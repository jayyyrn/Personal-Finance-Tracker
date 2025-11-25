import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Plus, Edit3, Target, AlertTriangle } from "lucide-react";
import { useAsyncAction } from "../hooks/useApi";
import { toast } from "sonner";

export function BudgetTracker({ 
  budgets = [], 
  categories = [], 
  loading = false, 
  onUpdateBudget, 
  onAddBudget 
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBudgetCategory, setNewBudgetCategory] = useState('');
  const [newBudgetLimit, setNewBudgetLimit] = useState('');
  const [editingBudget, setEditingBudget] = useState(null);
  const [editLimit, setEditLimit] = useState('');
<<<<<<< HEAD
  const [budgetType, setBudgetType] = useState('expense');
=======
  const [budgetType, setBudgetType] = useState('expense'); // Add this state
>>>>>>> d56f293ff91bb66bb44c0cdac2a7bc01ed81fe96

  const { execute: addBudget, loading: addingBudget } = useAsyncAction();
  const { execute: updateBudget, loading: updatingBudget } = useAsyncAction();

  // Get categories based on selected type
  const availableCategories = categories?.filter(cat => 
    cat?.type === budgetType && !budgets?.some(budget => budget?.category_id === cat?.id)
  ) || [];

  const handleAddBudget = async () => {
    if (!newBudgetCategory || !newBudgetLimit) {
      toast.error('Please select a category and enter a budget limit');
      return;
    }

    const result = await addBudget(() => 
      onAddBudget(parseInt(newBudgetCategory), parseFloat(newBudgetLimit))
    );

    if (result) {
      setShowAddForm(false);
      setNewBudgetCategory('');
      setNewBudgetLimit('');
    }
  };

  const handleUpdateBudget = async (budgetId) => {
    if (!editLimit) {
      toast.error('Please enter a valid budget limit');
      return;
    }

    const result = await updateBudget(() => 
      onUpdateBudget(budgetId, parseFloat(editLimit))
    );

    if (result) {
      setEditingBudget(null);
      setEditLimit('');
    }
  };

  const startEditing = (budget) => {
    setEditingBudget(budget.id);
    setEditLimit(budget.limit);
  };

  const formatAmount = (amount) => {
<<<<<<< HEAD
    if (!amount) return '₱0.00';
    return `₱${parseFloat(amount).toLocaleString()}`;
=======
    if (!amount) return '$0.00';
    return `$${parseFloat(amount).toLocaleString()}`;
>>>>>>> d56f293ff91bb66bb44c0cdac2a7bc01ed81fe96
  };

  // Safe access to budget properties
  const getBudgetCategoryName = (budget) => {
    return budget?.category?.name || 'Uncategorized';
  };

  const getBudgetCategoryColor = (budget) => {
    return budget?.category?.color || '#6b7280';
  };

  const getBudgetSpent = (budget) => {
    return budget?.spent || '0';
  };

  const getBudgetLimit = (budget) => {
    return budget?.limit || '0';
  };

  const getBudgetRemaining = (budget) => {
    return budget?.remaining || '0';
  };

  const getBudgetPercentage = (budget) => {
    return budget?.percentage || 0;
  };

  const getIsOverBudget = (budget) => {
    return budget?.is_over_budget || false;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Budget Overview</h1>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Budget
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Input 
          placeholder="Search budgets..." 
          className="pl-10"
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side - Budget List */}
        <div className="lg:col-span-2 space-y-4">
          {!budgets || budgets.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No budgets set up yet</p>
                <p className="text-sm text-muted-foreground">Create your first budget to start tracking spending</p>
              </CardContent>
            </Card>
          ) : (
            budgets.map((budget) => (
              <Card key={budget?.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    {/* Budget Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{getBudgetCategoryName(budget)}</h3>
                        <Badge
                          style={{ 
                            backgroundColor: getBudgetCategoryColor(budget),
                            color: 'white'
                          }}
                        >
                          {getBudgetCategoryName(budget)}
                        </Badge>
                        {getIsOverBudget(budget) && (
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Over Budget
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Budget: {formatAmount(getBudgetLimit(budget))}</span>
                          <span>Spent: {formatAmount(getBudgetSpent(budget))}</span>
                          <span>Remaining: {formatAmount(getBudgetRemaining(budget))}</span>
                        </div>

                        <Progress 
                          value={Math.min(getBudgetPercentage(budget), 100)} 
                          className="h-2"
                        />

                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{getBudgetPercentage(budget).toFixed(1)}% used</span>
                          <span>Period: Monthly</span>
                        </div>
                      </div>
                    </div>

                    {/* Edit Button */}
                    <div className="ml-4">
                      {editingBudget === budget?.id ? (
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            step="0.01"
                            value={editLimit}
                            onChange={(e) => setEditLimit(e.target.value)}
                            placeholder="Budget limit"
                            className="w-32"
                          />
                          <Button 
                            size="sm"
                            onClick={() => handleUpdateBudget(budget?.id)}
                            disabled={updatingBudget}
                          >
                            {updatingBudget ? 'Saving...' : 'Save'}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setEditingBudget(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEditing(budget)}
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Right Side - Create Budget Form */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Create Budget</h3>
              
<<<<<<< HEAD
              {/* Budget Type Toggle */}
=======
              {/* Budget Type Toggle - FIXED */}
>>>>>>> d56f293ff91bb66bb44c0cdac2a7bc01ed81fe96
              <div className="grid grid-cols-2 gap-2 mb-4">
                <Button 
                  variant={budgetType === 'expense' ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setBudgetType('expense')}
                >
                  Expense
                </Button>
                <Button 
                  variant={budgetType === 'income' ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setBudgetType('income')}
                >
                  Income
                </Button>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="budget-amount">Amount *</Label>
                  <Input
                    id="budget-amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newBudgetLimit}
                    onChange={(e) => setNewBudgetLimit(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="budget-category">Category *</Label>
                  <Select value={newBudgetCategory} onValueChange={setNewBudgetCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCategories.length > 0 ? (
                        availableCategories.map((category) => (
                          <SelectItem key={category?.id} value={category?.id?.toString()}>
                            {category?.name || 'Unknown Category'}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-categories" disabled>
                          No {budgetType} categories available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="budget-name">Budget Name *</Label>
                  <Input
                    id="budget-name"
                    placeholder="Enter budget name"
                  />
                </div>

                <div>
                  <Label htmlFor="budget-period">Period</Label>
                  <Select defaultValue="monthly">
                    <SelectTrigger>
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Action Button */}
              <Button 
                onClick={handleAddBudget} 
                disabled={addingBudget}
                className="w-full mt-6"
              >
                <Plus className="h-4 w-4 mr-2" />
                {addingBudget ? 'Creating...' : 'Create Budget'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}