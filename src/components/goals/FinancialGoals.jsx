import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { 
  Target, 
  Plus, 
  TrendingUp, 
  Calendar, 
  DollarSign,
  Home,
  Car,
  Plane,
  GraduationCap,
  PiggyBank,
  Trash2,
  Edit,
  CheckCircle
} from 'lucide-react';
import { toast } from "sonner";

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
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Mock data for development
  useEffect(() => {
    try {
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
        },
        {
          id: 3,
          title: 'Vacation',
          description: 'Europe trip fund for summer vacation',
          targetAmount: 8000,
          currentAmount: 5400,
          category: 'travel',
          priority: 'low',
          targetDate: '2024-07-01',
          status: 'in_progress',
          createdAt: '2024-03-01'
        }
      ];
      setGoals(mockGoals);
    } catch (error) {
      console.error('Error loading mock goals:', error);
      toast.error('Failed to load goals data');
    }
  }, []);

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

  const validateGoal = (goal) => {
    const newErrors = {};

    if (!goal.title?.trim()) {
      newErrors.title = 'Goal title is required';
    }

    if (!goal.targetAmount || parseFloat(goal.targetAmount) <= 0) {
      newErrors.targetAmount = 'Target amount must be greater than 0';
    }

    if (goal.currentAmount && parseFloat(goal.currentAmount) < 0) {
      newErrors.currentAmount = 'Current amount cannot be negative';
    }

    if (goal.targetDate && new Date(goal.targetDate) < new Date()) {
      newErrors.targetDate = 'Target date cannot be in the past';
    }

    if (goal.currentAmount && goal.targetAmount && 
        parseFloat(goal.currentAmount) > parseFloat(goal.targetAmount)) {
      newErrors.currentAmount = 'Current amount cannot exceed target amount';
    }

    return newErrors;
  };

  const calculateProgress = (current, target) => {
    try {
      if (!target || target <= 0) return 0;
      const progress = (current / target) * 100;
      return Math.min(progress, 100);
    } catch (error) {
      console.error('Error calculating progress:', error);
      return 0;
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  const formatCurrency = (amount) => {
    try {
      if (!amount && amount !== 0) return '₱0.00';
      return `₱${parseFloat(amount).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`;
    } catch (error) {
      console.error('Error formatting currency:', error);
      return '₱0.00';
    }
  };

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const validationErrors = validateGoal(newGoal);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        toast.error('Please fix the errors in the form');
        return;
      }

      const goalData = {
        id: Date.now(),
        title: newGoal.title.trim(),
        description: newGoal.description.trim(),
        targetAmount: parseFloat(newGoal.targetAmount),
        currentAmount: parseFloat(newGoal.currentAmount) || 0,
        category: newGoal.category || 'other',
        priority: newGoal.priority,
        targetDate: newGoal.targetDate,
        status: 'in_progress',
        createdAt: new Date().toISOString()
      };

      setGoals(prev => [...prev, goalData]);
      setNewGoal({
        title: '',
        description: '',
        targetAmount: '',
        currentAmount: '',
        category: '',
        priority: 'medium',
        targetDate: ''
      });
      setErrors({});
      toast.success('Financial goal created successfully!');
    } catch (error) {
      console.error('Error creating goal:', error);
      toast.error('Failed to create goal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGoal = (goalId) => {
    try {
      setGoals(prev => prev.filter(goal => goal.id !== goalId));
      toast.success('Goal deleted successfully');
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast.error('Failed to delete goal');
    }
  };

  const updateGoalProgress = (goalId, newAmount) => {
    try {
      const amount = parseFloat(newAmount);
      if (isNaN(amount) || amount < 0) {
        toast.error('Please enter a valid amount');
        return;
      }

      setGoals(prev => prev.map(goal => {
        if (goal.id === goalId) {
          const updatedAmount = goal.currentAmount + amount;
          if (updatedAmount > goal.targetAmount) {
            toast.warning('Amount exceeds target goal');
            return { ...goal, currentAmount: goal.targetAmount };
          }
          return { ...goal, currentAmount: updatedAmount };
        }
        return goal;
      }));
      toast.success('Goal progress updated');
    } catch (error) {
      console.error('Error updating goal progress:', error);
      toast.error('Failed to update goal progress');
    }
  };

  const getStatusBadge = (goal) => {
    try {
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
    } catch (error) {
      console.error('Error getting status badge:', error);
      return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Unknown</Badge>;
    }
  };

  const getDaysLeft = (targetDate) => {
    if (!targetDate) return null;
    try {
      const daysLeft = Math.ceil((new Date(targetDate) - new Date()) / (1000 * 60 * 60 * 24));
      return daysLeft;
    } catch (error) {
      console.error('Error calculating days left:', error);
      return null;
    }
  };

  const getCategoryLabel = (categoryValue) => {
    const category = goalCategories.find(cat => cat.value === categoryValue);
    return category?.label || 'Other';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Goals List */}
      <div className="lg:col-span-2 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold">Financial Goals</h2>
          <p className="text-muted-foreground">Track and achieve your financial milestones</p>
        </div>

        {/* Goals List */}
        <div className="space-y-4">
          {goals.length === 0 ? (
            <Card className="border-0 shadow-sm">
              <CardContent className="text-center py-12">
                <Target className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">No Financial Goals Yet</h3>
                <p className="text-muted-foreground">
                  Start building your financial future by setting your first goal using the form on the right
                </p>
              </CardContent>
            </Card>
          ) : (
            goals.map((goal) => {
              const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
              const daysLeft = getDaysLeft(goal.targetDate);
              
              return (
                <Card key={goal.id} className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{goal.title}</h3>
                          {getStatusBadge(goal)}
                          <Badge variant="outline" className={`text-xs ${priorityColors[goal.priority]}`}>
                            {goal.priority} priority
                          </Badge>
                        </div>
                        {goal.description && (
                          <p className="text-muted-foreground text-sm mb-3">{goal.description}</p>
                        )}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>Category: {getCategoryLabel(goal.category)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
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
                        <span className="text-2xl font-bold">
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

                      <div className="flex gap-2 pt-2">
                        <Input
                          type="number"
                          placeholder="Add amount"
                          className="flex-1 h-9"
                          min="0"
                          step="0.01"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              const amount = parseFloat(e.target.value);
                              if (amount > 0) {
                                updateGoalProgress(goal.id, amount);
                                e.target.value = '';
                              } else {
                                toast.error('Please enter a valid amount');
                              }
                            }
                          }}
                        />
                        <Button size="sm" variant="outline">
                          Add Funds
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* Right Column - Create Goal Form */}
      <div className="lg:col-span-1">
        <Card className="border-0 shadow-sm sticky top-6">
          <CardHeader>
            <CardTitle>Create New Financial Goal</CardTitle>
            <CardDescription>
              Set a clear financial goal and track your progress towards achieving it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="goal-title">Goal Title *</Label>
                <Input
                  id="goal-title"
                  value={newGoal.title}
                  onChange={(e) => {
                    setNewGoal(prev => ({ ...prev, title: e.target.value }));
                    if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
                  }}
                  placeholder="e.g., Emergency Fund"
                  className={`bg-muted/50 ${errors.title ? 'border-red-500' : ''}`}
                  required
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal-description">Description</Label>
                <Textarea
                  id="goal-description"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of your goal"
                  className="bg-muted/50 resize-none"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="target-amount">Target Amount *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-muted-foreground">₱</span>
                  <Input
                    id="target-amount"
                    type="number"
                    value={newGoal.targetAmount}
                    onChange={(e) => {
                      setNewGoal(prev => ({ ...prev, targetAmount: e.target.value }));
                      if (errors.targetAmount) setErrors(prev => ({ ...prev, targetAmount: '' }));
                    }}
                    placeholder="0.00"
                    className={`pl-7 bg-muted/50 ${errors.targetAmount ? 'border-red-500' : ''}`}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                {errors.targetAmount && (
                  <p className="text-sm text-red-500">{errors.targetAmount}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="current-amount">Current Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-muted-foreground">₱</span>
                  <Input
                    id="current-amount"
                    type="number"
                    value={newGoal.currentAmount}
                    onChange={(e) => {
                      setNewGoal(prev => ({ ...prev, currentAmount: e.target.value }));
                      if (errors.currentAmount) setErrors(prev => ({ ...prev, currentAmount: '' }));
                    }}
                    placeholder="0.00"
                    className={`pl-7 bg-muted/50 ${errors.currentAmount ? 'border-red-500' : ''}`}
                    min="0"
                    step="0.01"
                  />
                </div>
                {errors.currentAmount && (
                  <p className="text-sm text-red-500">{errors.currentAmount}</p>
                )}
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
                  onChange={(e) => {
                    setNewGoal(prev => ({ ...prev, targetDate: e.target.value }));
                    if (errors.targetDate) setErrors(prev => ({ ...prev, targetDate: '' }));
                  }}
                  className={`bg-muted/50 ${errors.targetDate ? 'border-red-500' : ''}`}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.targetDate && (
                  <p className="text-sm text-red-500">{errors.targetDate}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Goal'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};