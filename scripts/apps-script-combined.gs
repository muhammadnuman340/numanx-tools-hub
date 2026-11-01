/**
 * NumanX Tools Hub — Google Apps Script web app for the site's three forms.
 *
 * The Cloudflare functions (functions/api/contact.js, feedback.js, subscribe.js) POST here.
 * This script saves each submission to the Google Sheet and sends the emails:
 *
 *   Contact     → email to you + "we got your message" reply to the visitor
 *   Feedback    → email to you + thank-you reply (only if the visitor gave an email)
 *   Newsletter  → confirm-your-subscription email to the visitor;
 *                 after they click the link → email to you; every email has an unsubscribe link
 *
 * Setup (once):
 *   1. Create a Google Sheet → Extensions → Apps Script → paste this file into Code.gs and save.
 *   2. Project Settings → Script properties → add WEBHOOK_SECRET with a long random value.
 *      Put the same value in Cloudflare Pages → Settings → Variables as WEBHOOK_SECRET.
 *   3. Run sendTestEmail() once and allow the permissions Google asks for.
 *   4. Deploy → New deployment → Web app → Execute as: Me, Who has access: Anyone → Deploy.
 *   5. Put the web app URL in Cloudflare as CONTACT_WEBHOOK_URL, FEEDBACK_WEBHOOK_URL
 *      and NEWSLETTER_WEBHOOK_URL (the same URL for all three), then redeploy the site.
 *   After later edits: Deploy → Manage deployments → edit → Version: New version.
 */

const NOTIFICATION_EMAIL = 'numanxstudio@gmail.com';
const SITE_NAME = 'NumanX Tools Hub';
const SITE_URL = 'https://toolshub.numanxstudio.com';
// Leave empty when the script is opened from the sheet (Extensions → Apps Script): it then uses
// that sheet. Only a standalone script needs the sheet's ID here (the part of its URL after /d/).
const SHEET_ID = '';
const BRAND_COLOR = '#b45309';

// The contact form's "Subject" choices (value → label)
const TOPIC_LABELS = {
  feedback: 'Feedback',
  bug: 'Bug Report',
  suggestion: 'Tool Suggestion',
  partnership: 'Business / Partnership',
  other: 'Other',
};

// Per topic: an emoji for your inbox, where the notification goes, and the reply the visitor gets.
// To send a topic to a different inbox, change its `to` (e.g. partnerships to a business address).
const TOPICS = {
  'Business / Partnership': {
    icon: '💼',
    to: NOTIFICATION_EMAIL,
    reply: 'Thanks for your interest in working with NumanX Tools Hub. Business and partnership messages are read first; expect a reply within 1–2 working days. If you have a deck, rate card or deadline, just reply to this email with it.',
  },
  'Bug Report': {
    icon: '🐞',
    to: NOTIFICATION_EMAIL,
    reply: 'Thanks for reporting a bug — it helps everyone who uses the tool. If you haven’t already, reply with the tool’s page, your browser and device, and what you expected to happen. We’ll let you know when it’s fixed.',
  },
  'Tool Suggestion': {
    icon: '💡',
    to: NOTIFICATION_EMAIL,
    reply: 'Thanks for the tool idea. Every suggestion goes on our list, and the most requested ones get built first. We’ll write back if we build it or have a question.',
  },
  Feedback: {
    icon: '⭐',
    to: NOTIFICATION_EMAIL,
    reply: 'Thanks for your feedback. We read every message, and it decides what we fix and improve next.',
  },
  Other: {
    icon: '📬',
    to: NOTIFICATION_EMAIL,
    reply: 'Thanks for getting in touch. We read every message and usually reply within 2–3 working days.',
  },
};

function topicInfo(topic) {
  return TOPICS[topic] || TOPICS.Other;
}

// Emails to visitors stop well before Gmail's daily limit, so your own notifications still go out
const KEEP_FOR_NOTIFICATIONS = 15;
// At most one automatic email per visitor address in this many seconds
const VISITOR_EMAIL_GAP_SECONDS = 60 * 60;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Escapes visitor text before it goes into an HTML email or page. */
function esc(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || ''));
}

