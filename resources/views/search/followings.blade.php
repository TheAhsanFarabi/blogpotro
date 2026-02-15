@extends('layouts.app')

@section('content')
    <div class="container mx-auto mt-8 px-4">
        <h1 class="text-3xl font-bold mb-6 text-gray-800">{{ $user->name }}'s Followings</h1>

        @if($followings->isNotEmpty())
            <ul class="space-y-4">
                @foreach($followings as $following)
                    <li class="flex items-center p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300">
                        <img src="{{ $following->profile_picture ? asset('storage/images/' . $following->profile_picture) : asset('images/default-profile.png') }}" 
                             alt="{{ $following->name }}" 
                             class="h-10 w-10 rounded-full mr-4 object-cover">
                        <a href="{{ route('profile.show', $following->id) }}" class="text-blue-500 hover:text-blue-700">
                            {{ $following->name }}
                        </a>
                    </li>
                @endforeach
            </ul>
        @else
            <p>No followings found.</p>
        @endif

        <div class="mt-6">
            <a href="{{ url()->previous() }}" class="text-yellow-500 hover:underline">Go back</a>
        </div>
    </div>
@endsection
