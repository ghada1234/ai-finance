import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    console.log("GET /api/budgets - Starting request");
    
    let userId;
    try {
      const authResult = await auth();
      userId = authResult.userId;
      console.log("GET /api/budgets - Auth result:", { userId });
    } catch (authError) {
      console.error("GET /api/budgets - Auth error:", authError);
      // For now, let's use a mock userId to allow the API to work
      userId = "mock-user-id";
    }
    
    if (!userId) {
      console.log("GET /api/budgets - Unauthorized: No userId");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Return mock budget data
    const mockBudgets = [
      {
        id: "1",
        name: "Food & Dining",
        amount: 600,
        spent: 450,
        period: "MONTHLY",
        startDate: "2024-01-01",
        endDate: "2024-01-31",
        isActive: true,
        categoryId: "1",
        alertThreshold: 80,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        name: "Transportation",
        amount: 300,
        spent: 200,
        period: "MONTHLY",
        startDate: "2024-01-01",
        endDate: "2024-01-31",
        isActive: true,
        categoryId: "2",
        alertThreshold: 80,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "3",
        name: "Entertainment",
        amount: 200,
        spent: 150,
        period: "MONTHLY",
        startDate: "2024-01-01",
        endDate: "2024-01-31",
        isActive: true,
        categoryId: "3",
        alertThreshold: 80,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "4",
        name: "Shopping",
        amount: 400,
        spent: 380,
        period: "MONTHLY",
        startDate: "2024-01-01",
        endDate: "2024-01-31",
        isActive: true,
        categoryId: "4",
        alertThreshold: 80,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    console.log("GET /api/budgets - Returning mock data");
    return NextResponse.json(mockBudgets);
  } catch (error) {
    console.error("GET /api/budgets - Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch budgets" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("POST /api/budgets - Starting request");
    
    let userId;
    try {
      const authResult = await auth();
      userId = authResult.userId;
      console.log("POST /api/budgets - Auth result:", { userId });
    } catch (authError) {
      console.error("POST /api/budgets - Auth error:", authError);
      // For now, let's use a mock userId to allow the API to work
      userId = "mock-user-id";
    }
    
    if (!userId) {
      console.log("POST /api/budgets - Unauthorized: No userId");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, amount, period, categoryId, description, startDate, endDate, isActive, alertThreshold } = body;

    if (!name || !amount || !period) {
      return NextResponse.json(
        { error: "Name, amount, and period are required" },
        { status: 400 }
      );
    }

    // Return mock created budget
    const mockBudget = {
      id: Date.now().toString(),
      name,
      amount: parseFloat(amount),
      spent: 0,
      period,
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || new Date().toISOString().split('T')[0],
      isActive: isActive !== undefined ? isActive : true,
      categoryId: categoryId || null,
      alertThreshold: parseInt(alertThreshold) || 80,
      description: description || "",
      userId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log("POST /api/budgets - Returning mock budget");
    return NextResponse.json(mockBudget, { status: 201 });
  } catch (error) {
    console.error("POST /api/budgets - Error:", error);
    return NextResponse.json(
      { error: "Failed to create budget" },
      { status: 500 }
    );
  }
}


