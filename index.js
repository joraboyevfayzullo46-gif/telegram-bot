
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = process.env.TOKEN;

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {

    bot.sendMessage(
        msg.chat.id,
        `O'zingizga qulay tilni tanlang 🇺🇿

Ўзингизга қулай тилни танланг 🇺🇿

Выбери язык, который тебе нравится 🇷🇺

Choose the language you like 🇺🇸`,
        {
            reply_markup: {
                keyboard: [
                    ["🇺🇿 O'zbekcha", "🇺🇿 Ўзбекча"],
                    ["🇷🇺 Русский", "🇺🇸 English"]
                ],
                resize_keyboard: true
            }
        }
    );

});

    bot.sendMessage(
        msg.chat.id,
        'Link yuboring 📥\n\nTikTok / Instagram / YouTube / Facebook / Snapchat'
    );

});

bot.on('message', async (msg) => {

    const chatId = msg.chat.id;
    const text = msg.text;

    if (!text || !text.startsWith('http')) return;

    try {

        bot.sendMessage(chatId, 'Yuklanmoqda... ⏳');

        // TikTok
        if (text.includes('tiktok.com')) {

            const tt = await axios.get(
                `https://tikwm.com/api/?url=${text}`
            );

            const video = tt.data.data.play;

            return bot.sendVideo(chatId, video);

        }

        // Instagram
        if (text.includes('instagram.com')) {

            const ig = await axios.get(
                `https://api.ryzendesu.vip/api/downloader/igdl?url=${text}`
            );

            const video = ig.data.data[0].url;

            return bot.sendVideo(chatId, video);

        }

        // YouTube
        if (
            text.includes('youtube.com') ||
            text.includes('youtu.be')
        ) {

            const yt = await axios.get(
                `https://api.ryzendesu.vip/api/downloader/ytmp4?url=${text}`
            );

            const video = yt.data.url;

            return bot.sendVideo(chatId, video);

        }

        // Facebook
        if (
            text.includes('facebook.com') ||
            text.includes('fb.watch')
        ) {

            const fb = await axios.get(
                `https://api.ryzendesu.vip/api/downloader/fbdl?url=${text}`
            );

            const video = fb.data.data.hd;

            return bot.sendVideo(chatId, video);

        }

        // Snapchat
        if (text.includes('snapchat.com')) {

            const sc = await axios.get(
                `https://api.ryzendesu.vip/api/downloader/snack?url=${text}`
            );

            const video = sc.data.data.url;

            return bot.sendVideo(chatId, video);

        }

        bot.sendMessage(chatId, 'Qo‘llab-quvvatlanmaydi ❌');

    } catch (error) {

        console.log(error);

        bot.sendMessage(chatId, 'Xatolik chiqdi ❌');

    }

});
