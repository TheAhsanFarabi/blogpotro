@extends('layouts.app')

@section('content')
<div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Feedbacks Dashboard</h1>

    <!-- Feedbacks Table -->
    <div class="overflow-x-auto bg-white shadow-md rounded-lg">
        <table class="min-w-full bg-white">
            <thead class="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                    <th class="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Topic</th>
                    <th class="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Details</th>
                    <th class="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                @foreach ($feedbacks as $feedback)
                <tr>
                    <td class="px-5 py-4 whitespace-nowrap">
                        {{ $feedback->topic }}
                    </td>
                    <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-600">
                        {{ $feedback->details }}
                    </td>
                    <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ $feedback->email }}
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</div>
@endsection
