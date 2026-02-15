@extends('layouts.app')

@section('content')
    <div class="container mx-auto mt-8 px-4">
        <h1 class="text-3xl font-bold mb-6 text-gray-800">Search Results for "<span class="text-yellow-500">{{ $searchTerm }}</span>"</h1>

        @if($users->isNotEmpty())
            <div class="mb-8">
                <h2 class="text-2xl font-semibold text-gray-700">Users</h2>
                <ul class="space-y-4 mt-2">
                    @foreach($users as $user)
                        <li class="flex items-center p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300">
                            <img src="{{ $user->profile_picture ? asset('storage/images/' . $user->profile_picture) : asset('images/avator.jpg') }}" 
                                 alt="{{ $user->name }}" 
                                 class="h-10 w-10 rounded-full mr-4 object-cover">
                            <a href="{{ route('profile.show', $user->id) }}" class="text-blue-500 hover:text-blue-700">
                                {{ $user->name }}
                            </a>
                        </li>
                    @endforeach
                </ul>
            </div>
        @endif

        @if($blogs->isNotEmpty())
            <div>
                <h2 class="text-2xl font-semibold text-gray-700">Blogs</h2>
                <ul class="space-y-4 mt-2">
                    @foreach($blogs as $blog)
                        <li class="p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300">
                            <a href="{{ route('blogs.show', $blog->id) }}" class="text-blue-500 hover:text-blue-700">
                                {{ $blog->title }}
                            </a>
                        </li>
                    @endforeach
                </ul>
            </div>
        @endif

        <div class="mt-6">
            <a href="{{ url()->previous() }}" class="text-yellow-500 hover:underline">Go back</a>
        </div>
    </div>
@endsection
