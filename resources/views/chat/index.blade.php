@extends('layouts.app')

@section('content')
<div class="container mx-auto p-6 flex">
    <div class="w-1/3 pr-4">
        <h2 class="text-2xl font-bold mb-4">Chats</h2>
        <div class="grid grid-cols-1 gap-4">
            @foreach ($users as $user)
            <a href="{{ route('chat.show', $user->id) }}" class="block p-4 bg-white shadow rounded-lg hover:bg-gray-100">
                <div class="flex items-center">
                    @if ($user->profile_picture)
                        <img src="{{ asset('storage/images/' . $user->profile_picture) }}" alt="Profile Picture" class="w-12 h-12 rounded-full object-cover mr-4">
                    @else
                        <img src="https://via.placeholder.com/50" alt="Default Avatar" class="w-12 h-12 rounded-full object-cover mr-4">
                    @endif
                    <div>
                        <p class="text-lg font-semibold">{{ $user->name }}</p>
                    </div>
                </div>
            </a>
            @endforeach
        </div>
    </div>
    <div class="w-2/3 pl-4 border-l">
        @if (session('currentChatUser'))
            <h2 class="text-2xl font-bold mb-4">Chat with {{ session('currentChatUser')->name }}</h2>
            <div class="bg-gray-100 p-4 h-96 overflow-y-auto chat-window">
                @foreach ($messages as $message)
                    <div class="{{ $message->sender_id == Auth::id() ? 'text-right' : 'text-left' }}">
                        <div class="bg-white inline-block p-2 rounded-lg mb-2 shadow">
                            <p>{{ $message->message }}</p>
                        </div>
                    </div>
                @endforeach
            </div>
            <form id="message-form" class="mt-4">
                @csrf
                <input type="text" id="message" class="border rounded-lg p-2 w-full" placeholder="Type your message..." required>
                <button type="submit" class="mt-2 bg-blue-500 text-white rounded-lg px-4 py-2">Send</button>
            </form>
        @else
            <p class="text-gray-500">Select a user to start chatting.</p>
        @endif
    </div>
</div>

<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script>
    $(document).ready(function() {
        // Function to append messages
        function appendMessage(message, isSender) {
            var messageContainer = $('.chat-window');

            // Check if the message already exists
            if (messageContainer.find(`p:contains("${message}")`).length === 0) {
                messageContainer.append(`
                    <div class="${isSender ? 'text-right' : 'text-left'}">
                        <div class="bg-white inline-block p-2 rounded-lg mb-2 shadow">
                            <p>${message}</p>
                        </div>
                    </div>
                `);
            }
        }

        // Send a message via AJAX
        $('#message-form').on('submit', function(e) {
            e.preventDefault();

            var message = $('#message').val();
            var userId = 13;
            var $submitButton = $(this).find('button[type="submit"]');

            // Disable the button to prevent multiple submissions
            $submitButton.prop('disabled', true);
            $submitButton.text('Sending...');

            $.ajax({
                url: "{{ route('chat.store', ':userId') }}".replace(':userId', userId),
                method: 'POST',
                data: {
                    message: message,
                    _token: '{{ csrf_token() }}'
                },
                success: function(response) {
                    $('#message').val('');
                    $submitButton.prop('disabled', false).text('Send');
                    appendMessage(response.message, true);
                },
                error: function(xhr) {
                    alert('Message could not be sent.');
                    $submitButton.prop('disabled', false).text('Send');
                }
            });
        });

        // Poll for new messages
        setInterval(function() {
            var userId = 13;
            $.ajax({
                url: "{{ route('chat.fetch', ':userId') }}".replace(':userId', userId),
                method: 'GET',
                success: function(response) {
                    response.messages.forEach(function(message) {
                        if ($('.chat-window').find(`p:contains("${message.message}")`).length === 0) {
                            appendMessage(message.message, message.sender_id == {{ Auth::id() }});
                        }
                    });
                },
                error: function() {
                    console.error('Could not fetch messages.');
                }
            });
        }, 1000);
    });
</script>


@endsection
