export interface EmailMessage {
  id: string;
  toEmail: string;
  subject: string;
  type: 'registration_received' | 'approval_confirmed';
  title: string;
  badge: string;
  badgeColor: 'amber' | 'emerald';
  timestamp: string;
  status: 'sent' | 'delivered';
  htmlContent: string;
  plainText: string;
}

const EMAILS_STORAGE_KEY = 'pro_soccer_et_emails_v1';

/**
 * Creates rich HTML email template matching PRO SOCCER ET web interface styling:
 * - Cinematic dark stadium background (#05070a)
 * - Luxury gold & amber borders (#fbbf24, #f59e0b)
 * - PRO SOCCER ET branding and VIP 1X Engine accents
 * - Responsive layout with status badges and clean typography
 */
export function buildWebStyledEmailHtml(params: {
  recipientEmail: string;
  title: string;
  subject: string;
  badgeText: string;
  badgeColor: 'amber' | 'emerald';
  mainMessage: string;
  statusLabel: string;
  actionButtonText: string;
  actionButtonUrl: string;
  secondaryInfo?: string;
}): string {
  const isEmerald = params.badgeColor === 'emerald';
  const badgeBg = isEmerald ? '#064e3b' : '#451a03';
  const badgeBorder = isEmerald ? '#10b981' : '#f59e0b';
  const badgeTextColor = isEmerald ? '#6ee7b7' : '#fde68a';
  const primaryAccent = isEmerald ? '#10b981' : '#fbbf24';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${params.subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #05070a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #05070a; min-height: 100vh; padding: 24px 12px;">
    <tr>
      <td align="center">
        <!-- Main Email Container Styled Like Web Card -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; background-color: #0c101a; border: 2px solid ${primaryAccent}; border-radius: 24px; overflow: hidden; box-shadow: 0 0 50px rgba(255, 215, 0, 0.25);">
          
          <!-- Header Bar (Matching Web App Bar) -->
          <tr>
            <td style="background: linear-gradient(180deg, #121727 0%, #0c101a 100%); padding: 28px 32px; border-bottom: 1px solid rgba(251, 191, 36, 0.25); text-align: center;">
              <!-- Brand Logo -->
              <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                <tr>
                  <td style="vertical-align: middle;">
                    <div style="display: inline-block; width: 44px; height: 44px; line-height: 44px; border-radius: 12px; background: linear-gradient(135deg, #fbbf24 0%, #d97706 100%); color: #000000; font-size: 22px; font-weight: 900; text-align: center; box-shadow: 0 0 20px rgba(251, 191, 36, 0.6);">
                      ⚽
                    </div>
                  </td>
                  <td style="vertical-align: middle; padding-left: 14px; text-align: left;">
                    <span style="font-size: 20px; font-weight: 900; letter-spacing: 1.5px; color: #ffffff; text-transform: uppercase; display: block; line-height: 1.1;">
                      PRO SOCCER <span style="color: #fbbf24;">ET</span>
                    </span>
                    <span style="font-size: 10px; font-weight: 700; color: #94a3b8; letter-spacing: 2px; text-transform: uppercase;">
                      1X Predictive Matrix • VIP
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Status Banner -->
          <tr>
            <td style="padding: 24px 32px 12px; text-align: center;">
              <div style="display: inline-block; background-color: ${badgeBg}; border: 1.5px solid ${badgeBorder}; border-radius: 9999px; padding: 6px 18px; font-size: 11px; font-weight: 800; color: ${badgeTextColor}; text-transform: uppercase; letter-spacing: 1.5px;">
                ${params.badgeText}
              </div>
            </td>
          </tr>

          <!-- Email Content Body -->
          <tr>
            <td style="padding: 12px 32px 28px;">
              <h1 style="margin: 0 0 16px; font-size: 24px; font-weight: 900; color: #ffffff; text-align: center; text-transform: uppercase; letter-spacing: 0.5px;">
                ${params.title}
              </h1>

              <div style="background-color: #121727; border: 1px solid rgba(251, 191, 36, 0.2); border-radius: 16px; padding: 20px; margin-bottom: 24px;">
                <p style="margin: 0 0 12px; font-size: 14px; line-height: 1.6; color: #cbd5e1;">
                  Hello <strong style="color: #fbbf24;">${params.recipientEmail}</strong>,
                </p>
                <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #cbd5e1;">
                  ${params.mainMessage}
                </p>
              </div>

              <!-- Membership Details Box -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #07090f; border: 1px solid #1e293b; border-radius: 14px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 12px 18px; border-bottom: 1px solid #1e293b; font-size: 12px; color: #94a3b8; font-weight: 600;">
                    Registered Email:
                  </td>
                  <td align="right" style="padding: 12px 18px; border-bottom: 1px solid #1e293b; font-size: 12px; color: #ffffff; font-weight: 700; font-family: monospace;">
                    ${params.recipientEmail}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 18px; border-bottom: 1px solid #1e293b; font-size: 12px; color: #94a3b8; font-weight: 600;">
                    Access Status:
                  </td>
                  <td align="right" style="padding: 12px 18px; border-bottom: 1px solid #1e293b; font-size: 12px; color: ${primaryAccent}; font-weight: 800; text-transform: uppercase;">
                    ${params.statusLabel}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 18px; font-size: 12px; color: #94a3b8; font-weight: 600;">
                    Engine Platform:
                  </td>
                  <td align="right" style="padding: 12px 18px; font-size: 12px; color: #fbbf24; font-weight: 700;">
                    PRO SOCCER ET 1X Matrix
                  </td>
                </tr>
              </table>

              ${params.secondaryInfo ? `
              <p style="margin: 0 0 24px; font-size: 13px; line-height: 1.6; color: #94a3b8; text-align: center;">
                ${params.secondaryInfo}
              </p>
              ` : ''}

              <!-- Primary CTA Button Matching Web Predictor Button -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="${params.actionButtonUrl}" target="_blank" style="display: inline-block; background: linear-gradient(90deg, #fde047 0%, #fbbf24 50%, #f59e0b 100%); color: #000000; font-size: 13px; font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px; text-decoration: none; padding: 16px 36px; border-radius: 14px; box-shadow: 0 0 25px rgba(251, 191, 36, 0.6);">
                      ${params.actionButtonText} &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer (Matching Web Footer) -->
          <tr>
            <td style="background-color: #07090f; padding: 20px 32px; border-top: 1px solid #1e293b; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                Official PRO SOCCER ET Verification
              </p>
              <p style="margin: 0; font-size: 11px; color: #475569;">
                Predict Smarter. Analyze • Predict • Win • 1X Matrix System
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Retrieves all stored dispatched emails
 */
export function getAllDispatchedEmails(): EmailMessage[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(EMAILS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to get emails from localStorage:', err);
    return [];
  }
}

/**
 * Saves emails to storage
 */
export function saveDispatchedEmails(emails: EmailMessage[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(EMAILS_STORAGE_KEY, JSON.stringify(emails));
  } catch (err) {
    console.error('Failed to save emails to localStorage:', err);
  }
}

/**
 * Send / dispatch registration confirmation email when user registers
 */
export function sendRegistrationEmail(toEmail: string): EmailMessage {
  const cleanEmail = toEmail.trim().toLowerCase();
  const title = 'Registration Received';
  const subject = 'PRO SOCCER ET — VIP Registration Received (Pending Approval)';
  const badgeText = '⏳ Pending Admin Approval';
  const mainMessage =
    'Your VIP registration request has been successfully received by the PRO SOCCER ET administration team. All membership requests are reviewed manually to maintain private syndicate access. Once approved by our administrator, you will receive an activation email.';
  const statusLabel = 'Pending Review';
  const actionButtonText = 'View Registration Status';
  const actionButtonUrl = typeof window !== 'undefined' ? window.location.origin : 'https://prosoccer.et';
  const secondaryInfo =
    'Please keep your registered email handy. You will receive an immediate notification here as soon as the administrator accepts your account.';

  const htmlContent = buildWebStyledEmailHtml({
    recipientEmail: cleanEmail,
    title,
    subject,
    badgeText,
    badgeColor: 'amber',
    mainMessage,
    statusLabel,
    actionButtonText,
    actionButtonUrl,
    secondaryInfo,
  });

  const plainText = `PRO SOCCER ET | VIP 1X ENGINE
===================================
REGISTRATION RECEIVED (PENDING REVIEW)

Hello ${cleanEmail},

Your VIP registration request has been successfully received by the PRO SOCCER ET administration team.

Status: PENDING ADMIN APPROVAL
Platform: PRO SOCCER ET 1X Matrix

Once the administrator reviews and approves your account, your access to the 1X match predictive engine will be instantly unlocked.

Official Website: ${actionButtonUrl}
"Predict Smarter. Analyze • Predict • Win"`;

  const newEmail: EmailMessage = {
    id: `email_reg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    toEmail: cleanEmail,
    subject,
    type: 'registration_received',
    title,
    badge: badgeText,
    badgeColor: 'amber',
    timestamp: new Date().toISOString(),
    status: 'delivered',
    htmlContent,
    plainText,
  };

  const existing = getAllDispatchedEmails();
  existing.unshift(newEmail);
  saveDispatchedEmails(existing);

  return newEmail;
}

/**
 * Send / dispatch approval email when admin accepts the user
 */
export function sendApprovalEmail(toEmail: string, adminEmail?: string): EmailMessage {
  const cleanEmail = toEmail.trim().toLowerCase();
  const title = 'VIP Access Approved!';
  const subject = '🌟 PRO SOCCER ET — Your VIP Access Has Been Approved!';
  const badgeText = '✅ Account Approved & Activated';
  const mainMessage =
    `Great news! Your account has been reviewed and officially approved by ${adminEmail || 'the PRO SOCCER ET Administrator'}. Your VIP membership is now fully active, giving you complete access to our glowing 1X match predictive engine, Over/Under algorithms, and daily VIP Bankers.`;
  const statusLabel = 'Active VIP Member';
  const actionButtonText = 'Launch 1X Predictor Now';
  const actionButtonUrl = typeof window !== 'undefined' ? window.location.origin : 'https://prosoccer.et';
  const secondaryInfo =
    'You can now sign in using your registered email and password to start generating high-probability 1X match predictions immediately.';

  const htmlContent = buildWebStyledEmailHtml({
    recipientEmail: cleanEmail,
    title,
    subject,
    badgeText,
    badgeColor: 'emerald',
    mainMessage,
    statusLabel,
    actionButtonText,
    actionButtonUrl,
    secondaryInfo,
  });

  const plainText = `PRO SOCCER ET | VIP 1X ENGINE
===================================
★ VIP ACCESS APPROVED & ACTIVATED ★

Hello ${cleanEmail},

Congratulations! Your registration has been officially approved by the PRO SOCCER ET administrator.

Status: ACTIVE VIP MEMBER
Platform: PRO SOCCER ET 1X Matrix
Access: Full 1X Predictor & VIP Bankers Unlocked

You can now log in to the website to generate 1X predictions, Over/Under slips, and banker selections.

Launch Web Predictor: ${actionButtonUrl}
"Predict Smarter. Analyze • Predict • Win"`;

  const newEmail: EmailMessage = {
    id: `email_appr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    toEmail: cleanEmail,
    subject,
    type: 'approval_confirmed',
    title,
    badge: badgeText,
    badgeColor: 'emerald',
    timestamp: new Date().toISOString(),
    status: 'delivered',
    htmlContent,
    plainText,
  };

  const existing = getAllDispatchedEmails();
  existing.unshift(newEmail);
  saveDispatchedEmails(existing);

  return newEmail;
}

/**
 * Generates a mailto: link for easy 1-click emailing from default mail client
 */
export function buildMailtoHref(email: EmailMessage): string {
  const encSubject = encodeURIComponent(email.subject);
  const encBody = encodeURIComponent(email.plainText);
  return `mailto:${email.toEmail}?subject=${encSubject}&body=${encBody}`;
}
