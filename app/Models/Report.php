<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $fillable = ['user_id', 'reported_user_id', 'reported_blog_id', 'reason', 'details', 'resolved'];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function reportedUser() {
        return $this->belongsTo(User::class, 'reported_user_id');
    }

    public function reportedBlog() {
        return $this->belongsTo(Blog::class, 'reported_blog_id');
    }
}
