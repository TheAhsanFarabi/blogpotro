<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookSnap extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'summary', 'cover_photo', 'affiliate_link', 'user_id', 'approved'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}