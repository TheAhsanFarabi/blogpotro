@extends('layouts.app')

@section('content')
<div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Reports Dashboard</h1>

    <!-- Reports Table -->
    <div class="overflow-x-auto bg-white shadow-md rounded-lg">
        <table class="min-w-full bg-white">
            <thead class="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                    <th class="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User/Blog</th>
                    <th class="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Reason</th>
                    <th class="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Details</th>
                    <th class="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                @foreach ($reports as $report)
                <!-- Skip reports with deleted users -->
                @if ($report->reported_user_id && !$report->reportedUser)
                    @continue
                @endif
                <tr>
                    <!-- Reported User/Blog -->
                    <td class="px-5 py-4 whitespace-nowrap">
                        @if ($report->reported_user_id)
                        <a href="{{ route('profile.show', $report->reported_user_id) }}" class="text-indigo-600 hover:text-indigo-900 font-semibold">
                            {{ $report->reportedUser->name }}
                        </a>
                        @elseif ($report->reported_blog_id)
                        <a href="{{ route('blog.show', $report->reported_blog_id) }}" class="text-indigo-600 hover:text-indigo-900 font-semibold">
                            {{ $report->reportedBlog->title }}
                        </a>
                        @endif
                    </td>

                    <!-- Report Reason -->
                    <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-600">
                        {{ $report->reason }}
                    </td>

                    <!-- Report Details -->
                    <td class="px-5 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ $report->details }}
                    </td>

                    <!-- Action Buttons -->
                    <td class="px-5 py-4 whitespace-nowrap">
                        <div class="flex space-x-4">
                            @if ($report->reported_user_id)
                            <!-- Send Warning Button -->
                            <form action="{{ route('admin.warning.user', $report->reported_user_id) }}" method="POST">
                                @csrf
                                <button type="submit" class="px-4 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-600">
                                    Send Warning
                                </button>
                            </form>

                            <!-- Delete User Button -->
                            <form action="{{ route('admin.delete.user', $report->reported_user_id) }}" method="POST">
                                @csrf
                                <button type="submit" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-600">
                                    Delete User
                                </button>
                            </form>
                            @elseif ($report->reported_blog_id)
                            <!-- Delete Blog Button -->
                            <form action="{{ route('admin.delete.blog', $report->reported_blog_id) }}" method="POST">
                                @csrf
                                <button type="submit" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-600">
                                    Delete Blog
                                </button>
                            </form>
                            @endif
                        </div>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</div>
@endsection
