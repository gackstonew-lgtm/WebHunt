import { aggregator } from "../lib/providers";

async function debugRadar() {
  console.log("==================================================");
  console.log("DIAGNOSTIC TEST: FULL AGGREGATOR PIPELINE");
  console.log("==================================================");

  const queries = [
    "React / Next.js Developer",
    "Software Engineer",
    "Remote Developer",
  ];

  for (const q of queries) {
    console.log(`\n\n>>> SEARCHING: "${q}" <<<`);
    const start = Date.now();
    const res = await aggregator.search({
      mode: "online",
      query: q,
      provider: "all",
      forceRefresh: true,
    });
    const duration = Date.now() - start;

    console.log(`Search completed in ${duration}ms`);
    console.log(`Total fetched (raw): ${res.totalFetched}`);
    console.log(`Qualified count (final): ${res.qualifiedCount}`);
    console.log(`Sources queried:`, res.sourcesQueried);
    console.log(`Failed sources:`, res.failedSources);

    const counts: Record<string, number> = {};
    for (const lead of res.leads) {
      const src = (lead as any).source || (lead as any).sources?.[0] || "unknown";
      counts[src] = (counts[src] || 0) + 1;
    }
    console.log(`Breakdown of leads by source in final output:`);
    console.table(counts);
  }
}

debugRadar().catch(console.error);
