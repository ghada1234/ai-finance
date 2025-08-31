"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  Download, 
  Calendar,
  DollarSign,
  BarChart3,
  PieChart,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Brain,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  Target,
  Clock,
  Eye,
  Share2,
  Printer
} from "lucide-react";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar, AreaChart, Area } from "recharts";

interface MonthlyReport {
  month: string;
  year: number;
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  savingsRate: number;
  categoryBreakdown: Array<{
    name: string;
    amount: number;
    percentage: number;
    color: string;
    trend: 'up' | 'down' | 'stable';
  }>;
  topExpenses: Array<{
    description: string;
    amount: number;
    category: string;
    date: string;
  }>;
  aiInsights: Array<{
    id: string;
    type: 'savings' | 'spending' | 'budget' | 'trend' | 'goal';
    title: string;
    description: string;
    impact: 'positive' | 'negative' | 'neutral';
    confidence: number;
    action?: string;
  }>;
  budgetPerformance: Array<{
    category: string;
    budget: number;
    spent: number;
    remaining: number;
    percentage: number;
  }>;
  spendingTrends: Array<{
    week: string;
    amount: number;
  }>;
  goals: Array<{
    name: string;
    target: number;
    current: number;
    percentage: number;
    deadline: string;
  }>;
}

export default function ReportsPage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [reportData, setReportData] = useState<MonthlyReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockReport: MonthlyReport = {
        month: new Date(selectedYear, selectedMonth).toLocaleString('default', { month: 'long' }),
        year: selectedYear,
        totalIncome: 4500,
        totalExpenses: 3200,
        netSavings: 1300,
        savingsRate: 28.9,
        categoryBreakdown: [
          { name: 'Food & Dining', amount: 800, percentage: 25, color: '#FF6B6B', trend: 'up' },
          { name: 'Transportation', amount: 600, percentage: 18.8, color: '#4ECDC4', trend: 'down' },
          { name: 'Entertainment', amount: 400, percentage: 12.5, color: '#96CEB4', trend: 'stable' },
          { name: 'Shopping', amount: 500, percentage: 15.6, color: '#FFE66D', trend: 'up' },
          { name: 'Utilities', amount: 300, percentage: 9.4, color: '#A8E6CF', trend: 'stable' },
          { name: 'Healthcare', amount: 200, percentage: 6.3, color: '#FF8B94', trend: 'down' },
          { name: 'Other', amount: 400, percentage: 12.5, color: '#B8E6B8', trend: 'stable' }
        ],
        topExpenses: [
          { description: 'Grocery Shopping', amount: 250, category: 'Food & Dining', date: '2024-01-15' },
          { description: 'Gas Station', amount: 180, category: 'Transportation', date: '2024-01-12' },
          { description: 'Amazon Purchase', amount: 150, category: 'Shopping', date: '2024-01-10' },
          { description: 'Restaurant', amount: 120, category: 'Food & Dining', date: '2024-01-08' },
          { description: 'Netflix Subscription', amount: 15.99, category: 'Entertainment', date: '2024-01-01' }
        ],
        aiInsights: [
          {
            id: '1',
            type: 'savings',
            title: 'Excellent savings rate achieved!',
            description: 'Your 28.9% savings rate is above the recommended 20% and shows strong financial discipline.',
            impact: 'positive',
            confidence: 95
          },
          {
            id: '2',
            type: 'spending',
            title: 'Food spending increased 15%',
            description: 'Your dining out expenses have increased significantly. Consider meal planning to reduce costs.',
            impact: 'negative',
            confidence: 88,
            action: 'Review dining habits and set a weekly food budget'
          },
          {
            id: '3',
            type: 'budget',
            title: 'Transportation budget under control',
            description: 'Great job staying within your transportation budget! You saved 20% compared to last month.',
            impact: 'positive',
            confidence: 92
          },
          {
            id: '4',
            type: 'trend',
            title: 'Consistent spending pattern detected',
            description: 'Your spending has been consistent over the past 3 months, indicating good financial habits.',
            impact: 'positive',
            confidence: 87
          },
          {
            id: '5',
            type: 'goal',
            title: 'Emergency fund goal on track',
            description: 'You\'re 75% towards your emergency fund goal. Keep up the great work!',
            impact: 'positive',
            confidence: 90
          }
        ],
        budgetPerformance: [
          { category: 'Food & Dining', budget: 1000, spent: 800, remaining: 200, percentage: 80 },
          { category: 'Transportation', budget: 800, spent: 600, remaining: 200, percentage: 75 },
          { category: 'Entertainment', budget: 500, spent: 400, remaining: 100, percentage: 80 },
          { category: 'Shopping', budget: 600, spent: 500, remaining: 100, percentage: 83 }
        ],
        spendingTrends: [
          { week: 'Week 1', amount: 800 },
          { week: 'Week 2', amount: 750 },
          { week: 'Week 3', amount: 850 },
          { week: 'Week 4', amount: 800 }
        ],
        goals: [
          { name: 'Emergency Fund', target: 10000, current: 7500, percentage: 75, deadline: '2024-06-30' },
          { name: 'Vacation Fund', target: 3000, current: 1800, percentage: 60, deadline: '2024-08-15' },
          { name: 'New Car Fund', target: 15000, current: 5000, percentage: 33, deadline: '2025-03-01' }
        ]
      };
      
      setReportData(mockReport);
      setLoading(false);
    };

    fetchReportData();
  }, [selectedMonth, selectedYear]);

  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to access reports</h1>
          <p className="text-gray-600">You need to be authenticated to view your financial reports.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Generating your monthly report...</p>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No report data available</h1>
          <p className="text-gray-600">Start adding transactions to generate your first report.</p>
        </div>
      </div>
    );
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowUpRight className="h-4 w-4 text-red-600" />;
      case 'down':
        return <ArrowDownRight className="h-4 w-4 text-green-600" />;
      default:
        return <TrendingUp className="h-4 w-4 text-blue-600" />;
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'negative':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Target className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <FileText className="h-8 w-8 text-blue-600" />
            Monthly Report
          </h1>
          <p className="text-gray-600">
            AI-generated insights and analysis for {reportData.month} {reportData.year}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => (
                  <SelectItem key={i} value={i.toString()}>
                    {new Date(2024, i).toLocaleString('default', { month: 'long' })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${reportData.totalIncome.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${reportData.totalExpenses.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Savings</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ${reportData.netSavings.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {reportData.savingsRate}% of income
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Confidence</CardTitle>
            <Sparkles className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(reportData.aiInsights.reduce((sum, insight) => sum + insight.confidence, 0) / reportData.aiInsights.length)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Insight accuracy
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="breakdown">Category Breakdown</TabsTrigger>
          <TabsTrigger value="trends">Spending Trends</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Budget Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Budget Performance</CardTitle>
                <CardDescription>How well you stayed within your budgets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportData.budgetPerformance.map((budget, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{budget.category}</span>
                        <span className="text-gray-600">
                          ${budget.spent} / ${budget.budget}
                        </span>
                      </div>
                      <Progress 
                        value={Math.min(budget.percentage, 100)} 
                        className={`h-2 ${
                          budget.percentage > 90 ? 'bg-red-100' : 
                          budget.percentage > 75 ? 'bg-yellow-100' : 'bg-green-100'
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Expenses */}
            <Card>
              <CardHeader>
                <CardTitle>Top Expenses</CardTitle>
                <CardDescription>Your largest transactions this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reportData.topExpenses.map((expense, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{expense.description}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {expense.category}
                          </Badge>
                          <span className="text-xs text-gray-500">{expense.date}</span>
                        </div>
                      </div>
                      <span className="font-semibold text-red-600">
                        -${expense.amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reportData.aiInsights.map((insight) => (
              <Card key={insight.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getImpactIcon(insight.impact)}
                      <CardTitle className="text-lg">{insight.title}</CardTitle>
                    </div>
                    <Badge variant="secondary">{insight.confidence}%</Badge>
                  </div>
                  <CardDescription>{insight.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {insight.action && (
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <Lightbulb className="h-4 w-4" />
                      <span>{insight.action}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="breakdown" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
              <CardDescription>How your money was distributed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={reportData.categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : '0'}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                    >
                      {reportData.categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                  </RechartsPieChart>
                </ResponsiveContainer>
                
                <div className="space-y-4">
                  {reportData.categoryBreakdown.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="font-medium">{category.name}</span>
                        {getTrendIcon(category.trend)}
                      </div>
                      <div className="text-right">
                        <span className="font-semibold">${category.amount.toLocaleString()}</span>
                        <p className="text-xs text-gray-500">{category.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Spending Trends</CardTitle>
              <CardDescription>Track your spending patterns throughout the month</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={reportData.spendingTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#3B82F6" 
                    fill="#3B82F6" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Financial Goals Progress</CardTitle>
              <CardDescription>Track your progress towards financial goals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {reportData.goals.map((goal, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{goal.name}</h3>
                        <p className="text-sm text-gray-600">
                          Due: {new Date(goal.deadline).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">{goal.percentage}% complete</p>
                      </div>
                    </div>
                    <Progress value={goal.percentage} className="h-3" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
