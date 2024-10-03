<?php

use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\ModelController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TrainingController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/refresh', [AuthController::class, 'refresh']);
Route::post('/upload-model', [ModelController::class, 'uploadModel']);
Route::get('/model', [ModelController::class, 'getModel']);
Route::post('/upload-data', [FileController::class, 'uploadTrainingData']);
Route::get('/training', [FileController::class, 'getData']);

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::delete('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [UserController::class, 'getCurrentUser']);
});
