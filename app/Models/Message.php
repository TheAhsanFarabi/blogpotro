<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    // Define the table associated with the model
    protected $table = 'messages';

    // Define fillable fields for mass assignment
    protected $fillable = [
        'sender_id',
        'receiver_id',
        'message',
    ];

    // Define relationships with the User model
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }
}
