require('dotenv').config();
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.BOT_TOKEN;
const url   = process.env.WEBHOOK_URL;
const port  = process.env.PORT || 5000;

const app = express();
app.use(express.json());

const bot = new TelegramBot(token, { polling: false });

bot.setWebHook(`${url}/bot${token}`);

app.post(`/bot${token}`, (req, res) => {
    bot.processUpdate(req.body);
    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
    console.log(`Webhook set to ${url}/bot${token}`);
});

bot.getWebHookInfo()
    .then(info => console.log('Webhook info:', info))
    .catch(err => console.error('WebhookInfo error:', err));

bot.on('webhook_error', console.error);

bot.on('message', (msg) => {
    console.log(JSON.stringify({
        level: 'info',
        timestamp: new Date().toISOString(),
        event: 'message_received',
        chatId: msg.chat.id,
        text: msg.text,
    }));
    bot.sendMessage(msg.chat.id, `Ви написали: ${msg.text}`);
});
