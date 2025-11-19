// app/api/inventory/route.ts
import { NextResponse } from 'next/server';
import { getItems, getCategories } from '@/lib/data-server';

export async function GET() {
  const items = getItems();
  const categories = getCategories();
  // ... calculate stats
  return NextResponse.json({ totalItems, totalValue, totalProfit, categoryStats });
}