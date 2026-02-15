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
        Schema::create('invitations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('space_id')->constrained('spaces')->onDelete('cascade'); // Reference to the space
            $table->foreignId('sender_id')->constrained('users'); // Reference to the sender
            $table->string('email'); // Invitee's email
            $table->boolean('accepted')->default(false); // Status of the invitation
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invitations');
    }
};
