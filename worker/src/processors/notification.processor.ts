import { Job } from 'bullmq';
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';
import * as admin from 'firebase-admin';
import * as webPush from 'web-push';

// Initialize Firebase Admin if available
let firebaseApp: admin.app.App | null = null;
try {
  const firebaseKey = process.env.FIREBASE_SERVER_KEY;
  if (firebaseKey) {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(firebaseKey)),
    });
  }
} catch (error) {
  console.warn('Firebase initialization failed:', error);
}

// Initialize VAPID
const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
if (vapidPublicKey && vapidPrivateKey) {
  webPush.setVapidDetails(
    'mailto:admin@example.com',
    vapidPublicKey,
    vapidPrivateKey,
  );
}

export function NotificationProcessor(prisma: PrismaClient, redis: Redis) {
  return async (job: Job) => {
    const { userId, itemId, alertRuleId } = job.data;
    
    console.log(`Sending notification to user ${userId} for item ${itemId}`);
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { devices: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const item = await prisma.item.findUnique({
      where: { id: itemId },
      include: { source: true },
    });

    if (!item) {
      throw new Error('Item not found');
    }

    const sentVia: string[] = [];

    // Send to all user devices
    for (const device of user.devices) {
      try {
        if (device.platform === 'web') {
          await sendWebPush(device.fcmToken, item);
          sentVia.push('web-push');
        } else {
          await sendFCM(device.fcmToken, item, device.platform);
          sentVia.push('fcm');
        }
      } catch (error) {
        console.error(`Failed to send to device ${device.id}:`, error);
      }
    }

    // Create notification record
    const notification = await prisma.notification.create({
      data: {
        userId,
        itemId,
        alertRuleId,
        sentVia,
        status: sentVia.length > 0 ? 'SENT' : 'FAILED',
      },
    });

    return { notificationId: notification.id };
  };
}

async function sendFCM(token: string, item: any, platform: string) {
  if (!firebaseApp) {
    throw new Error('Firebase not initialized');
  }

  const message = {
    notification: {
      title: item.title,
      body: item.shortSummary || item.title,
    },
    data: {
      itemId: item.id,
      type: item.type,
      url: item.url,
    },
    token,
    android: {
      priority: 'high' as const,
    },
    apns: {
      headers: {
        'apns-priority': '10',
      },
    },
  };

  await admin.messaging(firebaseApp).send(message);
}

async function sendWebPush(subscription: string, item: any) {
  const payload = JSON.stringify({
    title: item.title,
    body: item.shortSummary || item.title,
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    data: {
      itemId: item.id,
      url: `/item/${item.id}`,
    },
  });

  try {
    const sub = JSON.parse(subscription);
    await webPush.sendNotification(sub, payload);
  } catch (error) {
    await webPush.sendNotification(subscription as any, payload);
  }
}

