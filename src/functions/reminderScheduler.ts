/**
 * Cloud Function Trigger / Scheduled Job: dailyReminderNotificationScheduler
 * 
 * Trigger: Cloud Scheduler (e.g. cron "0 8 * * *" - Runs once daily at 08:00 AM UK time)
 * Purpose: Checks all active life reminders across seniors where dueDate is TODAY or TOMORROW.
 *          Generates high-priority in-app Notification records, and triggers stub delivery calls
 *          for SMS and Email notification channels.
 * 
 * Architecture Note:
 * In production Google Cloud Functions / Firebase Functions environment, this function executes
 * with Firebase Admin privileges. In the full-stack container, it can also be triggered via the
 * secure `/api/scheduler/check-reminders` endpoint.
 */

import { ReminderRecord, NotificationRecord } from '../types';

export interface ScheduledExecutionResult {
  executionTimestamp: string;
  checkedCount: number;
  dueTodayCount: number;
  dueTomorrowCount: number;
  notificationsCreated: number;
  smsDispatchesTriggered: number;
  emailDispatchesTriggered: number;
  processedReminders: {
    reminderId: string;
    title: string;
    dueDate: string;
    seniorUid: string;
    channels: string[];
    isToday: boolean;
  }[];
}

/**
 * STUB: Send SMS Notification to Senior or Linked Family Carer
 * TODO: Wire this function to a production SMS provider (e.g. Twilio / AWS SNS / MessageBird)
 */
export async function sendSmsNotificationStub(
  recipientPhone: string,
  recipientName: string,
  reminderTitle: string,
  dueDateFormatted: string,
  reminderType: string
): Promise<{ success: boolean; messageId: string }> {
  // TODO: [SMS PROVIDER INTEGRATION]
  // Example Twilio payload:
  // await twilioClient.messages.create({
  //   body: `EverEase Reminder: Hello ${recipientName}, "${reminderTitle}" is due on ${dueDateFormatted}.`,
  //   from: process.env.TWILIO_PHONE_NUMBER,
  //   to: recipientPhone,
  // });

  console.log(`[SMS DISPATCH STUB] Sending SMS to ${recipientPhone} (${recipientName}): "${reminderTitle}" due ${dueDateFormatted}`);
  
  return {
    success: true,
    messageId: `sms_stub_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
  };
}

/**
 * STUB: Send Email Notification to Senior or Linked Family Carer
 * TODO: Wire this function to a production Email provider (e.g. SendGrid / Postmark / AWS SES / Resend)
 */
export async function sendEmailNotificationStub(
  recipientEmail: string,
  recipientName: string,
  reminderTitle: string,
  dueDateFormatted: string,
  reminderType: string,
  notes?: string
): Promise<{ success: boolean; emailId: string }> {
  // TODO: [EMAIL PROVIDER INTEGRATION]
  // Example SendGrid payload:
  // await sendgridMail.send({
  //   to: recipientEmail,
  //   from: 'reminders@everease.co.uk',
  //   subject: `EverEase Reminder: ${reminderTitle} is due ${dueDateFormatted}`,
  //   templateId: 'd-reminder-template-uk',
  //   dynamicTemplateData: { recipientName, reminderTitle, dueDateFormatted, notes }
  // });

  console.log(`[EMAIL DISPATCH STUB] Sending Email to ${recipientEmail} (${recipientName}): "${reminderTitle}" due ${dueDateFormatted}`);

  return {
    success: true,
    emailId: `email_stub_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
  };
}

/**
 * Check if a date string (YYYY-MM-DD) is Today, Tomorrow, or Past
 */
export function categorizeDueDate(dueDateStr: string, referenceDate: Date = new Date()): 'today' | 'tomorrow' | 'past' | 'future' {
  // Normalize dates to local midnight for accurate calendar comparison
  const ref = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
  
  const parts = dueDateStr.split('T')[0].split('-');
  if (parts.length < 3) return 'future';

  const due = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));

  const diffMs = due.getTime() - ref.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'tomorrow';
  if (diffDays < 0) return 'past';
  return 'future';
}

