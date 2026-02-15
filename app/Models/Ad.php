<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ad extends Model
{
    protected $fillable = ['title', 'video', 'active'];

    public function users()
    {
        return $this->belongsToMany(User::class, 'ad_user')->withTimestamps();
    }
}
