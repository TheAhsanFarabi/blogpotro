@extends('layouts.app')

@section('title')
Home
@endsection

@section('meta')
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="Blog-Potro | A place where your interests connect you with creative minds" />
    <meta property="og:description" content="Discover stories, thoughts and creative ideas from extraordinary blogs" />
    <meta property="og:image" content="{{ asset('images/soc-card.jpg') }}" />
    <meta property="og:url" content="{{ url()->current() }}" />
    <meta property="og:type" content="article" />

    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Blog-Potro | A place where your interests connect you with creative minds">
    <meta name="twitter:description" content="Discover stories, thoughts and creative ideas from extraordinary blogs">
    <meta name="twitter:image" content="{{ asset('images/soc-card.jpg') }}">
@endsection



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




                <x-shorts :$shorts />





                {{-- Filters --}}
                <x-filter :$categories />

                {{-- Blog Cards --}}
                <x-blog-card :$blogs />
                <!-- Pagination Links -->

                <div class="mt-6">
                    {{ $blogs->links('vendor.pagination.simple-tailwind') }}
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
