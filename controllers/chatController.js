const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Pinecone } = require("@pinecone-database/pinecone");

// Singleton clients — initialized once and reused across requests
let pineconeIndex = null;
let embeddingModel = null;
let chatModel = null;

const initClients = async () => {
  if (pineconeIndex && embeddingModel && chatModel) return;

  const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
  pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-2" });
  chatModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
};

// Minimum Pinecone cosine-similarity score to include a chunk in context
const SCORE_THRESHOLD = 0.45;
// Maximum previous turns to include for multi-turn memory (each turn = 1 user + 1 model msg)
const MAX_HISTORY_TURNS = 6;

const chatController = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    // Validate history: must be an array of {role, text} objects, capped at MAX_HISTORY_TURNS*2 entries
    const rawHistory = Array.isArray(history) ? history : [];
    const safeHistory = rawHistory
      .filter(
        (m) =>
          m &&
          typeof m === "object" &&
          (m.role === "user" || m.role === "bot") &&
          typeof m.text === "string" &&
          m.text.trim().length > 0
      )
      .slice(-(MAX_HISTORY_TURNS * 2)); // keep only the most recent turns

    // Cap input length to prevent abuse
    const sanitizedMessage = message.trim().slice(0, 500);

    await initClients();

    // ── 1. Embed the query ──────────────────────────────────────────────────
    const embedResult = await embeddingModel.embedContent({
      content: { parts: [{ text: sanitizedMessage }] },
      outputDimensionality: 768,
    });
    const queryVector = embedResult.embedding.values;

    // ── 2. Retrieve relevant portfolio chunks from Pinecone ─────────────────
    const queryResult = await pineconeIndex.namespace("portfolio").query({
      vector: queryVector,
      topK: 8,
      includeMetadata: true,
    });

    // Filter out low-relevance chunks below the score threshold
    const relevantMatches = queryResult.matches.filter(
      (m) => (m.score ?? 0) >= SCORE_THRESHOLD
    );

    const context =
      relevantMatches.length > 0
        ? relevantMatches
            .map((m) => m.metadata?.text || "")
            .filter(Boolean)
            .join("\n\n---\n\n")
        : null;

    // ── 3. Build system prompt ──────────────────────────────────────────────
    const systemPrompt =
      `You are a knowledgeable and friendly AI assistant on Priyanshu Sarkar's portfolio website. ` +
      `Your sole purpose is to help visitors learn about Priyanshu — his professional background, ` +
      `skills, work experience, education, and projects.\n\n` +
      `Guidelines:\n` +
      `- Answer ONLY based on the context provided below. Never fabricate or infer details.\n` +
      `- If the context does not cover the question, say: "I don't have that detail, but you can reach Priyanshu directly via the Contact section."\n` +
      `- Be concise yet thorough. Use bullet points or short paragraphs when listing multiple items.\n` +
      `- You may use **bold** for emphasis and bullet lists for readability.\n` +
      `- Keep a warm, professional tone. Refer to Priyanshu in the third person.\n` +
      `- If the visitor asks something unrelated to Priyanshu or his portfolio, politely redirect them.\n\n` +
      (context
        ? `Context:\n${context}`
        : `Context: No closely matching portfolio information was found for this query. Acknowledge this and suggest the visitor use the Contact section.`);

    // ── 4. Build Gemini multi-turn history from previous conversation ────────
    // Map {role:"bot"} → "model" for Gemini's API
    const geminiHistory = [
      {
        role: "user",
        parts: [{ text: systemPrompt }],
      },
      {
        role: "model",
        parts: [
          {
            text:
              "Understood! I'm ready to answer questions about Priyanshu based solely on the provided context, " +
              "using a clear and friendly tone.",
          },
        ],
      },
      // Inject prior conversation turns so Gemini maintains context
      ...safeHistory.map((m) => ({
        role: m.role === "bot" ? "model" : "user",
        parts: [{ text: m.text }],
      })),
    ];

    const chat = chatModel.startChat({ history: geminiHistory });
    const chatResult = await chat.sendMessage(sanitizedMessage);
    const answer = chatResult.response.text();

    return res.status(200).json({ success: true, answer });
  } catch (error) {
    console.error("Chat error:", error);
    return res.status(500).json({
      success: false,
      message: "Chat API error",
      error: error.message,
    });
  }
};

module.exports = { chatController };
