<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function store(Request $request){
        $validated = $request->validate([
            'category_name' => 'required|string|unique:categories,name|max:100'
        ]);
        Category::create([
            'name' => $validated['category_name']
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Category added successfully'
        ]);
    }
}
