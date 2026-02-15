<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CollabBlogHistory extends Model
{
    use HasFactory;
    protected $fillable = ['collab_blog_id', 'title', 'content','image','updated_by'];

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    // Define the relationship to the User model
    public function user()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
