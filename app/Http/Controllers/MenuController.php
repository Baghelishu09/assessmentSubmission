<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\MenuItem;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    public function index()
    {
        $categories = Category::withCount('items')->orderBy('name')->get();
        $items = MenuItem::with('category')->latest()->get();
        return response()->json([
            'status' => true,
            'items' => $items,
            'categories' => $categories
        ]);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'price' => 'required|numeric|min:0.01',
            'category_id' => 'required|exists:categories,id',
            'is_available' => 'required|in:0,1',
        ]);

        $item = MenuItem::create($validated);

        return response()->json([
            'status' => true,
            'message' => 'Item added successfully.',
            'item' => $item,
        ], 201);
    }

    public function update($id, Request $request)
    {
        $item = MenuItem::findOrFail($id);
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'price' => 'required|numeric|min:0.01',
            'category_id' => 'required|exists:categories,id',
            'is_available' => 'required|in:0,1',
        ]);
        $item->update($validated);
        return response()->json([
            'status' => true,
            'message' => 'Item updated successfully',
        ], 200);
    }

    public function destroy($id)
    {
        $item = MenuItem::findOrFail($id);
        $item->delete();
        return response()->json([
            'status' => true,
            'message' => 'Status deleted Successfully',
        ], 200);
    }
    public function toggleStatus($id)
    {
        $item = MenuItem::findOrFail($id);
        if ($item->is_available) {
            $item->update([
                'is_available' => false,
            ]);
        } else {
            $item->update([
                'is_available' => true,
            ]);
        }
        return response()->json([
            'status' => true,
            'message' => 'Status updated Successfully',
        ], 200);
    }
}
