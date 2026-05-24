const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const express = require('express');

// ===== WEB SERVER (Render uchun) =====
const app = express();

app.get('/', (req, res) => {
    res.send('Bot ishlayapti ✅');
});

app.listen(process.env.PORT || 3000);

// ===== BOT TOKEN =====
const token = process.env.TOKEN;

const bot = new TelegramBot(token, { polling: true });

// ===== USER MEMORY (til saqlash) =====
let userLang = {};

// ===== WELCOME TEXT =====
function welcome(lang) {

if (lang === "uz") {
return `🔥 Assalomu alaykum!

@joraboyevvc_bot ga xush kelibsiz 👋

📥 Instagram / TikTok / YouTube / Facebook / Snapchat videolarni yuklab olishingiz mumkin

━━━━━━━━━━━━━━
🚀 Link yuboring!
⚡ Tez | 🎥 HD | 🤖 24/7`;
}

if (lang === "ru") {
return `🔥 Добро пожаловать!

Вы можете скачать видео:

📥 Instagram / TikTok / YouTube / Facebook

━━━━━━━━━━━━━━
🚀 Отправьте ссылку!`;
}

return `🔥 Welcome!

Send video link 📥`;
}

// ===== START =====
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id,
`🌍 Tilni tanlang / Выберите язык / Choose language`, {
        reply_markup: {
            keyboard: [
                ["🇺🇿 O'zbekcha"],
                ["🇷🇺 Русский"],
                ["🇺🇸 English"]
            ],
            resize_keyboard: true
        }
    });
});

// ===== MAIN HANDLER =====
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (!text) return;

    // ===== LANGUAGE SELECT =====
    if (text === "🇺🇿 O'zbekcha") {
        userLang[chatId] = "uz";
        return bot.sendMessage(chatId, welcome("uz"));
    }

    if (text === "🇷🇺 Русский") {
        userLang[chatId] = "ru";
        return bot.sendMessage(chatId, welcome("ru"));
    }

    if (text === "🇺🇸 English") {
        userLang[chatId] = "en";
        return bot.sendMessage(chatId, welcome("en"));
    }

    // ignore buttons
    if (text === "menu") return;

    // only links
    if (!text.startsWith("http")) return;

    try {
        bot.sendMessage(chatId, "Yuklanmoqda... ⏳");

        // ===== TIKTOK =====
        if (text.includes("tiktok.com")) {
            const res = await axios.get(`https://tikwm.com/api/?url=${text}`);
            return bot.sendVideo(chatId, res.data.data.play);
        }

        // ===== INSTAGRAM =====
        if (text.includes("instagram.com")) {
            const res = await axios.get(`https://api.ryzendesu.vip/api/downloader/igdl?url=${text}`);
            return bot.sendVideo(chatId, res.data.data[0].url);
        }

        // ===== YOUTUBE =====
        if (text.includes("youtube.com") || text.includes("youtu.be")) {
            const res = await axios.get(`https://api.ryzendesu.vip/api/downloader/ytmp4?url=${text}`);
            return bot.sendVideo(chatId, res.data.url);
        }

        // ===== FACEBOOK =====
        if (text.includes("facebook.com") || text.includes("fb.watch")) {
            const res = await axios.get(`https://api.ryzendesu.vip/api/downloader/fbdl?url=${text}`);
            return bot.sendVideo(chatId, res.data.data.hd);
        }

        // ===== SNAPCHAT =====
        if (text.includes("snapchat.com")) {
            const res = await axios.get(`https://api.ryzendesu.vip/api/downloader/snack?url=${text}`);
            return bot.sendVideo(chatId, res.data.data.url);
        }

        bot.sendMessage(chatId, "❌ Qo‘llab-quvvatlanmaydi");

    } catch (err) {
        console.log(err);
        bot.sendMessage(chatId, "❌ Xatolik chiqdi");
    }
});
