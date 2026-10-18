import test from 'node:test';
import assert from 'node:assert/strict';
import {
  registerUser,
  loginUser,
  updateUserApprovalStatus,
  getAllUsers,
  saveUsers,
  verifyAdminPasscode,
} from './authStorage.ts';
import type { User } from '../types.ts';

// Mock localStorage for Node test environment
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

test('admin passcode verification accepts standard keys and unique code', () => {
  assert.equal(verifyAdminPasscode('PROSOCER6-ADMIN-8899'), true);
  assert.equal(verifyAdminPasscode('prosocer6-admin-8899'), true);
  assert.equal(verifyAdminPasscode('prosoccer2026'), true);
  assert.equal(verifyAdminPasscode('admin'), true);
  assert.equal(verifyAdminPasscode('wrongkey'), false);
});

test('user registration initializes with pending status', () => {
  const result = registerUser('tester_pending@prosoccer.et', 'pass123');
  assert.equal(result.success, true);
  assert.ok(result.user);
  assert.equal(result.user?.status, 'pending');
});

test('login blocks pending and rejected users with precise message', () => {
  // Pending user
  const pendingLogin = loginUser('tester_pending@prosoccer.et');
  assert.equal(pendingLogin.success, false);
  assert.equal(pendingLogin.status, 'pending');
  assert.ok(pendingLogin.message.includes('Account pending secret admin approval'));

  // Approve the user
  const users = getAllUsers();
  const testUser = users.find((u) => u.email === 'tester_pending@prosoccer.et');
  assert.ok(testUser);

  updateUserApprovalStatus(testUser!.id, 'approved', 'admin@prosoccer.et');

  // Login should now succeed!
  const approvedLogin = loginUser('tester_pending@prosoccer.et');
  assert.equal(approvedLogin.success, true);
  assert.equal(approvedLogin.status, 'approved');

  // Reject the user
  updateUserApprovalStatus(testUser!.id, 'rejected', 'admin@prosoccer.et');
  const rejectedLogin = loginUser('tester_pending@prosoccer.et');
  assert.equal(rejectedLogin.success, false);
  assert.equal(rejectedLogin.status, 'rejected');
  assert.ok(rejectedLogin.message.includes('declined'));
});
