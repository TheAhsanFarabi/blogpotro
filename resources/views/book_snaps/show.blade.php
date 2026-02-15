@extends('layouts.app')

@section('content')
<div class="container mx-auto mt-4">
    <div class="bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <!-- Flex container for image and content -->
        <div class="flex flex-col md:flex-row items-start">
            <!-- Book cover photo with smaller size -->
            <div class="w-full md:w-1/3 mb-4 md:mb-0">
                <img src="{{ asset('storage/' . $bookSnap->cover_photo) }}" alt="{{ $bookSnap->title }}" class="h-1/3 object-cover rounded-lg">
            </div>

            <!-- Book details (title, summary, link) -->
            <div class="md:ml-6 w-full md:w-2/3">
                <!-- Book title -->
                <h1 class="text-2xl font-bold mb-4">{{ $bookSnap->title }}</h1>

                <!-- Full book summary -->
                <p class="text-gray-700 mb-6">{{ $bookSnap->summary }}</p>

                <!-- Affiliate link -->
                <a href="{{ $bookSnap->affiliate_link }}" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Buy Now</a>

                <!-- Back to list link -->
                <a href="{{ route('book_snaps.index') }}" class="text-blue-500 hover:underline mt-4 block">Back to Book Snaps</a>
            </div>
        </div>
    </div>
</div>
@endsection
