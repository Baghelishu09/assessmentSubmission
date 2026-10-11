<?php

namespace App\Http\Controllers;

use App\Models\Order;

class BillingController extends Controller
{
    public function index() {
        $orders = Order::latest()->get();
        return response()->json([
            'status' => true,
            'orders' => $orders
        ],200);
    }
    public function generateReceipt($id){
        $order = Order::with('items','items.menuItem')->findOrFail($id);
        return response()->json([
            'status' => true,
            'order' => $order
        ],200);
    }
}
