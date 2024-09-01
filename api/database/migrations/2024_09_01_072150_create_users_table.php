<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id('user_id');
            $table->enum('user_type', ['Regular', 'Admin']);
            $table->string('first_name', 255);
            $table->string('middle_name', 255)->nullable();
            $table->string('last_name', 255);
            $table->string('email_address', 255)->unique();
            $table->string('employee_number', 255)->nullable();
            $table->string('employee_suffix', 5)->nullable();
            $table->string('phone', 255)->nullable();
            $table->string('department', 100)->nullable();
            $table->string('employee_role', 255)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
