@extends('layouts.app')

@section('content')
    <div class="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-8">
        <h2 class="text-3xl font-bold mb-6 text-gray-800">Purchase Subscription</h2>

        <!-- User Subscription Status -->
        <div class="bg-gray-50 p-6 rounded-lg shadow-md mb-8">
            <h2 class="text-2xl font-semibold mb-4 text-gray-700">Your Subscription Status</h2>
            @if (Auth::check())
                @php
                    $user = Auth::user();
                    $subscription = $user->subscription;
                @endphp

                @if ($subscription)
                    <p class="text-lg font-semibold">Current Pack: {{ ucfirst($subscription->pack_type) }}</p>
                    <p class="text-gray-600">Expires At: {{ $subscription->expires_at }}</p>
                @else
                    <p class="text-lg">You do not have an active subscription.</p>
                @endif
            @else
                <p class="text-lg">Please log in to view your subscription status.</p>
            @endif
        </div>

        <!-- Display Validation Errors -->
        @if ($errors->any())
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8">
                <ul>
                    @foreach ($errors->all() as $error)
                        <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
        @endif

        <!-- Subscription Packs -->
        <div class="flex flex-col md:flex-row md:space-x-8 space-y-8 md:space-y-0">
            <!-- Student Pack -->
            <div class="flex-1 bg-blue-100 p-6 rounded-lg shadow-lg border border-blue-300 flex flex-col items-center">
                <div class="mb-4">
                    <i class="fa-solid fa-graduation-cap text-3xl"></i>
                </div>
                <h3 class="text-xl font-semibold mb-4 text-gray-800">Student Pack</h3>
                <p class="text-lg mb-4">10 Credits - 1 Month</p>
                <p class="text-gray-600 mb-4">Ideal for students needing a basic pack with essential features.</p>
                <p class="font-bold text-gray-800">Price: 10 Credits</p>
                <button onclick="openModal('student')" class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300">Select</button>
            </div>

            <!-- Standard Pack -->
            <div class="flex-1 bg-green-100 p-6 rounded-lg shadow-lg border border-green-300 flex flex-col items-center">
                <div class="mb-4">
                    <i class="fa-solid fa-tree text-3xl"></i>
                </div>
                <h3 class="text-xl font-semibold mb-4 text-gray-800">Standard Pack</h3>
                <p class="text-lg mb-4">20 Credits - 1 Month</p>
                <p class="text-gray-600 mb-4">A balanced option with additional features for regular users.</p>
                <p class="font-bold text-gray-800">Price: 20 Credits</p>
                <button onclick="openModal('standard')" class="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300">Select</button>
            </div>

            <!-- Premium Pack -->
            <div class="flex-1 bg-yellow-100 p-6 rounded-lg shadow-lg border border-yellow-300 flex flex-col items-center">
                <div class="mb-4">
                    <i class="fa-solid fa-shield text-3xl"></i>
                </div>
                <h3 class="text-xl font-semibold mb-4 text-gray-800">Premium Pack</h3>
                <p class="text-lg mb-4">30 Credits - 1 Month</p>
                <p class="text-gray-600 mb-4">For users who want all the features with premium access.</p>
                <p class="font-bold text-gray-800">Price: 30 Credits</p>
                <button onclick="openModal('premium')" class="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition duration-300">Select</button>
            </div>
        </div>
    </div>

    <div id="subscriptionModal" class="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center hidden">
        <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h3 class="text-xl font-semibold mb-4" id="modalTitle">Confirm Your Subscription</h3>
            <ul class="list-disc list-inside text-gray-600 mb-4" id="modalDetails">
                <!-- List items will be dynamically populated here -->
            </ul>
            <form method="POST" action="{{ route('subscribe.purchase') }}">
                @csrf
                <input type="hidden" name="pack" id="selectedPack">
                <div class="flex justify-end space-x-4">
                    <button type="button" onclick="closeModal()" class="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition">Cancel</button>
                    <button type="submit" class="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition">Confirm</button>
                </div>
            </form>
        </div>
    </div>
    

    <script>
        let packDetails = {
            student: {
                title: 'Student Pack',
                details: [
                    'AI tools for writing',
                    'Space creating options',
                    'Ideal for students'
                ]
            },
            standard: {
                title: 'Standard Pack',
                details: [
                    'Includes all from Student Pack',
                    'Monetization options',
                    'Perfect for regular users'
                ]
            },
            premium: {
                title: 'Premium Pack',
                details: [
                    'Includes all from Standard Pack',
                    'Profile customization',
                    'Full feature access'
                ]
            }
        };
    
        function openModal(pack) {
            document.getElementById('modalTitle').innerText = `Confirm Subscription: ${packDetails[pack].title}`;
    
            let detailsList = document.getElementById('modalDetails');
            detailsList.innerHTML = ''; // Clear previous list
    
            // Create a list of details for the selected pack
            packDetails[pack].details.forEach(detail => {
                let li = document.createElement('li');
                li.innerText = detail;
                detailsList.appendChild(li);
            });
    
            document.getElementById('selectedPack').value = pack;
            document.getElementById('subscriptionModal').classList.remove('hidden');
        }
    
        function closeModal() {
            document.getElementById('subscriptionModal').classList.add('hidden');
        }
    </script>
    
@endsection
