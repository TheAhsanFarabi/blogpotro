<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    use HasFactory;
    protected $fillable = ['user_id', 'challenge_id', 'submission_text'];


    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function winner()
{
    return $this->hasOne(Submission::class)->where('is_winner', true);
}



}