<div class="bg-gray-100 p-4 rounded-lg shadow">
    <div class="flex items-center mb-4">
        <img src="{{ asset('storage/images/' . $user->profile_picture) }}" alt="Profile Picture" class="w-10 h-10 rounded-full object-cover mr-4">
        <p class="text-lg font-semibold">{{ $user->name }}</p>
    </div>

    <div class="h-96 overflow-y-auto p-4 bg-white rounded-lg mb-4">
        @foreach ($messages as $message)
            <div class="{{ $message->sender_id === Auth::id() ? 'text-right' : 'text-left' }}">
                <div class="inline-block p-2 mb-2 rounded-lg {{ $message->sender_id === Auth::id() ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black' }}">
                    {{ $message->message }}
                </div>
            </div>
        @endforeach
    </div>

    <!-- Message input box -->
    <form action="{{ route('chat.store', $user->id) }}" method="POST" class="flex">
        @csrf
        <input type="text" name="message" class="flex-grow border rounded-l-lg p-2" placeholder="Type a message...">
        <button type="submit" class="bg-blue-500 text-white px-4 rounded-r-lg">Send</button>
    </form>
</div>
