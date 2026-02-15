@extends('layouts.app')

@section('content')
<div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

    <a href="/admin/feedbacks" class="px-4 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-600">
        Review Feedbacks
    </a>

    <a href="/admin/reports" class="px-4 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-600">
        Review Reports
    </a>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Total Users -->
        <div class="bg-white shadow-lg rounded-lg p-4">
            <h2 class="text-xl font-semibold text-gray-700">Total Users</h2>
            <p class="text-4xl font-bold text-blue-600">{{ $userCount }}</p>
        </div>

        <!-- Total Blogs -->
        <div class="bg-white shadow-lg rounded-lg p-4">
            <h2 class="text-xl font-semibold text-gray-700">Total Blogs</h2>
            <p class="text-4xl font-bold text-green-600">{{ $blogCount }}</p>
        </div>

        <!-- Remaining Credits -->
        <div class="bg-white shadow-lg rounded-lg p-4">
            <h2 class="text-xl font-semibold text-gray-700">Remaining Credits</h2>
            <p class="text-4xl font-bold text-red-600">{{ $remainingCredits }}</p>
            <p class="text-sm text-gray-500">(Out of 10,000)</p>
        </div>

         <!-- Total Spaces -->
         <div class="bg-white shadow-lg rounded-lg p-4">
            <h2 class="text-xl font-semibold text-gray-700">Total Spaces</h2>
            <p class="text-4xl font-bold text-green-600">{{ $spaceCount}}</p>
        </div>

         <!-- Total Snaps -->
         <div class="bg-white shadow-lg rounded-lg p-4">
            <h2 class="text-xl font-semibold text-gray-700">Total Snaps</h2>
            <p class="text-4xl font-bold text-green-600">{{ $snapCount }}</p>
        </div>

         <!-- Total Shorts -->
         <div class="bg-white shadow-lg rounded-lg p-4">
            <h2 class="text-xl font-semibold text-gray-700">Total Shorts</h2>
            <p class="text-4xl font-bold text-green-600">{{ $shortCount }}</p>
        </div>
    </div>

    <!-- Graphs -->
    <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Blogs by Category Graph -->
        <div class="bg-white shadow-lg rounded-lg p-4">
            <h2 class="text-xl font-semibold text-gray-700 mb-4">Blogs by Category</h2>
            <canvas id="blogsByCategoryChart"></canvas>
        </div>

         <!-- Ads Watched Per Ad Chart -->
    <div class="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Ads Watched Per Ad</h2>
        <canvas id="adsWatchedChart"></canvas>
    </div>

    <!-- Subscriptions Purchased Chart -->
    <div class="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Subscriptions Purchased</h2>
        <canvas id="subscriptionsChart"></canvas>
    </div>





        
    </div>


      <!-- Most Liked Blogs -->
      <div class="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Most Liked Blogs</h2>
        <table class="min-w-full divide-y divide-gray-200">
            <thead>
                <tr>
                    <th class="px-4 py-2">Blog Title</th>
                    <th class="px-4 py-2">Author</th>
                    <th class="px-4 py-2">Likes</th>
                </tr>
            </thead>
            <tbody>
                @foreach($mostLikedBlogs as $blog)
                <tr>
                    <td class="border px-4 py-2">{{ $blog->title }}</td>
                    <td class="border px-4 py-2">{{ $blog->user->name }}</td>
                    <td class="border px-4 py-2">{{ $blog->likes_count }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <!-- Most Viewed Blogs -->
    <div class="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Most Viewed Blogs</h2>
        <table class="min-w-full divide-y divide-gray-200">
            <thead>
                <tr>
                    <th class="px-4 py-2">Blog Title</th>
                    <th class="px-4 py-2">Author</th>
                    <th class="px-4 py-2">Views</th>
                </tr>
            </thead>
            <tbody>
                @foreach($mostViewedBlogs as $blog)
                <tr>
                    <td class="border px-4 py-2">{{ $blog->title }}</td>
                    <td class="border px-4 py-2">{{ $blog->user->name }}</td>
                    <td class="border px-4 py-2">{{ $blog->views }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

   
</div>

<!-- Chart.js CDN -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<script>
    // Blogs by Category Data
    const blogsByCategoryData = {
        labels: {!! json_encode($blogCategories->keys()) !!}, // Category IDs or Names
        datasets: [{
            label: 'Blogs Count',
            data: {!! json_encode($blogCategories->values()) !!},
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
        }]
    };


    // Configs for Charts
    const configBlogsByCategory = {
        type: 'bar',
        data: blogsByCategoryData,
        options: { responsive: true }
    };


    // Render Charts
    const blogsByCategoryChart = new Chart(
        document.getElementById('blogsByCategoryChart'),
        configBlogsByCategory
    );


    // Ads Watched Chart Data
    const adsWatchedData = {
        labels: @json($adsWatchedPerAd->pluck('ad_id')),
        datasets: [{
            label: 'User Count per Ad',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            data: @json($adsWatchedPerAd->pluck('user_count'))
        }]
    };

    // Render Ads Watched Chart
    const adsWatchedCtx = document.getElementById('adsWatchedChart').getContext('2d');
    const adsWatchedChart = new Chart(adsWatchedCtx, {
        type: 'bar',
        data: adsWatchedData,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Subscriptions Chart Data
    const subscriptionsData = {
        labels: @json($subscriptionsPurchased->pluck('pack_type')),
        datasets: [{
            label: 'Subscription Count',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            data: @json($subscriptionsPurchased->pluck('count'))
        }]
    };

    // Render Subscriptions Chart
    const subscriptionsCtx = document.getElementById('subscriptionsChart').getContext('2d');
    const subscriptionsChart = new Chart(subscriptionsCtx, {
        type: 'bar',
        data: subscriptionsData,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });


</script>
@endsection
