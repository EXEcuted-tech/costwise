<?php

use App\Http\Controllers\ApiController;
use App\Http\Controllers\ArticleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\ModelController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\FGController;
use App\Http\Controllers\PredictionController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/refresh', [AuthController::class, 'refresh']);

Route::post('/upload-model', [ModelController::class, 'uploadModel']);
Route::post('/model', [ModelController::class, 'getModel']);

Route::prefix('/training')->group(function () {
    Route::post('/upload', [FileController::class, 'uploadTrainingData']);
    Route::get('/data', [FileController::class, 'getData']);
});

Route::prefix('/fg')->group(function () {
    Route::post('/upload', [FGController::class, 'uploadFG']);
    Route::get('/data', [FGController::class, 'getFGData']);
});

Route::prefix('/prediction')->group(function () {
    Route::post('/upload', [PredictionController::class, 'uploadPrediction']);
    Route::post('/data', [PredictionController::class, 'getPrediction']);
});

Route::prefix('/article')->group(function () {
    Route::post('/upload', [ArticleController::class, 'uploadArticle']);
    Route::post('/data', [ArticleController::class, 'getArticle']);
    Route::post('/update', [ArticleController::class, 'updateArticle']);
    Route::get('/all', [ArticleController::class, 'getAll']);
});

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::delete('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [UserController::class, 'getCurrentUser']);
});
