import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs.jsx';
import { Button } from './components/ui/button.jsx';
import { Toaster } from './components/ui/sonner.jsx';
import { SummaryCards } from './components/SummaryCards.jsx';
import { TransactionForm } from './components/TransactionForm.jsx';
import { TransactionList } from './components/TransactionList.jsx';
import { BudgetTracker } from './components/BudgetTracker.jsx';
import { SpendingChart } from './components/SpendingChart.jsx';
import { LoadingPage } from './components/LoadingSpinner.jsx';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import { ProfileSettings } from './components/profile/ProfileSettings.jsx';
import { ReportsPage } from './components/reports/ReportsPage.jsx';
import { LandingPage } from './components/landing/LandingPage.jsx';
import { FinancialGoals } from './components/goals/FinancialGoals.jsx';
import { AuthPage } from './components/auth/AuthPage.jsx';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import { useApi } from './hooks/useApi.js';
import { transactionService } from './services/transactionService.js';
import { categoryService } from './services/categoryService.js';
import { budgetService } from './services/budgetService.js';
import { 
  Wallet, 
  Moon, 
  Sun, 
  User, 
  FileText, 
  LogOut,
  ChevronDown,
  Target
} from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './components/ui/dropdown-menu.jsx';
import { Avatar, AvatarFallback, AvatarImage } from './components/ui/avatar.jsx';

