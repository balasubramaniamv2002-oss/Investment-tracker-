/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TrackerProvider, useTracker } from './context/TrackerContext';
import { AppShell, ActiveScreen } from './components/layout/AppShell';

// Views
import { LandingView } from './views/LandingView';
import { DashboardView } from './views/DashboardView';
import { HoldingsView } from './views/HoldingsView';
import { PortfoliosView } from './views/PortfoliosView';
import { TransactionsView } from './views/TransactionsView';
import { GoalsView } from './views/GoalsView';
import { AlertsView } from './views/AlertsView';
import { ReportsView } from './views/ReportsView';
import { SettingsView } from './views/SettingsView';
import { AdminView } from './views/AdminView';

// Modals
import { TransactionModal } from './components/modals/TransactionModal';
import { CsvImportModal } from './components/modals/CsvImportModal';
import { ManualPriceModal } from './components/modals/ManualPriceModal';
import { GoalModal } from './components/modals/GoalModal';
import { AlertModal } from './components/modals/AlertModal';
import { AuthModal } from './components/modals/AuthModal';
import { FeedbackModal } from './components/modals/FeedbackModal';
import { Transaction } from './types';

function MainApp() {
  const { user, isAuthenticated, loginAs, setSelectedPortfolioId } = useTracker();

  // App starts on Landing Page by default!
  const [currentScreen, setCurrentScreen] = useState<ActiveScreen>('landing');

  // If user signs out, switch back to Landing Page
  useEffect(() => {
    if (!isAuthenticated && currentScreen !== 'landing') {
      setCurrentScreen('landing');
    }
  }, [isAuthenticated, currentScreen]);

  // Modals state
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [editTx, setEditTx] = useState<Transaction | null>(null);
  const [isCsvImportOpen, setIsCsvImportOpen] = useState(false);
  const [manualPriceAssetId, setManualPriceAssetId] = useState<string | null>(null);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const handleOpenAddTx = (txToEdit?: Transaction) => {
    setEditTx(txToEdit || null);
    setIsAddTxOpen(true);
  };

  const handleOpenAuth = (mode: 'login' | 'signup' = 'signup') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleOpenManualPrice = (assetId: string) => {
    setManualPriceAssetId(assetId);
  };

  const handleSelectPortfolioAndNavigate = (id: string) => {
    setSelectedPortfolioId(id);
    setCurrentScreen('dashboard');
  };

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'landing':
        return (
          <LandingView
            onOpenAuth={handleOpenAuth}
            onLaunchDemo={() => {
              loginAs('investor');
              setCurrentScreen('dashboard');
            }}
          />
        );

      case 'dashboard':
        return (
          <DashboardView
            onOpenAddTx={() => handleOpenAddTx()}
            onOpenCsvImport={() => setIsCsvImportOpen(true)}
            onOpenManualPrice={handleOpenManualPrice}
            onNavigateToHoldings={() => setCurrentScreen('holdings')}
            onNavigateToGoals={() => setCurrentScreen('goals')}
          />
        );

      case 'holdings':
        return (
          <HoldingsView
            onOpenAddTx={() => handleOpenAddTx()}
            onOpenManualPrice={handleOpenManualPrice}
          />
        );

      case 'portfolios':
        return (
          <PortfoliosView
            onSelectPortfolio={handleSelectPortfolioAndNavigate}
          />
        );

      case 'transactions':
        return (
          <TransactionsView
            onOpenAddTx={handleOpenAddTx}
            onOpenCsvImport={() => setIsCsvImportOpen(true)}
          />
        );

      case 'goals':
        return (
          <GoalsView
            onOpenAddGoal={() => setIsGoalModalOpen(true)}
          />
        );

      case 'alerts':
        return (
          <AlertsView
            onOpenAddAlert={() => setIsAlertModalOpen(true)}
          />
        );

      case 'reports':
        return <ReportsView />;

      case 'settings':
        return <SettingsView />;

      case 'admin':
        return <AdminView />;

      default:
        return (
          <LandingView
            onOpenAuth={handleOpenAuth}
            onLaunchDemo={() => {
              loginAs('investor');
              setCurrentScreen('dashboard');
            }}
          />
        );
    }
  };

  return (
    <AppShell
      currentScreen={currentScreen}
      onNavigate={setCurrentScreen}
      onOpenAddTx={() => handleOpenAddTx()}
      onOpenAuth={handleOpenAuth}
      onOpenFeedback={() => setIsFeedbackOpen(true)}
    >
      {renderActiveScreen()}

      {/* Global Modals */}
      <TransactionModal
        isOpen={isAddTxOpen}
        onClose={() => {
          setIsAddTxOpen(false);
          setEditTx(null);
        }}
        editTx={editTx}
      />

      <CsvImportModal
        isOpen={isCsvImportOpen}
        onClose={() => setIsCsvImportOpen(false)}
      />

      {manualPriceAssetId && (
        <ManualPriceModal
          isOpen={!!manualPriceAssetId}
          onClose={() => setManualPriceAssetId(null)}
          assetId={manualPriceAssetId}
        />
      )}

      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
      />

      <AlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => setCurrentScreen('dashboard')}
        defaultMode={authMode}
      />

      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
      />
    </AppShell>
  );
}

export default function App() {
  return (
    <TrackerProvider>
      <MainApp />
    </TrackerProvider>
  );
}
