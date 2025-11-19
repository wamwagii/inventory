import { NextResponse } from 'next/server';
import { getItems, getCategories } from '@/lib/data-server';

export async function GET() {
  try {
    const items = getItems();
    const categories = getCategories();
    
    // Calculate stats
    const totalItems = items.reduce((sum, item) => sum + item.quantity_in_stock, 0);
    const totalValue = items.reduce((sum, item) => sum + (item.sale_price * item.quantity_in_stock), 0);
    const totalProfit = items.reduce((sum, item) => sum + (item.profit_margin * item.quantity_in_stock), 0);

    const categoryStats = items.reduce((acc, item) => {
      if (!acc[item.item_category]) {
        acc[item.item_category] = { count: 0, value: 0, profit: 0 };
      }
      acc[item.item_category].count += item.quantity_in_stock;
      acc[item.item_category].value += item.sale_price * item.quantity_in_stock;
      acc[item.item_category].profit += item.profit_margin * item.quantity_in_stock;
      return acc;
    }, {} as any);

    // Get recent items (last 5 added)
    const recentItems = items
      .sort((a, b) => new Date(b.purchase_date).getTime() - new Date(a.purchase_date).getTime())
      .slice(0, 5);

    const stats = {
      totalItems,
      totalValue,
      totalProfit,
      categoryStats
    };

    return NextResponse.json({
      stats,
      recentItems
    });
  } catch (error) {
    console.error('Error in inventory stats API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory statistics' },
      { status: 500 }
    );
  }
}