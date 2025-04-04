const { db, admin } = require('../config/firebase');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const notifiedDowntimes = new Map();
const NOTIFICATION_THROTTLE_MS = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

let transporter;

const configureMailTransport = () => {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD 
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  
  transporter.verify(function(error, success) {
    if (error) {
      console.error("SMTP connection error:", error);
    } else {
      console.log("SMTP server is ready to send emails");
    }
  });
};

const sendDowntimeNotification = async (user, website) => {
  try {
    if (!user.email) {
      console.error(`Cannot send notification: No email address for user ${user.uid}`);
      
      try {
        const userRecord = await admin.auth().getUser(user.uid);
        if (userRecord.email) {
          user.email = userRecord.email;
        } else {
          throw new Error('No email found in Auth record');
        }
      } catch (authError) {
        console.error('Failed to get user email from Auth:', authError);
        return; 
      }
    }

    const mailOptions = {
      from: `"Caffeine 4 Web" <your @email here>`,
      to: user.email,
      subject: `🔴 ALERT: ${website.name || website.url} is DOWN`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #cf6679;">Website Down Alert</h2>
          <p style="font-size: 16px;">
            We detected that <strong>${website.name || website.url}</strong> is currently down.
          </p>
          <p>
            <strong>URL:</strong> ${website.url}<br>
            <strong>Time detected:</strong> ${new Date().toLocaleString()}<br>
            <strong>Status:</strong> Down
          </p>
          <p>
            We'll notify you once the website is back up.
          </p>
          <p style="margin-top: 30px; font-size: 14px; color: #888;">
            <em>This is an automated alert from caffeine 4 web. To change your notification settings,
            visit your dashboard settings.</em>
          </p>
        </div>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`Downtime notification sent to ${user.email} for ${website.url} (Message ID: ${info.messageId})`);
    
    notifiedDowntimes.set(website.id, {
      timestamp: Date.now(),
      notified: true
    });
    
    await db.collection('notifications').add({
      userId: user.uid,
      websiteId: website.id,
      websiteUrl: website.url,
      type: 'downtime',
      timestamp: admin.firestore.Timestamp.now(),
      delivered: true
    });
    
  } catch (error) {
    console.error(`Failed to send downtime notification for ${website.url}:`, error);
  }
};

const sendUptimeNotification = async (user, website) => {
  try {
    const mailOptions = {
      from: `"Caffeine 4 Web" <your @email here>`,
      to: user.email,
      subject: `✅ RESOLVED: ${website.name || website.url} is back UP`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #03dac6;">Website Restored Alert</h2>
          <p style="font-size: 16px;">
            Good news! <strong>${website.name || website.url}</strong> is back online.
          </p>
          <p>
            <strong>URL:</strong> ${website.url}<br>
            <strong>Time restored:</strong> ${new Date().toLocaleString()}<br>
            <strong>Status:</strong> Up
          </p>
          <p style="margin-top: 30px; font-size: 14px; color: #888;">
            <em>This is an automated alert from caffeine 4 web. To change your notification settings,
            visit your dashboard settings.</em>
          </p>
        </div>
      `
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`Uptime notification sent to ${user.email} for ${website.url} (Message ID: ${info.messageId})`);
    
    notifiedDowntimes.delete(website.id);
    
    await db.collection('notifications').add({
      userId: user.uid,
      websiteId: website.id,
      websiteUrl: website.url,
      type: 'uptime',
      timestamp: admin.firestore.Timestamp.now(),
      delivered: true
    });
    
  } catch (error) {
    console.error(`Failed to send uptime notification for ${website.url}:`, error);
  }
};

const checkAndSendNotifications = async (website, pingResult) => {
  try {
    const currentTime = Date.now();
    const lastNotification = notifiedDowntimes.get(website.id);
    const isDown = !pingResult.isUp;
    
    // Site is down - check if we should notify
    if (isDown) {
      // Only notify if:
      // 1. We haven't notified yet, OR
      // 2. It's been more than 2 hours since the last notification
      const shouldNotify = !lastNotification || 
                         (currentTime - lastNotification.timestamp) > NOTIFICATION_THROTTLE_MS;
      
      if (shouldNotify) {
        const usersSnapshot = await db.collection('users').get();
        const notificationPromises = [];
        
        usersSnapshot.forEach(async (doc) => {
          try {
            let user = { uid: doc.id, ...doc.data() };
            
            if (!user.email) {
              try {
                const userRecord = await admin.auth().getUser(user.uid);
                user.email = userRecord.email;
              } catch (authError) {
                console.error(`Failed to get email for user ${user.uid}:`, authError);
                return; 
              }
            }
            
            // Check if user wants notifications for this website
            if (user.notificationSettings?.emailNotificationsEnabled &&
                user.notificationSettings?.websites?.[website.id] &&
                user.email) {
              
              notificationPromises.push(sendDowntimeNotification(user, website));
            }
          } catch (error) {
            console.error(`Error processing user ${doc.id}:`, error);
          }
        });
        
        await Promise.all(notificationPromises);
      } else {
        console.log(`Skipping notification for ${website.url}: last notification was less than 2 hours ago`);
      }
    } 
    // Site is up after being down - send notification immediately
    else if (!isDown && lastNotification) {
      const usersSnapshot = await db.collection('users').get();
      const notificationPromises = [];
      
      usersSnapshot.forEach(async (doc) => {
        try {
          let user = { uid: doc.id, ...doc.data() };
          
          if (!user.email) {
            try {
              const userRecord = await admin.auth().getUser(user.uid);
              user.email = userRecord.email;
            } catch (authError) {
              console.error(`Failed to get email for user ${user.uid}:`, authError);
              return; 
            }
          }
          
          if (user.notificationSettings?.emailNotificationsEnabled &&
              user.notificationSettings?.websites?.[website.id] &&
              user.email) {
            notificationPromises.push(sendUptimeNotification(user, website));
          }
        } catch (error) {
          console.error(`Error processing user ${doc.id}:`, error);
        }
      });
      
      await Promise.all(notificationPromises);
    }
  } catch (error) {
    console.error('Error checking and sending notifications:', error);
  }
};

module.exports = {
  configureMailTransport,
  checkAndSendNotifications
};