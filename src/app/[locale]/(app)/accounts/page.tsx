"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Edit, 
  Trash2, 
  DollarSign, 
  CreditCard, 
  PiggyBank,
  Wallet, 
  Building2,
  X,
  Save
} from "lucide-react";

export const dynamic = 'force-static';

interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment' | 'cash';
  balance: number;
  currency: string;
  isDefault: boolean;
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([
    { id: '1', name: 'Main Checking', type: 'checking', balance: 2500.50, currency: 'USD', isDefault: true },
    { id: '2', name: 'Savings Account', type: 'savings', balance: 10000.00, currency: 'USD', isDefault: false },
    { id: '3', name: 'Credit Card', type: 'credit', balance: -450.25, currency: 'USD', isDefault: false },
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'checking' as Account['type'],
    balance: '',
    currency: 'USD',
    isDefault: false
  });

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  const getAccountIcon = (type: Account['type']) => {
    switch (type) {
      case 'checking': return CreditCard;
      case 'savings': return PiggyBank;
      case 'credit': return CreditCard;
      case 'investment': return Building2;
      case 'cash': return Wallet;
      default: return CreditCard;
    }
  };

  const getAccountColor = (type: Account['type']) => {
    switch (type) {
      case 'checking': return 'bg-blue-100 text-blue-800';
      case 'savings': return 'bg-green-100 text-green-800';
      case 'credit': return 'bg-purple-100 text-purple-800';
      case 'investment': return 'bg-indigo-100 text-indigo-800';
      case 'cash': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAdd = () => {
    if (!formData.name || !formData.balance) return;
    
    const newAccount: Account = {
      id: Date.now().toString(),
      name: formData.name,
      type: formData.type,
      balance: parseFloat(formData.balance),
      currency: formData.currency,
      isDefault: formData.isDefault
    };
    
    // If this account is set as default, unset others
    if (formData.isDefault) {
      setAccounts(accounts.map(acc => ({ ...acc, isDefault: false })));
    }
    
    setAccounts([...accounts, newAccount]);
    resetForm();
    setIsAdding(false);
  };

  const handleEdit = (id: string) => {
    const account = accounts.find(a => a.id === id);
    if (account) {
      setFormData({
        name: account.name,
        type: account.type,
        balance: account.balance.toString(),
        currency: account.currency,
        isDefault: account.isDefault
      });
      setEditingId(id);
    }
  };

  const handleUpdate = () => {
    if (!editingId || !formData.name || !formData.balance) return;
    
    // If this account is set as default, unset others
    if (formData.isDefault) {
      setAccounts(accounts.map(acc => ({ ...acc, isDefault: false })));
    }
    
    setAccounts(accounts.map(a => 
      a.id === editingId 
        ? { ...a, ...formData, balance: parseFloat(formData.balance) }
        : a
    ));
    resetForm();
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this account?')) {
      setAccounts(accounts.filter(a => a.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'checking',
      balance: '',
      currency: 'USD',
      isDefault: false
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Accounts</h1>
          <p className="text-gray-600">Manage your financial accounts</p>
      </div>

      {/* Total Balance Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Total Balance</CardTitle>
          <CardDescription>Across all your accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`text-3xl font-bold ${totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${totalBalance.toFixed(2)}
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Account' : 'Add New Account'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Account Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Main Checking"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Account Type</Label>
                <Select value={formData.type} onValueChange={(value: Account['type']) => setFormData({...formData, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checking">Checking Account</SelectItem>
                    <SelectItem value="savings">Savings Account</SelectItem>
                    <SelectItem value="credit">Credit Card</SelectItem>
                    <SelectItem value="investment">Investment Account</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Balance</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.balance}
                  onChange={(e) => setFormData({...formData, balance: e.target.value})}
                  placeholder="0.00"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select value={formData.currency} onValueChange={(value) => setFormData({...formData, currency: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={formData.isDefault}
                onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
                className="rounded"
              />
              <Label htmlFor="isDefault">Set as default account</Label>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={editingId ? handleUpdate : handleAdd}>
                <Save className="h-4 w-4 mr-2" />
                {editingId ? 'Update' : 'Add'} Account
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
            Add Account
          </Button>
        </div>
      )}

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => {
          const IconComponent = getAccountIcon(account.type);
          const colorClass = getAccountColor(account.type);
          
          return (
            <Card key={account.id} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{account.name}</CardTitle>
                      <CardDescription className="capitalize">
                        {account.type.replace('_', ' ')}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">
                  ${account.balance.toFixed(2)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{account.currency}</span>
                  {account.isDefault && (
                    <Badge variant="secondary">Default</Badge>
                  )}
                </div>
                
                <div className="flex space-x-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(account.id)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(account.id)}
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
      {accounts.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No accounts yet</h3>
            <p className="text-gray-600 mb-4">
              Get started by adding your first financial account
            </p>
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Account
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