/** Gets a tab by name, creating it with headers. New columns are added at the end of old tabs. */
function getSheet(name, headers) {
  const ss = SHEET_ID ? SpreadsheetApp.openById(SHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('No sheet: open this script from the sheet (Extensions → Apps Script) or set SHEET_ID');
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
  } else if (sheet.getLastColumn() < headers.length) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
  return sheet;
}

/** Simple branded HTML wrapper for every email. */
function emailHtml(title, bodyHtml, footerHtml) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; color: #111; line-height: 1.6;">
      <h2 style="color: ${BRAND_COLOR}; border-bottom: 2px solid #e4e4e7; padding-bottom: 8px;">${title}</h2>
      ${bodyHtml}
      <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 24px 0 12px;" />
      <p style="font-size: 12px; color: #71717a;">${footerHtml || `${SITE_NAME} · <a href="${SITE_URL}/">${SITE_URL.replace('https://', '')}</a>`}</p>
    </div>`;
}

function notifyOwner(subject, html, replyTo, to) {
  try {
    MailApp.sendEmail({
      to: isEmail(to) ? to : NOTIFICATION_EMAIL,
      subject: subject,
      htmlBody: html,
      replyTo: isEmail(replyTo) ? replyTo : undefined,
      name: SITE_NAME,
    });
  } catch (err) {
    Logger.log('Owner mail error: ' + err);
  }
}

/**
 * Sends an automatic email to a visitor, with two limits: one per address per hour
 * (so the forms can't be used to flood someone's inbox) and a reserve in the daily quota.
 */
function emailVisitor(to, subject, html) {
  if (!isEmail(to)) return false;
  const cache = CacheService.getScriptCache();
  const key = 'sent_' + Utilities.base64EncodeWebSafe(String(to).toLowerCase()).slice(0, 200);
  if (cache.get(key)) return false;
  if (MailApp.getRemainingDailyQuota() <= KEEP_FOR_NOTIFICATIONS) return false;
  try {
    MailApp.sendEmail({ to: to, subject: subject, htmlBody: html, replyTo: NOTIFICATION_EMAIL, name: SITE_NAME });
    cache.put(key, '1', VISITOR_EMAIL_GAP_SECONDS);
    return true;
  } catch (err) {
    Logger.log('Visitor mail error: ' + err);
    return false;
  }
}

function webAppUrl() {
  return ScriptApp.getService().getUrl();
}

// ─── Entry points ────────────────────────────────────────────────────────────

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // Only the site's Cloudflare functions know the secret
    const secret = PropertiesService.getScriptProperties().getProperty('WEBHOOK_SECRET');
    if (secret && data.secret !== secret) return json({ success: false, error: 'Unauthorized' });
    delete data.secret;

    if (data.type === 'feedback') return json(handleFeedback(data));
    if (data.type === 'subscribe') return json(handleSubscribe(data));
    return json(handleContact(data));
  } catch (err) {
    return json({ success: false, error: String(err) });
  }
}

/** Links in the newsletter emails: ?action=confirm&token=… or ?action=unsubscribe&token=… */
function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || '';
  const token = (e && e.parameter && e.parameter.token) || '';
  if (action === 'confirm' || action === 'unsubscribe') return handleNewsletterLink(action, token);
  return page('NumanX Tools Hub', 'This address only handles the site’s forms.');
}

// ─── Contact ─────────────────────────────────────────────────────────────────

function handleContact(data) {
  // Old rows live in the first tab with these first five columns; Topic and Site are added at the end
  const sheet = getSheet('Contact', ['Timestamp', 'Name', 'Email', 'Subject', 'Message', 'Topic', 'Site']);
  const topic = data.topic || TOPIC_LABELS[data.subject] || 'General';
  const site = data.site || SITE_URL.replace('https://', '');
  sheet.appendRow([
    data.timestamp || new Date().toISOString(),
    data.name || '',
    data.email || '',
    data.subject || 'General',
    data.message || '',
    topic,
    site,
  ]);

  const info = topicInfo(topic);
  notifyOwner(
    `${info.icon} [${SITE_NAME}] ${topic} from ${data.name || 'Visitor'}`,
    emailHtml(
      `${info.icon} ${esc(topic)} — ${SITE_NAME}`,
      `<p><strong>Site:</strong> <a href="https://${esc(site)}/">${esc(site)}</a></p>
       <p><strong>Topic:</strong> ${esc(topic)}</p>
       <p><strong>Name:</strong> ${esc(data.name) || 'Anonymous'}</p>
       <p><strong>Email:</strong> <a href="mailto:${esc(data.email)}">${esc(data.email) || 'None'}</a></p>
       <p><strong>Received:</strong> ${new Date().toLocaleString()}</p>
       <p><strong>Message:</strong></p>
       <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; white-space: pre-wrap; font-size: 14px;">${esc(data.message)}</div>`,
      `Hit <strong>Reply</strong> to answer ${esc(data.name) || 'the visitor'} directly.`,
    ),
    data.email,
    info.to,
  );

  // The visitor's own message is not repeated, so the form can't be used to send someone arbitrary text
  emailVisitor(
    data.email,
    `We got your message (${topic}) — ${SITE_NAME}`,
    emailHtml(
      'Thanks for getting in touch',
      `<p>Hi ${esc(String(data.name || '').slice(0, 40)) || 'there'},</p>
       <p>Your <strong>${esc(topic)}</strong> message reached us.</p>
       <p>${info.reply}</p>
       <p>— ${SITE_NAME}</p>`,
      `You received this because this address was entered in the contact form on <a href="${SITE_URL}/contact/">${SITE_URL.replace('https://', '')}</a>. If that wasn’t you, ignore this email.`,
    ),
  );
  return { success: true };
}

