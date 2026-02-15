@auth
<h3 class="text-2xl font-bold mb-6">Comments</h3>
@else
<h3 class="text-2xl font-bold mb-6">Login to comment, like and bookmark this blog</h3>
@endauth

<!-- Comment Form -->
@auth
    <form action="{{ route('comments.store', $blog->id) }}" method="POST" class="mb-6">
        @csrf
        <textarea name="content" rows="3"
            class="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            placeholder="Write a comment..."></textarea>
        <input type="hidden" name="parent_id" id="parent-id" value="">
        <button type="submit"
            class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg mt-4 shadow-md transition duration-300">Post
            Comment</button>
    </form>
@endauth

<!-- Display Comments -->
<div class="space-y-6">
    @foreach ($blog->comments as $comment)
        <div class="p-4 bg-white rounded-lg shadow-md border border-gray-200">
            <div class="flex items-center mb-4 space-x-4">
                <!-- User Profile Picture -->
                @if ($comment->user->profile_picture)
                <a href="{{ route('profile.show', $comment->user->id) }}"><img src="{{ asset('storage/images/' . $comment->user->profile_picture) }}" alt="Profile Picture"
                        class="w-12 h-12 rounded-full object-cover"></a>
                @else
                    <img src="{{ asset('images/avator.jpg') }}" alt="Default Avatar"
                        class="w-12 h-12 rounded-full object-cover">
                @endif
                <div>
                    <a href="{{ route('profile.show', $comment->user->id) }}"><p class="text-lg font-semibold text-gray-800">{{ $comment->user->name }}</p></a>
                    <p class="text-sm text-gray-500">{{ $comment->created_at->diffForHumans() }}</p>
                </div>
            </div>

            <p class="text-gray-700 mb-4">{{ $comment->content }}</p>
            <!-- Reply Button -->
            <button class="text-blue-500 font-medium text-sm"
                onclick="showReplyForm({{ $comment->id }})">Reply</button>
            <br>
             <!-- Delete Button -->
            @if (Auth::id() === $comment->user_id)
                <button type="submit" class="text-red-500 hover:text-red-600 py-2"
                    onclick="openDeleteComment()">Delete</button>
            @endif




            <!-- Nested Replies -->
            @if ($comment->replies)
                <div class="mt-4 space-y-4">
                    @foreach ($comment->replies as $reply)
                        <div class="flex items-start space-x-4">
                            @if ($reply->user->profile_picture)
                                <img src="{{ asset('storage/images/' . $reply->user->profile_picture) }}"
                                    alt="Profile Picture" class="w-10 h-10 rounded-full object-cover">
                            @else
                                <img src="{{ asset('images/avator.jpg') }}" alt="Default Avatar"
                                    class="w-10 h-10 rounded-full object-cover">
                            @endif

                            <div class="bg-gray-100 p-3 rounded-lg shadow-sm border border-gray-200 flex-1">
                                <p class="font-semibold text-gray-800">{{ $reply->user->name }}</p>
                                <p class="text-sm text-gray-500">{{ $reply->created_at->diffForHumans() }}</p>
                                <p class="text-gray-700 mt-2">{{ $reply->content }}</p>
                                @if (Auth::id() === $reply->user_id)
                                    <button onclick="openDeleteReply()"
                                        class="text-red-500 hover:text-red-600 py-2">Delete</button>
                                @endif
                            </div>

                        </div>


                        <!-- Modal for Delete Replies -->
                        <div id="deleteModalReply"
                            class="flex fixed inset-0 bg-gray-800 bg-opacity-75 justify-center items-center hidden">
                            <div class="bg-white p-6 rounded-lg shadow-lg w-96">
                                <h2 class="text-2xl font-semibold mb-4">Are you sure?</h2>
                                <p class="text-gray-600 mb-6">Do you really want to delete this blog post? This action
                                    cannot be undone.</p>
                                <div class="flex justify-end space-x-4">
                                    <button class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                                        onclick="closeDeleteReply()">Cancel</button>
                                    <form id="delete-form-reply-{{ $reply->id }}"
                                        action="{{ route('comments.destroy', ['blog' => $blog->id, 'comment' => $reply->id]) }}"
                                        method="POST">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit"
                                            class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md">Delete</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    @endforeach
                </div>
            @endif

            <!-- Reply Form -->
            <form id="reply-form-{{ $comment->id }}" action="{{ route('comments.store', $blog->id) }}" method="POST"
                class="hidden mt-4">
                @csrf
                <input type="hidden" name="parent_id" value="{{ $comment->id }}">
                <textarea name="content" rows="2"
                    class="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                    placeholder="Write a reply..."></textarea>
                <button type="submit"
                    class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg mt-2 shadow-md transition duration-300">Reply</button>
            </form>
        </div>

        <!-- Modal for Delete Comments -->
        <div id="deleteModalComment"
            class="flex fixed inset-0 bg-gray-800 bg-opacity-75 justify-center items-center hidden">
            <div class="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 class="text-2xl font-semibold mb-4">Are you sure?</h2>
                <p class="text-gray-600 mb-6">Do you really want to delete this comment? This action
                    cannot be undone.</p>
                <div class="flex justify-end space-x-4">
                    <button class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                        onclick="closeDeleteComment()">Cancel</button>
                    <form id="delete-form-{{ $comment->id }}"
                        action="{{ route('comments.destroy', ['blog' => $blog->id, 'comment' => $comment->id]) }}"
                        method="POST">
                        @csrf
                        @method('DELETE')
                        <button type="submit"
                            class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md">Delete</button>
                    </form>
                </div>
            </div>
        </div>
    @endforeach
</div>




<script>
    function showReplyForm(commentId) {
        document.getElementById(`reply-form-${commentId}`).classList.toggle('hidden');
    }

    function openDeleteReply() {
        document.getElementById('deleteModalReply').classList.remove('hidden');
    }

    function closeDeleteReply() {
        document.getElementById('deleteModalReply').classList.add('hidden');
    }

    function openDeleteComment() {
        document.getElementById('deleteModalComment').classList.remove('hidden');
    }

    function closeDeleteComment() {
        document.getElementById('deleteModalComment').classList.add('hidden');
    }
</script>
