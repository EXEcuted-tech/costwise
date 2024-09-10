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
            $table->string('phone_number', 255);
            $table->string('department', 255);
            $table->string('position', 25);
            $table->longText('sys_role');
            $table->timestamps();
        });

        // Audit Logs Table
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->increments('log_id');
            $table->unsignedInteger('user_id');
            $table->enum('action', ['general', 'crud', 'import', 'export', 'stock']);
            $table->timestamp('timestamp')->useCurrent();
            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
        });

        // Files Table
        Schema::create('files', function (Blueprint $table) {
            $table->increments('file_id');
            $table->enum('file_type', ['master_file', 'transactional_file']);
            $table->longText('settings');
            $table->timestamps();
        });

        // Bill of Materials Table
        Schema::create('bill_of_materials', function (Blueprint $table) {
            $table->increments('bom_id');
            $table->longText('formulations');
            $table->decimal('total_cost', 10, 2);
            $table->decimal('total_batch_qty', 10, 2);
            $table->decimal('rm_cost', 10, 2);
            $table->timestamps();
        });

        // FODL Table
        Schema::create('fodl', function (Blueprint $table) {
            $table->increments('fodl_id');
            $table->decimal('factory_overhead', 10, 2);
            $table->decimal('direct_labor', 10, 2);
            $table->unsignedInteger('monthYear');
        });

        // Finished Goods Table
        Schema::create('finished_goods', function (Blueprint $table) {
            $table->increments('fg_id');
            $table->unsignedInteger('fodl_id');
            $table->string('fg_code', 255);
            $table->string('fg_desc', 255);
            $table->unsignedInteger('monthYear');
            $table->foreign('fodl_id')->references('fodl_id')->on('fodl')->onDelete('cascade');
        });

        // Formulations Table
        Schema::create('formulations', function (Blueprint $table) {
            $table->increments('formulation_id');
            $table->string('formulation_no', 255);
            $table->unsignedInteger('fg_id');
            $table->longText('material_qty_list');
            $table->foreign('fg_id')->references('fg_id')->on('finished_goods')->onDelete('cascade');
            $table->timestamps();
        });

        // Material Table
        Schema::create('materials', function (Blueprint $table) {
            $table->increments('material_id');
            $table->string('material_desc', 255);
            $table->decimal('material_cost', 10, 2);
            $table->string('unit', 10);
            $table->date('date');
        });

        // Inventory Table
        Schema::create('inventory', function (Blueprint $table) {
            $table->increments('inventory_id');
            $table->unsignedInteger('material_id');
            $table->enum('stock_status', ['In Stock', 'Low Stock']);
            $table->decimal('material_qty', 10, 2);
            $table->decimal('distributed_qty', 10, 2);
            $table->decimal('stock_qty', 10, 2);
            $table->foreign('material_id')->references('material_id')->on('materials')->onDelete('cascade');
            $table->timestamps();
        });

        // Article Table
        Schema::create('articles', function (Blueprint $table) {
            $table->increments('article_id');
            $table->longText('content');
            $table->timestamps();
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
    }
};
