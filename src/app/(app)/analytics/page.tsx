"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  Brain, 
  Lightbulb, 
  AlertTriangle,
  Target,
  DollarSign,
  Calendar,
  BarChart3,
  PieChart,
  LineChart,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Eye,
  Target as TargetIcon,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar } from "recharts";

interface AnalyticsData {
  spendingTrends: Array<{
    month: string;
    amount: number;
    category: string;
  }>;
  categoryBreakdown: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  insights: Array<{
    id: string;
    type: 'savings' | 'spending' | 'budget' | 'trend';
    title: string;
    description: string;
    impact: 'positive' | 'negative' | 'neutral';
    confidence: number;
    action?: string;
  }>;
  recommendations: Array<{
    id: string;
    title: string;
    description: string;
    potentialSavings: number;
    difficulty: 'easy' | 'medium' | 'hard';
    category: string;
  }>;
  monthlyComparison: {
    currentMonth: number;
    previousMonth: number;
    change: number;
    changePercentage: number;
  };
}

export default function AnalyticsPage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch analytics data
    const fetchAnalyticsData = async () => {
      setLoading(true);
      
      // Simulate loading time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockData: AnalyticsData = {
        spendingTrends: [
          { month: 'Jan', amount: 3200, category: 'Total' },
          { month: 'Feb', amount: 3400, category: 'Total' },
          { month: 'Mar', amount: 3100, category: 'Total' },
          { month: 'Apr', amount: 3600, category: 'Total' },
          { month: 'May', amount: 3300, category: 'Total' },
          { month: 'Jun', amount: 3500, category: 'Total' },
        ],
        categoryBreakdown: [
          { name: 'Food & Dining', value: 1200, color: '#FF6B6B' },
          { name: 'Transportation', value: 800, color: '#4ECDC4' },
          { name: 'Entertainment', value: 600, color: '#96CEB4' },
          { name: 'Shopping', value: 500, color: '#FFE66D' },
          { name: 'Utilities', value: 400, color: '#A8E6CF' },
        ],
        insights: [
          {
            id: '1',
            type: 'spending',
            title: 'Restaurant spending increased 25%',
            description: 'Your dining out expenses have increased significantly this month compared to last month.',
            impact: 'negative',
            confidence: 92,
            action: 'Consider cooking more meals at home'
          },
          {
            id: '2',
            type: 'savings',
            title: 'Great job on transportation savings!',
            description: 'You saved 15% on transportation costs by using public transit more frequently.',
            impact: 'positive',
            confidence: 88
          },
          {
            id: '3',
            type: 'budget',
            title: 'Entertainment budget at 75%',
            description: 'You\'re approaching your entertainment budget limit. Consider reducing non-essential expenses.',
            impact: 'neutral',
            confidence: 95,
            action: 'Review upcoming entertainment expenses'
          },
          {
            id: '4',
            type: 'trend',
            title: 'Consistent savings pattern detected',
            description: 'Your savings rate has been consistently above 20% for the past 3 months.',
            impact: 'positive',
            confidence: 97
          }
        ],
        recommendations: [
          {
            id: '1',
            title: 'Switch to a cheaper phone plan',
            description: 'You could save $30/month by switching to a different carrier with similar coverage.',
            potentialSavings: 360,
            difficulty: 'easy',
            category: 'Utilities'
          },
          {
            id: '2',
            title: 'Cancel unused subscriptions',
            description: 'We found 3 subscriptions you haven\'t used in the last 30 days.',
            potentialSavings: 45,
            difficulty: 'easy',
            category: 'Entertainment'
          },
          {
            id: '3',
            title: 'Optimize grocery shopping',
            description: 'Buying groceries in bulk and using coupons could save you 15% on food costs.',
            potentialSavings: 180,
            difficulty: 'medium',
            category: 'Food & Dining'
          },
          {
            id: '4',
            title: 'Negotiate insurance rates',
            description: 'Your insurance rates are 20% higher than average. Consider shopping around.',
            potentialSavings: 240,
            difficulty: 'hard',
            category: 'Insurance'
          }
        ],
        monthlyComparison: {
          currentMonth: 3500,
          previousMonth: 3300,
          change: 200,
          changePercentage: 6.1
        }
      };
      
      setAnalyticsData(mockData);
      setLoading(false);
    };

    fetchAnalyticsData();
  }, []);

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
          <h1 className="text-2xl font-bold mb-4">Please sign in to access analytics</h1>
          <p className="text-gray-600">You need to be authenticated to view your financial insights.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Analyzing your financial data...</p>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No data available</h1>
          <p className="text-gray-600">Start adding transactions to see your analytics.</p>
        </div>
      </div>
    );
  }

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive':
        return <ArrowUpRight className="h-4 w-4 text-green-600" />;
      case 'negative':
        return <ArrowDownRight className="h-4 w-4 text-red-600" />;
      default:
        return <Target className="h-4 w-4 text-blue-600" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Brain className="h-8 w-8 text-blue-600" />
          Smart Analytics
        </h1>
        <p className="text-gray-600">
          AI-powered insights and recommendations to help you make better financial decisions
        </p>
      </div>

      {/* Monthly Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Month Spending</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analyticsData.monthlyComparison.currentMonth.toLocaleString()}</div>
            <div className="flex items-center text-sm text-muted-foreground">
              {analyticsData.monthlyComparison.changePercentage > 0 ? (
                <ArrowUpRight className="h-4 w-4 text-red-600 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-green-600 mr-1" />
              )}
              {Math.abs(analyticsData.monthlyComparison.changePercentage)}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Potential Savings</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${analyticsData.recommendations.reduce((sum, rec) => sum + rec.potentialSavings, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              From {analyticsData.recommendations.length} recommendations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Confidence</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(analyticsData.insights.reduce((sum, insight) => sum + insight.confidence, 0) / analyticsData.insights.length)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Average insight confidence
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="insights" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="trends">Spending Trends</TabsTrigger>
          <TabsTrigger value="breakdown">Category Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analyticsData.insights.map((insight) => (
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

        <TabsContent value="recommendations" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analyticsData.recommendations.map((recommendation) => (
              <Card key={recommendation.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{recommendation.title}</CardTitle>
                    <Badge className={getDifficultyColor(recommendation.difficulty)}>
                      {recommendation.difficulty}
                    </Badge>
                  </div>
                  <CardDescription>{recommendation.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Potential Annual Savings:</span>
                      <span className="font-semibold text-green-600">
                        ${recommendation.potentialSavings}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Category:</span>
                      <Badge variant="outline">{recommendation.category}</Badge>
                    </div>
                    <Button className="w-full" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>6-Month Spending Trend</CardTitle>
              <CardDescription>Track your spending patterns over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsLineChart data={analyticsData.spendingTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breakdown" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
              <CardDescription>See how your money is distributed across categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={analyticsData.categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : '0'}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analyticsData.categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                  </RechartsPieChart>
                </ResponsiveContainer>
                
                <div className="space-y-4">
                  {analyticsData.categoryBreakdown.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <span className="font-semibold">${category.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
