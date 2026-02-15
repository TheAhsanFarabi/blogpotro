@extends('layouts.app')

@section('content')
<div class="container mx-auto mt-8">
    <h1 class="text-3xl font-bold mb-6">Your Spaces</h1>
    <a href="{{ route('spaces.create') }}" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4 inline-block">Create New Space</a>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @foreach($spaces as $space)
        <div class="bg-white shadow-lg rounded-lg overflow-hidden flex">
            @if($space->cover_picture)
            <div class="w-1/3">
                <img src="{{ asset('storage/' . $space->cover_picture) }}" alt="{{ $space->name }} Image" class="w-full h-full object-cover">
            </div>
            @endif

            <div class="w-2/3 p-6">
                <h2 class="text-xl font-semibold mb-2">{{ $space->name }}</h2>
                <p class="text-gray-600 mb-4">{{ Str::limit($space->description, 100) }}</p>
                <div class="flex justify-between items-center">
                    <a href="{{ route('spaces.show', $space->id) }}" class="text-blue-500 hover:underline">View Space</a>
                </div>
            </div>
        </div>

        @endforeach
    </div>
</div>
@endsection