<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Feedback extends Model
{
    protected $table = 'feedbacks';
    use HasFactory;
    protected $fillable = ['topic', 'details', 'email'];
}
