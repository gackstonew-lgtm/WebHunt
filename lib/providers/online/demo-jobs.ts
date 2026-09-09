import { IOnlineJobProvider } from "./types";
import { OnlineJobLead, OnlineSearchParams } from "@/lib/types";

export class DemoOnlineJobProvider implements IOnlineJobProvider {
  name = "Demo Online Tech Gigs (Offline Sandbox)";
  providerKey = "demo";

  isConfigured(): boolean {
    return true;
  }

  async fetchJobs(params: OnlineSearchParams): Promise<OnlineJobLead[]> {
    const q = (params.query || "web development").toLowerCase();

    const templates = [
      {
        title: "Full Stack Next.js & React Developer for Custom SaaS Platform",
        company: "Vanguard Digital Media",
        tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "PostgreSQL"],
        salary: "$4,500 - $6,500 / project",
        category: "Web Development",
        desc: "Looking for an experienced full-stack engineer to build a high-performance customer portal and billing dashboard using Next.js App Router and Tailwind CSS.",
      },
      {
        title: "Custom WordPress & WooCommerce Site Overhaul + Speed Optimization",
        company: "Horizon Retail Brands",
        tags: ["WordPress", "WooCommerce", "PHP", "Speed Optimization", "SEO"],
        salary: "$2,500 - $4,000 / project",
        category: "E-Commerce",
        desc: "Redesigning our storefront for mobile speed, checkout conversion, and custom payment integrations.",
      },
      {
        title: "Cloud POS Integration & Inventory Management Web App",
        company: "Apex Hospitality Group",
        tags: ["React", "Node.js", "REST API", "POS Systems", "Square / Stripe"],
        salary: "$5,000 - $8,000 / contract",
        category: "Software & POS Systems",
        desc: "Seeking developer to connect multi-location restaurant POS terminals with our central web inventory dashboard.",
      },
      {
        title: "Frontend Developer (React / Tailwind) for Booking & Appointment Portal",
        company: "Zenith Clinic Network",
        tags: ["React", "Tailwind CSS", "UI/UX", "Vercel", "Calendly API"],
        salary: "$3,000 - $5,000 / project",
        category: "Frontend Development",
        desc: "Build a seamless, interactive customer booking flow and customer notification system.",
      },
      {
        title: "Python Backend Developer for Automated Web Scraping & Data Pipeline",
        company: "Insight Analytics Corp",
        tags: ["Python", "FastAPI", "PostgreSQL", "Docker", "ETL"],
        salary: "$4,000 - $7,000 / contract",
        category: "Backend & Data",
        desc: "Develop robust data ingestion pipelines and API webhooks for market research analytics.",
      },
      {
        title: "Shopify Store Architect & Custom Theme Liquid Developer",
        company: "Nordic Lifestyle Labs",
        tags: ["Shopify", "Liquid", "JavaScript", "CRO", "Theme 2.0"],
        salary: "$3,500 - $5,500 / project",
        category: "E-Commerce",
        desc: "Create bespoke interactive product builders and lightning-fast PDP templates for direct-to-consumer brand.",
      },
    ];

    const today = new Date().toISOString().split("T")[0];

    return templates.map((tpl, i): OnlineJobLead => ({
      id: `demo-job-${i}-${Date.now()}`,
      type: "online",
      title: tpl.title,
      company: tpl.company,
      companyLogo: null,
      location: "Worldwide Remote",
      country: "Worldwide",
      isRemote: true,
      category: tpl.category,
      tags: tpl.tags,
      url: `https://example.com/apply/job-${i + 1}`,
      postedDate: today,
      salary: tpl.salary,
      source: "demo",
      descriptionSnippet: tpl.desc,
      status: "NEW",
      estimatedValue: 4500,
      notes: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
  }
}
