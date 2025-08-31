"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  Target,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  X,
  Calendar,
  DollarSign,
  Tag
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { useBudgets } from "@/hooks/useApi";

export default function BudgetsPage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const [isCreatingBudget, setIsCreatingBudget] = useState(false);
  const [budgetForm, setBudgetForm] = useState({
    name: "",
    amount: "",
    period: "MONTHLY",
    categoryId: "",
    description: "",
    startDate: "",
    endDate: "",
    isActive: true,
    alertThreshold: "80",
  });

  const { data: budgets, loading, error, refetch } = useBudgets();

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
          <h1 className="text-2xl font-bold mb-4">Please sign in to access your budgets</h1>
          <p className="text-gray-600">You need to be authenticated to view your budget data.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading budgets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Error loading budgets</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={refetch}>Try Again</Button>
        </div>
      </div>
    );
  }

  // Mock budget data - in a real app, this would come from an API
  const mockBudgets = [
    {
      id: 1,
      name: "Food & Dining",
      amount: 600,
      spent: 450,
      period: "MONTHLY",
      startDate: "2024-01-01",
      endDate: "2024-01-31",
      isActive: true,
    },
    {
      id: 2,
      name: "Transportation",
      amount: 300,
      spent: 200,
      period: "MONTHLY",
      startDate: "2024-01-01",
      endDate: "2024-01-31",
      isActive: true,
    },
    {
      id: 3,
      name: "Entertainment",
      amount: 200,
      spent: 150,
      period: "MONTHLY",
      startDate: "2024-01-01",
      endDate: "2024-01-31",
      isActive: true,
    },
    {
      id: 4,
      name: "Shopping",
      amount: 400,
      spent: 380,
      period: "MONTHLY",
      startDate: "2024-01-01",
      endDate: "2024-01-31",
      isActive: true,
    },
  ];

  // Mock categories for the form
  const categories = [
    { id: "1", name: "Food & Dining", color: "#FF6B6B" },
    { id: "2", name: "Transportation", color: "#4ECDC4" },
    { id: "3", name: "Entertainment", color: "#96CEB4" },
    { id: "4", name: "Shopping", color: "#FFE66D" },
    { id: "5", name: "Utilities", color: "#A8E6CF" },
    { id: "6", name: "Healthcare", color: "#FF8B94" },
    { id: "7", name: "Education", color: "#B8E6B8" },
    { id: "8", name: "Travel", color: "#FFB3BA" },
  ];

  const handleCreateBudget = () => {
    // TODO: Implement API call to create budget
    console.log("Creating budget:", budgetForm);
    
    // Reset form and close modal
    setBudgetForm({
      name: "",
      amount: "",
      period: "MONTHLY",
      categoryId: "",
      description: "",
      startDate: "",
      endDate: "",
      isActive: true,
      alertThreshold: "80",
    });
    setIsCreatingBudget(false);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setBudgetForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

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
          <h1 className="text-2xl font-bold mb-4">Please sign in to access your budgets</h1>
          <p className="text-gray-600">You need to be authenticated to view your budget data.</p>
        </div>
      </div>
    );
  }

  const budgetsData = budgets || [];
  const totalBudget = budgetsData.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = budgetsData.reduce((sum, budget) => sum + budget.spent, 0);
  const totalRemaining = totalBudget - totalSpent;
  const overallProgress = (totalSpent / totalBudget) * 100;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Budgets</h1>
          <p className="text-gray-600">Track your spending against monthly budgets</p>
        </div>
        <Button onClick={() => setIsCreatingBudget(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Budget
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBudget.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${totalSpent.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {overallProgress.toFixed(1)}% of budget
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${Math.abs(totalRemaining).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalRemaining >= 0 ? 'Available' : 'Over budget'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Overall Budget Progress</CardTitle>
          <CardDescription>
            Your spending across all categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{overallProgress.toFixed(1)}%</span>
            </div>
            <Progress 
              value={Math.min(overallProgress, 100)} 
              className={`h-3 ${
                overallProgress > 90 ? 'bg-red-100' : 
                overallProgress > 75 ? 'bg-yellow-100' : 'bg-green-100'
              }`}
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>${totalSpent.toLocaleString()} spent</span>
              <span>${totalBudget.toLocaleString()} budget</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {budgetsData.map((budget) => {
          const percentage = (budget.spent / budget.amount) * 100;
          const remaining = budget.amount - budget.spent;
          
          return (
            <Card key={budget.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{budget.name}</CardTitle>
                  <Badge variant={budget.isActive ? "default" : "secondary"}>
                    {budget.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <CardDescription>
                  {budget.period.toLowerCase()} budget
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className={`font-semibold ${
                      percentage > 90 ? 'text-red-600' : 
                      percentage > 75 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                  
                  <Progress 
                    value={Math.min(percentage, 100)} 
                    className={`h-2 ${
                      percentage > 90 ? 'bg-red-100' : 
                      percentage > 75 ? 'bg-yellow-100' : 'bg-green-100'
                    }`}
                  />
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Budget</p>
                      <p className="font-semibold">${budget.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Spent</p>
                      <p className="font-semibold text-red-600">${budget.spent.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Remaining</p>
                      <p className={`font-semibold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${Math.abs(remaining).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Status</p>
                      <div className="flex items-center gap-1">
                        {percentage > 90 ? (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        ) : percentage > 75 ? (
                          <Target className="h-4 w-4 text-yellow-600" />
                        ) : (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        )}
                        <span className={`text-xs ${
                          percentage > 90 ? 'text-red-600' : 
                          percentage > 75 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {percentage > 90 ? 'Warning' : 
                           percentage > 75 ? 'Caution' : 'On Track'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {budgetsData.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No budgets yet</h3>
            <p className="text-gray-600 mb-4">
              Create your first budget to start tracking your spending
            </p>
            <Button onClick={() => setIsCreatingBudget(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Budget
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Budget Modal */}
      {isCreatingBudget && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="text-xl">Create New Budget</CardTitle>
              <CardDescription>
                Set up a new budget to track your spending
              </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCreatingBudget(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Basic Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget-name">Budget Name *</Label>
                    <Input
                      id="budget-name"
                      placeholder="e.g., Food & Dining"
                      value={budgetForm.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="budget-amount">Budget Amount *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="budget-amount"
                        type="number"
                        placeholder="0.00"
                        value={budgetForm.amount}
                        onChange={(e) => handleInputChange("amount", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget-description">Description</Label>
                  <Textarea
                    id="budget-description"
                    placeholder="Optional description for this budget..."
                    value={budgetForm.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              {/* Category and Period */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Category & Period
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget-category">Category</Label>
                    <Select
                      value={budgetForm.categoryId}
                      onValueChange={(value) => handleInputChange("categoryId", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="budget-period">Budget Period *</Label>
                    <Select
                      value={budgetForm.period}
                      onValueChange={(value) => handleInputChange("period", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="WEEKLY">Weekly</SelectItem>
                        <SelectItem value="MONTHLY">Monthly</SelectItem>
                        <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                        <SelectItem value="YEARLY">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Date Range */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Date Range
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget-start-date">Start Date</Label>
                    <Input
                      id="budget-start-date"
                      type="date"
                      value={budgetForm.startDate}
                      onChange={(e) => handleInputChange("startDate", e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="budget-end-date">End Date</Label>
                    <Input
                      id="budget-end-date"
                      type="date"
                      value={budgetForm.endDate}
                      onChange={(e) => handleInputChange("endDate", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Settings
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label htmlFor="budget-active">Active Budget</Label>
                      <p className="text-sm text-gray-600">
                        Enable this budget for tracking
                      </p>
                    </div>
                    <Switch
                      id="budget-active"
                      checked={budgetForm.isActive}
                      onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="budget-alert">Alert Threshold (%)</Label>
                    <Select
                      value={budgetForm.alertThreshold}
                      onValueChange={(value) => handleInputChange("alertThreshold", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="70">70%</SelectItem>
                        <SelectItem value="80">80%</SelectItem>
                        <SelectItem value="90">90%</SelectItem>
                        <SelectItem value="95">95%</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-600">
                      Get notified when you reach this percentage of your budget
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-4 border-t">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setIsCreatingBudget(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1"
                  onClick={handleCreateBudget}
                  disabled={!budgetForm.name || !budgetForm.amount}
                >
                  Create Budget
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
