@extends('layouts.app')
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

@section('content')
<div class="container mx-auto mt-10 text-center">







    <h1 class="text-3xl font-bold mb-6">Your TypeWizard Result</h1>


    

    <p class="text-lg">Words Per Minute (WPM): <span class="font-semibold">{{ $wpm }}</span></p>
    <p class="text-lg">Spelling Accuracy: <span class="font-semibold">{{ $accuracy }}%</span></p>



     <!-- Leaderboard Section -->
     <div class="my-10">
        <h2 class="text-2xl font-bold mb-4">Leaderboard</h2>
        @if($leaderboard->isEmpty())
            <p class="text-lg">No scores recorded yet.</p>
        @else
            <table class="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr class="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                        <th class="py-3 px-6 text-left">Name</th>
                        <th class="py-3 px-6 text-left">WPM</th>
                    </tr>
                </thead>
                <tbody class="text-gray-600 text-sm font-light">
                    @foreach($leaderboard as $entry)
                        <tr class="border-b border-gray-200 hover:bg-gray-100">
                            <td class="py-3 px-6">{{ $entry->user->name }}</td> <!-- Use user name -->
                            <td class="py-3 px-6">{{ $entry->wpm }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @endif
    </div>

    <div class="mt-10">
        <canvas id="wpmChart" width="400" height="200"></canvas>
    </div>

    <a href="{{ url('/games/typewizard') }}" class="mt-4 inline-block text-blue-500 underline">Play Again</a>

   
</div>

<script>
    const ctx = document.getElementById('wpmChart').getContext('2d');
    const typingData = @json($typingData); // Data from the controller

    const labels = typingData.map(data => `${data.time} sec`);
    const wpmValues = typingData.map(data => data.wpm);

    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Typing Speed (WPM)',
                data: wpmValues,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.1
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Time (seconds)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'WPM'
                    },
                    beginAtZero: true
                }
            }
        }
    });
</script>
@endsection
