import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { 
  Target, 
  Plus, 
  Calendar, 
  DollarSign,
  Home,
  Car,
  Plane,
  GraduationCap,
  PiggyBank,
  Trash2,
  Edit,
  RefreshCw
} from 'lucide-react';
import { toast } from "sonner@2.0.3";

export const FinancialGoals = () => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetAmount: '',
    currentAmount: '',
    category: '',
    priority: 'medium',
    targetDate: ''
  });
  const [contributionAmounts, setContributionAmounts] = useState({});
  const [editingGoal, setEditingGoal] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = () => {
    // Load from localStorage or use mock data
    const savedGoals = localStorage.getItem('financialGoals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    } else {
      const mockGoals = [
        {
          id: 1,
          title: 'Emergency Fund',
          description: 'Build up emergency savings for unexpected expenses',
          targetAmount: 15000,
          currentAmount: 8300,
          category: 'emergency',
          priority: 'high',
          targetDate: '2024-12-31',
          status: 'in_progress',
          createdAt: '2024-01-01'
        },
        {
          id: 2,
          title: 'New Car',
          description: 'Save for a reliable vehicle upgrade',
          targetAmount: 25000,
          currentAmount: 12000,
          category: 'vehicle',
          priority: 'medium',
          targetDate: '2025-06-30',
          status: 'in_progress',
          createdAt: '2024-02-15'
        }
      ];
      setGoals(mockGoals);
      localStorage.setItem('financialGoals', JSON.stringify(mockGoals));
    }
  };

  const saveGoals = (updatedGoals) => {
    localStorage.setItem('financialGoals', JSON.stringify(updatedGoals));
    setGoals(updatedGoals);
  };

  const goalCategories = [
    { value: 'emergency', label: 'Emergency Fund', icon: PiggyBank },
    { value: 'housing', label: 'Housing', icon: Home },
    { value: 'vehicle', label: 'Vehicle', icon: Car },
    { value: 'travel', label: 'Travel', icon: Plane },
    { value: 'education', label: 'Education', icon: GraduationCap },
    { value: 'other', label: 'Other', icon: Target }
  ];

  const priorityColors = {
    high: 'bg-red-100 text-red-800 border-red-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    low: 'bg-green-100 text-green-800 border-green-200'
  };

  const calculateProgress = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (progress) => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    
    if (!newGoal.title || !newGoal.targetAmount) {
      toast.error('Please fill in required fields');
      return;
    }

    const targetAmt = parseFloat(newGoal.targetAmount);
    if (targetAmt <= 0) {
      toast.error('Target amount must be greater than 0');
      return;
    }

    setSubmitting(true);

    try {
      const goalData = {
        id: Date.now(),
        title: newGoal.title,
        description: newGoal.description,
        targetAmount: targetAmt,
        currentAmount: parseFloat(newGoal.currentAmount) || 0,
        category: newGoal.category || 'other',
        priority: newGoal.priority,
        targetDate: newGoal.targetDate,
        status: 'in_progress',
        createdAt: new Date().toISOString()
      };

      const updatedGoals = [goalData, ...goals];
      saveGoals(updatedGoals);
      
      setNewGoal({
        title: '',
        description: '',
        targetAmount: '',
        currentAmount: '',
        category: '',
        priority: 'medium',
        targetDate: ''
      });
      
      toast.success('Financial goal created successfully!');
    } catch (error) {
      toast.error('Failed to create goal');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteGoal = (goalId) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) {
      return;
    }

    const updatedGoals = goals.filter(goal => goal.id !== goalId);
    saveGoals(updatedGoals);
    
    setContributionAmounts(prev => {
      const newAmounts = { ...prev };
      delete newAmounts[goalId];
      return newAmounts;
    });
    
    toast.success('Goal deleted successfully');
  };

  const handleAddFunds = (goalId) => {
    const amount = parseFloat(contributionAmounts[goalId] || 0);
    
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const newAmount = goal.currentAmount + amount;
        const progress = (newAmount / goal.targetAmount) * 100;
        
        if (progress >= 100 && goal.status !== 'completed') {
          toast.success(`🎉 Congratulations! You've reached your goal: ${goal.title}`);
        } else {
          toast.success(`Added ${formatCurrency(amount)} to ${goal.title}`);
        }
        
        return {
          ...goal,
          currentAmount: newAmount,
          status: progress >= 100 ? 'completed' : 'in_progress'
        };
      }
      return goal;
    });

    saveGoals(updatedGoals);

    setContributionAmounts(prev => ({
      ...prev,
      [goalId]: ''
    }));
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setNewGoal({
      title: goal.title,
      description: goal.description,
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString(),
      category: goal.category,
      priority: goal.priority,
      targetDate: goal.targetDate
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateGoal = async (e) => {
    e.preventDefault();
    
    if (!newGoal.title || !newGoal.targetAmount) {
      toast.error('Please fill in required fields');
      return;
    }

    setSubmitting(true);

    try {
      const updatedGoals = goals.map(goal => {
        if (goal.id === editingGoal.id) {
          return {
            ...goal,
            title: newGoal.title,
            description: newGoal.description,
            targetAmount: parseFloat(newGoal.targetAmount),
            currentAmount: parseFloat(newGoal.currentAmount) || 0,
            category: newGoal.category || 'other',
            priority: newGoal.priority,
            targetDate: newGoal.targetDate
          };
        }
        return goal;
      });

      saveGoals(updatedGoals);

      setEditingGoal(null);
      setNewGoal({
        title: '',
        description: '',
        targetAmount: '',
        currentAmount: '',
        category: '',
        priority: 'medium',
        targetDate: ''
      });
      toast.success('Goal updated successfully!');
    } catch (error) {
      toast.error('Failed to update goal');
    } finally {
      setSubmitting(false);
    }
  };

  const cancelEdit = () => {
    setEditingGoal(null);
    setNewGoal({
      title: '',
      description: '',
      targetAmount: '',
      currentAmount: '',
      category: '',
      priority: 'medium',
      targetDate: ''
    });
  };

  const getStatusBadge = (goal) => {
    const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
    if (progress >= 100) {
      return <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>;
    }
    
    if (goal.targetDate) {
      const daysLeft = Math.ceil((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24));
      if (daysLeft < 0) {
        return <Badge className="bg-red-100 text-red-800 border-red-200">Overdue</Badge>;
      }
    }
    
    return <Badge className="bg-blue-100 text-blue-800 border-blue-200">In Progress</Badge>;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2>Financial Goals</h2>
            <p className="text-muted-foreground">Track and achieve your financial milestones</p>
          </div>
          <Button variant="outline" size="sm" onClick={loadGoals}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="space-y-4">
          {goals.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="text-center py-12">
                <Target className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3>No Financial Goals Yet</h3>
                <p className="text-muted-foreground mt-2">
                  Start building your financial future by setting your first goal
                </p>
              </CardContent>
            </Card>
          ) : (
            goals.map((goal) => {
              const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
              const daysLeft = goal.targetDate ? Math.ceil((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24)) : null;
              
              return (
                <Card key={goal.id} className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3>{goal.title}</h3>
                          {getStatusBadge(goal)}
                          <Badge variant="outline" className={`text-xs ${priorityColors[goal.priority]}`}>
                            {goal.priority} priority
                          </Badge>
                        </div>
                        {goal.description && (
                          <p className="text-muted-foreground text-sm mb-3">{goal.description}</p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEditGoal(goal)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteGoal(goal.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl">
                          {formatCurrency(goal.currentAmount)}
                        </span>
                        <span className="text-muted-foreground">
                          of {formatCurrency(goal.targetAmount)}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="w-full bg-muted rounded-full h-3">
                          <div
                            className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(progress)}`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{progress.toFixed(1)}% complete</span>
                          {daysLeft !== null && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
                            </span>
                          )}
                        </div>
                      </div>

                      {progress < 100 && (
                        <div className="flex gap-2 pt-2">
                          <div className="relative flex-1">
                            <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="number"
                              placeholder="Amount to add"
                              className="h-9 pl-9"
                              min="0"
                              step="0.01"
                              value={contributionAmounts[goal.id] || ''}
                              onChange={(e) => setContributionAmounts(prev => ({
                                ...prev,
                                [goal.id]: e.target.value
                              }))}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddFunds(goal.id);
                                }
                              }}
                            />
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleAddFunds(goal.id)}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      <div className="lg:col-span-1">
        <Card className="border-0 shadow-sm sticky top-6">
          <CardHeader>
            <CardTitle>{editingGoal ? 'Edit Goal' : 'Create New Goal'}</CardTitle>
            <CardDescription>
              {editingGoal 
                ? 'Update your financial goal details' 
                : 'Set a clear financial goal and track your progress'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={editingGoal ? handleUpdateGoal : handleCreateGoal} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="goal-title">Goal Title *</Label>
                <Input
                  id="goal-title"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Emergency Fund"
                  className="bg-muted/50"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal-description">Description</Label>
                <Textarea
                  id="goal-description"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description"
                  className="bg-muted/50 resize-none"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="target-amount">Target Amount *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="target-amount"
                    type="number"
                    value={newGoal.targetAmount}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, targetAmount: e.target.value }))}
                    placeholder="0.00"
                    className="pl-9 bg-muted/50"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="current-amount">Current Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="current-amount"
                    type="number"
                    value={newGoal.currentAmount}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, currentAmount: e.target.value }))}
                    placeholder="0.00"
                    className="pl-9 bg-muted/50"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal-category">Category</Label>
                <Select 
                  value={newGoal.category} 
                  onValueChange={(value) => setNewGoal(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className="bg-muted/50">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {goalCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal-priority">Priority</Label>
                <Select 
                  value={newGoal.priority} 
                  onValueChange={(value) => setNewGoal(prev => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger className="bg-muted/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="target-date">Target Date</Label>
                <Input
                  id="target-date"
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, targetDate: e.target.value }))}
                  className="bg-muted/50"
                />
              </div>

              <div className="flex gap-2">
                {editingGoal && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1"
                    onClick={cancelEdit}
                  >
                    Cancel
                  </Button>
                )}
                <Button type="submit" className="flex-1" disabled={submitting}>
                  {submitting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    editingGoal ? 'Update Goal' : 'Create Goal'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
