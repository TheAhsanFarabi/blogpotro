<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CollabBlog extends Model
{
    use HasFactory;

    protected $fillable = ['space_id', 'author_id', 'title', 'content','image'];

    public function space()
    {
        return $this->belongsTo(Space::class);
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function histories()
{
    return $this->hasMany(CollabBlogHistory::class);
}


}