/**
 * Main scheduled execution engine.
 * Reads reminders due today or tomorrow, writes notifications to Firestore,
 * and calls stub SMS/Email delivery functions.
 */
export async function runDailyReminderCheck(
  remindersList: ReminderRecord[],
  firestoreWriteNotification?: (notif: NotificationRecord) => Promise<any>
): Promise<ScheduledExecutionResult> {
  const now = new Date();
  let checkedCount = 0;
  let dueTodayCount = 0;
  let dueTomorrowCount = 0;
  let notificationsCreated = 0;
  let smsDispatchesTriggered = 0;
  let emailDispatchesTriggered = 0;
  const processedReminders: ScheduledExecutionResult['processedReminders'] = [];

  for (const reminder of remindersList) {
    // Skip reminders marked done
    if (reminder.status === 'done') {
      continue;
    }

    checkedCount++;
    const dueCategory = categorizeDueDate(reminder.dueDate, now);

    if (dueCategory === 'today' || dueCategory === 'tomorrow') {
      const isToday = dueCategory === 'today';
      if (isToday) dueTodayCount++;
      else dueTomorrowCount++;

      const dueText = isToday ? 'TODAY' : 'TOMORROW';
      const timeText = reminder.time ? ` at ${reminder.time}` : '';
      const notifTitle = `⏰ Reminder Due ${dueText}: ${reminder.title}`;
      const notifBody = `${reminder.title} is scheduled for ${dueText.toLowerCase()}${timeText}.${reminder.notes ? ` Notes: ${reminder.notes}` : ''}`;

      // 1. In-App Notification Record
      if (reminder.channel.includes('in_app')) {
        const notifId = `notif_rem_${reminder.reminderId}_${now.toISOString().split('T')[0]}`;
        const newNotification: NotificationRecord = {
          notifId,
          uid: reminder.seniorUid,
          type: 'reminder',
          payload: {
            title: notifTitle,
            body: notifBody,
            route: '/reminders',
            module: 'reminders',
            actionRequired: true,
            reminderId: reminder.reminderId,
            reminderType: reminder.type,
            dueDate: reminder.dueDate,
          },
          read: false,
          createdAt: now.toISOString(),
        };

        if (firestoreWriteNotification) {
          try {
            await firestoreWriteNotification(newNotification);
            notificationsCreated++;
          } catch (writeErr) {
            console.error('Error writing reminder notification:', writeErr);
          }
        } else {
          notificationsCreated++;
        }
      }

      // 2. SMS Delivery Channel (Stub Call)
      if (reminder.channel.includes('sms')) {
        await sendSmsNotificationStub(
          '+44 7700 900077', // Senior UK demo mobile or from UserRecord
          reminder.createdByName || 'Margaret',
          reminder.title,
          `${dueText}${timeText}`,
          reminder.type
        );
        smsDispatchesTriggered++;
      }

      // 3. Email Delivery Channel (Stub Call)
      if (reminder.channel.includes('email')) {
        await sendEmailNotificationStub(
          'margaret.davies@example.co.uk', // Senior email or from UserRecord
          reminder.createdByName || 'Margaret',
          reminder.title,
          `${dueText}${timeText}`,
          reminder.type,
          reminder.notes
        );
        emailDispatchesTriggered++;
      }

      processedReminders.push({
        reminderId: reminder.reminderId,
        title: reminder.title,
        dueDate: reminder.dueDate,
        seniorUid: reminder.seniorUid,
        channels: reminder.channel,
        isToday,
      });
    }
  }

  return {
    executionTimestamp: now.toISOString(),
    checkedCount,
    dueTodayCount,
    dueTomorrowCount,
    notificationsCreated,
    smsDispatchesTriggered,
    emailDispatchesTriggered,
    processedReminders,
  };
}
