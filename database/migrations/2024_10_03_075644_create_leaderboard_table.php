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
        Schema::create('leaderboard', function (Blueprint $table) {
            $table->id(); // Auto-incrementing ID
            $table->unsignedBigInteger('user_id')->unique(); // User ID, assuming users table has this ID
            $table->decimal('wpm', 8, 2)->nullable(); // Words Per Minute for TypeWizard
            $table->integer('synonym_score')->default(0); // Synonym score for Synonym Game
            $table->integer('vocabulary_score')->default(0); // Vocabulary score for Complete a Sentence Game
            $table->timestamps(); // Created at and updated at timestamps

            // Foreign key constraint
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade'); // Assuming a users table exists
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leaderboard');
    }
};
