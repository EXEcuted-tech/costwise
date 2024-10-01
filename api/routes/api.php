<?php

use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\FileController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/refresh', [AuthController::class, 'refresh']);

Route::prefix('/files')->group(function () {
    Route::post('/upload', [FileController::class, 'upload']);
});

Route::group(['middleware' => ['auth:sanctum']],function(){
    Route::delete('/logout',[AuthController::class,'logout']);
    Route::get('/user',[UserController::class,'getCurrentUser']);

});