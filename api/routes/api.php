<?php

use App\Http\Controllers\ApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PasswordResetController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/refresh', [AuthController::class, 'refresh']);


Route::group(['middleware' => ['auth:sanctum']],function(){
    Route::delete('/logout',[AuthController::class,'logout']);
    Route::get('/user',[UserController::class,'getCurrentUser']);
    Route::put('/user/update', [UserController::class, 'editUserInfo']);
    
    Route::post('/password/email', [PasswordResetController::class, 'sendResetLinkEmail']);
    Route::get('/password-reset/{token}', [PasswordResetController::class, 'verifyToken']);
    Route::post('/password/reset', [PasswordResetController::class, 'resetPassword']);

});