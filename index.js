const si = require('systeminformation');
const axios = require('axios');

require('dotenv').config();

// Replace with your Telegram Bot API token and chat ID
const TELEGRAM_API_TOKEN = process.env.TELEGRAM_API_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

const checkRAMUsage = async () => {
    const data = await si.mem();
    const totalMemory = data.total;
    const freeMemory = data.available;
    const usedMemory = totalMemory - freeMemory;
    const ramUsagePercentage = (usedMemory / totalMemory) * 100;

    console.log(`RAM Usage: ${ramUsagePercentage.toFixed(2)}%`);

    if (ramUsagePercentage > 80) {
        let publicIP = await getPublicIP();
        await sendTelegramMessage(`High RAM Usage on server ${publicIP} Alert: ${ramUsagePercentage.toFixed(2)}%`);
    }
};

const getPublicIP = async () => {
    try {
        const response = await axios.get('https://api64.ipify.org?format=json');
        const publicIP = response.data.ip;
        return publicIP;
    } catch (error) {
        console.error('Error fetching public IP:', error.message);
    }
};

const sendTelegramMessage = async (message) => {
    const url = `https://api.telegram.org/bot${TELEGRAM_API_TOKEN}/sendMessage`;
    const params = {
        chat_id: CHAT_ID,
        text: message,
    };

    try {
        const response = await axios.post(url, params);

        if (response.data.ok) {
            console.log('Telegram message sent successfully.');
        } else {
            console.error('Failed to send Telegram message:', response.data.description);
        }
    } catch (error) {
        console.error('Error sending Telegram message:', error.message);
    }
};

setInterval(checkRAMUsage, 1 * 60 * 1000);