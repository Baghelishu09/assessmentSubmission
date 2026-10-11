<?php

use App\Http\Controllers\BillingController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;

// Menu Module
Route::post('/categories', [CategoryController::class, 'store'])->name('api.categories.store');
Route::get('/menu',[MenuController::class, 'index']);
Route::post('/menu/store',[MenuController::class, 'store']);
Route::put('/menu/{id}/update',[MenuController::class, 'update']);
Route::delete('/menu/{id}',[MenuController::class, 'destroy']);
Route::patch('/menu/{id}',[MenuController::class, 'toggleStatus']);

// Order Module
Route::get('/order',[OrderController::class, 'index']);
Route::post('/order', [OrderController::class, 'store']);

// Billing
Route::get('/billing', [BillingController::class, 'index']);
Route::get('/billing/{id}/receipt',[BillingController::class, 'generateReceipt']);

// Order History
Route::get('/history', [OrderController::class, 'history']);

// Payments
Route::get('/payments',[PaymentController::class, 'index']);
Route::patch('/payments/{id}/paid',[PaymentController::class, 'paid']);