import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import type { User, PredictionResult } from './types.ts';
import {
  getCurrentUser,
  setCurrentUser,
  getAllUsers,
} from './utils/authStorage.ts';
import { Navbar } from './components/Navbar.tsx';
import { PredictHero } from './components/PredictHero.tsx';
import { PredictModal } from './components/PredictModal.tsx';
import { PredictionResultCard } from './components/PredictionResultCard.tsx';
import { AdminPortal } from './components/AdminPortal.tsx';
import { RegisterGate } from './components/RegisterGate.tsx';
import { Footer } from './components/Footer.tsx';
import { StadiumBackground } from './components/StadiumBackground.tsx';
import { AlertTriangle, RefreshCw, Sparkles } from 'lucide-react';

// Production Error Boundary
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('PRO SOCER ET error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#05070a] flex items-center justify-center p-6 text-center">
          <div className="max-w-md p-8 bg-[#0c101a] border border-amber-500/30 rounded-2xl">
            <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white uppercase">Engine Stabilized</h2>
            <p className="mt-2 text-xs text-slate-400">
              An unexpected display variance occurred.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-2.5 bg-amber-400 text-black font-bold text-xs uppercase rounded-xl flex items-center gap-2 mx-auto"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [currentUser, setCurrentUserState] = useState<User | null>(() => getCurrentUser());
  const [isAdminView, setIsAdminView] = useState(false);
  const [isPredictModalOpen, setIsPredictModalOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [latestPrediction, setLatestPrediction] = useState<PredictionResult | null>(null);

  // Calculate pending users count
  const refreshPendingUsers = () => {
    const allUsers = getAllUsers();
    const count = allUsers.filter((u) => u.status === 'pending').length;
    setPendingCount(count);
  };

  useEffect(() => {
    refreshPendingUsers();
  }, []);

  const handleLoginSuccess = (user: User) => {
    setCurrentUserState(user);
    refreshPendingUsers();
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentUserState(null);
  };

  const handlePredictionGenerated = (newResult: PredictionResult) => {
    setLatestPrediction(newResult);
    setIsAdminView(false);
  };

  const isApproved = currentUser && currentUser.status === 'approved';

  return (
    <ErrorBoundary>
      <div className="relative min-h-screen bg-[#05070a] text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-black">
        {/* Animated Stadium Atmosphere & 3D Pitch Background */}
        <StadiumBackground />

        {/* Content Layer (Keeps content crisp above animated background) */}
        <div className="relative z-10 flex-1 flex flex-col">
          {/* Sleek Top Bar with ONLY Admin Portal Option (No logo, No dashboard, No VIP, No my predictions) */}
          <Navbar
            currentUser={currentUser}
            pendingCount={pendingCount}
            isAdminView={isAdminView}
            onToggleAdminView={() => setIsAdminView(!isAdminView)}
            onOpenAuth={() => {
              // Already toggled via RegisterGate or logout
            }}
            onLogout={handleLogout}
          />

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col items-center justify-center">
          {isAdminView ? (
            <AdminPortal
              currentUser={currentUser}
              onUsersUpdated={refreshPendingUsers}
            />
          ) : !isApproved ? (
            /* First Time / Unapproved User View: Shows Register By Email and I will Approve */
            <div className="w-full flex flex-col items-center justify-center py-10">
              <div className="text-center mb-4">
                <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white uppercase max-w-4xl text-balance drop-shadow-[0_4px_25px_rgba(255,215,0,0.3)]">
                  <span className="text-gold-gradient">
                    PRO SOCER ET
                  </span>
                </h1>
              </div>

              <RegisterGate
                onLoginSuccess={handleLoginSuccess}
                onOpenAdmin={() => setIsAdminView(true)}
              />
            </div>
          ) : (
            /* Approved VIP / Admin View: Shows Glowing Predict Button */
            <div className="w-full">
              <PredictHero
                onOpenPredict={() => setIsPredictModalOpen(true)}
              />

              {/* Latest Generated Prediction Slip (appears when generated) */}
              {latestPrediction && (
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-16 animate-in fade-in">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                        Generated Prediction Slip
                      </span>
                    </div>
                    <button
                      onClick={() => setLatestPrediction(null)}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Clear Slip
                    </button>
                  </div>
                  <PredictionResultCard
                    prediction={latestPrediction}
                    onClose={() => setLatestPrediction(null)}
                  />
                </div>
              )}
            </div>
          )}
        </main>

        {/* Prediction Modal */}
        <PredictModal
          isOpen={isPredictModalOpen}
          onClose={() => setIsPredictModalOpen(false)}
          onPredictionGenerated={handlePredictionGenerated}
        />

        {/* Clean Footer with Admin Portal trigger */}
        <Footer onOpenAdmin={() => setIsAdminView(true)} />
        </div>
      </div>
    </ErrorBoundary>
  );
}