// ─── Feedback ────────────────────────────────────────────────────────────────

function handleFeedback(data) {
  const sheet = getSheet('Feedback', ['Timestamp', 'Rating', 'Message', 'Email', 'Page', 'Name', 'Site']);
  sheet.appendRow([
    data.timestamp || new Date().toISOString(),
    data.rating || '',
    data.message || '',
    data.email || '',
    data.page || '',
    data.name || '',
    data.site || '',
  ]);

  const who = data.name || data.email || 'Anonymous visitor';
  const site = data.site || SITE_URL.replace('https://', '');
  const pageUrl = `https://${site}${data.page || '/'}`;
  notifyOwner(
    `[${SITE_NAME}] Feedback ${data.rating ? data.rating + '/5' : ''} from ${who} — ${data.page || '/'}`,
    emailHtml(
      `⭐ Feedback — ${SITE_NAME}`,
      `<p><strong>Name:</strong> ${esc(data.name) || 'Not given'}</p>
       <p><strong>Email:</strong> ${data.email ? `<a href="mailto:${esc(data.email)}">${esc(data.email)}</a>` : 'Not given'}</p>
       <p><strong>Rating:</strong> ${data.rating ? esc(data.rating) + '/5' : 'None provided'}</p>
       <p><strong>Page:</strong> <a href="${esc(pageUrl)}">${esc(data.page || '/')}</a></p>
       <p><strong>Received:</strong> ${new Date().toLocaleString()}</p>
       <p><strong>Message:</strong></p>
       <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; white-space: pre-wrap; font-size: 14px;">${esc(data.message) || 'No comment'}</div>`,
      data.email ? `Hit <strong>Reply</strong> to answer ${esc(who)} directly.` : 'No email given, so there is no one to reply to.',
    ),
    data.email,
  );

  if (data.email) {
    emailVisitor(
      data.email,
      `Thanks for your feedback — ${SITE_NAME}`,
      emailHtml(
        'Thanks for your feedback',
        `<p>Hi ${esc(String(data.name || '').slice(0, 40)) || 'there'},</p>
         <p>Thanks for rating ${SITE_NAME}${data.rating ? ` <strong>${esc(data.rating)}/5</strong>` : ''}. Feedback like yours decides what we fix and build next.</p>
         <p>If we have a question about it, we’ll reply to this address. You can also reply to this email any time.</p>
         <p>— ${SITE_NAME}</p>`,
        `You received this because this address was entered in the feedback form on <a href="${SITE_URL}/">${SITE_URL.replace('https://', '')}</a>. If that wasn’t you, ignore this email.`,
      ),
    );
  }
  return { success: true };
}

