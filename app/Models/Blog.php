<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    protected $fillable = ['title', 'content', 'image', 'user_id','credits','theme','privacy','is_pro'];

    protected $casts = [
        'theme' => 'array', // Cast theme to array when retrieved
    ];

    /**
     * Get the user that owns the blog.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function likes()
    {
        return $this->hasMany(Like::class);
    }

    public function isLikedBy(User $user)
    {
        return $this->likes()->where('user_id', $user->id)->exists();
    }

    public function comments()
    {
        return $this->hasMany(Comment::class)->whereNull('parent_id'); // Get top-level comments
    }

    public function bookmarkedBy()
    {
        return $this->belongsToMany(User::class, 'bookmarks');
    }

    public function isBookmarkedBy(User $user)
    {
        return $this->bookmarkedBy()->where('user_id', $user->id)->exists();
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
