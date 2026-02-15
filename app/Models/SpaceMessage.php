<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SpaceMessage extends Model
{
    protected $fillable = ['space_id', 'user_id', 'message'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function space()
    {
        return $this->belongsTo(Space::class);
    }
}
