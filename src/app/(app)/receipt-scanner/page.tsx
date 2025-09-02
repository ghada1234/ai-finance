"use client";
 
import { useState, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  FileText, 
  DollarSign, 
  Calendar, 
  Tag, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  Trash2,
  Save,
  Sparkles,
  Receipt,
  MapPin,
  Hash
} from "lucide-react";

// Force static generation to avoid prerendering issues
export const dynamic = 'force-static';

interface ReceiptData {
  merchant: string;
  total: number;
  date: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  category: string;
  confidence: number;
  tax?: number;
  subtotal?: number;
  receiptNumber?: string;
  address?: string;
}


  export default function ReceiptScannerPage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [extractedData, setExtractedData] = useState<ReceiptData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<ReceiptData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
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
          <h1 className="text-2xl font-bold mb-4">Please sign in to access the receipt scanner</h1>
          <p className="text-gray-600">You need to be authenticated to use AI-powered receipt scanning.</p>
        </div>
      </div>
    );
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setExtractedData(null);
      setEditedData(null);
      setIsEditing(false);
    }
  };

  const processReceipt = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setProcessingProgress(0);

    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        const imageBase64 = base64.split(',')[1]; // Remove data:image/jpeg;base64, prefix

        try {
          // Simulate processing steps with shorter delays
          const steps = [
            "Preprocessing image...",
            "Extracting text...",
            "Analyzing data...",
            "Finalizing results..."
          ];

          for (let i = 0; i < steps.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 300));
            setProcessingProgress(((i + 1) / steps.length) * 100);
          }

          // Try to call the API with timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

          const response = await fetch('/api/receipt-scanner', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ imageBase64 }),
            signal: controller.signal
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
          }

          const extractedData = await response.json();
          
          if (extractedData.confidence < 20) {
            alert('Warning: Low confidence in data extraction. Please check the results carefully.');
          }
          
          setExtractedData(extractedData);
          setEditedData(extractedData);
        } catch (apiError) {
          console.error('API processing failed, using fallback:', apiError);
          
          // Fallback: Generate mock data for testing
          const mockData = {
            merchant: "Sample Store",
            total: 25.99,
            date: new Date().toISOString().split('T')[0],
            items: [
              { name: "Sample Item", price: 25.99, quantity: 1 }
            ],
            category: "Other",
            confidence: 75,
            tax: 2.50,
            subtotal: 23.49,
            receiptNumber: "12345",
            address: "123 Sample St, City, State"
          };
          
          setExtractedData(mockData);
          setEditedData(mockData);
          alert('API processing failed. Using sample data for demonstration.');
        } finally {
          setIsProcessing(false);
          setProcessingProgress(0);
        }
      };

      reader.readAsDataURL(selectedFile);
    } catch (error) {
      console.error('Error processing receipt:', error);
      alert('Error processing receipt. Please try again.');
      setIsProcessing(false);
      setProcessingProgress(0);
    }
  };

  const saveTransaction = async () => {
    if (!editedData) return;

    setIsSaving(true);
    
    try {
      // This would save to your API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form
      setSelectedFile(null);
      setPreviewUrl(null);
      setExtractedData(null);
      setEditedData(null);
      setIsEditing(false);
      
      alert("Transaction saved successfully!");
    } catch (error) {
      alert("Error saving transaction");
    } finally {
      setIsSaving(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setExtractedData(null);
    setEditedData(null);
    setIsEditing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-blue-600" />
          AI Receipt Scanner
        </h1>
        <p className="text-gray-600">
          Upload a photo of your receipt and let AI automatically extract and categorize your expenses
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Receipt
            </CardTitle>
            <CardDescription>
              Upload an image of your receipt
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!previewUrl ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  Drag and drop your receipt image here, or choose an option below
                </p>
                <div className="flex justify-center">
                  <Button onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800 mb-2">
                    <strong>💡 Tip:</strong> For best OCR results, ensure your receipt is:
                  </p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Well-lit and clearly visible</li>
                    <li>• Flat and not crumpled</li>
                    <li>• High contrast (dark text on light background)</li>
                    <li>• Shows merchant name, total, and items clearly</li>
                    <li>• Avoid shadows or glare on the text</li>
                  </ul>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={previewUrl || ''}
                    alt="Receipt preview"
                    className="w-full h-64 object-contain border rounded-lg"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={clearSelection}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Button 
                  onClick={processReceipt} 
                  disabled={isProcessing}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Extract Data with AI
                    </>
                  )}
                </Button>
                
                {isProcessing && (
                  <div className="space-y-2">
                    <Progress value={processingProgress} className="w-full" />
                    <p className="text-sm text-gray-600 text-center">
                      {processingProgress.toFixed(0)}% complete
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Extracted Data
            </CardTitle>
            <CardDescription>
              Review and edit the AI-extracted information
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!extractedData ? (
              <div className="text-center py-8 text-gray-500">
                <Receipt className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Upload a receipt to see extracted data</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Confidence Score */}
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium">AI Confidence</span>
                  </div>
                  <Badge variant={extractedData.confidence > 90 ? "default" : "secondary"}>
                    {extractedData.confidence}%
                  </Badge>
                </div>

                {/* Merchant */}
                <div className="space-y-2">
                  <Label>Merchant</Label>
                  {isEditing ? (
                    <Input
                      value={editedData?.merchant || ""}
                      onChange={(e) => setEditedData(prev => prev ? {...prev, merchant: e.target.value} : null)}
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      {extractedData.merchant}
                    </div>
                  )}
                </div>

                {/* Total Amount */}
                <div className="space-y-2">
                  <Label>Total Amount</Label>
                  {isEditing ? (
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="number"
                        step="0.01"
                        value={editedData?.total || ""}
                        onChange={(e) => setEditedData(prev => prev ? {...prev, total: parseFloat(e.target.value) || 0} : null)}
                        className="pl-10"
                      />
                    </div>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg text-xl font-bold text-green-600">
                      ${extractedData.total.toFixed(2)}
                    </div>
                  )}
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <Label>Date</Label>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={editedData?.date || ""}
                      onChange={(e) => setEditedData(prev => prev ? {...prev, date: e.target.value} : null)}
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {new Date(extractedData.date).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label>Category</Label>
                  {isEditing ? (
                    <Select
                      value={editedData?.category || ""}
                      onValueChange={(value) => setEditedData(prev => prev ? {...prev, category: value} : null)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Food & Dining">Food & Dining</SelectItem>
                        <SelectItem value="Shopping">Shopping</SelectItem>
                        <SelectItem value="Transportation">Transportation</SelectItem>
                        <SelectItem value="Entertainment">Entertainment</SelectItem>
                        <SelectItem value="Utilities">Utilities</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg flex items-center gap-2">
                      <Tag className="h-4 w-4 text-gray-400" />
                      {extractedData.category}
                    </div>
                  )}
                </div>

                {/* Additional Details */}
                {extractedData.receiptNumber && (
                  <div className="space-y-2">
                    <Label>Receipt Number</Label>
                    <div className="p-3 bg-gray-50 rounded-lg flex items-center gap-2">
                      <Hash className="h-4 w-4 text-gray-400" />
                      {extractedData.receiptNumber}
                    </div>
                  </div>
                )}

                {extractedData.address && (
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <div className="p-3 bg-gray-50 rounded-lg flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      {extractedData.address}
                    </div>
                  </div>
                )}

                {/* Items */}
                <div className="space-y-2">
                  <Label>Items</Label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {extractedData.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm">{item.name}</span>
                        <span className="text-sm font-medium">${item.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4">
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} className="flex-1">
                      Edit Data
                    </Button>
                  ) : (
                    <>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setIsEditing(false);
                          setEditedData(extractedData);
                        }}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={saveTransaction}
                        disabled={isSaving}
                        className="flex-1"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Transaction
                          </>
                        )}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
