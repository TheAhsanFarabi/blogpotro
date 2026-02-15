<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('user_course', function (Blueprint $table) {
            $table->integer('score')->nullable(); // Add the score column
        });
    }

    public function down()
    {
        Schema::table('user_course', function (Blueprint $table) {
            $table->dropColumn('score'); // Drop the score column if needed
        });
    }
};
