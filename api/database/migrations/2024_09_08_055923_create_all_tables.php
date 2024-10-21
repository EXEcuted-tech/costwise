<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Users Table
        Schema::create('users', function (Blueprint $table) {
            $table->increments('user_id');
            $table->string('employee_number', 255);
            $table->enum('user_type', ['Regular', 'Admin']);
            $table->string('first_name', 255);
            $table->string('middle_name', 255)->nullable();
            $table->string('last_name', 255);
            $table->string('suffix', 5)->nullable();
            $table->string('email_address', 255);
            $table->string('password', 255);
            $table->string('phone_number', 255);
            $table->string('department', 255);
            $table->string('position', 25);
            $table->longText('display_picture')->nullable();
            $table->longText('sys_role');
            $table->timestamps();
        });

        // Audit Logs Table
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->increments('log_id');
            $table->unsignedInteger('user_id');
            $table->enum('action', ['general', 'crud', 'import', 'export', 'stock']);
            $table->string('description', 255);
            $table->boolean('read')->default(false)->index();
            $table->timestamp('timestamp')->useCurrent();
            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
        });

        // Files Table
        Schema::create('files', function (Blueprint $table) {
            $table->increments('file_id');
            $table->enum('file_type', ['master_file', 'transactional_file', 'inventory_file', 'training_file']);
            $table->longText('settings');
            $table->timestamps();
            $table->index(['file_id']);
        });

        // Bill of Materials Table
        Schema::create('bill_of_materials', function (Blueprint $table) {
            $table->increments('bom_id');
            $table->string('bom_name', 255);
            $table->longText('formulations');
            $table->timestamps();
            $table->index(['bom_id']);
        });

        // FODL Table
        Schema::create('fodl', function (Blueprint $table) {
            $table->increments('fodl_id');
            $table->string('fg_code', 255);
            $table->decimal('factory_overhead', 10, 2);
            $table->decimal('direct_labor', 10, 2);
            $table->unsignedInteger('monthYear');
            $table->index(['fodl_id']);
        });

        // Finished Goods Table
        Schema::create('finished_goods', function (Blueprint $table) {
            $table->increments('fg_id');
            $table->unsignedInteger('fodl_id')->nullable();
            $table->string('fg_code', 255);
            $table->string('fg_desc', 255);
            $table->decimal('total_cost', 10, 2)->nullable();
            $table->decimal('total_batch_qty', 10, 2);
            $table->decimal('rm_cost', 10, 2)->nullable();
            $table->string('unit', 10);
            $table->unsignedInteger('formulation_no')->nullable();
            $table->boolean('is_least_cost')->default(false)->index();
            $table->unsignedInteger('monthYear');
            $table->foreign('fodl_id')->references('fodl_id')->on('fodl')->onDelete('cascade');
            $table->index(['fg_id', 'fg_code', 'rm_cost', 'fodl_id']);
        });

        // Formulations Table
        Schema::create('formulations', function (Blueprint $table) {
            $table->increments('formulation_id');
            $table->unsignedInteger('fg_id');
            $table->string('formula_code', 255);
            $table->longText('emulsion');
            $table->longText('material_qty_list');
            $table->timestamps();
            $table->foreign('fg_id')->references('fg_id')->on('finished_goods')->onDelete('cascade');
            $table->index(['formulation_id', 'formula_code']);
        });

        // Material Table
        Schema::create('materials', function (Blueprint $table) {
            $table->increments('material_id');
            $table->string('material_code', 255);
            $table->string('material_desc', 255);
            $table->decimal('material_cost', 10, 2);
            $table->string('unit', 10);
            $table->date('date');
            $table->index(['material_id', 'material_code', 'material_cost']);
        });

        // Article Table
        Schema::create('articles', function (Blueprint $table) {
            $table->increments('article_id');
            $table->enum('category', ['Manage Account', 'Getting Started', 'Essentials']);
            $table->longText('content');
            $table->timestamps();
        });

        // Transaction Table
        Schema::create('transactions', function (Blueprint $table) {
            $table->id('transaction_id');
            $table->unsignedInteger('material_id')->nullable();
            $table->unsignedInteger('fg_id')->nullable();
            $table->string('journal', 255);
            $table->string('entry_num', 15);
            $table->string('trans_desc', 255);
            $table->string('project', 255);
            $table->string('gl_account', 50);
            $table->string('gl_desc', 255);
            $table->string('warehouse', 20);
            $table->timestamp('date');
            $table->integer('month');
            $table->integer('year');
            $table->longText('settings');
            $table->foreign('material_id')->references('material_id')->on('materials')->onDelete('cascade');
            $table->foreign('fg_id')->references('fg_id')->on('finished_goods')->onDelete('cascade');
            $table->index(['transaction_id', 'material_id', 'fg_id']);
        });

        // Predictions Table
        Schema::create('predictions', function (Blueprint $table) {
            $table->integer('prediction_id', 11)->primary();
            $table->integer('product_num');
            $table->string('product_name', 255);
            $table->decimal('cost', 17, 7);
            $table->string('monthYear', 50);
            $table->timestamps();
        });

        // Inventory Table
        Schema::create('inventory', function (Blueprint $table) {
            $table->increments('inventory_id');
            $table->unsignedInteger('material_id');
            $table->enum('material_category', ['meat_material', 'meat_alternate', 'packaging', 'food_ingredient', 'casing', 'tin_can', 'other']);
            $table->enum('stock_status', ['In Stock', 'Low Stock']);
            $table->decimal('purchased_qty', 10, 2);
            $table->decimal('usage_qty', 10, 2);
            $table->decimal('total_qty', 10, 2);
            $table->timestamps();
            $table->foreign('material_id')->references('material_id')->on('materials')->onDelete('cascade');
        });

        // Events Table
        Schema::create('events', function (Blueprint $table) {
            $table->increments('event_id');
            $table->unsignedInteger('user_id')->nullable();
            $table->string('title');
            $table->text('description')->nullable();
            $table->date('event_date');
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->timestamps();
            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articles');
        Schema::dropIfExists('inventory');
        Schema::dropIfExists('materials');
        Schema::dropIfExists('finished_goods');
        Schema::dropIfExists('fodl');
        Schema::dropIfExists('formulations');
        Schema::dropIfExists('bill_of_materials');
        Schema::dropIfExists('files');
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('users');
        Schema::dropIfExists('transactions');
        Schema::dropIfExists('events');
    }
};
