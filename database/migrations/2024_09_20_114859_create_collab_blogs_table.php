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
        Schema::create('collab_blogs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('space_id')->constrained(); // Reference to the Space
            $table->foreignId('author_id')->constrained('users'); // Reference to the User
            $table->string('title');
            $table->text('content');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('collab_blogs');
    }
};
