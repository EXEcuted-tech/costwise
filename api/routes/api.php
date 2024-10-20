<?php

use App\Http\Controllers\ApiController;
use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\BomController;
use App\Http\Controllers\FinishedGoodController;
use App\Http\Controllers\FodlController;
use App\Http\Controllers\FormulationController;
use App\Http\Controllers\MaterialController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\TransactionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\InventoryController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/refresh', [AuthController::class, 'refresh']);

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::delete('/logout', [AuthController::class, 'logout']);
    Route::get('/users',[UserController::class,'getAllUsers']);

     Route::prefix('/user')->group(function () {
        Route::get('', [UserController::class, 'getCurrentUser']);
        Route::post('update/{id}',[UserController::class,'updateUser']);
        Route::delete('archive/{id}', [UserController::class, 'archiveUser']);
    });

    Route::prefix('/files')->group(function () {
        Route::post('upload', [FileController::class, 'upload']);
        Route::get('retrieve_all', [FileController::class, 'retrieveAll']);
        Route::get('retrieve', [FileController::class, 'retrieve']);
        Route::post('delete', [FileController::class, 'delete']);
        Route::post('export', [FileController::class, 'export']);
        Route::post('export_all', [FileController::class, 'exportAll']);
    });

    Route::prefix('/finished_goods')->group(function () {
        Route::get('retrieve_all', [FinishedGoodController::class, 'retrieveAll']);
        Route::get('retrieve', [FinishedGoodController::class, 'retrieve']);
        Route::get('retrieve_first', [FinishedGoodController::class, 'retrieveFirst']);
        Route::get('retrieve_batch', [FinishedGoodController::class, 'retrieveBatch']);
        Route::post('create', [FinishedGoodController::class, 'create']);
        Route::post('update', [FinishedGoodController::class, 'update']);
        Route::post('update_or_create', [FinishedGoodController::class, 'updateOrCreate']);
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
        Route::get('retrieve_first', [BomController::class, 'retrieveFirst']);
        Route::get('retrieve_batch', [BomController::class, 'retrieveBatch']);
        Route::post('update_batch', [BomController::class, 'updateBatch']);
        Route::post('delete', [BomController::class, 'delete']);
        Route::post('create', [BomController::class, 'create']);
        Route::post('update_create_batch', [BomController::class, 'updateOrCreateBatch']);
    });

    Route::prefix('/formulations')->group(function () {
        Route::get('retrieve_all', [FormulationController::class, 'retrieveAll']);
        Route::get('retrieve_all_fg', [FormulationController::class, 'retrieveAllWithFG']);
        Route::get('retrieve', [FormulationController::class, 'retrieve']);
        Route::get('retrieve_batch', [FormulationController::class, 'retrieveBatch']);
        Route::post('create', [FormulationController::class, 'create']);
        Route::post('update_emulsion', [FormulationController::class, 'updateEmulsion']);
        Route::post('delete', [FormulationController::class, 'delete']);
        Route::post('delete_fg', [FormulationController::class, 'deleteBulkWithFG']);
        Route::post('delete_material', [FormulationController::class, 'deleteBulkWithMaterial']);
        Route::post('upload', [FormulationController::class, 'upload']);
        Route::post('export', [FormulationController::class, 'export']);
    });

    Route::prefix('/transactions')->group(function () {
        Route::get('retrieve_batch', [TransactionController::class, 'retrieveBatch']);
        Route::post('update_batch', [TransactionController::class, 'updateBatch']);
        Route::post('delete_bulk', [TransactionController::class, 'deleteBulk']);
    });

    Route::prefix('/auditlogs')->group(function () {
        Route::get('',[AuditLogController::class,'getAuditLogs']);
        Route::post('logsaudit',[AuditLogController::class,'updateAuditLogs']);
    });
        
    Route::prefix('/notifications')->group(function () {
        Route::get('new', [NotificationController::class, 'getNewNotifications']);
        Route::get('retrieve', [NotificationController::class, 'retrieve']);
        Route::get('retrieve_unread', [NotificationController::class, 'retrieveUnread']);
    });

    Route::prefix('/inventory')->group(function () {
        Route::post('upload', [InventoryController::class, 'upload']);
        Route::get('retrieveAll', [InventoryController::class, 'retrieveAll']);
        Route::get('lists', [InventoryController::class, 'retrieveInventoryList']);
        Route::delete('archive', [InventoryController::class, 'archiveInventoryList']);
    });
});
