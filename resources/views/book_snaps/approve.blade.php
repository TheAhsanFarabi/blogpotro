@extends('layouts.app')

@section('content')
<div class="container mx-auto mt-4">
    <h1 class="text-2xl font-bold mb-4">Book Snaps Awaiting Approval</h1>

    @if(session('success'))
        <div class="bg-green-500 text-white p-2 rounded mb-4">{{ session('success') }}</div>
    @endif

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        @foreach($bookSnaps as $snap)
        <div class="bg-white shadow-md rounded-lg p-4 border border-gray-200">
            <img src="{{ asset('storage/' . $snap->cover_photo) }}" alt="{{ $snap->title }}" class="w-full h-40 object-cover mb-4">
            <h2 class="text-lg font-semibold">{{ $snap->title }}</h2>
            <p class="text-gray-600">{{ $snap->summary }}</p>
            <a href="{{ $snap->affiliate_link }}" class="text-blue-500 hover:underline">Affiliate Link</a>
            <form action="{{ route('book_snaps.approved', $snap->id) }}" method="POST" class="mt-4">
                @csrf
                <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded">Approve</button>
            </form>
        </div>
        @endforeach
    </div>
</div>
@endsection
