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
            $table->text('bio')->nullable();
            $table->string('institute')->nullable();
            $table->date('dob')->nullable();
            $table->text('work_experience')->nullable();
            $table->string('profile_theme')->default('default-theme'); // default theme value
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['bio', 'institute', 'dob', 'work_experience', 'profile_theme']);
        });
    }
};
