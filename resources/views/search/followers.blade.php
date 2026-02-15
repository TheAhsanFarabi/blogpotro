@extends('layouts.app')

@section('content')
    <div class="container mx-auto mt-8 px-4">
        <h1 class="text-3xl font-bold mb-6 text-gray-800">{{ $user->name }}'s Followers</h1>

        @if($followers->isNotEmpty())
            <ul class="space-y-4">
                @foreach($followers as $follower)
                    <li class="flex items-center p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300">
                        <img src="{{ $follower->profile_picture ? asset('storage/images/' . $follower->profile_picture) : asset('images/default-profile.png') }}" 
                             alt="{{ $follower->name }}" 
                             class="h-10 w-10 rounded-full mr-4 object-cover">
                        <a href="{{ route('profile.show', $follower->id) }}" class="text-blue-500 hover:text-blue-700">
                            {{ $follower->name }}
                        </a>
                    </li>
                @endforeach
            </ul>
        @else
            <p>No followers found.</p>
        @endif

        <div class="mt-6">
            <a href="{{ url()->previous() }}" class="text-yellow-500 hover:underline">Go back</a>
        </div>
    </div>
@endsection
