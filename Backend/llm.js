const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function generateReply(message) {
  try {
    const userMessage =
      typeof message === "string"
        ? message
        : message.message || JSON.stringify(message);

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "user", content: userMessage }
      ],
      model: "llama-3.1-8b-instant",
    });

    return chatCompletion.choices[0].message.content;
  } catch (error) {
    console.error(error);
    return "Error generating response.";
  }
}

module.exports = { generateReply };