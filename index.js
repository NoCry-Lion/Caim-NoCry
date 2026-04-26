const { Client, GatewayIntentBits } = require("discord.js");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

client.once("ready", () => {
  console.log("Bot online!");
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith("!ask ")) {
    const pergunta = message.content.slice(5);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(pergunta);
      const texto = result.response.text();

      message.reply(texto.substring(0, 1900));
    } catch {
      message.reply("Erro ao usar Gemini.");
    }
  }
});

client.login(process.env.DISCORD_TOKEN);