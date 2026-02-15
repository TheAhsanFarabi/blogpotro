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
        Schema::table('users', function (Blueprint $table) {
            $table->string('status')->nullable(); 
            $table->timestamp('status_created_at')->nullable();// The status field that lasts 24 hours
            $table->string('avatar_effect')->nullable(); // Avatar effect, could be a CSS class or URL for an effect
            $table->string('banner_theme')->nullable(); // Banner theme for profile banner customization
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('status');
            $table->dropColumn('status_created_at');
            $table->dropColumn('avatar_effect');
            $table->dropColumn('banner_theme');
        });
    }
};
