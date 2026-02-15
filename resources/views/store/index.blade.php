@extends('layouts.app')

@section('content')
<x-heading bgColor="bg-red-400">
    Blogpotro Store
</x-heading>
<div class="container mx-auto py-8">
    <!-- Enhanced Announcement for offers -->
<div class="bg-gradient-to-r from-yellow-100 to-yellow-600 text-black p-8 rounded-lg mb-8 text-center shadow-lg transition-transform transform hover:scale-105">
    <h2 class="text-3xl font-bold">Special Offer</h2>
    <p class="text-xl mt-3">
        Get <span class="font-extrabold text-red-600">50% off</span> on all products! Limited time only!
    </p>
</div>

<!-- My Purchases Link -->
<div class="mt-8">
    <a href="{{ route('purchases.index') }}" class="my-3 text-2xl w-1/3 flex items-center justify-center bg-blue-500 rounded-lg p-6 text-white hover:bg-blue-400 transition duration-300 transform hover:scale-105 shadow-md">
My Purchases
    </a>
</div>


    @if(session('success'))
        <div class="bg-green-500 text-white p-4 rounded-md mb-6">
            {{ session('success') }}
        </div>
    @endif

    <!-- Product Sections -->
    <div class="space-y-8">
        <!-- T-Shirts Section -->
        <div>
            <h2 class="text-2xl font-bold mb-4">T-Shirts</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                @foreach($products as $product)
                    @if($product->type === 'tshirt')
                        @php
                            $userPurchasesCount = \App\Models\Purchase::where('user_id', auth()->id())
                                ->where('product_id', $product->id)
                                ->count();
                            $maxPurchasable = 10 - $userPurchasesCount;
                        @endphp

                        <div class="bg-white p-4 rounded-lg shadow-lg border border-gray-300 transition-transform duration-300 hover:shadow-xl">
                            <img src="{{ asset('storage/' . $product->image_path) }}" alt="Product Image" class="w-full h-48 object-cover mb-4 rounded-lg">
                            <h3 class="text-xl font-semibold text-gray-700">{{ $product->name }}</h3>
                            <p class="text-gray-800 mt-2 font-bold">{{ $product->price }} credits</p>
                            @if($maxPurchasable <= 9)
                                <p class="text-red-500 font-semibold mt-2">Out of Stock</p>
                            @else
                            <p class="text-gray-600 mt-1">Stock: {{ $maxPurchasable }}</p> <!-- Show remaining purchasable -->
                            <a href="{{ route('store.show', $product->id) }}" class="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600">
                                View Product
                            </a>
                            @endif
                        </div>
                    @endif
                @endforeach
            </div>
        </div>

        <!-- Books Section -->
        <div>
            <h2 class="text-2xl font-bold mb-4">Books</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                @foreach($products as $product)
                    @if($product->type === 'book')
                        @php
                            $userPurchasesCount = \App\Models\Purchase::where('user_id', auth()->id())
                                ->where('product_id', $product->id)
                                ->count();
                            $maxPurchasable = 10 - $userPurchasesCount;
                        @endphp
            
                        <div class="bg-white p-4 rounded-lg shadow-lg border border-gray-300 transition-transform duration-300 hover:shadow-xl">
                            <img src="{{ asset('storage/' . $product->image_path) }}" alt="Product Image" class="w-full h-48 object-cover mb-4 rounded-lg">
                            <h3 class="text-xl font-semibold text-gray-700">{{ $product->name }}</h3>
                            <p class="text-gray-800 mt-2 font-bold">{{ $product->price }} credits</p>
                            {{-- <p class="text-gray-600 mt-1">Stock: {{ $maxPurchasable }}</p> <!-- Show remaining purchasable --> --}}
            
                            @if($maxPurchasable <= 0)
                                <p class="text-red-500 font-semibold mt-2">Out of Stock</p>
                            @else
                                @if($product->file_path)
                                    <div class="flex items-center mt-4">
                                        <a href="{{ asset('storage/' . $product->file_path) }}" class="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600">
                                            Download PDF
                                        </a>
                                    </div>
                                @else
                                    <a href="{{ route('store.show', $product->id) }}" class="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600">
                                        View Product
                                    </a>
                                @endif
                            @endif
                        </div>
                    @endif
                @endforeach
            </div>
            
        </div>

        <!-- Notebooks Section -->
        <div>
            <h2 class="text-2xl font-bold mb-4">Notebooks</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                @foreach($products as $product)
                    @if($product->type === 'notebook')
                        @php
                            $userPurchasesCount = \App\Models\Purchase::where('user_id', auth()->id())
                                ->where('product_id', $product->id)
                                ->count();
                            $maxPurchasable = 10 - $userPurchasesCount;
                        @endphp

                        <div class="bg-white p-4 rounded-lg shadow-lg border border-gray-300 transition-transform duration-300 hover:shadow-xl">
                            <img src="{{ asset('storage/' . $product->image_path) }}" alt="Product Image" class="w-full h-48 object-cover mb-4 rounded-lg">
                            <h3 class="text-xl font-semibold text-gray-700">{{ $product->name }}</h3>
                            <p class="text-gray-800 mt-2 font-bold">{{ $product->price }} credits</p>
                            <p class="text-gray-600 mt-1">Stock: {{ $maxPurchasable }}</p> <!-- Show remaining purchasable -->
                            
                            <a href="{{ route('store.show', $product->id) }}" class="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600">
                                View Product
                            </a>
                        </div>
                    @endif
                @endforeach
            </div>
        </div>
    </div>

   
</div>
@endsection
