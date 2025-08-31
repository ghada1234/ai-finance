"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  CreditCard, 
  Wallet, 
  PiggyBank, 
  Building2,
  MoreHorizontal,
  Edit,
  Trash2,
  X,
  DollarSign,
  Tag,
  AlertTriangle
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useAccounts } from "@/hooks/useApi";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const accountTypeIcons = {
  CHECKING: CreditCard,
  SAVINGS: PiggyBank,
  CREDIT_CARD: CreditCard,
  CASH: Wallet,
  INVESTMENT: Building2,
  OTHER: Building2,
};

const accountTypeColors = {
  CHECKING: "bg-blue-100 text-blue-800",
  SAVINGS: "bg-green-100 text-green-800",
  CREDIT_CARD: "bg-purple-100 text-purple-800",
  CASH: "bg-yellow-100 text-yellow-800",
  INVESTMENT: "bg-indigo-100 text-indigo-800",
  OTHER: "bg-gray-100 text-gray-800",
};

export default function AccountsPage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const { data: accounts, loading, error, refetch } = useAccounts();
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

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
          <h1 className="text-2xl font-bold mb-4">Please sign in to access your accounts</h1>
          <p className="text-gray-600">You need to be authenticated to view your financial accounts.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading accounts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Error loading accounts</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={refetch}>Try Again</Button>
        </div>
      </div>
    );
  }

  const totalBalance = accounts?.reduce((sum, account) => sum + Number(account.balance), 0) || 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Accounts</h1>
          <p className="text-gray-600">Manage your financial accounts</p>
        </div>
        <Button onClick={() => setIsCreatingAccount(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Account
        </Button>
      </div>

      {/* Total Balance Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Total Balance</CardTitle>
          <CardDescription>Across all your accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">
            ${totalBalance.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts?.map((account) => {
          const IconComponent = accountTypeIcons[account.type as keyof typeof accountTypeIcons] || Building2;
          const colorClass = accountTypeColors[account.type as keyof typeof accountTypeColors] || "bg-gray-100 text-gray-800";
          
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
                        {account.type.toLowerCase().replace('_', ' ')}
                      </CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">
                  ${Number(account.balance).toLocaleString()}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{account.currency}</span>
                  {account.isDefault && (
                    <Badge variant="secondary">Default</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {accounts?.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No accounts yet</h3>
            <p className="text-gray-600 mb-4">
              Get started by adding your first financial account
            </p>
            <Button onClick={() => setIsCreatingAccount(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Account
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Account Modal */}
      {isCreatingAccount && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="text-xl">Add New Account</CardTitle>
              <CardDescription>
                Create a new financial account to track your money
              </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCreatingAccount(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Account Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="account-name">Account Name *</Label>
                    <Input
                      id="account-name"
                      placeholder="e.g., Main Checking"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="account-type">Account Type *</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CHECKING">Checking Account</SelectItem>
                        <SelectItem value="SAVINGS">Savings Account</SelectItem>
                        <SelectItem value="CREDIT_CARD">Credit Card</SelectItem>
                        <SelectItem value="CASH">Cash</SelectItem>
                        <SelectItem value="INVESTMENT">Investment Account</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="account-balance">Initial Balance</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="account-balance"
                        type="number"
                        placeholder="0.00"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="account-currency">Currency</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                        <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                        <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Account Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Account Settings
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="account-color">Account Color</Label>
                    <div className="grid grid-cols-6 gap-2">
                      {[
                        "#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444", "#6B7280",
                        "#EC4899", "#14B8A6", "#F97316", "#84CC16", "#A855F7", "#06B6D4"
                      ].map((color) => (
                        <button
                          key={color}
                          className="w-8 h-8 rounded-full border-2 border-gray-200 hover:border-gray-400 transition-colors"
                          style={{ backgroundColor: color }}
                          type="button"
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="account-icon">Account Icon</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select icon" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CreditCard">Credit Card</SelectItem>
                        <SelectItem value="PiggyBank">Piggy Bank</SelectItem>
                        <SelectItem value="Wallet">Wallet</SelectItem>
                        <SelectItem value="Building2">Building</SelectItem>
                        <SelectItem value="Banknote">Banknote</SelectItem>
                        <SelectItem value="Coins">Coins</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Additional Options */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Additional Options
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="account-default" />
                    <Label htmlFor="account-default">Set as Default Account</Label>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="account-notes">Notes</Label>
                    <Textarea
                      id="account-notes"
                      placeholder="Optional notes about this account..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-4 border-t">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setIsCreatingAccount(false)}
                >
                  Cancel
                </Button>
                <Button className="flex-1">
                  Create Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
