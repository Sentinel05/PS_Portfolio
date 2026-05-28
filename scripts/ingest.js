/**
 * Ingestion script — embeds portfolio content and upserts into Pinecone.
 * Run once (or whenever portfolio content changes): npm run ingest
 *
 * Required .env variables:
 *   MONGO_URI        — MongoDB Atlas connection string
 *   GEMINI_API_KEY   — Google AI Studio API key
 *   PINECONE_API_KEY — Pinecone API key
 *   PINECONE_INDEX   — Name of your Pinecone index (768 dimensions, cosine metric)
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("dns");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Pinecone } = require("@pinecone-database/pinecone");

// Fix DNS on some Windows setups
dns.setServers(["8.8.8.8", "8.8.4.4"]);
dotenv.config();

const Education = require("../models/Education");
const Work = require("../models/Work");
const Project = require("../models/Project");
const Skill = require("../models/Skill");

/**
 * Build plain text chunks from all portfolio collections + static bio.
 * Returns array of { text, source, title } objects.
 */
const buildChunks = (educations, works, projects, skills) => {
  const chunks = [];

  // ── Static bio / about ──────────────────────────────────────────────────────
  chunks.push({
    text:
      "Priyanshu Sarkar is a Software Engineer at OpenText based in Bengaluru, India. " +
      "He develops and enhances integrational features for Data Protector — enabling " +
      "enterprises to protect critical environments like SAP HANA, VMware, Documentum " +
      "and Windows Defender. He is passionate about clean code, enterprise reliability, " +
      "and impactful solutions. His core technologies include TypeScript, C++, Angular, " +
      "React, and REST APIs.",
    source: "about",
    title: "About Priyanshu",
  });

  // ── Education ───────────────────────────────────────────────────────────────
  educations.forEach((edu) => {
    chunks.push({
      text: `Education: ${edu.title} at ${edu.school}, ${edu.location} (${edu.date}). Grade/Score: ${edu.grade}.`,
      source: "education",
      title: edu.title,
    });
  });

  // ── Work experience ──────────────────────────────────────────────────────────
  works.forEach((work) => {
    chunks.push({
      text: `Work Experience: ${work.title} at ${work.company}, ${work.location} (${work.date}). ${work.desc}`,
      source: "work",
      title: work.title,
    });
  });

  // ── Projects ────────────────────────────────────────────────────────────────
  projects.forEach((project) => {
    chunks.push({
      text: `Project: ${project.title} (${project.type}). Technologies: ${project.tags.join(", ")}. ${project.desc} Repository: ${project.link}`,
      source: "project",
      title: project.title,
    });
  });

  // ── Skills (single grouped chunk) ────────────────────────────────────────
  const skillNames = skills.map((s) => s.name).join(", ");
  chunks.push({
    text: `Priyanshu's technical skills and tools include: ${skillNames}.`,
    source: "skills",
    title: "Skills",
  });

  // ── Contact / social links ───────────────────────────────────────────────────
  chunks.push({
    text:
      "Priyanshu Sarkar can be contacted via LinkedIn (https://www.linkedin.com/in/priyanshu-sarkar-79464b242), " +
      "GitHub (https://github.com/Sentinel05), Gmail (psarkar.work05@gmail.com), " +
      "or WhatsApp (+91 7904953079). The portfolio website also has a Contact section with a message form.",
    source: "contact",
    title: "Contact",
  });

  return chunks;
};

/**
 * Embed a single text using the Google Generative AI SDK directly.
 * Uses gemini-embedding-2 with outputDimensionality=768 to match the Pinecone index.
 */
const embedText = async (embeddingModel, text) => {
  const result = await embeddingModel.embedContent({
    content: { parts: [{ text }] },
    outputDimensionality: 768,
  });
  return result.embedding.values;
};

const ingest = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const [educations, works, projects, skills] = await Promise.all([
      Education.find().sort({ order: 1 }),
      Work.find().sort({ order: 1 }),
      Project.find().sort({ order: 1 }),
      Skill.find().sort({ order: 1 }),
    ]);
    console.log(
      `Fetched: ${educations.length} educations, ${works.length} works, ${projects.length} projects, ${skills.length} skills`
    );

    const chunks = buildChunks(educations, works, projects, skills);
    console.log(`Built ${chunks.length} chunks for embedding`);

    console.log("Initializing Pinecone client...");
    const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
    const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);

    console.log("Initializing Google Gemini embedding model (gemini-embedding-2, 768 dims)...");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-2" });

    console.log("Embedding and upserting chunks into Pinecone namespace 'portfolio'...");
    const BATCH_SIZE = 5;
    let totalUpserted = 0;

    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
      const batch = chunks.slice(i, i + BATCH_SIZE);

      const records = [];
      for (let j = 0; j < batch.length; j++) {
        const values = await embedText(embeddingModel, batch[j].text);
        records.push({
          id: `doc-${i + j}`,
          values,
          metadata: {
            text: batch[j].text,
            source: batch[j].source,
            title: batch[j].title,
          },
        });
      }

      await pineconeIndex.namespace("portfolio").upsert({ records });
      totalUpserted += records.length;
      console.log(`  Upserted batch ${Math.floor(i / BATCH_SIZE) + 1}: ${records.length} vectors (total: ${totalUpserted})`);
    }

    console.log("\n✅ Ingestion complete! All portfolio content embedded into Pinecone.");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Ingestion error:", error);
    process.exit(1);
  }
};

ingest();
