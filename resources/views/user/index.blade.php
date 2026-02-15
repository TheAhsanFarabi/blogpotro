@extends('layouts.app')

@section('content')
    <x-heading bgColor="bg-yellow-400">
        Blogpotro Family
    </x-heading>
    <div class="container mx-auto px-6 py-10">
        <h3 class="md:text-6xl sm:text-2xl my-6 text-center">Total User: <b>{{ $users->count() }}</b></h3>

        <div class="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 gap-6">
            @foreach ($users as $user)
                <div class="bg-white shadow-lg rounded-lg overflow-hidden">
                    <a href="{{ route('profile.show', $user->id) }}">
                        <img class="w-full h-32 object-cover"
                            src="{{ $user->profile_picture ? asset('storage/images/' . $user->profile_picture) : asset('images/avator.jpg') }}"
                            alt="User Image">
                    </a>

                    <div class="p-4">
                        <a href="{{ route('profile.show', $user->id) }}">
                            <h2 class="text-xl font-bold flex items-center">
                                {{ $user->name }}
                                @if ($user->is_admin) <!-- Check if the user is an admin -->
                                    <span class="ml-2 text-green-500 text-sm font-bold">[Admin]</span>
                                @endif
                            </h2>
                        </a>
                        <p class="text-gray-500 text-sm mt-2">Joined {{ $user->created_at->format('M d, Y') }}</p>

                        @if (auth()->user()->is_admin && !$user->is_admin) <!-- Check if the authenticated user is an admin and the user is not already an admin -->
                            <form action="{{ route('admin.make', $user->id) }}" method="POST" class="mt-2">
                                @csrf
                                <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                    Make Admin
                                </button>
                            </form>
                        @endif
                    </div>
                </div>
            @endforeach
        </div>
    </div>
@endsection
