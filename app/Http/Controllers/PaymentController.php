<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    public function index()
    {
        $orders = Order::latest()->get();
        $totalRevenue = Order::sum('grandtotal');
        $statusRevenue = DB::select("SELECT payment_status, SUM(grandtotal) AS total FROM orders GROUP BY payment_status");
        return response()->json([
            'status' => true,
            'orders' => $orders,
            'revenue' => $totalRevenue,
            'revenue_status' => $statusRevenue
    ],200);
    }
    public function paid($id){
        $order = Order::findOrFail($id);
        if($order->payment_status === 'paid'){
            return response()->json([
                'status' => false,
                'message' => 'This order is already Paid'
            ]);
        }
        $order->update([
            'payment_status' => 'paid',
        ]);
        return response()->json([
            'status' => true,
            'message' => 'Order marked paid successfully',
        ],201);
    }
}
