<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LoanAnalysisController;
use App\Http\Controllers\AuthController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Protect analysis endpoints
    Route::get('/analyses', [LoanAnalysisController::class, 'index']);
    Route::post('/analyses', [LoanAnalysisController::class, 'store']);
});

Route::get('/ping', function () {
    return response()->json(['message' => 'pong']);
});

