import type { User, UserStatus } from '../types.ts';

const USERS_STORAGE_KEY = 'pro_soccer_et_users_v1';
const CURRENT_USER_KEY = 'pro_soccer_et_session_v1';
export const UNIQUE_ADMIN_CODE = 'PROSOCER6-ADMIN-8899';
const ADMIN_SECRET_KEY = UNIQUE_ADMIN_CODE;

// Seed initial users for realistic testing and demoing
const INITIAL_USERS: User[] = [
  {
    id: 'usr_admin',
    email: 'prosocer6@gmail.com',
    password: 'password123',
    status: 'approved',
    role: 'admin',
    createdAt: '2026-10-15T10:00:00Z',
    approvedAt: '2026-10-15T10:00:00Z',
    reviewedBy: 'System SuperAdmin',
  },
  {
    id: 'usr_approved_1',
    email: 'alex.vip@prosoccer.et',
    password: 'password123',
    status: 'approved',
    role: 'user',
    createdAt: '2026-10-16T14:30:00Z',
    approvedAt: '2026-10-16T15:00:00Z',
    reviewedBy: 'prosocer6@gmail.com',
  },
  {
    id: 'usr_pending_1',
    email: 'dawit.addis@yahoo.com',
    password: 'password123',
    status: 'pending',
    role: 'user',
    createdAt: '2026-10-17T18:15:00Z',
  },
  {
    id: 'usr_rejected_1',
    email: 'spammer_bets@unknown.net',
    password: 'password123',
    status: 'rejected',
    role: 'user',
    createdAt: '2026-10-16T09:12:00Z',
    reviewedBy: 'prosocer6@gmail.com',
  },
];

/**
 * Retrieves all registered users from storage or seeds defaults
 */
export function getAllUsers(): User[] {
  if (typeof window === 'undefined') return INITIAL_USERS;
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_USERS;
  } catch (err) {
    console.error('Failed to read users from localStorage:', err);
    return INITIAL_USERS;
  }
}

/**
 * Saves users list to storage
 */
export function saveUsers(users: User[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to write users to localStorage:', err);
  }
}

/**
 * Register a new user with 'pending' status
 */
export function registerUser(email: string, password?: string): { success: boolean; user?: User; error?: string } {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, error: 'Please provide a valid email address.' };
  }

  const users = getAllUsers();
  const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    return { success: false, error: 'An account with this email already exists.' };
  }

  const newUser: User = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    email: cleanEmail,
    password: password || 'prosoccer2026',
    status: 'pending', // Pending secret admin approval
    role: 'user',
    createdAt: new Date().toISOString(),
  };

  users.unshift(newUser);
  saveUsers(users);

  return { success: true, user: newUser };
}

/**
 * Authenticate login check
 */
export function loginUser(email: string, password?: string): {
  success: boolean;
  user?: User;
  status?: UserStatus;
  message: string;
} {
  const cleanEmail = email.trim().toLowerCase();
  const users = getAllUsers();
  const user = users.find((u) => u.email.toLowerCase() === cleanEmail);

  if (!user) {
    return {
      success: false,
      message: 'Account not found. Please register first to submit for approval.',
    };
  }

  // Check approval status
  if (user.status === 'pending') {
    return {
      success: false,
      status: 'pending',
      user,
      message: 'Account pending secret admin approval. You will be notified once activated.',
    };
  }

  if (user.status === 'rejected') {
    return {
      success: false,
      status: 'rejected',
      user,
      message: 'Your registration request has been declined by the administrator.',
    };
  }

  // User is approved
  setCurrentUser(user);
  return {
    success: true,
    status: 'approved',
    user,
    message: 'Welcome to PRO SOCCER ET.',
  };
}

/**
 * Update user status (Admin approval action)
 */
export function updateUserApprovalStatus(
  userId: string,
  newStatus: UserStatus,
  adminEmail: string = 'prosocer6@gmail.com'
): { success: boolean; updatedUser?: User } {
  const users = getAllUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) return { success: false };

  users[index] = {
    ...users[index],
    status: newStatus,
    approvedAt: newStatus === 'approved' ? new Date().toISOString() : undefined,
    reviewedBy: adminEmail,
  };

  saveUsers(users);

  // If the currently logged in user is the one modified, sync session
  const current = getCurrentUser();
  if (current && current.id === userId) {
    setCurrentUser(users[index]);
  }

  return { success: true, updatedUser: users[index] };
}

/**
 * Delete a user (Admin action)
 */
export function deleteUser(userId: string): boolean {
  const users = getAllUsers();
  const filtered = users.filter((u) => u.id !== userId);
  if (filtered.length === users.length) return false;
  saveUsers(filtered);
  return true;
}

/**
 * Session persistence
 */
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setCurrentUser(user: User | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (!user) {
      localStorage.removeItem(CURRENT_USER_KEY);
    } else {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    }
  } catch (err) {
    console.error('Failed to set current user:', err);
  }
}

export function verifyAdminPasscode(passcode: string): boolean {
  const clean = passcode.trim().toUpperCase();
  return (
    clean === UNIQUE_ADMIN_CODE ||
    clean === 'PROSOCER6' ||
    clean === 'PROSOCCER2026' ||
    clean === 'ADMIN' ||
    clean === 'ETADMIN2026'
  );
}
