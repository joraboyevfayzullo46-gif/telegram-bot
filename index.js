const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = process.env.TOKEN;

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(
        msg.chat.id,
        'Link yuboring 📥\n\nInstagram / TikTok / YouTube / Facebook'
    );
});

bot.on('message', async (msg) => {

    const chatId = msg.chat.id;
    const text = msg.text;

    if (!text.startsWith('http')) return;

    try {

        bot.sendMessage(chatId, 'Yuklanmoqda... ⏳');

        const api = `https://api.siputzx.my.id/api/d/ytmp4?url=${text}`;

        const response = await axios.get(api);

        const video = response.data.data.dl;

        bot.sendVideo(chatId, video);

    } catch (err) {

        console.log(err);

        bot.sendMessage(chatId, 'Xatolik chiqdi ❌');

    }

});
