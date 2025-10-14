import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Plus, Edit3, Target, AlertTriangle } from "lucide-react";
import { LoadingCard } from "./LoadingSpinner";
import { ErrorMessage } from "./ErrorBoundary";
import { useAsyncAction } from "../hooks/useApi";
import { toast } from "sonner@2.0.3";

export function BudgetTracker({ 
  budgets, 
  categories, 
  loading, 
  onUpdateBudget, 
  onAddBudget 
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBudgetCategory, setNewBudgetCategory] = useState('');
  const [newBudgetLimit, setNewBudgetLimit] = useState('');
  const [editingBudget, setEditingBudget] = useState(null);
  const [editLimit, setEditLimit] = useState('');

  const { execute: addBudget, loading: addingBudget } = useAsyncAction();
  const { execute: updateBudget, loading: updatingBudget } = useAsyncAction();

  // Get categories that don't have budgets yet
  const availableCategories = categories.filter(
    category => 
      category.type === 'expense' && 
      !budgets.some(budget => budget.category_id === category.id)
  );

  const handleAddBudget = async (e) => {
    e.preventDefault();
    if (!newBudgetCategory || !newBudgetLimit) return;

    const success = await addBudget(async () => {
      await onAddBudget(parseInt(newBudgetCategory), parseFloat(newBudgetLimit));
    });

    if (success) {
      setNewBudgetCategory('');
      setNewBudgetLimit('');
      setShowAddForm(false);
      toast.success('Budget created successfully');
    }
  };

  const handleUpdateBudget = async (budgetId, newLimit) => {
    const success = await updateBudget(async () => {
      await onUpdateBudget(budgetId, parseFloat(newLimit));
    });

    if (success) {
      setEditingBudget(null);
      setEditLimit('');
      toast.success('Budget updated successfully');
    }
  };

  const calculateProgress = (spent, limit) => {
    const percentage = (parseFloat(spent) / parseFloat(limit)) * 100;
    return Math.min(percentage, 100);
  };

  const getProgressColor = (spent, limit) => {
    const percentage = (parseFloat(spent) / parseFloat(limit)) * 100;
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getBudgetStatus = (spent, limit) => {
    const percentage = (parseFloat(spent) / parseFloat(limit)) * 100;
    if (percentage >= 100) return { text: 'Over Budget', color: 'bg-red-100 text-red-800 border-red-200' };
    if (percentage >= 80) return { text: 'Near Limit', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    return { text: 'On Track', color: 'bg-green-100 text-green-800 border-green-200' };
  };

  if (loading) return <LoadingCard />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Budget Tracker */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5" />
            Budget Tracker
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-4">
            {budgets.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No budgets set up yet</p>
                <p className="text-sm">Create your first budget to start tracking spending</p>
              </div>
            ) : (
              budgets.map((budget) => {
                const progress = calculateProgress(budget.spent, budget.limit);
                const status = getBudgetStatus(budget.spent, budget.limit);
                const isEditing = editingBudget === budget.id;

                return (
                  <div key={budget.id} className="p-4 rounded-lg border bg-card">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{budget.category?.name}</span>
                        <Badge variant="outline" className={`text-xs ${status.color}`}>
                          {status.text}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={editLimit}
                              onChange={(e) => setEditLimit(e.target.value)}
                              className="w-24 h-8"
                              placeholder="0.00"
                            />
                            <Button
                              size="sm"
                              onClick={() => handleUpdateBudget(budget.id, editLimit)}
                              disabled={updatingBudget}
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingBudget(null);
                                setEditLimit('');
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingBudget(budget.id);
                              setEditLimit(budget.limit);
                            }}
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          ${parseFloat(budget.spent).toFixed(2)} of ${parseFloat(budget.limit).toFixed(2)}
                        </span>
                        <span className="font-medium">{progress.toFixed(1)}%</span>
                      </div>
                      
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(budget.spent, budget.limit)}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Remaining: ${parseFloat(budget.remaining).toFixed(2)}</span>
                        {progress >= 100 && (
                          <span className="text-red-600 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Over budget
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create New Budget */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Budget
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-0">
          {availableCategories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>All expense categories have budgets</p>
              <p className="text-sm">Edit existing budgets or add new categories</p>
            </div>
          ) : (
            <form onSubmit={handleAddBudget} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="budget-category">Category</Label>
                <Select 
                  value={newBudgetCategory} 
                  onValueChange={setNewBudgetCategory}
                  required
                >
                  <SelectTrigger className="bg-muted/50">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget-limit">Monthly Limit</Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-muted-foreground">$</span>
                  <Input
                    id="budget-limit"
                    type="number"
                    value={newBudgetLimit}
                    onChange={(e) => setNewBudgetLimit(e.target.value)}
                    placeholder="0.00"
                    className="pl-7 bg-muted/50"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={addingBudget || !newBudgetCategory || !newBudgetLimit}
              >
                {addingBudget ? 'Creating...' : 'Create Budget'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}