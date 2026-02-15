@extends('layouts.app')

@section('content')
    <div class="container mx-auto p-4">
        <h2 class="text-2xl font-bold mb-6">Notifications</h2>
        @if ($unreadCount > 0)
            <p class="text-sm text-red-500 mb-4">You have {{ $unreadCount }} unread
                notification{{ $unreadCount > 1 ? 's' : '' }}.</p>
        @endif
        <div class="bg-white shadow-md rounded-lg">
            @if ($notifications->isEmpty())
                <p class="text-gray-500">You have no notifications.</p>
            @else
                <ul class="space-y-4">
                    @foreach ($notifications as $notification)
                        <li @class([
                            'p-4',
                            'rounded-lg',
                            'bg-blue-100' => $notification->type == 'follow',
                            'bg-green-200' => $notification->type == 'like',
                            'bg-green-100' => $notification->type == 'comment',
                            'bg-violet-100' => $notification->type == 'views',
                            'bg-yellow-200' => $notification->type == 'streaks',
                            'bg-gray-200' => $notification->type == 'challenge_winner',
                            'bg-red-200' => $notification->type == 'warning'
                        ])>

                            <div class="flex flex-col lg:flex-row justify-between">
                                <div class="flex flex-row space-x-3">
                                    @if ($notification->type == 'follow' || $notification->type == 'like' || $notification->type == 'comment')
                                        @if ($notification->data['sender_profile_pic'])
                                            <a href="{{ route('profile.show', $notification->data['sender_id']) }}"><img
                                                    src="{{ asset('storage/images/' . $notification->data['sender_profile_pic']) }}"
                                                    alt="Profile Picture" class="w-8 h-8 rounded-full"></a>
                                        @else
                                            <a href="{{ route('profile.show', $notification->data['sender_id']) }}"><img
                                                    src="{{ asset('images/avator.jpg') }}" alt="Default Avatar"
                                                    class="w-8 h-8 rounded-full"></a>
                                        @endif
                                    @else
                                        <i class="fa-solid fa-star text-3xl text-violet-500"></i>
                                    @endif
                                    <div>
                                        <p>{{ $notification->data['message'] }}
                                            @if ($notification->type !== 'follow' && $notification->type !== 'streaks' && $notification->type !== 'challenge_winner' && $notification->type !== 'warning')
                                                <a class="font-bold hover:text-blue-600"
                                                    href="{{ route('blogs.show', $notification->data['blog_id']) }}">
                                                    {{ $notification->data['blog_title'] }}</a>
                                            @endif

                                        </p>
                                        <small
                                            class="text-gray-500">{{ $notification->created_at->diffForHumans() }}</small>
                                    </div>
                                </div>
                                <!-- Mark as Read Button -->
                                @if (!$notification->is_read)
                                    <a href="{{ route('notifications.read', $notification->id) }}"
                                        class="text-sm text-blue-500 text-end hover:text-black">Mark as read</a>
                                @endif
                            </div>

                        </li>
                    @endforeach
                </ul>
            @endif
        </div>
    </div>

    {{ $notifications->links() }}

@endsection
