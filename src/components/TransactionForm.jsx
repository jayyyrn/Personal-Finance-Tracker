import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Category } from "../types/api";
<<<<<<< HEAD
import { useAsyncAction } from "../hooks/useApi";
import { LoadingSpinner } from "./LoadingSpinner";
import { Plus } from "lucide-react";
=======
// Remove this line: import { CreateTransactionData } from "../services/transactionService";
import { useAsyncAction } from "../hooks/useApi";
import { LoadingSpinner } from "./LoadingSpinner";
import { Plus, DollarSign } from "lucide-react";
>>>>>>> d56f293ff91bb66bb44c0cdac2a7bc01ed81fe96
import { toast } from "sonner";

export function TransactionForm({ categories, onTransactionAdded, onAddTransaction }) {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const { execute: submitTransaction, loading, error } = useAsyncAction();

  const filteredCategories = categories.filter(cat => cat.type === type);

  const resetForm = () => {
    setType('expense');
    setAmount('');
    setCategoryId('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!amount || !categoryId || !description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const transactionData = {
      type,
      amount: parseFloat(amount),
      category_id: parseInt(categoryId),
      description,
      transaction_date: date
    };

    const success = await submitTransaction(async () => {
      await onAddTransaction(transactionData);
    });

    if (success) {
      resetForm();
      onTransactionAdded();
      toast.success(`${type === 'income' ? 'Income' : 'Expense'} added successfully!`);
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add Transaction
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Transaction Type */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={type === 'expense' ? 'default' : 'outline'}
              onClick={() => {
                setType('expense');
<<<<<<< HEAD
                setCategoryId('');
=======
                setCategoryId(''); // Reset category when type changes
>>>>>>> d56f293ff91bb66bb44c0cdac2a7bc01ed81fe96
              }}
              className={`h-10 ${type === 'expense' ? 'bg-red-600 hover:bg-red-700' : 'border-red-200 text-red-600 hover:bg-red-50'}`}
            >
              Expense
            </Button>
            <Button
              type="button"
              variant={type === 'income' ? 'default' : 'outline'}
              onClick={() => {
                setType('income');
<<<<<<< HEAD
                setCategoryId('');
=======
                setCategoryId(''); // Reset category when type changes
>>>>>>> d56f293ff91bb66bb44c0cdac2a7bc01ed81fe96
              }}
              className={`h-10 ${type === 'income' ? 'bg-green-600 hover:bg-green-700' : 'border-green-200 text-green-600 hover:bg-green-50'}`}
            >
              Income
            </Button>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount *</Label>
            <div className="relative">
<<<<<<< HEAD
              <span className="absolute left-3 top-3 h-4 w-4 text-muted-foreground">₱</span>
=======
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
>>>>>>> d56f293ff91bb66bb44c0cdac2a7bc01ed81fe96
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="pl-10 bg-muted/50"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={categoryId} onValueChange={setCategoryId} required>
              <SelectTrigger className="bg-muted/50">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What was this transaction for?"
              className="bg-muted/50"
              required
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-muted/50"
              required
            />
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full bg-black hover:bg-gray-800 text-white"
            disabled={loading || !amount || !categoryId || !description}
          >
            {loading ? (
              <>
                <LoadingSpinner className="mr-2 h-4 w-4" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add Transaction
              </>
            )}
          </Button>

          {error && (
            <p className="text-sm text-red-600 mt-2">{error}</p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}