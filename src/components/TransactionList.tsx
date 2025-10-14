import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Trash2, Search, RefreshCw, X, ChevronDown } from "lucide-react";
import { transactionService } from "../services/transactionService";
import { LoadingCard } from "./LoadingSpinner";
import { ErrorMessage } from "./ErrorBoundary";
import { toast } from "sonner@2.0.3";

export function TransactionList({ categories, onDeleteTransaction, refreshTrigger }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const perPage = 10;
  
  // Filter state
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch transactions
  const fetchTransactions = async (pageNum = 1, append = false) => {
    try {
      if (pageNum === 1 && !append) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      setError(null);

      const params = {
        ...filters,
        search: debouncedSearch || undefined,
        page: pageNum,
        per_page: perPage
      };

      const response = await transactionService.getTransactions(params);
      const newTransactions = response.data || [];

      if (append) {
        setTransactions(prev => [...prev, ...newTransactions]);
      } else {
        setTransactions(newTransactions);
      }

      setHasMore(newTransactions.length === perPage);
      
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err.message || 'Failed to load transactions');
      if (pageNum === 1) {
        toast.error('Failed to load transactions');
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  // Initial load and when filters change
  useEffect(() => {
    setPage(1);
    fetchTransactions(1, false);
  }, [filters, debouncedSearch]);

  // Refresh when parent triggers it
  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      setPage(1);
      fetchTransactions(1, false);
    }
  }, [refreshTrigger]);

  // Refresh functionality
  const handleRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await fetchTransactions(1, false);
    toast.success('Transactions refreshed');
  };

  // Load more functionality
  const handleLoadMore = async () => {
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchTransactions(nextPage, true);
  };

  // Delete transaction
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    try {
      // Optimistic update
      setTransactions(prev => prev.filter(t => t.id !== id));
      
      await onDeleteTransaction(id);
      
    } catch (error) {
      toast.error('Failed to delete transaction');
      // Refetch to restore state
      fetchTransactions(page, false);
    }
  };

  // Filter change handler
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? undefined : value
    }));
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({});
    setSearchTerm('');
    toast.success('Filters cleared');
  };

  const hasActiveFilters = () => {
    return searchTerm !== '' || filters.type || filters.category_id;
  };

  const formatAmount = (amount) => {
    const num = parseFloat(amount);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(num);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading && !refreshing) {
    return <LoadingCard />;
  }

  if (error && transactions.length === 0) {
    return <ErrorMessage message="Failed to load transactions" onRetry={handleRefresh} />;
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Transaction History
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Filters */}
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-muted/50"
              />
            </div>

            {/* Type Filter */}
            <Select 
              value={filters.type || 'all'} 
              onValueChange={(value) => handleFilterChange('type', value)}
            >
              <SelectTrigger className="bg-muted/50">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>

            {/* Category Filter */}
            <Select 
              value={filters.category_id?.toString() || 'all'} 
              onValueChange={(value) => handleFilterChange('category_id', value === 'all' ? undefined : parseInt(value))}
            >
              <SelectTrigger className="bg-muted/50">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters() && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClearFilters}
              className="w-full sm:w-auto"
            >
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          )}
        </div>

        {/* Transaction List */}
        <div className="space-y-3">
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="mb-2">No Transactions Found</h3>
              <p className="text-muted-foreground text-sm">
                {hasActiveFilters() 
                  ? 'Try adjusting your filters or search terms' 
                  : 'Start by adding your first transaction'}
              </p>
            </div>
          ) : (
            <>
              {transactions.map((transaction) => (
                <div 
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div 
                      className={`w-1 h-12 rounded-full ${
                        transaction.type === 'expense' ? 'bg-red-500' : 'bg-green-500'
                      }`} 
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="truncate">{transaction.description}</h4>
                        <Badge 
                          variant="outline" 
                          className="text-xs whitespace-nowrap"
                        >
                          {transaction.category?.name || 'Uncategorized'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(transaction.transaction_date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`font-medium ${
                      transaction.type === 'expense' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {transaction.type === 'expense' ? '-' : '+'}
                      {formatAmount(transaction.amount)}
                    </span>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(transaction.id)}
                      className="text-destructive hover:text-destructive h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {/* Load More Button */}
              {hasMore && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-2" />
                      Load More
                    </>
                  )}
                </Button>
              )}

              {/* Show count */}
              <div className="text-center text-sm text-muted-foreground pt-2">
                Showing {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
