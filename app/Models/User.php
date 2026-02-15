<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Carbon\Carbon; // Correct import of Carbon

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'bio',
        'institute',
        'dob',
        'work_experience',
        'profile_picture',
        'profile_theme',
        'verification_code',
        'credits',
        'status',        
        'avatar_effect',  
        'banner_theme',  
        'status_created_at', 
        'is_reported',
        'balance'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [ // Fixed to be an array
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'last_read_at' => 'datetime',
        'status_created_at' => 'datetime', // Make sure to cast this as datetime
        'categories' => 'array',
    ];

    // Relations and additional methods...

    public function blogs(): HasMany
    {
        return $this->hasMany(Blog::class);
    }

    public function likes(): HasMany
    {
        return $this->hasMany(Like::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function bookmarks(): BelongsToMany
    {
        return $this->belongsToMany(Blog::class, 'bookmarks');
    }

    public function followers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'followers', 'user_id', 'follower_id');
    }

    public function following(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'followers', 'follower_id', 'user_id');
    }

    public function isFollowing(User $user): bool
    {
        return $this->following->contains($user);
    }

    public function isFollowedBy(User $user): bool
    {
        return $this->followers->contains($user);
    }

    public function sentMessages(): HasMany
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function receivedMessages(): HasMany
    {
        return $this->hasMany(Message::class, 'receiver_id');
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    public function subscription()
    {
        return $this->hasOne(Subscription::class);
    }

    public function spaces()
    {
        return $this->belongsToMany(Space::class, 'space_user');
    }

    public function ads(): BelongsToMany
    {
        return $this->belongsToMany(Ad::class, 'ad_user')->withTimestamps();
    }

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'user_product');
    }

    /**
     * Check if the user's status is active (within 24 hours)
     */
    public function isStatusActive(): bool
    {
        return $this->status && $this->status_created_at && $this->status_created_at->gt(Carbon::now()->subDay());
    }


    // In User model
public function purchaseCourse(Course $course)
{
    if ($this->credits >= $course->credits_required) {
        $this->credits -= $course->credits_required;
        $this->courses()->attach($course->id); // Add the course to the user's courses
        $this->save();
        return true;
    }

    return false;
}

public function courses()
{
    return $this->belongsToMany(Course::class, 'user_course');
}

public function referral()
{
    return $this->hasOne(Referral::class);
}



}
