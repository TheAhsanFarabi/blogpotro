@extends('layouts.app')

@section('content')
<div class="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
    <h1 class="text-2xl font-bold text-gray-800 mb-4">Your Streaks</h1>

    <div class="calendar">
        @php
            $currentDate = now()->startOfMonth();
            $endDate = now()->endOfMonth();
            $startDayOfWeek = $currentDate->dayOfWeek; // Get the first day of the month (Sunday = 0)
            $daysInMonth = $currentDate->daysInMonth;
            $today = now();
            $weeks = [];
            $week = [];

            // Fill initial empty days before the first day of the month
            for ($i = 0; $i < $startDayOfWeek; $i++) {
                $week[] = null;
            }

            // Fill days of the current month
            for ($day = 1; $day <= $daysInMonth; $day++) {
                $week[] = $day;
                if (count($week) === 7) {
                    $weeks[] = $week;
                    $week = [];
                }
            }

            // Fill remaining days in the last week with null if necessary
            if (count($week) > 0) {
                for ($i = count($week); $i < 7; $i++) {
                    $week[] = null;
                }
                $weeks[] = $week;
            }
        @endphp

        <!-- Calendar Table -->
        <table class="table-auto w-full text-center border-collapse">
            <thead>
                <tr>
                    @foreach (['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as $day)
                        <th class="border-b-2 p-2 font-bold text-gray-800">{{ $day }}</th>
                    @endforeach
                </tr>
            </thead>
            <tbody>
                @foreach ($weeks as $week)
                    <tr>
                        @foreach ($week as $day)
                            @php
                                $currentDate = now()->startOfMonth()->setDay($day);
                                $hasStreak = $day && $streaks->contains('date', $currentDate->toDateString());
                            @endphp
                            <td class="p-4 border
                                {{ $day === null ? 'bg-white' : ($currentDate->isToday() ? 'bg-blue-200 text-white' : 'bg-gray-100 text-gray-800') }}">
                                
                                <!-- Display day number -->
                                @if ($day)
                                    <div class="text-lg font-semibold">{{ $day }}</div>

                                    <!-- Show fire icon if there's a streak -->
                                    @if ($hasStreak)
                                        <div class="text-red-500 mt-2">
                                            <i class="fas fa-fire"></i>
                                        </div>
                                    @else
                                        <!-- Show empty circle for non-streak days -->
                                        <div class="bg-gray-300 h-6 w-6 mx-auto rounded-full mt-2"></div>
                                    @endif
                                @endif
                            </td>
                        @endforeach
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</div>
@endsection
