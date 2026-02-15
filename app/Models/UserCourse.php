<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserCourse extends Model
{
    protected $table = 'user_course'; // If the table name is different
    protected $fillable = ['user_id', 'course_id', 'score']; // Add score to fillable attributes

    // Define relationships if needed
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
