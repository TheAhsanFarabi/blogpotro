@extends('layouts.app')

@section('content')
    <div class="container mx-auto py-8">
        <div class="bg-white p-6 rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Product Image -->
            <div>
                <img src="{{ asset('storage/' . $product->image_path) }}" alt="{{ $product->name }}" class="w-full h-auto rounded-lg shadow-md">
            </div>
            
            <!-- Product Details -->
            <div>
                <h1 class="text-2xl font-semibold text-gray-800">{{ $product->name }}</h1>
                <p class="text-gray-600 mt-4">{{ $product->description }}</p>
                <p class="text-gray-800 mt-2 font-bold">{{ $product->price }} credits</p>

                <form action="{{ route('store.purchase', $product->id) }}" method="POST">
                    @csrf
                    <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 mt-6">
                        Purchase
                    </button>
                </form>
            </div>
        </div>
    </div>
@endsection
