import React, { useState } from 'react';
import type { User, UserStatus } from '../types.ts';
import {
  getAllUsers,
  updateUserApprovalStatus,
  deleteUser,
  verifyAdminPasscode,
  registerUser,
} from '../utils/authStorage.ts';
import {
  Lock,
  Unlock,
  ShieldCheck,
  UserCheck,
  UserX,
  Clock,
  Trash2,
  CheckCircle,
  XCircle,
  Search,
  UserPlus,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

interface AdminPortalProps {
  currentUser: User | null;
  onUsersUpdated: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  currentUser,
  onUsersUpdated,
}) => {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(
    currentUser?.role === 'admin' || false
  );
  const [passcode, setPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);
  const [users, setUsers] = useState<User[]>(getAllUsers());
  const [statusFilter, setStatusFilter] = useState<'all' | UserStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const refreshList = () => {
    const fresh = getAllUsers();
    setUsers(fresh);
    onUsersUpdated();
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyAdminPasscode(passcode)) {
      setIsUnlocked(true);
      setPasscodeError(false);
    } else {
      setPasscodeError(true);
    }
  };

  const handleApprove = (userId: string, email: string) => {
    updateUserApprovalStatus(userId, 'approved', currentUser?.email || 'admin@prosoccer.et');
    refreshList();
    showNotice(`Approved ${email}. User can now log in immediately.`);
  };

  const handleReject = (userId: string, email: string) => {
    updateUserApprovalStatus(userId, 'rejected', currentUser?.email || 'admin@prosoccer.et');
    refreshList();
    showNotice(`Rejected ${email}. Account access blocked.`);
  };

  const handleDelete = (userId: string, email: string) => {
    if (confirm(`Remove user ${email}?`)) {
      deleteUser(userId);
      refreshList();
      showNotice(`Removed ${email}.`);
    }
  };

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newEmail.includes('@')) return;
    const res = registerUser(newEmail);
    if (res.success) {
      setNewEmail('');
      refreshList();
      showNotice(`Created pending user ${newEmail}. Needs approval.`);
    } else {
      alert(res.error || 'Failed to add user');
    }
  };

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  // Filter users
  const filteredUsers = users.filter((u) => {
    const matchesFilter = statusFilter === 'all' || u.status === statusFilter;
    const matchesSearch = u.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const pendingCount = users.filter((u) => u.status === 'pending').length;
  const approvedCount = users.filter((u) => u.status === 'approved').length;
  const rejectedCount = users.filter((u) => u.status === 'rejected').length;

  if (!isUnlocked) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-[#0c101a] border border-amber-500/30 rounded-3xl shadow-[0_0_40px_rgba(255,215,0,0.15)] text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-5">
          <Lock className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-black text-white uppercase tracking-tight">
          Secret Admin Portal
        </h2>
        <p className="mt-2 text-xs text-slate-400 leading-relaxed">
          Authorized personnel only. Enter the secret administrative passcode to manage user registration approvals.
        </p>

        <form onSubmit={handleUnlock} className="mt-6 space-y-4">
          <div>
            <input
              type="password"
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value);
                setPasscodeError(false);
              }}
              placeholder="Enter Private Passcode"
              className="w-full bg-[#121622] border border-slate-700 focus:border-amber-400 rounded-xl px-4 py-3 text-sm text-center text-white placeholder-slate-500 font-mono tracking-wider focus:outline-none focus:ring-1 focus:ring-amber-400"
              required
            />
            {passcodeError && (
              <p className="mt-2 text-xs text-rose-400">
                Access denied. Invalid private passcode.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 hover:shadow-[0_0_20px_rgba(255,215,0,0.5)] text-black font-black uppercase tracking-wider text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Unlock className="w-4 h-4" />
            <span>Unlock Private Admin Portal</span>
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-amber-500/20">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Executive Command</span>
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tight mt-1">
            Secret Admin Portal
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-slate-400">Your Unique Code:</span>
            <code className="text-xs font-mono font-bold text-amber-300 bg-black/50 px-2 py-0.5 rounded border border-amber-400/30">
              PROSOCER6-ADMIN-8899
            </code>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={refreshList}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 border border-slate-800 hover:border-amber-400 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setIsUnlocked(false)}
            className="px-3 py-2 bg-rose-950/40 border border-rose-500/30 text-rose-300 hover:bg-rose-900/50 rounded-xl text-xs font-semibold transition-colors"
          >
            Lock Portal
          </button>
        </div>
      </div>

      {/* Action Notification Toast */}
      {actionNotice && (
        <div className="p-3.5 bg-amber-500/10 border border-amber-400/40 rounded-xl text-amber-300 text-xs flex items-center gap-2 shadow-lg animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-medium">{actionNotice}</span>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 bg-stadium-card rounded-2xl">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Total Users
          </span>
          <span className="text-2xl sm:text-3xl font-mono font-bold text-white tabular-nums mt-1 block">
            {users.length}
          </span>
        </div>

        <div className="p-5 bg-stadium-card rounded-2xl border-amber-500/40 relative">
          {pendingCount > 0 && (
            <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          )}
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-400">
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Approvals</span>
          </div>
          <span className="text-2xl sm:text-3xl font-mono font-bold text-amber-400 tabular-nums mt-1 block">
            {pendingCount}
          </span>
        </div>

        <div className="p-5 bg-stadium-card rounded-2xl">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Approved VIPs</span>
          </div>
          <span className="text-2xl sm:text-3xl font-mono font-bold text-emerald-400 tabular-nums mt-1 block">
            {approvedCount}
          </span>
        </div>

        <div className="p-5 bg-stadium-card rounded-2xl">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-rose-400">
            <UserX className="w-3.5 h-3.5" />
            <span>Rejected / Blocked</span>
          </div>
          <span className="text-2xl sm:text-3xl font-mono font-bold text-rose-400 tabular-nums mt-1 block">
            {rejectedCount}
          </span>
        </div>
      </div>

      {/* Control Strip & Search */}
      <div className="bg-[#0e121d] border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 overflow-x-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              statusFilter === 'all'
                ? 'bg-amber-400 text-black shadow-sm font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Users ({users.length})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              statusFilter === 'pending'
                ? 'bg-amber-400 text-black shadow-sm font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Pending</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 bg-black/20 text-black rounded text-[10px]">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setStatusFilter('approved')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              statusFilter === 'approved'
                ? 'bg-amber-400 text-black shadow-sm font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Approved ({approvedCount})
          </button>
          <button
            onClick={() => setStatusFilter('rejected')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              statusFilter === 'rejected'
                ? 'bg-amber-400 text-black shadow-sm font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Rejected ({rejectedCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Users Table / List */}
      <div className="bg-[#0c101a] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#121622] text-slate-400 uppercase tracking-wider border-b border-slate-800 font-semibold">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">User Email</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 hidden sm:table-cell">Registered</th>
                <th className="py-3.5 px-4 text-right">Approval Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-500">
                    No users matching selected filter.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-4 px-4 sm:px-6 font-medium text-white">
                      <div className="flex items-center gap-2">
                        <span className="truncate max-w-[200px] sm:max-w-none">{u.email}</span>
                        {u.role === 'admin' && (
                          <span className="px-1.5 py-0.2 bg-yellow-500/20 text-yellow-300 border border-yellow-400/40 rounded text-[9px] uppercase font-bold">
                            Admin
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      {u.status === 'pending' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-400/30 text-[11px] font-semibold">
                          <Clock className="w-3 h-3 text-amber-400 animate-pulse" />
                          <span>Pending Approval</span>
                        </span>
                      )}
                      {u.status === 'approved' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 text-[11px] font-semibold">
                          <CheckCircle className="w-3 h-3 text-emerald-400" />
                          <span>Approved VIP</span>
                        </span>
                      )}
                      {u.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-300 border border-rose-400/30 text-[11px] font-semibold">
                          <XCircle className="w-3 h-3 text-rose-400" />
                          <span>Declined</span>
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-slate-400 hidden sm:table-cell tabular-nums">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {u.status !== 'approved' && (
                          <button
                            onClick={() => handleApprove(u.id, u.email)}
                            className="px-2.5 py-1.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/40 text-emerald-300 font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                            title="Approve User Registration"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                        )}

                        {u.status !== 'rejected' && u.role !== 'admin' && (
                          <button
                            onClick={() => handleReject(u.id, u.email)}
                            className="px-2.5 py-1.5 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                            title="Reject User Registration"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        )}

                        {u.role !== 'admin' && (
                          <button
                            onClick={() => handleDelete(u.id, u.email)}
                            className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
