<?php

namespace App\Services;

use App\Models\MenuItem;
use App\Models\Order;
use Illuminate\Support\Facades\DB;

class OrderService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }
    public function createOrder(array $data)
    {
        $tax = 0;
        $subTotal = 0;
        $grandTotal = 0;
        DB::transaction(function () use ($data, $subTotal, $tax, $grandTotal) {
            foreach ($data['items'] as $item) {
                $currentItem = MenuItem::where('id', $item['menu_item_id'])->first();
                $itemPrice = $currentItem->price;
                $totalPrice = $itemPrice * ($item['quantity']);
                $subTotal += $totalPrice;
            }
            $tax = (($subTotal * 5) / 100);
            $grandTotal = $subTotal + $tax;
            $order = Order::create([
                'customer_name' => $data['customer_name'],
                'table_no' => $data['table_no'],
                'payment_status' => $data['payment_status'],
                'payment_method' => $data['payment_method'],
                'subtotal' => $subTotal,
                'tax' => $tax,
                'grandtotal' => $grandTotal
            ]);
            foreach ($data['items'] as $item) {
                $itemValue = MenuItem::findOrFail($item['menu_item_id']);
                $order->items()->create([
                    'item_id' => $itemValue->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $itemValue->price,
                    'total_price' => (($itemValue->price) * $item['quantity'])
                ]);
            }
        });
    }
}
