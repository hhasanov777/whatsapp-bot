const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const app = express();

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', (qr) => {
    console.log('QR KODU:');
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('WhatsApp hazirdir!');
});

client.initialize();

app.get('/send', async (req, res) => {
    const phone = req.query.phone;
    const message = req.query.message;
    const chatId = phone + '@c.us';
    
    try {
        await client.sendMessage(chatId, message);
        res.json({ success: true, message: 'Gonderildi' });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server port:' + PORT);
});
