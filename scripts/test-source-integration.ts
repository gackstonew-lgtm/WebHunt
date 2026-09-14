import { JobicyJobProvider } from "../lib/providers/online/jobicy";
import { TheMuseJobProvider } from "../lib/providers/online/themuse";
import { RemoteOkJobProvider } from "../lib/providers/online/remoteok";
import { HimalayasJobProvider } from "../lib/providers/online/himalayas";
import { RemotiveJobProvider } from "../lib/providers/online/remotive";
import { ArbeitnowJobProvider } from "../lib/providers/online/arbeitnow";
import { aggregator } from "../lib/providers";
import { deduplicateOnlineJobs } from "../lib/deduplication";
import { OnlineJobLead } from "../lib/types";

async function runVerification() {
  console.log("==================================================");
  console.log("WEB HUNT OPPORTUNITY SOURCE INTEGRATION TEST SUITE");
  console.log("==================================================\n");

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, testName: string, extraInfo?: any) {
    total++;
    if (condition) {
      console.log(`  PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  FAIL: ${testName}`, extraInfo ? extraInfo : "");
    }
  }

  // 1. Jobicy Provider Test
  console.log("--- 1. Testing Jobicy Connector ---");
  const jobicy = new JobicyJobProvider();
  assert(jobicy.isConfigured() === true, "Jobicy provider is configured without keys");
  assert(jobicy.providerKey === "jobicy", "Jobicy provider key is 'jobicy'");

  try {
    const jobs = await jobicy.fetchJobs({ mode: "online", query: "developer", maxResults: 5 });
    assert(Array.isArray(jobs), "Jobicy returns array of jobs");
    assert(jobs.length > 0, `Jobicy returned ${jobs.length} jobs`);
    if (jobs.length > 0) {
      const sample = jobs[0];
      assert(Boolean(sample.title), `Sample job has title: "${sample.title}"`);
      assert(Boolean(sample.company), `Sample job has company: "${sample.company}"`);
      assert(sample.source === "jobicy", "Sample job source is 'jobicy'");
      assert(sample.url.startsWith("http"), `Sample job has valid URL: ${sample.url}`);
      assert(sample.isRemote === true, "Sample job isRemote is true");
      assert(Boolean(sample.opportunityType), `Sample job has opportunityType: ${sample.opportunityType}`);
      assert(sample.verificationStatus === "VERIFIED", "Verification status is VERIFIED");
    }
  } catch (err) {
    assert(false, "Jobicy fetchJobs should not throw", err);
  }

  // 2. The Muse Provider Test
  console.log("\n--- 2. Testing The Muse Connector ---");
  const themuse = new TheMuseJobProvider();
  assert(themuse.isConfigured() === true, "The Muse provider is configured without keys");
  assert(themuse.providerKey === "themuse", "The Muse provider key is 'themuse'");

  try {
    const jobs = await themuse.fetchJobs({ mode: "online", query: "", maxResults: 5 });
    assert(Array.isArray(jobs), "The Muse returns array of jobs");
    assert(jobs.length > 0, `The Muse returned ${jobs.length} jobs`);
    if (jobs.length > 0) {
      const sample = jobs[0];
      assert(Boolean(sample.title), `Sample job has title: "${sample.title}"`);
      assert(sample.source === "themuse", "Sample job source is 'themuse'");
      assert(sample.url.startsWith("http"), `Sample job has valid URL: ${sample.url}`);
      assert(Boolean(sample.opportunityType), `Sample job has opportunityType: ${sample.opportunityType}`);
    }
  } catch (err) {
    assert(false, "The Muse fetchJobs should not throw", err);
  }

  // 3. Remote OK Provider Test
  console.log("\n--- 3. Testing Remote OK Connector ---");
  const remoteok = new RemoteOkJobProvider();
  assert(remoteok.isConfigured() === true, "Remote OK provider is configured without keys");
  assert(remoteok.providerKey === "remoteok", "Remote OK provider key is 'remoteok'");

  try {
    const jobs = await remoteok.fetchJobs({ mode: "online", query: "react", maxResults: 5 });
    assert(Array.isArray(jobs), "Remote OK returns array");
    if (jobs.length > 0) {
      const sample = jobs[0];
      assert(sample.source === "remoteok", "Sample job source is 'remoteok'");
      assert(Boolean(sample.opportunityType), `Sample job has opportunityType: ${sample.opportunityType}`);
    }
  } catch (err) {
    assert(false, "Remote OK fetchJobs should not throw", err);
  }

  // 4. Himalayas Provider Test
  console.log("\n--- 4. Testing Himalayas Connector ---");
  const himalayas = new HimalayasJobProvider();
  assert(himalayas.isConfigured() === true, "Himalayas provider is configured");
  assert(himalayas.providerKey === "himalayas", "Himalayas provider key is 'himalayas'");

  try {
    const jobs = await himalayas.fetchJobs({ mode: "online", query: "developer", maxResults: 5 });
    assert(Array.isArray(jobs), "Himalayas returns array");
    if (jobs.length > 0) {
      const sample = jobs[0];
      assert(sample.source === "himalayas", "Sample job source is 'himalayas'");
      assert(Boolean(sample.opportunityType), `Sample job has opportunityType: ${sample.opportunityType}`);
    }
  } catch (err) {
    assert(false, "Himalayas fetchJobs should not throw", err);
  }

  // 5. Remotive Provider Test
  console.log("\n--- 5. Testing Remotive Connector ---");
  const remotive = new RemotiveJobProvider();
  assert(remotive.isConfigured() === true, "Remotive provider is configured");

  try {
    const jobs = await remotive.fetchJobs({ mode: "online", query: "software", maxResults: 5 });
    assert(Array.isArray(jobs), "Remotive returns array");
    if (jobs.length > 0) {
      const sample = jobs[0];
      assert(sample.source === "remotive", "Sample job source is 'remotive'");
      assert(Boolean(sample.opportunityType), `Sample job has opportunityType: ${sample.opportunityType}`);
    }
  } catch (err) {
    assert(false, "Remotive fetchJobs should not throw", err);
  }

  // 6. Arbeitnow Provider Test
  console.log("\n--- 6. Testing Arbeitnow Connector ---");
  const arbeitnow = new ArbeitnowJobProvider();
  assert(arbeitnow.isConfigured() === true, "Arbeitnow provider is configured");

  try {
    const jobs = await arbeitnow.fetchJobs({ mode: "online", query: "", maxResults: 5 });
    assert(Array.isArray(jobs), "Arbeitnow returns array");
    if (jobs.length > 0) {
      const sample = jobs[0];
      assert(sample.source === "arbeitnow", "Sample job source is 'arbeitnow'");
      assert(Boolean(sample.opportunityType), `Sample job has opportunityType: ${sample.opportunityType}`);
    }
  } catch (err) {
    assert(false, "Arbeitnow fetchJobs should not throw", err);
  }

  // 7. Deduplication & Multi-Source Fusion Test
  console.log("\n--- 7. Testing Deduplication and Multi-Source Fusion ---");
  const mockLeadA: OnlineJobLead = {
    id: "jobicy-101",
    type: "online",
    title: "Senior Full Stack Engineer",
    company: "Acme Cloud Corp",
    location: "Worldwide Remote",
    isRemote: true,
    tags: ["typescript", "react"],
    url: "https://acme.com/jobs/101",
    postedDate: "2026-09-14",
    salary: "Competitive",
    source: "jobicy",
    status: "NEW",
    estimatedValue: 4000,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockLeadB: OnlineJobLead = {
    id: "remoteok-202",
    type: "online",
    title: "Senior Full Stack Engineer",
    company: "Acme Cloud Corp",
    location: "Worldwide Remote",
    isRemote: true,
    tags: ["nextjs", "node"],
    url: "https://acme.com/jobs/101",
    postedDate: "2026-09-14",
    salary: "$120k - $150k",
    source: "remoteok",
    status: "NEW",
    estimatedValue: 4000,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const deduplicated = deduplicateOnlineJobs([mockLeadA, mockLeadB]);
  assert(deduplicated.length === 1, "Duplicate jobs merged into 1 canonical lead");
  assert(deduplicated[0].sources?.includes("jobicy") === true, "Fused sources include 'jobicy'");
  assert(deduplicated[0].sources?.includes("remoteok") === true, "Fused sources include 'remoteok'");
  assert(deduplicated[0].salary === "$120k - $150k", "Richer salary preserved from second source");
  assert(deduplicated[0].tags.includes("typescript") && deduplicated[0].tags.includes("nextjs"), "Tags merged across sources");

  // 8. LeadProviderAggregator Status Test
  console.log("\n--- 8. Testing Provider Aggregator Registration ---");
  const statusList = aggregator.getOnlineProvidersStatus();
  const jobicyStatus = statusList.find((s) => s.key === "jobicy");
  const themuseStatus = statusList.find((s) => s.key === "themuse");

  assert(Boolean(jobicyStatus), "Jobicy is listed in online providers status");
  assert(jobicyStatus?.configured === true, "Jobicy is marked configured: true");
  assert(jobicyStatus?.isFree === true, "Jobicy is marked isFree: true");

  assert(Boolean(themuseStatus), "The Muse is listed in online providers status");
  assert(themuseStatus?.configured === true, "The Muse is marked configured: true");
  assert(themuseStatus?.isFree === true, "The Muse is marked isFree: true");

  console.log("\n==================================================");
  console.log(`TEST RESULTS: ${passed}/${total} PASSED`);
  console.log("==================================================");

  if (passed !== total) {
    process.exit(1);
  }
}

runVerification().catch((e) => {
  console.error("FATAL TEST SUITE ERROR:", e);
  process.exit(1);
});
