@extends('layouts.app')

@section('content')
<div class="container mx-auto mt-4">

    <!-- Create Snap Button (Visible to authorized users only, e.g., admins or specific roles) -->
    
    <div class="mb-4">
        <a href="{{ route('book_snaps.create') }}" class="bg-blue-500 text-white px-4 py-2 rounded">
            Create Book Snap
        </a>
    </div>
    

    <h1 class="text-2xl font-bold mb-4">Approved Book Snaps</h1>

    <!-- Horizontal scroll wrapper for book snaps with a custom horizontal scrollbar -->
    <div class="relative">
        <div class="custom-scrollbar flex overflow-x-auto space-x-4 py-4 snap-x snap-mandatory" id="book-snap-container">
            @foreach($bookSnaps as $snap)
            <div class="min-w-[300px] bg-white shadow-md rounded-lg p-4 border border-gray-200 flex-shrink-0 snap-start">
                <!-- Full-size cover photo -->
                <img src="{{ asset('storage/' . $snap->cover_photo) }}" alt="{{ $snap->title }}" class="w-full h-60 object-cover mb-4 rounded-lg">

                <!-- Book title -->
                <h2 class="text-lg font-semibold">{{ $snap->title }}</h2>
                
                <!-- View details button to go to show page -->
                <a href="{{ route('book_snaps.show', $snap->id) }}" class="text-blue-500 hover:underline mt-2">View Details</a>

                <!-- Affiliate link -->
                <a href="{{ $snap->affiliate_link }}" class="text-blue-500 hover:underline mt-2 block">Buy Now</a>
            </div>
            @endforeach
        </div>
    </div>

    <!-- Pagination Links -->
    <div class="mt-4">
        {{ $bookSnaps->links() }}
    </div>
</div>

<!-- Custom CSS for Horizontal Scrollbar -->
<style>
    /* Custom scroll container */
    .custom-scrollbar {
        scrollbar-width: thin; /* For Firefox */
        scrollbar-color: #4299e1 #edf2f7; /* Thumb and track color */
    }

    /* For WebKit browsers (Chrome, Safari) */
    .custom-scrollbar::-webkit-scrollbar {
        height: 8px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: #4299e1; /* Thumb color */
        border-radius: 10px; /* Rounded thumb */
    }
    
    .custom-scrollbar::-webkit-scrollbar-track {
        background-color: #edf2f7; /* Track color */
    }

    /* Optional smooth scrolling for a better user experience */
    .custom-scrollbar {
        scroll-behavior: smooth;
    }
</style>
@endsection
