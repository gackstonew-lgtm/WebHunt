import { AiPlatformsProvider } from "../lib/providers/online/ai-platforms";
import { classifyAiTask } from "../lib/taxonomy/ai-classifier";
import { deduplicateOnlineJobs } from "../lib/deduplication";
import { checkApplicantEligibility } from "../lib/eligibility/regional-filter";
import { SOURCE_REGISTRY } from "../lib/sources/registry";
import { aggregator } from "../lib/providers";
import { OnlineJobLead } from "../lib/types";

async function runTests() {
  console.log("==================================================");
  console.log("TEST SUITE: AI OPPORTUNITIES INTEGRATION");
  console.log("==================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}${detail ? ` - ${detail}` : ""}`);
      failed++;
    }
  }

  // -------------------------------------------------------------
  // TEST 1: Source Registry Investigation Coverage
  // -------------------------------------------------------------
  console.log("--- 1. Testing Source Registry for 11 AI Platforms ---");
  const requiredSources = [
    "clickworker",
    "crowdgen_appen",
    "telus_digital_ai",
    "oneforma",
    "dataannotation_tech",
    "outlier_ai",
    "toloka_ai",
    "remotasks",
    "alignerr",
    "rws_trainai",
    "welocalize",
  ];

  for (const srcId of requiredSources) {
    const found = SOURCE_REGISTRY.find((s) => s.id === srcId);
    assert(
      !!found,
      `Registry contains ${srcId}`,
      `Missing from SOURCE_REGISTRY`
    );
    if (found) {
      assert(
        found.websiteUrl.startsWith("https://"),
        `Source ${srcId} has official secure websiteUrl (${found.websiteUrl})`
      );
      assert(
        found.termsSummary.length > 10,
        `Source ${srcId} has documented terms/API status`
      );
    }
  }

  // -------------------------------------------------------------
  // TEST 2: AI Category Classification (11 Specific Categories)
  // -------------------------------------------------------------
  console.log("\n--- 2. Testing AI Task Category Classification (11 Categories) ---");

  const classificationCases = [
    {
      title: "AI Response Evaluator - RLHF & Human Feedback",
      expected: "AI Training",
    },
    {
      title: "Data Labeling Specialist - Bounding Box & Semantic Segmentation",
      expected: "Data Annotation",
    },
    {
      title: "Search Quality Rater - Query Relevance Assessment",
      expected: "Search Evaluation",
    },
    {
      title: "Audio Transcriptionist & Linguistic Annotation Specialist",
      expected: "Language and Speech Tasks",
    },
    {
      title: "AI Coding Evaluator - Python & JavaScript Code Review",
      expected: "AI Coding Tasks",
    },
    {
      title: "AI Mathematics Evaluator - Mathematical Problem Evaluation",
      expected: "AI Mathematics and Reasoning",
    },
    {
      title: "Computer Vision Annotator - LiDAR & Object Detection",
      expected: "Computer Vision",
    },
    {
      title: "Chatbot Response Evaluator - LLM Prompt Evaluation",
      expected: "Generative AI Evaluation",
    },
    {
      title: "Multilingual Voice Recording & Data Collection Task",
      expected: "Data Collection",
    },
    {
      title: "AI Red Teaming Specialist - Model Safety & Harmful Content Review",
      expected: "AI Safety and Quality Assurance",
    },
    {
      title: "Legal-Domain AI Evaluator - Contract & Law Model Training",
      expected: "Expert AI Training",
    },
  ];

  for (const testCase of classificationCases) {
    const res = classifyAiTask({ title: testCase.title });
    assert(
      res.category === testCase.expected,
      `Classify: "${testCase.title}" -> ${testCase.expected}`,
      `Got: ${res.category}`
    );
  }

  // Negative control: Ensure generic job with "AI" substring or false positive is NOT classified
  const negativeCase = classifyAiTask({ title: "Air Conditioning Repair Mechanic" });
  assert(
    negativeCase.category === null,
    `Negative control: "Air Conditioning Repair Mechanic" is NOT classified as AI`,
    `Incorrectly classified as: ${negativeCase.category}`
  );

  // -------------------------------------------------------------
  // TEST 3: Deduplication Engine Safeguards
  // -------------------------------------------------------------
  console.log("\n--- 3. Testing Deduplication Engine ---");

  const distinctJobs: OnlineJobLead[] = [
    {
      id: "job-1",
      type: "online",
      title: "AI Data Annotator — English",
      company: "CrowdGen",
      location: "Worldwide",
      isRemote: true,
      tags: ["ai", "english"],
      url: "https://crowdgen.com/project/101",
      postedDate: "2026-09-14",
      source: "crowdgen_appen",
      status: "NEW",
      estimatedValue: 2500,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "job-2",
      type: "online",
      title: "AI Data Annotator — Swahili",
      company: "CrowdGen",
      location: "Kenya",
      isRemote: true,
      tags: ["ai", "swahili"],
      url: "https://crowdgen.com/project/102",
      postedDate: "2026-09-14",
      source: "crowdgen_appen",
      status: "NEW",
      estimatedValue: 2500,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const dedupResult = deduplicateOnlineJobs(distinctJobs);
  assert(
    dedupResult.length === 2,
    `Distinct language/regional opportunities ("English" vs "Swahili") are NOT merged`,
    `Expected 2, got: ${dedupResult.length}`
  );

  // Identical URL cross-source test
  const duplicateJobs: OnlineJobLead[] = [
    {
      id: "dup-1",
      type: "online",
      title: "Search Quality Rater",
      company: "Welocalize",
      location: "Worldwide",
      isRemote: true,
      tags: ["ai", "search"],
      url: "https://jobs.lever.co/weloglobal/123",
      postedDate: "2026-09-14",
      source: "welocalize",
      status: "NEW",
      estimatedValue: 3000,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "dup-2",
      type: "online",
      title: "Search Quality Rater",
      company: "Welocalize",
      location: "Worldwide",
      isRemote: true,
      tags: ["remoteok"],
      url: "https://jobs.lever.co/weloglobal/123", // same canonical apply URL
      postedDate: "2026-09-14",
      source: "remoteok",
      status: "NEW",
      estimatedValue: 3000,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const merged = deduplicateOnlineJobs(duplicateJobs);
  assert(
    merged.length === 1,
    `Identical canonical URL cross-posted across sources is merged into 1 listing`,
    `Expected 1, got: ${merged.length}`
  );
  assert(
    Boolean(merged[0].sources?.includes("welocalize") && merged[0].sources?.includes("remoteok")),
    `Merged listing preserves multi-source attribution (welocalize + remoteok)`
  );

  // -------------------------------------------------------------
  // TEST 4: Eligibility & Badging Handling
  // -------------------------------------------------------------
  console.log("\n--- 4. Testing Regional Eligibility Badges ---");

  const kenyaRole = checkApplicantEligibility({
    title: "AI Annotator",
    location: "Nairobi, Kenya",
  });
  assert(
    kenyaRole.badgeType === "kenya_eligible" && kenyaRole.isEligibleKenya === true,
    `Kenya explicit location -> "kenya_eligible"`
  );

  const usRole = checkApplicantEligibility({
    title: "AI Prompt Evaluator",
    location: "US Only (United States)",
  });
  assert(
    usRole.badgeType === "country_restricted" && usRole.isEligibleKenya === false,
    `US Only location -> "country_restricted"`
  );

  const langRole = checkApplicantEligibility({
    title: "Search Quality Rater - Portuguese (Brazil)",
    location: "Remote",
  });
  assert(
    langRole.badgeType === "language_restricted" && langRole.isEligibleKenya === false,
    `Specific language pair -> "language_restricted"`
  );

  const testRole = checkApplicantEligibility({
    title: "AI Response Evaluator",
    location: "Worldwide",
    assessmentRequired: true,
  });
  assert(
    testRole.badgeType === "assessment_required",
    `Assessment-required worldwide role -> "assessment_required"`
  );

  // -------------------------------------------------------------
  // TEST 5: AI Platforms Provider Connector Live Execution
  // -------------------------------------------------------------
  console.log("\n--- 5. Testing AiPlatformsProvider Execution ---");
  const provider = new AiPlatformsProvider();
  assert(provider.isConfigured() === true, "AiPlatformsProvider is configured");

  const startMs = Date.now();
  const jobs = await provider.fetchJobs({ mode: "online", query: "ai", maxResults: 15 });
  const latency = Date.now() - startMs;

  assert(jobs.length > 0, `AiPlatformsProvider fetched ${jobs.length} jobs (${latency}ms)`);
  
  if (jobs.length > 0) {
    const sample = jobs[0];
    assert(
      !!sample.title && !!sample.company && !!sample.url,
      `Sample job has valid title, company, and original URL (${sample.title} at ${sample.company})`
    );
    assert(
      sample.sourceVerificationStatus !== undefined,
      `Sample job has sourceVerificationStatus: ${sample.sourceVerificationStatus}`
    );
    assert(
      sample.salary !== undefined,
      `Sample job has salary defined without fabrication (${sample.salary})`
    );
    console.log(`Sample Job: [${sample.company}] ${sample.title} | Category: ${sample.aiTaskCategory || sample.category} | Eligibility: ${sample.countryEligibility} | URL: ${sample.url}`);
  }

  // -------------------------------------------------------------
  // TEST 6: Aggregator Integration
  // -------------------------------------------------------------
  console.log("\n--- 6. Testing LeadProviderAggregator Online Search ---");
  const aggResult = await aggregator.search({
    mode: "online",
    query: "ai training",
    forceRefresh: true,
    maxResults: 20,
  });

  assert(aggResult.mode === "online", `Aggregator returned mode: "online"`);
  assert(aggResult.leads.length > 0, `Aggregator returned ${aggResult.leads.length} leads for "ai training"`);
  assert(
    aggResult.diagnostics?.successfulProviders! > 0,
    `Aggregator diagnostics report successful providers (${aggResult.diagnostics?.successfulProviders})`
  );

  console.log("\n==================================================");
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution fatal error:", err);
  process.exit(1);
});
