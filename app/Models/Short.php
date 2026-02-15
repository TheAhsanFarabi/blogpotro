<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Short extends Model
{
    protected $fillable = ['user_id', 'image', 'text'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

