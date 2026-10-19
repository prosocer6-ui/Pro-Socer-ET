import test from 'node:test';
import assert from 'node:assert/strict';
import {
  sendRegistrationEmail,
  sendApprovalEmail,
  buildWebStyledEmailHtml,
  buildMailtoHref,
  getAllDispatchedEmails,
} from './emailService.ts';

// Mock localStorage for node test
const mockStorage: Record<string, string> = {};
globalThis.localStorage = {
  getItem: (key: string) => mockStorage[key] || null,
  setItem: (key: string, value: string) => {
    mockStorage[key] = value;
  },
  removeItem: (key: string) => {
    delete mockStorage[key];
  },
  clear: () => {
    Object.keys(mockStorage).forEach((k) => delete mockStorage[k]);
  },
  length: 0,
  key: () => null,
};

test('sendRegistrationEmail dispatches email with web-styled HTML and pending badge', () => {
  const email = sendRegistrationEmail('newfan@prosoccer.et');

  assert.equal(email.toEmail, 'newfan@prosoccer.et');
  assert.equal(email.type, 'registration_received');
  assert.equal(email.badgeColor, 'amber');
  assert.ok(email.badge.includes('Pending'));
  assert.ok(email.htmlContent.includes('PRO SOCCER'));
  assert.ok(email.htmlContent.includes('#05070a')); // Dark stadium styling
  assert.ok(email.plainText.includes('PENDING ADMIN APPROVAL'));
});

test('sendApprovalEmail dispatches approval email with web-styled HTML and VIP activation badge', () => {
  const email = sendApprovalEmail('vipmember@prosoccer.et', 'prosocer6@gmail.com');

  assert.equal(email.toEmail, 'vipmember@prosoccer.et');
  assert.equal(email.type, 'approval_confirmed');
  assert.equal(email.badgeColor, 'emerald');
  assert.ok(email.badge.includes('Approved'));
  assert.ok(email.htmlContent.includes('PRO SOCCER'));
  assert.ok(email.htmlContent.includes('vipmember@prosoccer.et'));
  assert.ok(email.plainText.includes('VIP ACCESS APPROVED'));
});

test('buildMailtoHref creates valid mailto link with encoded subject and body', () => {
  const email = sendApprovalEmail('vipmember@prosoccer.et');
  const href = buildMailtoHref(email);

  assert.ok(href.startsWith('mailto:vipmember@prosoccer.et?subject='));
  assert.ok(href.includes('body='));
});
