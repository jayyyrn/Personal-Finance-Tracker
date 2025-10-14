
import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./components/ui/tabs";
import { Button } from "./components/ui/button";
import { Toaster } from "./components/ui/sonner";
import { SummaryCards } from "./components/SummaryCards";
import { TransactionForm } from "./components/TransactionForm";
import { TransactionList } from "./components/TransactionList";
import { BudgetTracker } from "./components/BudgetTracker";
import { SpendingChart } from "./components/SpendingChart";
import { LoadingPage } from "./components/LoadingSpinner";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ProfileSettings } from "./components/profile/ProfileSettings";
import { ReportsPage } from "./components/reports/ReportsPage";
import { LandingPage } from "./components/landing/LandingPage";
import { FinancialGoals } from "./components/goals/FinancialGoals";
import { AuthPage } from "./components/auth/AuthPage";
import {  AuthProvider, useAuth,} from "./contexts/AuthContext";
import { useApi } from "./hooks/useApi";
import { transactionService } from "./services/transactionService";
import { categoryService } from "./services/categoryService";
import { budgetService } from "./services/budgetService";
import {
  Wallet,
  Moon,
  Sun,
  User,
  FileText,
  LogOut,
  ChevronDown,
  Target,
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./components/ui/avatar";

function AppContent() {
  const { user, loading: authLoading, isAuthenticated, logout } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [currentPage, setCurrentPage] = useState("landing");
 

  const {
    data: dashboardStats,
    loading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useApi(() => transactionService.getDashboardStats(), [isAuthenticated], isAuthenticated);

  const {
    data: categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useApi(() => categoryService.getCategories(), [isAuthenticated], isAuthenticated);

  const {
    data: budgets,
    loading: budgetsLoading,
    refetch: refetchBudgets,
  } = useApi(() => budgetService.getBudgets(), [isAuthenticated], isAuthenticated);

  const [transactionRefreshTrigger, setTransactionRefreshTrigger] = useState(0);

  // --- Handlers ---
  const handleAddTransaction = async (transactionData: import("./types").TransactionData) => {
    await transactionService.createTransaction(transactionData);
  };

  const handleTransactionAdded = () => {
    refetchStats();
    refetchBudgets();
    setTransactionRefreshTrigger((prev) => prev + 1);
  };

  const handleDeleteTransaction = async (id: number) => {
    try {
      await transactionService.deleteTransaction(id);
      toast.success("Transaction deleted successfully");
      refetchStats();
      refetchBudgets();
      setTransactionRefreshTrigger((prev) => prev + 1);
    } catch {
      toast.error("Failed to delete transaction");
    }
  };

  const handleUpdateBudget = async (budgetId: number, limit: number) => {
    try {
      await budgetService.updateBudget(budgetId, { limit });
      toast.success("Budget updated successfully");
      refetchBudgets();
    } catch {
      toast.error("Failed to update budget");
    }
  };

  const handleAddBudget = async (categoryId: number, limit: number) => {
    try {
      await budgetService.createBudget({ category_id: categoryId, limit });
      toast.success("Budget created successfully");
      refetchBudgets();
    } catch {
      toast.error("Failed to create budget");
    }
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch {
      toast.error("Failed to logout");
    }
  };

  const getInitials = (name?: string) =>
    name
      ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
      : "U";

  // --- Page Handling ---
  if (authLoading) return <LoadingPage />;

  if (!isAuthenticated) {
    return currentPage === "landing"
      ? <LandingPage onGetStarted={() => setCurrentPage("auth")} />
      : <AuthPage />;
  }

  if (categoriesLoading) return <LoadingPage />;

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

  // --- Main Dashboard ---
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
                <Wallet className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Personal Finance Tracker</h1>
                <p className="text-sm text-muted-foreground">
                  Welcome back, {user?.name?.split(" ")[0] || "User"}!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage("goals")}>
                <Target className="mr-2 h-4 w-4" /> Goals
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage("reports")}>
                <FileText className="mr-2 h-4 w-4" /> Reports
              </Button>
              <Button variant="outline" size="icon" onClick={toggleTheme}>
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline">{user?.name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setCurrentPage("profile")}>
                    <User className="mr-2 h-4 w-4" /> Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCurrentPage("goals")}>
                    <Target className="mr-2 h-4 w-4" /> Financial Goals
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCurrentPage("reports")}>
                    <FileText className="mr-2 h-4 w-4" /> Reports
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            <SummaryCards
              stats={dashboardStats}
              loading={statsLoading}
              error={statsError}
              onRetry={refetchStats}
            />

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid grid-cols-5 w-full max-w-lg">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="budget">Budget</TabsTrigger>
                <TabsTrigger value="goals">Goals</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              {/* Overview */}
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

              {/* Transactions */}
              <TabsContent value="transactions" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <TransactionList
                      categories={categories || []}
                      onDeleteTransaction={handleDeleteTransaction}
                      refreshTrigger={transactionRefreshTrigger}
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

              {/* Budget */}
              <TabsContent value="budget">
                <BudgetTracker
                  budgets={budgets || []}
                  categories={categories || []}
                  loading={budgetsLoading}
                  onUpdateBudget={handleUpdateBudget}
                  onAddBudget={handleAddBudget}
                />
              </TabsContent>

              {/* Goals */}
              <TabsContent value="goals">
                <FinancialGoals />
              </TabsContent>

              {/* Analytics */}
              <TabsContent value="analytics">
                <SpendingChart categories={categories || []} />
              </TabsContent>
            </Tabs>
          </div>
        </main>

        <Toaster />
      </div>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
