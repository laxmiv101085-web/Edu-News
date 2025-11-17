import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import * as admin from 'firebase-admin';
import * as webPush from 'web-push';

@Injectable()
export class NotificationsService {
  private firebaseApp: admin.app.App | null = null;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    // Initialize Firebase Admin if key is provided
    const firebaseKey = config.get('FIREBASE_SERVER_KEY');
    if (firebaseKey) {
      try {
        this.firebaseApp = admin.initializeApp({
          credential: admin.credential.cert(JSON.parse(firebaseKey)),
        });
      } catch (error) {
        console.warn('Firebase initialization failed:', error.message);
      }
    }

    // Initialize VAPID for web push
    const vapidPublicKey = config.get('VAPID_PUBLIC_KEY');
    const vapidPrivateKey = config.get('VAPID_PRIVATE_KEY');
    if (vapidPublicKey && vapidPrivateKey) {
      webPush.setVapidDetails(
        'mailto:admin@example.com',
        vapidPublicKey,
        vapidPrivateKey,
      );
    }
  }

  async sendNotification(userId: string, itemId: string, alertRuleId?: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { devices: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const item = await this.prisma.item.findUnique({
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
          // Web push via VAPID
          await this.sendWebPush(device.fcmToken, item);
          sentVia.push('web-push');
        } else {
          // Mobile push via FCM
          await this.sendFCM(device.fcmToken, item, device.platform);
          sentVia.push('fcm');
        }
      } catch (error) {
        console.error(`Failed to send to device ${device.id}:`, error);
      }
    }

    // Create notification record
    const notification = await this.prisma.notification.create({
      data: {
        userId,
        itemId,
        alertRuleId,
        sentVia,
        status: sentVia.length > 0 ? 'SENT' : 'FAILED',
      },
    });

    return notification;
  }

  private async sendFCM(token: string, item: any, platform: string) {
    if (!this.firebaseApp) {
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

    await admin.messaging(this.firebaseApp).send(message);
  }

  private async sendWebPush(subscription: string, item: any) {
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
      // If subscription is already a PushSubscription object
      await webPush.sendNotification(subscription as any, payload);
    }
  }
}

