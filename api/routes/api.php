<?php

use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\ModelController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TrainingController;
use App\Http\Controllers\FGController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/refresh', [AuthController::class, 'refresh']);

Route::post('/upload-model', [ModelController::class, 'uploadModel']);
Route::get('/model', [ModelController::class, 'getModel']);

Route::prefix('/training')->group(function () {
    Route::post('/upload', [FileController::class, 'uploadTrainingData']);
    Route::get('/data', [FileController::class, 'getData']);
});

Route::prefix('/fg')->group(function () {
    Route::post('/upload', [FGController::class, 'uploadFG']);
    Route::get('/data', [FGController::class, 'getFGData']);
});

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::delete('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [UserController::class, 'getCurrentUser']);
});