// ─── Newsletter (double opt-in) ──────────────────────────────────────────────

const SUBSCRIBER_HEADERS = ['Timestamp', 'Email', 'Status', 'Token', 'Confirmed at', 'Unsubscribed at', 'Site'];
const COL = { email: 2, status: 3, token: 4, confirmedAt: 5, unsubscribedAt: 6 };

function findSubscriberRow(sheet, column, value) {
  if (!value || sheet.getLastRow() < 2) return 0;
  const values = sheet.getRange(2, column, sheet.getLastRow() - 1, 1).getValues();
  for (let i = 0; i < values.length; i++) {
    if (String(values[i][0]).toLowerCase() === String(value).toLowerCase()) return i + 2;
  }
  return 0;
}

function handleSubscribe(data) {
  const email = String(data.email || '').toLowerCase().trim();
  if (!isEmail(email)) return { success: false, error: 'Invalid email' };

  const sheet = getSheet('Subscribers', SUBSCRIBER_HEADERS);
  let row = findSubscriberRow(sheet, COL.email, email);
  if (row && sheet.getRange(row, COL.status).getValue() === 'confirmed') {
    return { success: true, status: 'already-subscribed' };
  }

  const token = Utilities.getUuid();
  if (row) {
    // Pending or unsubscribed: start again with a fresh link
    sheet.getRange(row, COL.status, 1, 2).setValues([['pending', token]]);
  } else {
    sheet.appendRow([data.timestamp || new Date().toISOString(), email, 'pending', token, '', '', data.site || '']);
  }

  const confirmUrl = `${webAppUrl()}?action=confirm&token=${encodeURIComponent(token)}`;
  const unsubscribeUrl = `${webAppUrl()}?action=unsubscribe&token=${encodeURIComponent(token)}`;
  const sent = emailVisitor(
    email,
    `Confirm your subscription — ${SITE_NAME}`,
    emailHtml(
      'One click to confirm',
      `<p>Someone (hopefully you) asked to get ${SITE_NAME} updates at this address: new free tools and guides, at most a couple of emails a month.</p>
       <p style="margin: 24px 0;"><a href="${confirmUrl}" style="background: ${BRAND_COLOR}; color: #fff; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: bold;">Yes, subscribe me</a></p>
       <p>If you didn’t ask for this, ignore this email and you won’t hear from us.</p>`,
      `<a href="${unsubscribeUrl}">Don’t email this address again</a> · ${SITE_NAME}`,
    ),
  );
  return { success: true, status: sent ? 'confirmation-sent' : 'confirmation-delayed' };
}

function handleNewsletterLink(action, token) {
  const sheet = getSheet('Subscribers', SUBSCRIBER_HEADERS);
  const row = findSubscriberRow(sheet, COL.token, token);
  if (!row) return page('Link not found', 'This link has expired or was already replaced by a newer one. You can sign up again on the site.');

  const email = sheet.getRange(row, COL.email).getValue();
  const now = new Date().toISOString();
  if (action === 'confirm') {
    const wasConfirmed = sheet.getRange(row, COL.status).getValue() === 'confirmed';
    sheet.getRange(row, COL.status).setValue('confirmed');
    if (!wasConfirmed) {
      sheet.getRange(row, COL.confirmedAt).setValue(now);
      notifyOwner(
        `[${SITE_NAME}] New newsletter subscriber`,
        emailHtml('📨 New subscriber', `<p><strong>Email:</strong> ${esc(email)}</p><p><strong>Confirmed:</strong> ${new Date().toLocaleString()}</p>`),
      );
    }
    const unsubscribeUrl = `${webAppUrl()}?action=unsubscribe&token=${encodeURIComponent(token)}`;
    return page(
      'You’re subscribed',
      `Thanks! ${esc(email)} will get ${SITE_NAME} updates. Changed your mind? <a href="${unsubscribeUrl}">Unsubscribe</a>.`,
    );
  }
  sheet.getRange(row, COL.status).setValue('unsubscribed');
  sheet.getRange(row, COL.unsubscribedAt).setValue(now);
  return page('You’re unsubscribed', `${esc(email)} won’t get any more emails from ${SITE_NAME}.`);
}

