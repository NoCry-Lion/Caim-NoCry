const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.get("/", (req, res) => res.send("Bot online"));

app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor web ativo");
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

client.once("ready", () => {
  console.log(`Bot online como ${client.user.tag}`);
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
    } catch (e) {
      message.reply("Erro ao consultar Gemini.");
    }
  }
});

console.log("Token existe?", !!process.env.DISCORD_TOKEN);
console.log("Tamanho:", process.env.DISCORD_TOKEN?.length);
client.login(process.env.DISCORD_TOKEN);

client.on("error", console.error);
client.on("warn", console.warn);

client.once("ready", () => {
  console.log(Bot online como ${client.user.tag});
});
