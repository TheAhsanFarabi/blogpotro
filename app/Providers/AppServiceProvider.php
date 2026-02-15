<?php

namespace App\Providers;

use App\Models\Space;
use App\Policies\SpacePolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array
     */
    protected $policies = [
        Space::class => SpacePolicy::class,
    ];

    /**
     * Register any application services.
     */
    public function register(): void
    {
        // You can register other services here
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Manually register policies since this isn't AuthServiceProvider
        foreach ($this->policies as $model => $policy) {
            Gate::policy($model, $policy);
        }
    }
}
