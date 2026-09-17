import { prisma } from "@/lib/db";
import { OnlineJobLead } from "@/lib/types";
import { JobicyJobProvider } from "@/lib/providers/online/jobicy";
import { HimalayasJobProvider } from "@/lib/providers/online/himalayas";
import { TheMuseJobProvider } from "@/lib/providers/online/themuse";
import { AdzunaJobProvider } from "@/lib/providers/online/adzuna";
import { JoobleJobProvider } from "@/lib/providers/online/jooble";
import { WeWorkRemotelyJobProvider } from "@/lib/providers/online/weworkremotely";
import { RemoteOkJobProvider } from "@/lib/providers/online/remoteok";
import { IOnlineJobProvider } from "@/lib/providers/online/types";

// Combine the main providers that support zero-auth or configured-auth
const PROVIDERS: IOnlineJobProvider[] = [
  new JobicyJobProvider(),
  new HimalayasJobProvider(),
  new TheMuseJobProvider(),
  new AdzunaJobProvider(),
  new JoobleJobProvider(),
  new WeWorkRemotelyJobProvider(),
  new RemoteOkJobProvider()
];
/*
  jobicyProvider,
  himalayasProvider,
  themuseProvider,
  adzunaProvider,
  joobleProvider,
  weworkremotelyProvider,
  remoteokProvider
];*/

export async function runMonitoringCycle(userId: string) {
  const activeProviders = PROVIDERS.filter(p => p.isConfigured());
  let newOpportunities = 0;
  
  // Create a run log
  const runLog = await prisma.monitoringRun.create({
    data: {
      userId,
      provider: activeProviders.map(p => p.name).join(", "),
      status: "running"
    }
  });

  try {
    const userProfile = await prisma.userProfile.findUnique({
      where: { userId }
    });

    const results = await Promise.allSettled(
      activeProviders.map(provider => 
        provider.execute({
          mode: "online",
          query: "", // Broad query
          
          country: "worldwide"
        })
      )
    );

    let itemsFetched = 0;
    let itemsNew = 0;
    let itemsDuplicate = 0;

    for (const result of results) {
      if (result.status === "fulfilled" && result.value.status === "success") {
        const jobs = result.value.jobs;
        itemsFetched += jobs.length;

        for (const job of jobs) {
          // Deduplication check
          const existing = await prisma.lead.findFirst({
            where: {
              userId,
              pipelineType: "job_application",
              OR: [
                { sourceUrl: job.url },
                { 
                  businessName: job.company,
                  city: job.title
                }
              ]
            }
          });

          if (existing) {
            itemsDuplicate++;
            await prisma.lead.update({
              where: { id: existing.id },
              data: { lastSeenAt: new Date() }
            });
          } else {
            // It's a new opportunity
            itemsNew++;
            const newLead = await prisma.lead.create({
              data: {
                userId,
                pipelineType: "job_application",
                businessName: job.company,
                phone: "",
                phoneFormatted: "",
                category: job.tags?.join(", ") || "",
                hasWebsite: true,
                sourceProvider: job.source,
                providerPlaceId: job.id,
                sourceUrl: job.url,
                city: job.title,
                notes: job.descriptionSnippet,
                publishedAt: job.postedDate ? new Date(job.postedDate) : null,
                status: "SAVED"
              }
            });

            await prisma.notification.create({
              data: {
                userId,
                type: "NEW_OPPORTUNITY",
                title: `New ${job.source} Opportunity: ${job.title}`,
                message: `${job.company} is hiring for ${job.title}.`,
                opportunityId: newLead.id
              }
            });
          }
        }
      }
    }

    await prisma.monitoringRun.update({
      where: { id: runLog.id },
      data: {
        completedAt: new Date(),
        status: "success",
        itemsFetched,
        itemsNew,
        itemsDuplicate
      }
    });

    return { success: true, itemsFetched, itemsNew, itemsDuplicate };

  } catch (error: any) {
    await prisma.monitoringRun.update({
      where: { id: runLog.id },
      data: {
        completedAt: new Date(),
        status: "failed",
        error: error.message
      }
    });
    return { success: false, error: error.message };
  }
}
