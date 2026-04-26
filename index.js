const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.get("/", (req, res) => res.send("online"));
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

client.on("ready", () => {
  console.log(`Bot online como ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  console.log("Mensagem recebida:", message.content);

  if (message.content.startsWith("!ask ")) {
    try {
      const pergunta = message.content.slice(5);

      const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const result = await model.generateContent(pergunta);
      const texto = result.response.text();

      await message.reply(texto.substring(0, 1900));
    } catch (e) {
      console.error(e);
      await message.reply("Erro no Gemini.");
    }
  }
});

client.on("error", console.error);

client.login(process.env.DISCORD_TOKEN).catch(console.error);
