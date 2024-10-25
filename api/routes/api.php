<?php

use App\Http\Controllers\ApiController;
use App\Http\Controllers\AuditLogController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\BomController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\FinishedGoodController;
use App\Http\Controllers\FodlController;
use App\Http\Controllers\FormulationController;
use App\Http\Controllers\MaterialController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\SystemController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\CostCalcController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\ModelController;
use App\Http\Controllers\FGController;
use App\Http\Controllers\PredictionController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\ReleaseNoteController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/refresh', [AuthController::class, 'refresh']);

Route::prefix('/password-reset')->group(function () {
    Route::post('email', [PasswordResetController::class, 'sendResetLinkEmail']);
    Route::get('{token}', [PasswordResetController::class, 'verifyToken']);
    Route::post('reset', [PasswordResetController::class, 'resetPassword']);
});

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::delete('/logout', [AuthController::class, 'logout']);
    Route::get('/users', [UserController::class, 'getAllUsers']);

    Route::prefix('/user')->group(function () {
        Route::get('', [UserController::class, 'getCurrentUser']);
        Route::get('retrieve', [UserController::class, 'retrieveUser']);
        Route::get('roles', [UserController::class, 'getUserRoles']);
        Route::post('update/{id}', [UserController::class, 'updateUser']);
        Route::delete('archive/{id}', [UserController::class, 'archiveUser']);
        Route::put('update', [UserController::class, 'editUserInfo']);
        Route::post('update_profile_picture', [UserController::class, 'updateProfilePicture']);
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
        Route::get('retrieve_allFG', [FinishedGoodController::class, 'retrieveAllFGData']);
        Route::get('retrieve', [FinishedGoodController::class, 'retrieve']);
        Route::get('retrieve_first', [FinishedGoodController::class, 'retrieveFirst']);
        Route::get('retrieve_batch', [FinishedGoodController::class, 'retrieveBatch']);
        Route::post('create', [FinishedGoodController::class, 'create']);
        Route::post('update', [FinishedGoodController::class, 'update']);
        Route::post('update_or_create', [FinishedGoodController::class, 'updateOrCreate']);
        Route::get('average_cost', [FinishedGoodController::class, 'getAverageCost']);
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
        Route::get('material_cost_utilization', [MaterialController::class, 'getMaterialCostUtilization']);
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
        Route::get('total_production_cost', [TransactionController::class, 'getTotalProductionCost']);
    });

    Route::prefix('/auditlogs')->group(function () {
        Route::get('', [AuditLogController::class, 'getAuditLogs']);
        Route::post('logsaudit', [AuditLogController::class, 'updateAuditLogs']);
        Route::post('export', [AuditLogController::class, 'export']);
    });

    Route::prefix('/notifications')->group(function () {
        Route::get('new', [NotificationController::class, 'getNewNotifications']);
        Route::get('retrieve', [NotificationController::class, 'retrieve']);
        Route::get('retrieve_unread', [NotificationController::class, 'retrieveUnread']);
        Route::post('mark_as_read', [NotificationController::class, 'markAsRead']);
        Route::post('mark_all_as_read', [NotificationController::class, 'markAllAsRead']);
    });

    Route::prefix('/inventory')->group(function () {
        Route::post('upload', [InventoryController::class, 'upload']);
        Route::get('retrieveAll', [InventoryController::class, 'retrieveAll']);
        Route::get('lists', [InventoryController::class, 'retrieveInventoryList']);
        Route::delete('archive', [InventoryController::class, 'archiveInventoryList']);
    });

    Route::prefix('/events')->group(function () {
        Route::post('create', [EventController::class, 'create']);
        Route::get('retrieve', [EventController::class, 'retrieve']);
        Route::get('retrieve_all', [EventController::class, 'retrieveAll']);
        Route::post('update', [EventController::class, 'update']);
        Route::post('delete', [EventController::class, 'delete']);
    });

    Route::prefix('/cost_calculation')->group(function () {
        Route::get('retrieve_month_year_options', [CostCalcController::class, 'retrieveMonthYearOptions']);
        Route::get('retrieve_fg', [CostCalcController::class, 'retrieveFGOptions']);
        Route::get('retrieve_fg_details', [CostCalcController::class, 'retrieveFGDetails']);
        Route::post('export', [CostCalcController::class, 'export']);
    });


    Route::prefix('/article')->group(function () {
        Route::post('upload', [ArticleController::class, 'uploadArticle']);
        Route::get('all', [ArticleController::class, 'getAll']);
        Route::post('data', [ArticleController::class, 'getArticle']);
        Route::post('update', [ArticleController::class, 'updateArticle']);
    });

    Route::prefix('/system')->group(function () {
        Route::get('retrieve_data', [SystemController::class, 'retrieveData']);
    });

    Route::prefix('/release_note')->group(function () {
        Route::get('retrieve', [ReleaseNoteController::class, 'retrieve']);
        Route::get('retrieve_all', [ReleaseNoteController::class, 'retrieveAll']);
        Route::post('create', [ReleaseNoteController::class, 'createNote']);
        Route::post('update', [ReleaseNoteController::class, 'updateNote']);
        Route::post('delete', [ReleaseNoteController::class, 'deleteNote']);
    });
});

Route::prefix('/training')->group(function () {
    Route::post('upload', [FileController::class, 'uploadTrainingData']);
    Route::get('data', [FileController::class, 'getData']);
    Route::post('update', [FileController::class, 'updateTrainingData']);
});

Route::prefix('/prediction')->group(function () {
    Route::post('/upload', [PredictionController::class, 'uploadPrediction']);
    Route::post('/data', [PredictionController::class, 'getPrediction']);
    Route::post('/current_data', [PredictionController::class, 'getCurrentPrediction']);
});
