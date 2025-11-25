import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { Wallet } from 'lucide-react';

export const AuthPage = () => {
  const [currentView, setCurrentView] = useState('login'); // 'login', 'register', 'forgot'

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-xl bg-primary mb-4">
            <Wallet className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-semibold">Personal Finance Tracker</h1>
          <p className="text-muted-foreground mt-2">
            Take control of your financial future
          </p>
        </div>

        {/* Auth Forms */}
        {currentView === 'login' && (
          <LoginForm
            onSwitchToRegister={() => setCurrentView('register')}
            onSwitchToForgotPassword={() => setCurrentView('forgot')}
          />
        )}

        {currentView === 'register' && (
          <RegisterForm
            onSwitchToLogin={() => setCurrentView('login')}
          />
        )}

        {currentView === 'forgot' && (
          <ForgotPasswordForm
            onSwitchToLogin={() => setCurrentView('login')}
          />
        )}

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>© 2024 Personal Finance Tracker. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};