import React, { useState } from 'react';
import type { EmailMessage } from '../utils/emailService.ts';
import { buildMailtoHref } from '../utils/emailService.ts';
import { X, Mail, Check, Copy, ExternalLink, Sparkles, Send, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { BrandLogo } from './BrandLogo.tsx';

interface EmailModalProps {
  email: EmailMessage | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EmailModal: React.FC<EmailModalProps> = ({
  email,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'html' | 'text'>('preview');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !email) return null;

  const handleCopy = async () => {
    try {
      const content = activeTab === 'html' ? email.htmlContent : email.plainText;
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isEmerald = email.badgeColor === 'emerald';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0a0d16] border-2 border-amber-500/40 rounded-3xl shadow-[0_0_60px_rgba(255,215,0,0.3)] flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-800 bg-[#0e121d] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              isEmerald
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/40'
                : 'bg-amber-500/20 text-amber-400 border border-amber-400/40'
            }`}>
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-white">
                  Official Email Notification
                </span>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  isEmerald
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {email.type === 'approval_confirmed' ? 'VIP Approved' : 'Registration'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-xs sm:max-w-md">
                Sent to: <span className="text-white font-mono font-semibold">{email.toEmail}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
            aria-label="Close email modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Mode Tabs (Web Preview vs HTML vs Plain Text) */}
        <div className="px-6 py-2.5 bg-[#07090f] border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-amber-400 text-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Web Interface View
            </button>
            <button
              onClick={() => setActiveTab('html')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'html'
                  ? 'bg-amber-400 text-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              HTML Source
            </button>
            <button
              onClick={() => setActiveTab('text')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'text'
                  ? 'bg-amber-400 text-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Plain Text
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-amber-400/50 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-amber-400" />
                  <span>Copy</span>
                </>
              )}
            </button>

            <a
              href={buildMailtoHref(email)}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(255,215,0,0.4)] cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 fill-black" />
              <span>Open Mail Client</span>
            </a>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#05070a]">
          {activeTab === 'preview' ? (
            /* Rendered to look exactly like the PRO SOCCER ET web interface */
            <div className="max-w-xl mx-auto bg-[#0c101a] border-2 border-amber-400/50 rounded-3xl p-6 sm:p-8 shadow-[0_0_40px_rgba(255,215,0,0.2)] text-left relative overflow-hidden">
              {/* Golden Background Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Email Header */}
              <div className="relative pb-5 border-b border-amber-500/20 text-center">
                <BrandLogo size="md" showTagline={true} />
              </div>

              {/* Status Badge */}
              <div className="relative mt-5 text-center">
                <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                  isEmerald
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-[0_0_15px_rgba(255,215,0,0.3)]'
                }`}>
                  {isEmerald ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Sparkles className="w-3.5 h-3.5 text-amber-400" />}
                  <span>{email.badge}</span>
                </span>
              </div>

              {/* Title & Body */}
              <div className="relative mt-4 text-center">
                <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                  {email.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Subject: <span className="text-slate-200 font-semibold">{email.subject}</span>
                </p>
              </div>

              {/* Message Box Styled like Web Card */}
              <div className="relative mt-5 p-5 rounded-2xl bg-[#121625] border border-amber-400/25">
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  Hello <strong className="text-amber-400 font-mono">{email.toEmail}</strong>,
                </p>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-2">
                  {email.type === 'approval_confirmed'
                    ? 'Your registration has been reviewed and officially approved by the PRO SOCCER ET Administrator. Your VIP membership is now fully active! You have unlocked unlimited access to the glowing 1X match predictive engine, Over/Under algorithms, and VIP Bankers.'
                    : 'Your VIP registration request has been submitted to the PRO SOCCER ET administrator. All memberships are reviewed to maintain syndicate standards. You will be notified as soon as your access is approved.'}
                </p>
              </div>

              {/* Credentials / Details Box */}
              <div className="relative mt-4 bg-[#07090f] border border-slate-800 rounded-2xl p-4 divide-y divide-slate-800/80 text-xs">
                <div className="flex items-center justify-between py-2 text-slate-400">
                  <span className="font-semibold">Registered Email:</span>
                  <span className="font-mono font-bold text-white">{email.toEmail}</span>
                </div>
                <div className="flex items-center justify-between py-2 text-slate-400">
                  <span className="font-semibold">Membership Status:</span>
                  <span className={`font-bold uppercase ${isEmerald ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {email.type === 'approval_confirmed' ? 'Active VIP Member' : 'Pending Review'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 text-slate-400">
                  <span className="font-semibold">Platform:</span>
                  <span className="font-bold text-amber-300">PRO SOCCER ET 1X Matrix</span>
                </div>
              </div>

              {/* Primary Call to Action Button */}
              <div className="relative mt-6 text-center">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 text-black font-black uppercase text-xs tracking-wider shadow-[0_0_25px_rgba(255,215,0,0.6)] hover:shadow-[0_0_35px_rgba(255,215,0,0.8)] transition-all cursor-pointer"
                >
                  {email.type === 'approval_confirmed'
                    ? 'Access VIP Predictor Now →'
                    : 'Registration Recorded — Pending Approval'}
                </button>
              </div>

              {/* Web Footer */}
              <div className="relative mt-6 pt-4 border-t border-slate-800 text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                  Predict Smarter • Analyze • Predict • Win
                </p>
              </div>
            </div>
          ) : activeTab === 'html' ? (
            <div className="bg-[#0b0e17] border border-slate-800 rounded-2xl p-4 font-mono text-[11px] text-amber-200 overflow-x-auto whitespace-pre leading-relaxed">
              {email.htmlContent}
            </div>
          ) : (
            <div className="bg-[#0b0e17] border border-slate-800 rounded-2xl p-6 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
              {email.plainText}
            </div>
          )}
        </div>

        {/* Modal Bottom Bar */}
        <div className="px-6 py-3 border-t border-slate-800 bg-[#0e121d] flex items-center justify-between text-xs text-slate-400">
          <span>Formatted with PRO SOCCER ET web interface styling.</span>
          <button
            onClick={onClose}
            className="text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
