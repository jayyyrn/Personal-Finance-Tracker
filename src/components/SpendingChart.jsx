import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { TrendingUp, PieChart as PieChartIcon } from "lucide-react";
import { Category } from "../types/api";
import { useApi } from "../hooks/useApi";
import { transactionService } from "../services/transactionService";
import { LoadingCard } from "./LoadingSpinner";
import { ErrorMessage } from "./ErrorBoundary";

export function SpendingChart({ categories }) {
  const { data: categoryStats, loading: categoryLoading, error: categoryError } = useApi(
    () => transactionService.getCategoryStats('expense'),
    []
  );

  const { data: monthlyStats, loading: monthlyLoading, error: monthlyError } = useApi(
    () => transactionService.getMonthlyStats(6),
    []
  );

  if (categoryLoading || monthlyLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LoadingCard />
        <LoadingCard />
      </div>
    );
  }

  if (categoryError || monthlyError) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ErrorMessage error={categoryError || monthlyError || 'Failed to load chart data'} />
        <ErrorMessage error={categoryError || monthlyError || 'Failed to load chart data'} />
      </div>
    );
  }

  // FIXED: Handle both field name variations from mock data
  const pieChartData = categoryStats?.map(stat => ({
    name: stat.category_name,
    value: parseFloat(stat.total_amount || stat.total || 0), // Handle both field names
    color: stat.category_color || stat.color || '#6b7280',   // Handle both field names
    count: stat.transaction_count || 1                       // Add default count
  })) || [];

  // FIXED: Handle month formatting and ensure numbers are parsed correctly
  const barChartData = monthlyStats?.map(stat => ({
    month: typeof stat.month === 'string' ? stat.month.substring(0, 3) : 'Jan',
    income: parseFloat(stat.income || 0),
    expenses: parseFloat(stat.expenses || 0),
    net: parseFloat(stat.net || (parseFloat(stat.income || 0) - parseFloat(stat.expenses || 0)))
  })) || [];

  // Debug: Log the data to see what's actually coming through
  console.log('Category Stats:', categoryStats);
  console.log('Pie Chart Data:', pieChartData);
  console.log('Monthly Stats:', monthlyStats);
  console.log('Bar Chart Data:', barChartData);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey}: ₱{entry.value?.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p style={{ color: data.color }}>
            Amount: ₱{data.value?.toFixed(2)}
          </p>
          <p className="text-sm text-muted-foreground">
            {data.count} transaction{data.count !== 1 ? 's' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
      {/* Category Spending Pie Chart */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5" />
            Spending by Category
          </CardTitle>
        </CardHeader>
        <CardContent className="w-full">
          {pieChartData.length === 0 || pieChartData.every(item => item.value === 0) ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No expense data available</p>
            </div>
          ) : (
            <div className="h-80 w-full min-h-[320px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
          
          {/* Legend */}
          {pieChartData.length > 0 && !pieChartData.every(item => item.value === 0) && (
            <div className="mt-4 space-y-2">
              {pieChartData.map((entry, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: entry.color }}
                    />
                    <span>{entry.name}</span>
                  </div>
                  <span className="font-medium">₱{entry.value.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Monthly Trends Bar Chart */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Monthly Trends
          </CardTitle>
        </CardHeader>
        <CardContent className="w-full">
          {barChartData.length === 0 || barChartData.every(item => item.income === 0 && item.expenses === 0) ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No monthly data available</p>
            </div>
          ) : (
            <div className="h-80 w-full min-h-[320px]">
              <ResponsiveContainer width="100%" height="100%" minWidth={300} minHeight={300}>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="income" fill="#22c55e" name="Income" />
                  <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                  <Bar dataKey="net" fill="#3b82f6" name="Net" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}