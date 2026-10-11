<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\MenuItem;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index()
    {
        $categories = Category::all();
        $items = MenuItem::with('category')->latest()->get();
        return response()->json([
            'status' => true,
            'items' => $items,
            'categories' => $categories
        ]);
    }
    public function store(Request $request, OrderService $orderService)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'table_no' => 'required|string|max:255',
            'payment_status' => 'required|in:pending,paid',
            'payment_method' => 'required|in:cash,upi,card',
            'items' => 'required|array|min:1',
            'items.*.menu_item_id' => [
                'required',
                'integer',
                'distinct',
                'exists:menu_items,id',
            ],
            'items.*.quantity' => 'required|integer|min:1',
            'subtotal' => 'required|numeric|min:0',
            'tax' => 'required|numeric|min:0',
            'total' => 'required|numeric|min:0',
        ]);
        try {
            $orderService->createOrder($validated);
            return response()->json([
                'status' => true,
                'message' => 'Order created Successfully'
            ],201);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => 'Something went wrong'
            ],500);
        }
    }

    public function history(){
        $orders = Order::withCount('items')->latest()->get();
        return response()->json([
            'status' => true,
            'orders' => $orders
        ],200);
    }
}
