@extends('layouts.app')

@section('content')
    <div class="container mx-auto mt-8">

        {{-- Success Message --}}
        @if (session('success'))
            <div class="mb-4 rounded border-l-4 border-green-500 bg-green-100 p-4 text-green-700">
                {{ session('success') }}
            </div>
        @endif

        {{-- Error Message --}}
        @if ($errors->any())
            <div class="mb-4 rounded border-l-4 border-red-500 bg-red-100 p-4 text-red-700">
                {{ $errors->first() }}
            </div>
        @endif

        {{-- 2 Column Layout --}}
        <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
            {{-- Left Column --}}
            <div>

                {{-- Credits Display --}}
                <h2 class="mb-6 text-2xl font-bold">Your Credits</h2>
                <div class="mb-6 rounded-lg bg-green-200 bg-white p-6 text-center shadow-md">
                    <h4 class="text-3xl font-bold">
                        {{ $credits }}
                        <i class="fas fa-bolt text-yellow-500"></i>
                    </h4>
                </div>

                {{-- Redeem Coupon Section --}}
                <h3 class="mb-4 text-xl font-bold">Redeem a Coupon</h3>
                <form action="{{ route('credits.redeem') }}" method="POST" class="space-y-4">
                    @csrf
                    <div>
                        <label for="coupon_code" class="block text-sm font-medium text-gray-700">Enter Coupon Code:</label>
                        <input type="text" id="coupon_code" name="coupon_code"
                            class="mt-1 block w-full rounded-md border border-gray-300 p-3 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Enter code" required>
                    </div>
                    <button type="submit"
                        class="rounded-md bg-blue-500 px-4 py-2 text-white shadow transition duration-200 hover:bg-blue-600">
                        Redeem Coupon
                    </button>
                </form>

                {{-- Watch Ads Section --}}
                <div class="mt-8">
                    <h3 class="mb-4 text-xl font-bold">Watch Ads to Earn Credits</h3>
                    <div class="mb-4 rounded-lg bg-white p-6 shadow-md">
                        <p class="mb-4 text-gray-700">Watch a short ad and earn 1 credit per ad watched.</p>
                        <a href="/ads"
                            class="rounded-md bg-green-500 px-4 py-2 text-white shadow transition duration-200 hover:bg-green-600">
                            Watch Ad
                        </a>
                    </div>
                </div>
            </div>

            {{-- Right Column --}}
            <div>
                {{-- How Credits Work --}}
                <h3 class="mb-4 text-2xl font-bold">How Credits Work</h3>
                <div class="rounded-lg bg-white p-6 shadow-md">
                    <p class="mb-4 text-gray-700">
                        Credits are the main currency system used in Blogpotro. Users can earn or purchase credits to access
                        various services and features across the platform.
                    </p>
                    <ul class="list-inside list-disc space-y-2 text-gray-700">
                        <li>Earn credits through creative activities such as writing challenges, content creation, or
                            completing tasks.</li>
                        <li>Use credits to unlock premium services such as advanced AI writing tools, monetization options,
                            and profile customization.</li>
                        <li>Watch ads or redeem coupon codes to gain additional credits without any cost.</li>
                    </ul>
                </div>

                {{-- Coming Soon Section --}}
                <div class="mt-8">
                    <h3 class="text-xl font-bold">Coming Soon: Payment System</h3>
                    <p class="mb-4 text-gray-700">We are working on integrating a payment system to allow you to purchase
                        more credits. Stay tuned!</p>
                    <div class="flex space-x-4">
                        <span class="text-3xl"><i class="fab fa-paypal"></i></span>
                        <span class="text-3xl"><i class="fab fa-google-pay"></i></span>
                        <span class="text-3xl"><i class="fab fa-cc-visa"></i></span>
                    </div>
                </div>

            </div>
        </div>
    </div>
@endsection
