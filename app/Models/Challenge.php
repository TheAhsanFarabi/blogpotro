<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Challenge extends Model
{
    use HasFactory;



    public function submissions()
    {
        return $this->hasMany(Submission::class);
    }

    public function winner()
    {
        return $this->hasOne(Submission::class)->where('is_winner', true);
    }
}