"use client";

import { useState, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  FileText, 
  Table, 
  Download,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileSpreadsheet,
  Eye,
  Map,
  Settings,
  Play
} from "lucide-react";

interface CSVData {
  headers: string[];
  rows: string[][];
  preview: string[][];
}

interface ColumnMapping {
  date: string;
  description: string;
  amount: string;
  type: string;
  category: string;
  account: string;
  notes: string;
}

export default function CSVImportPage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<CSVData | null>(null);
  const [currentStep, setCurrentStep] = useState<'upload' | 'mapping' | 'preview' | 'import'>('upload');
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({
    date: '',
    description: '',
    amount: '',
    type: '',
    category: '',
    account: '',
    notes: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importResults, setImportResults] = useState<{
    imported: number;
    skipped: number;
    errors: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          <h1 className="text-2xl font-bold mb-4">Please sign in to access CSV import</h1>
          <p className="text-gray-600">You need to be authenticated to import financial data.</p>
        </div>
      </div>
    );
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
      setSelectedFile(file);
      await processCSVFile(file);
    }
  };

  const processCSVFile = async (file: File) => {
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const rows = lines.slice(1).map(line => 
        line.split(',').map(cell => cell.trim().replace(/"/g, ''))
      );
      
      setCsvData({
        headers,
        rows,
        preview: rows.slice(0, 5) // Show first 5 rows as preview
      });
      
      // Auto-detect column mapping
      const autoMapping: ColumnMapping = {
        date: '',
        description: '',
        amount: '',
        type: '',
        category: '',
        account: '',
        notes: ''
      };

      headers.forEach((header, index) => {
        const lowerHeader = header.toLowerCase();
        if (lowerHeader.includes('date')) autoMapping.date = header;
        else if (lowerHeader.includes('desc') || lowerHeader.includes('note') || lowerHeader.includes('memo')) autoMapping.description = header;
        else if (lowerHeader.includes('amount') || lowerHeader.includes('sum') || lowerHeader.includes('total')) autoMapping.amount = header;
        else if (lowerHeader.includes('type') || lowerHeader.includes('category')) autoMapping.type = header;
        else if (lowerHeader.includes('account')) autoMapping.account = header;
      });

      setColumnMapping(autoMapping);
      setCurrentStep('mapping');
    } catch (error) {
      console.error('Error processing CSV:', error);
      alert('Error processing CSV file');
    }
  };

  const downloadTemplate = () => {
    const template = `Date,Description,Amount,Type,Category,Account,Notes
2024-01-15,Grocery shopping,-50.25,EXPENSE,Food & Dining,Main Checking,Weekly groceries
2024-01-16,Salary payment,2500.00,INCOME,Salary,Main Checking,Monthly salary
2024-01-17,Gas station,-35.00,EXPENSE,Transportation,Credit Card,Fuel for car`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transaction_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const startImport = async () => {
    if (!csvData || !columnMapping.date || !columnMapping.description || !columnMapping.amount) {
      alert('Please map the required columns: Date, Description, and Amount');
      return;
    }

    setIsProcessing(true);
    setImportProgress(0);
    setCurrentStep('import');

    // Simulate import process
    const totalRows = csvData.rows.length;
    let imported = 0;
    const skipped = 0;
    let errors = 0;

    for (let i = 0; i < totalRows; i++) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setImportProgress(((i + 1) / totalRows) * 100);

      // Simulate processing logic
      const row = csvData.rows[i];
      if (row.length >= 3) {
        imported++;
      } else {
        errors++;
      }
    }

    setImportResults({ imported, skipped, errors });
    setIsProcessing(false);
  };

  const resetImport = () => {
    setSelectedFile(null);
    setCsvData(null);
    setCurrentStep('upload');
    setColumnMapping({
      date: '',
      description: '',
      amount: '',
      type: '',
      category: '',
      account: '',
      notes: ''
    });
    setImportResults(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <FileSpreadsheet className="h-8 w-8 text-blue-600" />
          CSV Import
        </h1>
        <p className="text-gray-600">
          Import your financial data from CSV files with automatic mapping and validation
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4">
          {['upload', 'mapping', 'preview', 'import'].map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                currentStep === step 
                  ? 'bg-blue-600 border-blue-600 text-white' 
                  : index < ['upload', 'mapping', 'preview', 'import'].indexOf(currentStep)
                  ? 'bg-green-600 border-green-600 text-white'
                  : 'border-gray-300 text-gray-500'
              }`}>
                {index + 1}
              </div>
              <span className="ml-2 text-sm font-medium capitalize">{step}</span>
              {index < 3 && (
                <div className={`w-16 h-0.5 mx-4 ${
                  index < ['upload', 'mapping', 'preview', 'import'].indexOf(currentStep)
                    ? 'bg-green-600'
                    : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Upload Step */}
      {currentStep === 'upload' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload CSV File
              </CardTitle>
              <CardDescription>
                Select a CSV file to import transactions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  Drag and drop your CSV file here, or click to browse
                </p>
                <Button onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Select CSV File
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
              <div className="text-sm text-gray-500">
                <p>Supported formats: CSV</p>
                <p>Maximum file size: 10MB</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                CSV Templates
              </CardTitle>
              <CardDescription>
                Download templates for different formats
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button variant="outline" onClick={downloadTemplate} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Basic Template
                </Button>
                <div className="text-sm text-gray-600">
                  <p className="font-medium">Template includes:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Date column</li>
                    <li>Description column</li>
                    <li>Amount column (negative for expenses)</li>
                    <li>Type column (INCOME/EXPENSE/TRANSFER)</li>
                    <li>Category column</li>
                    <li>Account column</li>
                    <li>Notes column</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Mapping Step */}
      {currentStep === 'mapping' && csvData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="h-5 w-5" />
              Column Mapping
            </CardTitle>
            <CardDescription>
              Map your CSV columns to the application fields
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date Column *</Label>
                <Select
                  value={columnMapping.date}
                  onValueChange={(value) => setColumnMapping(prev => ({ ...prev, date: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select date column" />
                  </SelectTrigger>
                  <SelectContent>
                    {csvData.headers.map((header) => (
                      <SelectItem key={header} value={header}>
                        {header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Description Column *</Label>
                <Select
                  value={columnMapping.description}
                  onValueChange={(value) => setColumnMapping(prev => ({ ...prev, description: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select description column" />
                  </SelectTrigger>
                  <SelectContent>
                    {csvData.headers.map((header) => (
                      <SelectItem key={header} value={header}>
                        {header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Amount Column *</Label>
                <Select
                  value={columnMapping.amount}
                  onValueChange={(value) => setColumnMapping(prev => ({ ...prev, amount: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select amount column" />
                  </SelectTrigger>
                  <SelectContent>
                    {csvData.headers.map((header) => (
                      <SelectItem key={header} value={header}>
                        {header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Type Column</Label>
                <Select
                  value={columnMapping.type}
                  onValueChange={(value) => setColumnMapping(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type column (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {csvData.headers.map((header) => (
                      <SelectItem key={header} value={header}>
                        {header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Category Column</Label>
                <Select
                  value={columnMapping.category}
                  onValueChange={(value) => setColumnMapping(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category column (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {csvData.headers.map((header) => (
                      <SelectItem key={header} value={header}>
                        {header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Account Column</Label>
                <Select
                  value={columnMapping.account}
                  onValueChange={(value) => setColumnMapping(prev => ({ ...prev, account: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select account column (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {csvData.headers.map((header) => (
                      <SelectItem key={header} value={header}>
                        {header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setCurrentStep('upload')}>
                Back
              </Button>
              <Button 
                onClick={() => setCurrentStep('preview')}
                disabled={!columnMapping.date || !columnMapping.description || !columnMapping.amount}
                className="flex-1"
              >
                Next: Preview Data
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview Step */}
      {currentStep === 'preview' && csvData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Data Preview
            </CardTitle>
            <CardDescription>
              Review your data before importing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    {csvData.headers.map((header, index) => (
                      <th key={index} className="border border-gray-300 px-3 py-2 text-left text-sm font-medium">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {csvData.preview.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-50">
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="border border-gray-300 px-3 py-2 text-sm">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="text-sm text-gray-600">
              <p>Showing first 5 rows of {csvData.rows.length} total rows</p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setCurrentStep('mapping')}>
                Back
              </Button>
              <Button onClick={startImport} className="flex-1">
                Start Import
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Import Step */}
      {currentStep === 'import' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Import Progress
            </CardTitle>
            <CardDescription>
              Processing your CSV data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isProcessing ? (
              <div className="space-y-4">
                <Progress value={importProgress} className="w-full" />
                <p className="text-center text-sm text-gray-600">
                  {importProgress.toFixed(0)}% complete
                </p>
                <div className="flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                </div>
              </div>
            ) : importResults ? (
              <div className="space-y-4">
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Import Complete!</h3>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{importResults.imported}</div>
                    <div className="text-sm text-gray-600">Imported</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{importResults.skipped}</div>
                    <div className="text-sm text-gray-600">Skipped</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{importResults.errors}</div>
                    <div className="text-sm text-gray-600">Errors</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={resetImport} className="flex-1">
                    Import Another File
                  </Button>
                  <Button className="flex-1">
                    View Transactions
                  </Button>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  );
}


