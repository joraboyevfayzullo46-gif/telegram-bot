const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const express = require('express');

// ===== Render alive server =====
const app = express();
app.get('/', (req, res) => res.send('Bot ishlayapti ✅'));
app.listen(process.env.PORT || 3000);

// ===== BOT =====
const bot = new TelegramBot(process.env.TOKEN, { polling: true });

// ===== AXIOS TIMEOUT FIX =====
const request = axios.create({
    timeout: 15000
});

// ===== USER LANGUAGE =====
let userLang = {};

// ================= TEXT SYSTEM =================
function text(lang) {

if (lang === "uz") {
return {
welcome: `🔥 Assalomu alaykum. @joraboyevvc_bot ga Xush kelibsiz!

Bot orqali quyidagilarni yuklab olishingiz mumkin:

• Instagram - Sifatli Video  
• TikTok - Sifatli Video  
• Snapchat - Sifatli Video  
• YouTube - Sifatli Video  
• Facebook - Sifatli Video  

🚀 Yuklab olmoqchi bo'lgan videoga havolani yuboring!
😎 Bot guruhlarda ham ishlay oladi!`,

loading: "📥 Video yuklanmoqda, iltimos biroz kuting ⏳",
error: "❌ Server vaqtincha ishlamayapti, iltimos keyinroq urinib ko‘ring"
};
}

if (lang === "ru") {
return {
welcome: `🔥 Добро пожаловать в @joraboyevvc_bot!

• Instagram  
• TikTok  
• Snapchat  
• YouTube  
• Facebook  

🚀 Отправьте ссылку!
😎 Работает в группах!`,

loading: "📥 Видео загружается, подождите ⏳",
error: "❌ Сервер временно недоступен"
};
}

return {
welcome: `🔥 Welcome!

Send video link 📥`,
loading: "📥 Loading...",
error: "❌ Server error"
};

}

// ================= START =================
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id,
`🌍 Tilni tanlang / Выберите язык`, {
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

// ================= LANGUAGE =================
bot.on('message', async (msg) => {

const chatId = msg.chat.id;
const textMsg = msg.text;

if (!textMsg) return;

// language
if (textMsg === "🇺🇿 O'zbekcha") {
    userLang[chatId] = "uz";
    return bot.sendMessage(chatId, text("uz").welcome);
}

if (textMsg === "🇷🇺 Русский") {
    userLang[chatId] = "ru";
    return bot.sendMessage(chatId, text("ru").welcome);
}

if (textMsg === "🇺🇸 English") {
    userLang[chatId] = "en";
    return bot.sendMessage(chatId, text("en").welcome);
}

// ignore non links
if (!textMsg.startsWith("http")) return;

const lang = userLang[chatId] || "en";

bot.sendMessage(chatId, text(lang).loading);

handleDownload(chatId, textMsg, lang);

});

// ================= MULTI API =================
async function tryAPIs(apis) {

for (let api of apis) {
    try {
        const res = await request.get(api.url);

        const data = api.get(res);

        // FIX: undefined check
        if (data && data !== "undefined") {
            return data;
        }

    } catch (e) {
        console.log("API fail:", api.url);
    }
}

return null;

}

// ================= DOWNLOAD ENGINE =================
async function handleDownload(chatId, url, lang) {

try {

let video = null;

// ===== TIKTOK =====
if (url.includes("tiktok.com")) {

video = await tryAPIs([
{
url: `https://tikwm.com/api/?url=${url}`,
get: (res) => res.data?.data?.play
},
{
url: `https://api.tiklydown.eu.org/api/download?url=${url}`,
get: (res) => res.data?.video
}
]);

}

// ===== INSTAGRAM =====
else if (url.includes("instagram.com")) {

video = await tryAPIs([
{
url: `https://api.ryzendesu.vip/api/downloader/igdl?url=${url}`,
get: (res) => res.data?.data?.[0]?.url
},
{
url: `https://api.savetube.me/download?url=${url}`,
get: (res) => res.data?.url
}
]);

}

// ===== YOUTUBE =====
else if (url.includes("youtube.com") || url.includes("youtu.be")) {

video = await tryAPIs([
{
url: `https://api.ryzendesu.vip/api/downloader/ytmp4?url=${url}`,
get: (res) => res.data?.url
}
]);

}

// ===== FACEBOOK =====
else if (url.includes("facebook.com") || url.includes("fb.watch")) {

video = await tryAPIs([
{
url: `https://api.ryzendesu.vip/api/downloader/fbdl?url=${url}`,
get: (res) => res.data?.data?.hd
}
]);

}

// ===== SNAPCHAT =====
else if (url.includes("snapchat.com")) {

video = await tryAPIs([
{
url: `https://api.ryzendesu.vip/api/downloader/snack?url=${url}`,
get: (res) => res.data?.data?.url
}
]);

}

// ===== FIX: VIDEO CHECK =====
if (!video || video === "undefined" || video === null) {
    return bot.sendMessage(chatId, text(lang).error);
}

// ===== SAFE SEND =====
try {
    return bot.sendVideo(chatId, video);
} catch (e) {
    return bot.sendMessage(chatId, text(lang).error);
}

} catch (err) {
console.log(err);
return bot.sendMessage(chatId, text(lang).error);
}

    }
