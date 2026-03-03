const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');

const app = express();
app.use(express.json());

const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: './session'
    }),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process'
        ]
    }
});

client.on('qr', (qr) => {
    console.log('QR KODU:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('WhatsApp hazirdir!');
});

client.on('auth_failure', msg => {
    console.error('AUTH ERROR', msg);
});

client.on('disconnected', reason => {
    console.log('Disconnected:', reason);
});

client.initialize();

app.get('/', (req, res) => {
    res.send('WhatsApp Bot is running');
});

app.get('/send', async (req, res) => {
    const phone = req.query.phone;
    const message = req.query.message;

    if (!phone || !message) {
        return res.json({ success: false, error: "phone ve message vacibdir" });
    }

    const chatId = phone.includes('@c.us') ? phone : phone + '@c.us';

    try {
        await client.sendMessage(chatId, message);
        res.json({ success: true, message: 'Gonderildi' });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('Server port: ' + PORT);
});
