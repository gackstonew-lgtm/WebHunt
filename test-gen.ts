import { generateTruthfulJobProposal } from "./lib/proposals/truthful-generator";

const profile = {
  fullName: "John Doe",
  professionalTitle: "Software Engineer",
  skills: ["React", "TypeScript", "Node.js"],
  yearsExperience: 5,
};

const job = {
  title: "Frontend Developer",
  company: "Tech Corp",
  tags: ["React", "JavaScript"]
};

try {
  console.log(generateTruthfulJobProposal(job as any, profile as any, "technical_pitch"));
  console.log("SUCCESS");
} catch (e: any) {
  console.error("FAILED", e.message);
}