/** Small result page for the confirm / unsubscribe links. */
function page(title, messageHtml) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 64px auto; padding: 0 16px; color: #111; line-height: 1.6;">
      <h1 style="color: ${BRAND_COLOR}; font-size: 24px;">${title}</h1>
      <p>${messageHtml}</p>
      <p><a href="${SITE_URL}/" style="color: ${BRAND_COLOR};">Back to ${SITE_NAME}</a></p>
    </div>`;
  return HtmlService.createHtmlOutput(html).setTitle(title).addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// ─── Run once from the editor ────────────────────────────────────────────────

/** Asks Google for the email and sheet permissions and checks that mail arrives. */
function sendTestEmail() {
  getSheet('Contact', ['Timestamp', 'Name', 'Email', 'Subject', 'Message', 'Topic', 'Site']);
  MailApp.sendEmail({
    to: NOTIFICATION_EMAIL,
    subject: `[${SITE_NAME}] Test email — Apps Script is connected`,
    htmlBody: emailHtml('✅ It works', `<p>Emails from the site's forms will arrive here. Remaining emails today: ${MailApp.getRemainingDailyQuota()}.</p>`),
    name: SITE_NAME,
  });
  Logger.log('Test email sent to ' + NOTIFICATION_EMAIL + '. Secret set: ' + Boolean(PropertiesService.getScriptProperties().getProperty('WEBHOOK_SECRET')));
}

/**
 * Sends one test of each form. "Visitor" emails go to your own inbox through Gmail's
 * plus-addressing (name+test@gmail.com arrives at name@gmail.com). Test rows are marked TEST
 * in the sheet; delete them afterwards. Run it after deploying, so the newsletter links work.
 */
function testAllForms() {
  const [user, domain] = NOTIFICATION_EMAIL.split('@');
  const stamp = Date.now();
  const visitor = (tag) => `${user}+${tag}${stamp}@${domain}`;
  const results = [];

  // One contact message per topic, each from its own test address
  Object.keys(TOPIC_LABELS).forEach((value) => {
    const topic = TOPIC_LABELS[value];
    results.push(`Contact (${topic}): ` + JSON.stringify(handleContact({
      name: 'TEST Contact', email: visitor(value), subject: value, topic: topic,
      message: `TEST ${topic} message from testAllForms(). <b>This should show as text, not bold.</b>`,
      site: SITE_URL.replace('https://', ''),
    })));
  });
  results.push('Feedback: ' + JSON.stringify(handleFeedback({
    rating: 5, name: 'TEST Feedback', email: visitor('feedbackform'), page: '/tools/run-rate-calculator/',
    message: 'TEST feedback from testAllForms().', site: SITE_URL.replace('https://', ''),
  })));
  if (webAppUrl()) {
    results.push('Newsletter: ' + JSON.stringify(handleSubscribe({ email: visitor('newsletter'), site: 'TEST' })));
  } else {
    results.push('Newsletter: skipped — deploy the web app first (Deploy → New deployment), then run again');
  }

  Logger.log(results.join('\n'));
  Logger.log('Check ' + NOTIFICATION_EMAIL + ' for up to 13 emails: contact 5 topics × 2, feedback (2), newsletter confirm (1). ' +
    'Click the confirm link to get the 6th: "New newsletter subscriber". Emails left today: ' + MailApp.getRemainingDailyQuota());
}