import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { TrendingUp, PieChart as PieChartIcon } from "lucide-react";
import { useApi } from "../hooks/useApi";
import { transactionService } from "../services/transactionService";
import { LoadingCard } from "./LoadingSpinner";
import { ErrorMessage } from "./ErrorBoundary";

interface CategoryStat {
  category_id?: number;
  category_name?: string;
  category?: string;
  total?: number | string;
  total_amount?: number | string;
  amount?: number | string;
  color?: string;
  category_color?: string;
  transaction_count?: number;
  count?: number;
}

interface MonthlyStat {
  month?: string;
  income?: number | string;
  expenses?: number | string;
  net?: number | string;
}

// Recharts payload item shape used in tooltips
type RechartsPayloadItem = {
  value?: number | string;
  dataKey?: string;
  color?: string;
  payload?: any;
};

export function SpendingChart({ categories }: { categories?: any[] }) {
  const { data: categoryStats, loading: categoryLoading, error: categoryError, refetch: refetchCategoryStats } = useApi<CategoryStat[]>(
    () => transactionService.getCategoryStats('expense'),
    []
  );

  const { data: monthlyStats, loading: monthlyLoading, error: monthlyError, refetch: refetchMonthlyStats } = useApi<MonthlyStat[]>(
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
    const err = (categoryError || monthlyError) ?? 'Failed to load chart data';
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ErrorMessage
          error={err}
          onRetry={() => {
            refetchCategoryStats?.();
            refetchMonthlyStats?.();
          }}
        />
        <ErrorMessage
          error={err}
          onRetry={() => {
            refetchCategoryStats?.();
            refetchMonthlyStats?.();
          }}
        />
      </div>
    );
  }

  const pieChartData = (categoryStats || [])
    .map((stat) => {
      // Backend may return different field names; prefer 'total' but fallback to older keys
      const rawValue = stat?.total ?? stat?.total_amount ?? stat?.amount ?? 0;
      const value = Number(rawValue);
      return {
        name: stat?.category_name ?? stat?.category ?? 'Uncategorized',
        value: isFinite(value) ? value : 0,
        color: stat?.color ?? stat?.category_color ?? '#cbd5e1',
        count: Number(stat?.transaction_count ?? stat?.count ?? 0) || 0,
      };
    })
    // remove zero / invalid slices so the pie doesn't show NaN or degenerate slices
    .filter((d) => d.value > 0);

  const barChartData = (monthlyStats || []).map((stat: MonthlyStat) => ({
    month: (() => {
      // Try to produce a short month label from the returned month value.
      // Handles formats like '2025-08-01', '2025-08' or already short names.
      try {
        if (!stat?.month) return '';
        const maybeDate = new Date(String(stat.month));
        if (!isNaN(maybeDate.getTime())) {
          return maybeDate.toLocaleString(undefined, { month: 'short' });
        }
        if (typeof stat.month === 'string') {
          // try YYYY-MM or YYYY-MM-DD
          const parts = stat.month.split('-');
          if (parts.length >= 2) {
            // convert month number to name
            const monthIndex = Number(parts[1]) - 1;
            if (!Number.isNaN(monthIndex) && monthIndex >= 0 && monthIndex < 12) {
              return new Date(2000, monthIndex, 1).toLocaleString(undefined, { month: 'short' });
            }
            return parts[1];
          }
          return stat.month;
        }
        return String(stat.month);
      } catch (e) {
        return String(stat.month || '');
      }
    })(),
    income: Number(stat.income) || 0,
    expenses: Number(stat.expenses) || 0,
    net: Number(stat.net) || 0
  })) || [];

  const CustomTooltip: React.FC<{ active?: boolean; payload?: RechartsPayloadItem[]; label?: string | number }> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => {
            const val = Number(entry?.value) || 0;
            return (
              <p key={index} style={{ color: entry?.color }}>
                {entry?.dataKey}: ${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  const PieTooltip: React.FC<{ active?: boolean; payload?: any[] }> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload ?? {};
      const amount = Number(data?.value) || 0;
      return (
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{data?.name}</p>
          <p style={{ color: data?.color }}>
            Amount: ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-muted-foreground">
            {data?.count ?? 0} transaction{(data?.count ?? 0) !== 1 ? 's' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Category Spending Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5" />
            Spending by Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pieChartData.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No expense data available</p>
              {/* Debug: show raw categoryStats so it's easier to see what's returned from the API */}
              <details className="mt-4 text-left text-xs text-muted-foreground">
                <summary className="cursor-pointer">View raw category stats (debug)</summary>
                <pre className="mt-2 p-2 bg-muted/50 rounded text-xs overflow-auto" style={{maxHeight: 240}}>
{JSON.stringify(categoryStats || [], null, 2)}
                </pre>
              </details>
            </div>
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${isFinite(percent) ? (percent * 100).toFixed(0) + '%' : ''}`
                    }
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
          {pieChartData.length > 0 && (
            <div className="mt-4 space-y-2">
              {pieChartData.map((entry, index) => {
                const v = Number(entry.value) || 0;
                return (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: entry.color }}
                      />
                      <span>{entry.name}</span>
                    </div>
                    <span className="font-medium">${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Monthly Trends Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Monthly Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          {barChartData.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No monthly data available</p>
            </div>
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
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
