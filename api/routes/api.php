<?php

use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/refresh', [AuthController::class, 'refresh']);

Route::group(['middleware' => ['auth:sanctum']],function(){
    Route::delete('/logout',[AuthController::class,'logout']);
    Route::get('/user',[UserController::class,'getCurrentUser']);
    Route::get('/users',[UserController::class,'getAllUsers']);
    Route::post('/user/update/{id}',[UserController::class,'updateUser']);
});
