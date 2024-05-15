const axios = require('axios');
const cheerio = require('cheerio');
const twilio = require('twilio');

// Twilio credentials (replace with your actual credentials)
const accountSid = 'your_account_sid';
const authToken = 'your_auth_token';
const client = new twilio(accountSid, authToken);

module.exports = async (req, res) => {
  try {
    const response = await axios.get('https://www.ticket-onlineshop.com/ols/fcstpauli-heim/de/hs/channel/shop/index');
    const $ = cheerio.load(response.data);

    // Check if the text "Es sind keine Tickets verfügbar" is found
    const text = $('body').text();
    if (!text.includes('Es sind keine Tickets verfügbar')) {
      // Send SMS
      await client.messages.create({
        body: 'Tickets are now available!',
        from: '+1234567890', // Your Twilio number
        to: '+491735144502' // Customer's number
      });

      res.status(200).send('SMS sent');
    } else {
      res.status(200).send('No action needed');
    }
  } catch (error) {
    console.error('Error checking website status:', error);
    res.status(500).send('Error checking website status');
  }
};
