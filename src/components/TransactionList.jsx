import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Trash2, Search, Filter, Plus } from "lucide-react";
import { Category, Transaction } from "../types/api";
import { useApi } from "../hooks/useApi";
import { transactionService } from "../services/transactionService";
import { LoadingCard } from "./LoadingSpinner";
import { ErrorMessage } from "./ErrorBoundary";
import { toast } from "sonner";

export function TransactionList({ categories, onDeleteTransaction }) {
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const { data: transactionsResponse, loading, error, refetch } = useApi(
    () => transactionService.getTransactions({ ...filters, search: searchTerm }),
    [filters, searchTerm]
  );

  const transactions = transactionsResponse?.data || [];

  const handleDelete = async (id) => {
    try {
      await onDeleteTransaction(id);
      refetch();
    } catch (error) {
      toast.error('Failed to delete transaction');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? undefined : value
    }));
  };

  const formatAmount = (amount, type) => {
    const num = parseFloat(amount);
    const formatted = `₱${num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
    
    return type === 'expense' ? `-${formatted}` : `+${formatted}`;
  };

  const getTransactionColor = (type) => {
    return type === 'expense' ? 'text-red-600' : 'text-green-600';
  };

  const getCategoryBadgeColor = (categoryName) => {
    const colorMap = {
      'Food & Dining': 'bg-red-100 text-red-800 border-red-200',
      'Transportation': 'bg-blue-100 text-blue-800 border-blue-200',
      'Entertainment': 'bg-purple-100 text-purple-800 border-purple-200',
      'Shopping': 'bg-orange-100 text-orange-800 border-orange-200',
      'Bills & Utilities': 'bg-green-100 text-green-800 border-green-200',
      'Healthcare': 'bg-pink-100 text-pink-800 border-pink-200',
      'Education': 'bg-teal-100 text-teal-800 border-teal-200',
      'Salary': 'bg-green-100 text-green-800 border-green-200',
      'Freelance': 'bg-cyan-100 text-cyan-800 border-cyan-200',
      'Investments': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    };
    
    return colorMap[categoryName] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading) return <LoadingCard />;
  if (error) return <ErrorMessage message="Failed to load transactions" onRetry={refetch} />;

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Transaction History
          </CardTitle>
          <Button size="sm" variant="outline">
            Add Transaction
            <Plus className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        {/* Filters */}
        <div className="flex gap-3 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background"
            />
          </div>
          
          <Select value={filters.type || 'all'} onValueChange={(value) => handleFilterChange('type', value)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.category_id?.toString() || 'all'} onValueChange={(value) => handleFilterChange('category_id', value === 'all' ? undefined : parseInt(value))}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
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
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-2">
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No transactions found</p>
              <p className="text-sm">Try adjusting your filters or add your first transaction</p>
            </div>
          ) : (
            transactions.map((transaction) => (
              <div 
                key={transaction.id} 
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-2 h-8 rounded-full ${transaction.type === 'expense' ? 'bg-red-500' : 'bg-green-500'}`} />
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{transaction.description}</span>
                      {transaction.category && (
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getCategoryBadgeColor(transaction.category.name)}`}
                        >
                          {transaction.category.name}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(transaction.transaction_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                    {formatAmount(transaction.amount, transaction.type)}
                  </span>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(transaction.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {transactions.length > 0 && (
          <div className="flex justify-center mt-6">
            <Button variant="outline" size="sm">
              Load More
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}