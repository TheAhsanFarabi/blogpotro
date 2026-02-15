@extends('layouts.app')

@section('content')
<div class="container mx-auto p-4">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <!-- Left Column -->
        <div class="lg:col-span-2">
            @auth
                <!-- Hero Section -->
                <x-hero />
                
            @endauth
            <!-- Search Input -->
            <x-search />
            {{-- Filters --}}
            <x-filter :$categories />

            {{-- Blog Cards --}}
            <x-blog-card :$blogs />
            <!-- Pagination Links -->
            <div class="mt-6">
                {{ $blogs->links('vendor.pagination.tailwind') }}
            </div>
        </div>

        <!-- Right Column -->
        <div class="lg:col-span-1 sticky top-20 max-h-screen">
            {{-- Featured Blogs Section --}}
            <x-featured-blogs :$featuredBlogs />

            {{-- Top Users Section --}}
            <x-top-user :$topUsers />
        </div>
    </div>
</div>
@endsection
