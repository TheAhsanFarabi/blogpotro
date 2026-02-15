<?php
namespace App\Policies;

use App\Models\User;
use App\Models\Space;

class SpacePolicy
{
    public function isMember(User $user, Space $space)
    {
        return $space->members->contains($user);
    }
}
