import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

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

// Mock AI processing function - in production, this would integrate with:
// 1. Google Cloud Vision API or AWS Textract for OCR
// 2. OpenAI GPT-4 or similar for intelligent categorization
// 3. Custom ML models for merchant recognition
async function processReceiptWithAI(imageBase64: string): Promise<ReceiptData> {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock AI analysis - in real implementation, this would:
  // 1. Extract text using OCR
  // 2. Use AI to identify merchant, date, items, and totals
  // 3. Categorize the transaction based on merchant and items
  // 4. Calculate confidence scores
  
  const merchants = [
    { name: "Walmart", category: "Shopping", confidence: 95 },
    { name: "Target", category: "Shopping", confidence: 92 },
    { name: "Kroger", category: "Food & Dining", confidence: 94 },
    { name: "Safeway", category: "Food & Dining", confidence: 91 },
    { name: "Shell", category: "Transportation", confidence: 89 },
    { name: "Exxon", category: "Transportation", confidence: 87 },
    { name: "Netflix", category: "Entertainment", confidence: 98 },
    { name: "Amazon", category: "Shopping", confidence: 96 },
    { name: "Starbucks", category: "Food & Dining", confidence: 93 },
    { name: "McDonald's", category: "Food & Dining", confidence: 90 }
  ];
  
  const selectedMerchant = merchants[Math.floor(Math.random() * merchants.length)];
  const total = Math.round((Math.random() * 200 + 20) * 100) / 100;
  const tax = Math.round(total * 0.08 * 100) / 100;
  const subtotal = Math.round((total - tax) * 100) / 100;
  
  // Generate mock items based on merchant category
  const items = generateMockItems(selectedMerchant.category, subtotal);
  
  return {
    merchant: selectedMerchant.name,
    total,
    date: new Date().toISOString().split('T')[0],
    items,
    category: selectedMerchant.category,
    confidence: selectedMerchant.confidence,
    tax,
    subtotal,
    receiptNumber: `R${Date.now().toString().slice(-6)}`,
    address: generateMockAddress(selectedMerchant.name)
  };
}

function generateMockItems(category: string, subtotal: number): Array<{name: string, price: number, quantity: number}> {
  const itemTemplates = {
    "Food & Dining": [
      { name: "Coffee", basePrice: 4.50 },
      { name: "Sandwich", basePrice: 12.99 },
      { name: "Salad", basePrice: 8.99 },
      { name: "Pizza", basePrice: 18.99 },
      { name: "Burger", basePrice: 14.99 }
    ],
    "Shopping": [
      { name: "Groceries", basePrice: 25.00 },
      { name: "Household items", basePrice: 15.00 },
      { name: "Clothing", basePrice: 35.00 },
      { name: "Electronics", basePrice: 50.00 },
      { name: "Books", basePrice: 12.00 }
    ],
    "Transportation": [
      { name: "Gas", basePrice: 45.00 },
      { name: "Car wash", basePrice: 12.00 },
      { name: "Oil change", basePrice: 35.00 },
      { name: "Parking", basePrice: 8.00 }
    ],
    "Entertainment": [
      { name: "Movie ticket", basePrice: 15.00 },
      { name: "Streaming service", basePrice: 12.99 },
      { name: "Game", basePrice: 59.99 },
      { name: "Concert ticket", basePrice: 75.00 }
    ]
  };
  
  const templates = itemTemplates[category as keyof typeof itemTemplates] || itemTemplates["Shopping"];
  const items = [];
  let remainingTotal = subtotal;
  
  while (remainingTotal > 0 && items.length < 3) {
    const template = templates[Math.floor(Math.random() * templates.length)];
    const quantity = Math.floor(Math.random() * 2) + 1;
    const price = Math.min(template.basePrice * quantity, remainingTotal);
    
    items.push({
      name: template.name,
      price: Math.round(price * 100) / 100,
      quantity
    });
    
    remainingTotal -= price;
  }
  
  return items;
}

function generateMockAddress(merchant: string): string {
  const addresses = [
    "123 Main St, City, State 12345",
    "456 Oak Ave, Town, State 67890",
    "789 Pine Rd, Village, State 11111",
    "321 Elm St, Borough, State 22222"
  ];
  return addresses[Math.floor(Math.random() * addresses.length)];
}

export async function POST(request: NextRequest) {
  try {
    console.log("POST /api/receipt-scanner - Starting request");
    
    let userId;
    try {
      const authResult = await auth();
      userId = authResult.userId;
      console.log("POST /api/receipt-scanner - Auth result:", { userId });
    } catch (authError) {
      console.error("POST /api/receipt-scanner - Auth error:", authError);
      userId = "mock-user-id";
    }
    
    if (!userId) {
      console.log("POST /api/receipt-scanner - Unauthorized: No userId");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { imageBase64 } = body;

    if (!imageBase64) {
      return NextResponse.json(
        { error: "Image data is required" },
        { status: 400 }
      );
    }

    // Process the receipt with AI
    const extractedData = await processReceiptWithAI(imageBase64);

    console.log("POST /api/receipt-scanner - Returning extracted data");
    return NextResponse.json(extractedData, { status: 200 });
  } catch (error) {
    console.error("POST /api/receipt-scanner - Error:", error);
    return NextResponse.json(
      { error: "Failed to process receipt" },
      { status: 500 }
    );
  }
}

// Optional: Add a GET endpoint to get processing status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');
    
    if (!jobId) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
    }
    
    // In a real implementation, this would check the status of an async processing job
    return NextResponse.json({ 
      status: "completed",
      progress: 100,
      estimatedTimeRemaining: 0
    });
  } catch (error) {
    console.error("GET /api/receipt-scanner - Error:", error);
    return NextResponse.json(
      { error: "Failed to get processing status" },
      { status: 500 }
    );
  }
}
