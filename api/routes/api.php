<?php

use App\Http\Controllers\ApiController;
use App\Http\Controllers\BomController;
use App\Http\Controllers\FinishedGoodController;
use App\Http\Controllers\FodlController;
use App\Http\Controllers\FormulationController;
use App\Http\Controllers\MaterialController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\FileController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/refresh', [AuthController::class, 'refresh']);

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::delete('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [UserController::class, 'getCurrentUser']);

    Route::prefix('/files')->group(function () {
        Route::post('upload', [FileController::class, 'upload']);
        Route::get('retrieve_all', [FileController::class, 'retrieveAll']);
        Route::get('retrieve', [FileController::class, 'retrieve']);
        Route::post('export', [FileController::class, 'export']);
    });

    Route::prefix('/finished_goods')->group(function () {
        Route::get('retrieve_all', [FinishedGoodController::class, 'retrieveAll']);
        Route::get('retrieve', [FinishedGoodController::class, 'retrieve']);
        Route::get('retrieve_first', [FinishedGoodController::class, 'retrieveFirst']);
        Route::get('retrieve_batch', [FinishedGoodController::class, 'retrieveBatch']);
        Route::post('update', [FinishedGoodController::class, 'update']);
    });

    Route::prefix('/fodls')->group(function () {
        Route::get('retrieve_all', [FodlController::class, 'retrieveAll']);
        Route::get('retrieve', [FodlController::class, 'retrieve']);
        Route::get('retrieve_batch', [FodlController::class, 'retrieveBatch']);
        Route::post('update_batch', [FodlController::class, 'updateBatchCombined']);
        Route::post('delete', [FodlController::class, 'deleteFodl']);
        Route::post('delete_bulk', [FodlController::class, 'deleteBulkFodl']);
    });

    Route::prefix('/materials')->group(function () {
        Route::get('retrieve_all', [MaterialController::class, 'retrieveAll']);
        Route::get('retrieve', [MaterialController::class, 'retrieve']);
        Route::get('retrieve_batch', [MaterialController::class, 'retrieveBatch']);
        Route::post('update_batch', [MaterialController::class, 'updateBatch']);
        Route::post('delete_bulk', [MaterialController::class, 'deleteBulk']);
    });

    Route::prefix('/boms')->group(function () {
        Route::get('retrieve_all', [BomController::class, 'retrieveAll']);
        Route::get('retrieve', [BomController::class, 'retrieve']);
        Route::get('retrieve_batch', [BomController::class, 'retrieveBatch']);
        Route::post('update_batch', [BomController::class, 'updateBatch']);
    });

    Route::prefix('/formulations')->group(function () {
        Route::get('retrieve_all', [FormulationController::class, 'retrieveAll']);
        Route::get('retrieve', [FormulationController::class, 'retrieve']);
        Route::get('retrieve_batch', [FormulationController::class, 'retrieveBatch']);
        Route::post('update_emulsion', [FormulationController::class, 'updateEmulsion']);
        Route::post('delete_fg', [FormulationController::class, 'deleteBulkWithFg']);
        Route::post('delete_material', [FormulationController::class, 'deleteBulkWithMaterial']);
    });
});