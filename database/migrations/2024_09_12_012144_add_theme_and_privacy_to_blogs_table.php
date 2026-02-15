<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('blogs', function (Blueprint $table) {
            $table->json('theme')->nullable(); // To store colors, images as JSON
            $table->enum('privacy', ['private', 'public'])->default('public'); // Privacy field
        });
    }

    public function down()
    {
        Schema::table('blogs', function (Blueprint $table) {
            $table->dropColumn('theme');
            $table->dropColumn('privacy');
        });
    }
};
