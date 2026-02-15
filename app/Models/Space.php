<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Space extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'created_by', 'cover_picture'];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'space_user', 'space_id', 'user_id'); // Make sure to specify the pivot table
    }

    public function invitations()
    {
        return $this->hasMany(Invitation::class);
    }

    public function blogs()
    {
        return $this->hasMany(CollabBlog::class);
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
}
