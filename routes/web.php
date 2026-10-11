<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::middleware(['auth','verified'])->group(function() {
    Route::get('/dashboard', function(){
        return view('backend.pages.menu');
    })->name('dashboard');
    Route::get('/orders', function(){
        return view('backend.pages.orders');
    })->name('orders');
    Route::get('/billing', function(){
        return view('backend.pages.billing');
    })->name('billing');
    Route::get('/history', function(){
        return view('backend.pages.history');
    })->name('history');
    Route::get('/payments', function(){
        return view('backend.pages.payments');
    })->name('payments');


});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
