"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  Edit, 
  Trash2, 
  DollarSign, 
  Target,
  AlertTriangle,
  CheckCircle,
  X,
  Save,
  Calendar
} from "lucide-react";

export const dynamic = 'force-dynamic';

interface Budget {
  id: string;
  name: string;
  category: string;
  amount: number;
  spent: number;
  period: 'monthly' | 'yearly' | 'weekly';
  startDate: string;
  endDate: string;
  isActive: boolean;
  }

  export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([
    { 
      id: '1', 
      name: 'Food & Dining', 
      category: 'Food', 
      amount: 500, 
      spent: 320, 
      period: 'monthly', 
      startDate: '2024-01-01', 
      endDate: '2024-01-31',
      isActive: true 
    },
    { 
      id: '2', 
      name: 'Transportation', 
      category: 'Transport', 
      amount: 200,
      spent: 180, 
      period: 'monthly', 
      startDate: '2024-01-01', 
      endDate: '2024-01-31',
      isActive: true 
    },
    { 
      id: '3', 
      name: 'Entertainment', 
      category: 'Entertainment', 
      amount: 150, 
      spent: 200, 
      period: 'monthly', 
      startDate: '2024-01-01', 
      endDate: '2024-01-31',
      isActive: true 
    },
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    amount: '',
    period: 'monthly' as Budget['period'],
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    isActive: true
  });

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const totalRemaining = totalBudget - totalSpent;

  const getProgressColor = (spent: number, amount: number) => {
    const percentage = (spent / amount) * 100;
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusIcon = (spent: number, amount: number) => {
    const percentage = (spent / amount) * 100;
    if (percentage >= 90) return AlertTriangle;
    if (percentage >= 75) return AlertTriangle;
    return CheckCircle;
  };

  const getStatusColor = (spent: number, amount: number) => {
    const percentage = (spent / amount) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  const handleAdd = () => {
    if (!formData.name || !formData.category || !formData.amount || !formData.endDate) return;
    
    const newBudget: Budget = {
      id: Date.now().toString(),
      name: formData.name,
      category: formData.category,
      amount: parseFloat(formData.amount),
      spent: 0,
      period: formData.period,
      startDate: formData.startDate,
      endDate: formData.endDate,
      isActive: formData.isActive
    };
    
    setBudgets([...budgets, newBudget]);
    resetForm();
    setIsAdding(false);
  };

  const handleEdit = (id: string) => {
    const budget = budgets.find(b => b.id === id);
    if (budget) {
      setFormData({
        name: budget.name,
        category: budget.category,
        amount: budget.amount.toString(),
        period: budget.period,
        startDate: budget.startDate,
        endDate: budget.endDate,
        isActive: budget.isActive
      });
      setEditingId(id);
    }
  };

  const handleUpdate = () => {
    if (!editingId || !formData.name || !formData.category || !formData.amount || !formData.endDate) return;
    
    setBudgets(budgets.map(b => 
      b.id === editingId 
        ? { ...b, ...formData, amount: parseFloat(formData.amount) }
        : b
    ));
    resetForm();
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this budget?')) {
      setBudgets(budgets.filter(b => b.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      amount: '',
      period: 'monthly',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      isActive: true
    });
  };

  const cancelEdit = () => {
    resetForm();
    setEditingId(null);
    setIsAdding(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Budgets</h1>
        <p className="text-gray-600">Set and track your spending limits</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ${totalBudget.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${totalSpent.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${totalRemaining.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <Card className="mb-6">
        <CardHeader>
            <CardTitle>{editingId ? 'Edit Budget' : 'Add New Budget'}</CardTitle>
        </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Budget Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Food & Dining"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Food">Food & Dining</SelectItem>
                    <SelectItem value="Transport">Transportation</SelectItem>
                    <SelectItem value="Entertainment">Entertainment</SelectItem>
                    <SelectItem value="Shopping">Shopping</SelectItem>
                    <SelectItem value="Utilities">Utilities</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Travel">Travel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Budget Amount</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  placeholder="0.00"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Period</Label>
                <Select value={formData.period} onValueChange={(value: Budget['period']) => setFormData({...formData, period: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                className="rounded"
              />
              <Label htmlFor="isActive">Active budget</Label>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={editingId ? handleUpdate : handleAdd}>
                <Save className="h-4 w-4 mr-2" />
                {editingId ? 'Update' : 'Add'} Budget
              </Button>
              <Button variant="outline" onClick={cancelEdit}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
          </div>
        </CardContent>
      </Card>
      )}

      {/* Add Button */}
      {!isAdding && !editingId && (
        <div className="mb-6">
          <Button onClick={() => setIsAdding(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Budget
          </Button>
        </div>
      )}

      {/* Budgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget) => {
          const progressPercentage = (budget.spent / budget.amount) * 100;
          const StatusIcon = getStatusIcon(budget.spent, budget.amount);
          const statusColor = getStatusColor(budget.spent, budget.amount);
          
          return (
            <Card key={budget.id} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                  <CardTitle className="text-lg">{budget.name}</CardTitle>
                    <CardDescription className="capitalize">
                      {budget.category} • {budget.period}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    {budget.isActive && (
                      <Badge variant="secondary">Active</Badge>
                    )}
                    <StatusIcon className={`h-5 w-5 ${statusColor}`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Spent</span>
                  <span className="font-semibold">${budget.spent.toFixed(2)} / ${budget.amount.toFixed(2)}</span>
                </div>
                
                <div className="space-y-2">
                  <Progress value={Math.min(progressPercentage, 100)} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0%</span>
                    <span>{Math.round(progressPercentage)}%</span>
                    <span>100%</span>
                  </div>
                  </div>
                  
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Remaining:</span>
                  <span className={`font-semibold ${budget.amount - budget.spent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${(budget.amount - budget.spent).toFixed(2)}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Period:</span>
                  <span className="font-medium">
                    {new Date(budget.startDate).toLocaleDateString()} - {new Date(budget.endDate).toLocaleDateString()}
                        </span>
                      </div>
                
                <div className="flex space-x-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(budget.id)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(budget.id)}
                    className="flex-1"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {budgets.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No budgets yet</h3>
            <p className="text-gray-600 mb-4">
              Set up your first budget to start tracking your spending
            </p>
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Budget
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
