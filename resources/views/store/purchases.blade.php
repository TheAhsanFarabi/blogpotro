@extends('layouts.app')

@section('content')
    <div class="container mx-auto py-8">
        <h1 class="text-2xl font-bold mb-6">Your Purchases</h1>

        @if($purchases->isEmpty())
            <div class="bg-yellow-200 p-4 rounded-md">
                <p class="text-gray-700">You have not purchased any items yet.</p>
            </div>
        @else
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                @foreach($purchases as $purchase)
                    <div class="bg-white p-4 rounded-lg shadow-lg border border-gray-300">
                        <img src="{{ asset('storage/' . $purchase->product->image_path) }}" alt="Product Image" class="w-full h-48 object-cover mb-4 rounded-lg">
                        <h3 class="text-xl font-semibold text-gray-700">{{ $purchase->product->name }}</h3>
                        <p class="text-gray-600">{{ $purchase->product->description }}</p>
                        <p class="text-gray-800 mt-2 font-bold">{{ $purchase->product->price }} credits</p>
                        <p class="text-green-500 mt-2">You own this product!</p>
                    </div>
                @endforeach
            </div>
        @endif
    </div>
@endsection
