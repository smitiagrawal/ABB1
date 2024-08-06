const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendOutbidNotification = async (previousBidders, auctionTitle) => {
    if (previousBidders.length > 0) {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            bcc: previousBidders,
            subject: 'You have been outbid!',
            text: `Someone has placed a higher bid on the auction: ${auctionTitle}. Visit the auction page to place a higher bid.`,
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log('Outbid notification sent successfully');
        } catch (error) {
            console.error('Error sending outbid notification:', error);
        }
    }
};

module.exports = { sendOutbidNotification };
