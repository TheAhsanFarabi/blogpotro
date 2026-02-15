@extends('layouts.app')

@section('content')
    <!-- Include Chart.js from CDN -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <div class="container mx-auto py-8">
        <h1 class="mb-6 text-2xl font-bold text-center">Your Blog Analytics</h1>

        <!-- User Info Section -->
        <div class="mb-6 rounded-lg bg-white p-6 shadow flex items-center space-x-2">
            <img src="{{ Auth::user()->profile_picture ? asset('storage/images/' . Auth::user()->profile_picture) : asset('images/avator.jpg') }}" alt="Profile Picture" class="h-16 w-16 rounded-full border-2 border-teal-500">
            <h2 class="text-3xl ml-4 font-semibold">Welcome, {{ Auth::user()->name }}!</h2>
        </div>

        <!-- Withdraw Money and Premium Blogs Count -->
        <div class="flex justify-start">
            <div class="max-w-md p-4 bg-white rounded-lg shadow-md my-4 flex-1 mr-4">
                <p class="text-lg text-gray-700 mb-4">
                    Your Balance: <span class="font-bold text-teal-600 text-6xl">{{ number_format(Auth::user()->balance, 2) }} BDT</span>
                </p>
                
                <form action="" method="POST">
                    @csrf
                    <button type="submit" 
                        @if (Auth::user()->balance < 500.00) 
                            disabled 
                            class="w-full py-3 px-6 text-white font-semibold rounded-md shadow-lg bg-gray-300 cursor-not-allowed transition duration-200" 
                        @else 
                            class="w-full py-3 px-6 bg-green-500 text-white font-semibold rounded-md shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 transition duration-200" 
                        @endif
                    >
                        Withdraw Money
                    </button>
                </form>
            </div>

            <!-- Total Premium Blogs Count -->
            <div class="max-w-md p-4 bg-white rounded-lg shadow-md my-4 flex-1">
                <h3 class="text-lg text-gray-700 mb-4">Total Premium Blogs:</h3>
                <p class="text-6xl font-bold text-teal-600">
                    {{ $totalPremiumBlogs }} <!-- Ensure this variable is passed to the view -->
                </p>
            </div>
        </div>

        <!-- Analytics Chart Section -->
        <div class="mb-6 rounded-lg bg-white p-6 shadow">
            <canvas id="analyticsChart" class="h-64 w-full"></canvas>

            <script>
                const ctx = document.getElementById('analyticsChart').getContext('2d');
                const data = @json($data);

                const analyticsChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: data.labels,
                        datasets: [
                            {
                                label: 'Views',
                                data: data.views,
                                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                                borderColor: 'rgba(54, 162, 235, 1)',
                                borderWidth: 1,
                            },
                            {
                                label: 'Likes',
                                data: data.likes,
                                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                                borderColor: 'rgba(255, 99, 132, 1)',
                                borderWidth: 1,
                            },
                            {
                                label: 'Comments',
                                data: data.comments,
                                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                                borderColor: 'rgba(75, 192, 192, 1)',
                                borderWidth: 1,
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        scales: {
                            y: {
                                beginAtZero: true,
                            },
                        },
                        plugins: {
                            legend: {
                                display: true,
                            },
                        },
                    },
                });
            </script>
        </div>

        <!-- Monetization Requirements Section -->
        <div class="rounded-lg bg-white p-6 shadow">
            <h2 class="mb-4 text-lg font-semibold">Monetization Requirements</h2>

            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Total Views</label>
                <div class="relative pt-1">
                    <div class="flex justify-between">
                        <div>
                            <span class="inline-block rounded-full bg-teal-200 px-2 py-1 text-xs font-semibold uppercase text-teal-600">
                                {{ $progress['views'] }}%
                            </span>
                        </div>
                        <div>
                            <span class="inline-block text-xs font-semibold text-teal-600">
                                {{ $data['views']->sum() }}/1000
                            </span>
                        </div>
                    </div>
                    <div class="h-2 rounded bg-gray-200">
                        <div class="h-2 rounded bg-teal-600" style="width: {{ $progress['views'] }}%;"></div>
                    </div>
                </div>
            </div>

            <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Total Likes</label>
                <div class="relative pt-1">
                    <div class="flex justify-between">
                        <div>
                            <span class="inline-block rounded-full bg-teal-200 px-2 py-1 text-xs font-semibold uppercase text-teal-600">
                                {{ $progress['likes'] }}%
                            </span>
                        </div>
                        <div>
                            <span class="inline-block text-xs font-semibold text-teal-600">
                                {{ $data['likes']->sum() }}/5
                            </span>
                        </div>
                    </div>
                    <div class="h-2 rounded bg-gray-200">
                        <div class="h-2 rounded bg-teal-600" style="width: {{ $progress['likes'] }}%;"></div>
                    </div>
                </div>
            </div>

            <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700">Followers</label>
                <div class="relative pt-1">
                    <div class="flex justify-between">
                        <div>
                            <span class="inline-block rounded-full bg-teal-200 px-2 py-1 text-xs font-semibold uppercase text-teal-600">
                                {{ number_format($progress['followers'], 2) }}%
                            </span>
                        </div>
                        <div>
                            <span class="inline-block text-xs font-semibold text-teal-600">
                                {{ $data['followers'] }}/3
                            </span>
                        </div>
                    </div>
                    <div class="h-2 rounded bg-gray-200">
                        <div class="h-2 rounded bg-teal-600" style="width: {{ $progress['followers'] }}%;"></div>
                    </div>
                </div>
            </div>

            @if (!Auth::user()->is_monetized)
                <form action="{{ route('analytics.activate.monetization') }}" method="POST">
                    @csrf
                    <button type="submit"
                        @if (!$requirements['views'] || !$requirements['likes'] || !$requirements['followers']) disabled
                            class="w-full py-2 px-4 text-white font-semibold rounded-md shadow bg-gray-200" 
                        @else 
                            class="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200" 
                        @endif
                    >
                        Activate Monetization
                    </button>
                </form>
            @else
                <h3 class="font-semibold text-green-600">
                    🎉 Congrats! Your Monetization has been activated
                </h3>
            @endif
        </div>
    </div>
@endsection
