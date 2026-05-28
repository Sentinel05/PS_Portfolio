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

const chatController = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    // Cap input length to prevent abuse
    const sanitizedMessage = message.trim().slice(0, 500);

    await initClients();

    // Embed the query with outputDimensionality=768 to match the Pinecone index
    const embedResult = await embeddingModel.embedContent({
      content: { parts: [{ text: sanitizedMessage }] },
      outputDimensionality: 768,
    });
    const queryVector = embedResult.embedding.values;

    // Retrieve the most relevant portfolio chunks from Pinecone
    const queryResult = await pineconeIndex.namespace("portfolio").query({
      vector: queryVector,
      topK: 5,
      includeMetadata: true,
    });

    const context = queryResult.matches
      .map((m) => m.metadata?.text || "")
      .filter(Boolean)
      .join("\n\n---\n\n");

    const systemPrompt =
      `You are a helpful AI assistant on Priyanshu Sarkar's portfolio website. ` +
      `Your job is to answer visitor questions about Priyanshu — his background, skills, work experience, education, and projects.\n\n` +
      `Answer only based on the context provided below. Be concise, friendly, and professional. ` +
      `If the information is not covered in the context, say "I don't have that information, but you can reach Priyanshu directly via the Contact section." ` +
      `Do not make up or infer information beyond what is provided.\n\nContext:\n${context}`;

    const chat = chatModel.startChat({
      history: [{ role: "user", parts: [{ text: systemPrompt }] }, { role: "model", parts: [{ text: "Understood. I'll answer questions about Priyanshu based only on the provided context." }] }],
    });

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