// Main App Component wrapped with Auth
function AppContent() {
  const { user, loading: authLoading, isAuthenticated, logout } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [currentPage, setCurrentPage] = useState('landing');

  // API calls using custom hooks - only call when authenticated
  const { 
    data: dashboardStats, 
    loading: statsLoading, 
    error: statsError, 
    refetch: refetchStats 
  } = useApi(
    () => transactionService.getDashboardStats(),
    [isAuthenticated],
    isAuthenticated
  );

  const { 
    data: categories, 
    loading: categoriesLoading, 
    error: categoriesError 
  } = useApi(
    () => categoryService.getCategories(),
    [isAuthenticated],
    isAuthenticated
  );

  const { 
    data: budgets, 
    loading: budgetsLoading, 
    refetch: refetchBudgets 
  } = useApi(
    () => budgetService.getBudgets(),
    [isAuthenticated],
    isAuthenticated
  );

  // Transaction management
  const handleAddTransaction = async (transactionData) => {
    await transactionService.createTransaction(transactionData);
  };

  const handleTransactionAdded = () => {
    refetchStats();
    refetchBudgets();
  };

  const handleDeleteTransaction = async (id) => {
    try {
      await transactionService.deleteTransaction(id);
      toast.success('Transaction deleted successfully');
      refetchStats();
      refetchBudgets();
    } catch (error) {
      toast.error('Failed to delete transaction');
    }
  };

  // Budget management
  const handleUpdateBudget = async (budgetId, limit) => {
    try {
      await budgetService.updateBudget(budgetId, { limit });
      toast.success('Budget updated successfully');
      refetchBudgets();
    } catch (error) {
      toast.error('Failed to update budget');
    }
  };

  const handleAddBudget = async (categoryId, limit) => {
    try {
      await budgetService.createBudget({ category_id: categoryId, limit });
      toast.success('Budget created successfully');
      refetchBudgets();
    } catch (error) {
      toast.error('Failed to create budget');
    }
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  // Show loading while checking authentication
  if (authLoading) {
    return <LoadingPage />;
  }

  // Show landing page if not authenticated
  if (!isAuthenticated) {
    if (currentPage === 'landing') {
      return <LandingPage onGetStarted={() => setCurrentPage('auth')} />;
    }
    return <AuthPage />;
  }

  // Show profile settings page
  if (currentPage === 'profile') {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-background">
          <ProfileSettings onClose={() => setCurrentPage('dashboard')} />
          <Toaster />
        </div>
      </ErrorBoundary>
    );
  }

  // Show goals page
  if (currentPage === 'goals') {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-background">
          {/* Header */}
          <header className="border-b bg-card">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setCurrentPage('dashboard')}
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
                      <Wallet className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h1 className="text-xl font-semibold">Personal Finance Tracker</h1>
                      <p className="text-sm text-muted-foreground">Financial Goals</p>
                    </div>
                  </button>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={toggleTheme}>
                    {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-2 px-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user?.avatar} />
                          <AvatarFallback className="text-sm">
                            {getInitials(user?.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="hidden sm:inline">{user?.name}</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setCurrentPage('dashboard')}>
                        <Wallet className="mr-2 h-4 w-4" />
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setCurrentPage('profile')}>
                        <User className="mr-2 h-4 w-4" />
                        Profile Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </header>

          <main className="container mx-auto px-4 py-8">
            <FinancialGoals />
          </main>
          <Toaster />
        </div>
      </ErrorBoundary>
    );
  }

  // Show reports page
  if (currentPage === 'reports') {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-background">
          {/* Header */}
          <header className="border-b bg-card">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setCurrentPage('dashboard')}
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
                      <Wallet className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h1 className="text-xl font-semibold">Personal Finance Tracker</h1>
                      <p className="text-sm text-muted-foreground">Financial Reports</p>
                    </div>
                  </button>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={toggleTheme}>
                    {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-2 px-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user?.avatar} />
                          <AvatarFallback className="text-sm">
                            {getInitials(user?.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="hidden sm:inline">{user?.name}</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setCurrentPage('dashboard')}>
                        <Wallet className="mr-2 h-4 w-4" />
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setCurrentPage('profile')}>
                        <User className="mr-2 h-4 w-4" />
                        Profile Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </header>

          <main className="container mx-auto px-4 py-8">
            <ReportsPage />
          </main>
          <Toaster />
        </div>
      </ErrorBoundary>
    );
  }

  // Loading state for categories
  if (categoriesLoading) {
    return <LoadingPage />;
  }

  // Error state
  if (categoriesError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">Failed to load application data</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  // Main dashboard
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
                  <Wallet className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold">Personal Finance Tracker</h1>
                  <p className="text-sm text-muted-foreground">
                    Welcome back, {user?.name?.split(' ')[0] || 'User'}!
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentPage('goals')}
                >
                  <Target className="mr-2 h-4 w-4" />
                  Goals
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentPage('reports')}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Reports
                </Button>

                <Button variant="outline" size="icon" onClick={toggleTheme}>
                  {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 px-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback className="text-sm">
                          {getInitials(user?.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:inline">{user?.name}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setCurrentPage('profile')}>
                      <User className="mr-2 h-4 w-4" />
                      Profile Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCurrentPage('goals')}>
                      <Target className="mr-2 h-4 w-4" />
                      Financial Goals
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCurrentPage('reports')}>
                      <FileText className="mr-2 h-4 w-4" />
                      Reports
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            {/* Summary Cards */}
            <SummaryCards 
              stats={dashboardStats}
              loading={statsLoading}
              error={statsError}
              onRetry={refetchStats}
            />

            {/* Tabs */}
<<<<<<< HEAD
           <Tabs defaultValue="overview" className="space-y-6">
 <div className="flex justify-start">
  <TabsList className="flex items-center gap-6 bg-muted rounded-full px-6 py-1">

      <TabsTrigger
        value="overview"
        className="px-4 py-2 rounded-full text-sm data-[state=active]:bg-card data-[state=active]:shadow"
      >
        Overview
      </TabsTrigger>

      <TabsTrigger
        value="transactions"
        className="px-4 py-2 rounded-full text-sm data-[state=active]:bg-card data-[state=active]:shadow"
      >
        Transactions
      </TabsTrigger>

      <TabsTrigger
        value="budget"
        className="px-4 py-2 rounded-full text-sm data-[state=active]:bg-card data-[state=active]:shadow"
      >
        Budget
      </TabsTrigger>

      <TabsTrigger
        value="goals"
        className="px-4 py-2 rounded-full text-sm data-[state=active]:bg-card data-[state=active]:shadow"
      >
        Goals
      </TabsTrigger>

    </TabsList>
  </div>
=======
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid grid-cols-5 w-full max-w-lg">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="budget">Budget</TabsTrigger>
                <TabsTrigger value="goals">Goals</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
>>>>>>> d56f293ff91bb66bb44c0cdac2a7bc01ed81fe96

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <TransactionForm 
                    categories={categories || []} 
                    onAddTransaction={handleAddTransaction}
                    onTransactionAdded={handleTransactionAdded}
                  />
                  <BudgetTracker
                    budgets={budgets || []}
                    categories={categories || []}
                    loading={budgetsLoading}
                    onUpdateBudget={handleUpdateBudget}
                    onAddBudget={handleAddBudget}
                  />
                </div>
                <SpendingChart categories={categories || []} />
              </TabsContent>

              <TabsContent value="transactions" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <TransactionList 
                      categories={categories || []}
                      onDeleteTransaction={handleDeleteTransaction}
                    />
                  </div>
                  <div className="lg:col-span-1">
                    <TransactionForm 
                      categories={categories || []} 
                      onAddTransaction={handleAddTransaction}
                      onTransactionAdded={handleTransactionAdded}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="budget" className="space-y-6">
                <BudgetTracker
                  budgets={budgets || []}
                  categories={categories || []}
                  loading={budgetsLoading}
                  onUpdateBudget={handleUpdateBudget}
                  onAddBudget={handleAddBudget}
                />
              </TabsContent>

              <TabsContent value="goals" className="space-y-6">
                <FinancialGoals />
              </TabsContent>
<<<<<<< HEAD
=======

              <TabsContent value="analytics" className="space-y-6">
                <SpendingChart categories={categories || []} />
              </TabsContent>
>>>>>>> d56f293ff91bb66bb44c0cdac2a7bc01ed81fe96
            </Tabs>
          </div>
        </main>

        {/* Toast notifications */}
        <Toaster />
      </div>
    </ErrorBoundary>
  );
}

// Main App with Auth Provider
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}