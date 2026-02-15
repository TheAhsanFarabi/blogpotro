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
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable(); // The user who created the report
            $table->unsignedBigInteger('reported_user_id')->nullable(); // The reported user
            $table->unsignedBigInteger('reported_blog_id')->nullable(); // The reported blog
            $table->string('reason'); // Reason for reporting
            $table->text('details')->nullable(); // Detailed explanation
            $table->boolean('resolved')->default(false); // If the report is resolved
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
