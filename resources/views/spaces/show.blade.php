@extends('layouts.app')

@section('content')


<div class="container mx-auto mt-8">
    @if($space->cover_picture)
    <img src="{{ asset('storage/' . $space->cover_picture) }}" alt="{{ $space->name }} Image" class="w-full h-48 object-cover mb-4 rounded-lg shadow-md">
    @endif
    <h1 class="text-4xl font-extrabold mb-4 text-gray-900">{{ $space->name }}</h1>
    <p class="text-lg text-gray-600 mb-4">{{ $space->description }}</p>

    <div class="mb-6">
        @if(auth()->id() === $space->created_by)
        <span class="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full">You are the creator of this space!</span>
        @elseif($isMember)
        <span class="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full">You are already a member of this space!</span>
        @elseif($invitation)
        <span class="inline-block bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">You have been invited to join this space!</span>
        <form action="{{ route('invitations.accept', $invitation->id) }}" method="POST" class="mt-2">
            @csrf
            <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600">Accept Invitation</button>
        </form>
        @else
        <span class="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full">You are not invited to this space yet.</span>
        @endif
    </div>


    <!-- Delete Space Form (Only for Creator) -->
    @if(Auth::id() === $space->created_by)
    <a href="{{ route('spaces.edit', $space->id) }}" class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mb-6 inline-block shadow">Edit Space</a>
    <form action="{{ route('spaces.destroy', $space->id) }}" method="POST" onsubmit="return confirm('Are you sure you want to delete this space?');" class="inline-block">
        @csrf
        @method('DELETE')
        <button type="submit" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Delete Space</button>
    </form>
    @endif

    <div class="container mx-auto mt-8 mb-3">
        <style>
            .task-column {
                min-height: 150px;
                padding: 10px;
                border: 1px dashed #ccc;
                border-radius: 5px;
                background-color: #f9f9f9;
                /* Default background */
            }

            #todo {
                background-color: #e0f7fa;
                /* Light Cyan for To-Do */
            }

            #in-progress {
                background-color: #fff3e0;
                /* Light Orange for In Progress */
            }

            #done {
                background-color: #e8f5e9;
                /* Light Green for Done */
            }
        </style>
 @if($isMember)
        <h2 class="text-xl font-semibold mb-4">Task Manager</h2>

        <form action="{{ route('tasks.add', $space->id) }}" method="POST" class="flex mb-4">
            @csrf
            <input type="text" name="title" placeholder="New Task" class="border border-gray-300 rounded-lg p-2 w-full" required>
            <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Add Task</button>
        </form>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="task-column" id="todo">
                <h3 class="font-semibold">To-Do</h3>
                @foreach($space->tasks->where('status', 'to-do') as $task)
                <div class="bg-white shadow-md rounded-lg p-4 mb-4 cursor-pointer hover:shadow-lg transition-shadow duration-200"
                    id="task-{{ $task->id }}" onclick="openTask('{{ $task->id }}')">
                    <h4 class="text-lg font-medium">{{ $task->title }}</h4>
                    <form action="{{ route('tasks.delete', $task->id) }}" method="POST" class="inline-block">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="text-red-500 hover:underline mt-2">Delete</button>
                    </form>
                </div>
                @endforeach
            </div>

            <div class="task-column" id="in-progress">
                <h3 class="font-semibold">In Progress</h3>
                @foreach($space->tasks->where('status', 'in progress') as $task)
                <div class="bg-white shadow-md rounded-lg p-4 mb-4 cursor-pointer hover:shadow-lg transition-shadow duration-200"
                    id="task-{{ $task->id }}" onclick="openTask('{{ $task->id }}')">
                    <h4 class="text-lg font-medium">{{ $task->title }}</h4>
                    <form action="{{ route('tasks.delete', $task->id) }}" method="POST" class="inline-block">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="text-red-500 hover:underline mt-2">Delete</button>
                    </form>
                </div>
                @endforeach
            </div>

            <div class="task-column" id="done">
                <h3 class="font-semibold">Done</h3>
                @foreach($space->tasks->where('status', 'done') as $task)
                <div class="bg-white shadow-md rounded-lg p-4 mb-4 cursor-pointer hover:shadow-lg transition-shadow duration-200"
                    id="task-{{ $task->id }}" onclick="openTask('{{ $task->id }}')">
                    <h4 class="text-lg font-medium">{{ $task->title }}</h4>
                    <form action="{{ route('tasks.delete', $task->id) }}" method="POST" class="inline-block">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="text-red-500 hover:underline mt-2">Delete</button>
                    </form>
                </div>
                @endforeach
            </div>
        </div>
    </div>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/Sortable/1.14.0/Sortable.min.js"></script>
    <script>
        const updateTaskStatus = (taskId, newStatus) => {
            fetch(`/tasks/${taskId}/update-status`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': '{{ csrf_token() }}' // Ensure CSRF token is included
                    },
                    body: JSON.stringify({
                        status: newStatus
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        console.log(`Task ${taskId} updated to status ${newStatus}`);
                    } else {
                        console.error('Failed to update task status.');
                    }
                })
                .catch(error => console.error('Error:', error));
        };

        // Ensure the sortable functionality works for the tasks
        const createSortable = (element, status) => {
            Sortable.create(element, {
                animation: 150,
                group: 'tasks',
                draggable: '.bg-white', // Specify that only task items are draggable
                onEnd: function(evt) {
                    const taskId = evt.item.id.split('-')[1]; // Extract task ID
                    const newStatus = evt.to.id === 'todo' ? 'to-do' :
                        evt.to.id === 'in-progress' ? 'in progress' : 'done'; // Determine new status
                    updateTaskStatus(taskId, newStatus); // Call the function to update status
                }
            });
        };

        // Assign columns
        const todo = document.getElementById('todo');
        const inProgress = document.getElementById('in-progress');
        const done = document.getElementById('done');

        // Initialize sortable for each column
        createSortable(todo, 'to-do');
        createSortable(inProgress, 'in progress');
        createSortable(done, 'done');
    </script>

@endif

    <div class=" p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Left Column -->
        <div class="col-span-1 md:col-span-2">
            <h2 class="text-xl font-semibold mt-6 mb-4">Collaborative Blogs</h2>
            @if($isMember)
            <!-- Add Create Collab Blog Button -->
            <div class="mt-4">
                <a href="{{ route('collab_blogs.create', $space->id) }}" class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 shadow">Create New Collaborative Blog</a>
            </div>
            @endif
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                @foreach($space->blogs as $blog)
                <div class="bg-white p-4 rounded-lg shadow-md border border-gray-300">
                    @if($blog->image)
                    <img src="{{ asset('storage/' . $blog->image) }}" alt="{{ $blog->title }} Image" class="w-full h-48 object-cover rounded-md mb-2">
                    @endif
                    <a href="{{ route('collab_blogs.show', [$space->id, $blog->id]) }}" class="text-blue-500 hover:underline text-xl font-bold">{{ $blog->title }}</a>
                    <p class="text-gray-600 mb-2">{{ Str::limit($blog->content, 100) }}</p>

                    <div class="flex flex-row justify-start items-center">
                        @php
                        // Get contributors for this specific blog
                        $blogContributors = $blog->histories()->with('user')->distinct()->get()->pluck('user');
                        @endphp

                        @foreach($blogContributors as $contributor)
                        @if($contributor->profile_picture)
                        <img src="{{ asset('storage/images/' . $contributor->profile_picture) }}" alt="{{ $contributor->name }}" class="w-12 h-12 rounded-full mr-4">
                        @else
                        <div class="w-12 h-12 rounded-full bg-gray-300 mr-4"></div>
                        @endif
                        @endforeach
                    </div>
                </div>
                @endforeach
            </div>

        </div>


        <!-- right column -->
        <div class="col-span-1 md:col-span-1 bg-white shadow-lg rounded-lg p-6">
            <h2 class="text-xl font-semibold mb-4">Members</h2>
            <div class="grid grid-cols-1 gap-4 mb-6">
                @foreach($members as $member)
                <div class="bg-gray-100 p-4 rounded-lg flex items-center">
                    @if($member->profile_picture)
                    <img src="{{ asset('storage/images/' . $member->profile_picture) }}" alt="{{ $member->name }}" class="w-12 h-12 rounded-full mr-4 shadow">
                    @else
                    <div class="w-12 h-12 rounded-full bg-gray-300 mr-4"></div>
                    @endif
                    <span class="font-medium">{{ $member->name }}</span>
                </div>
                @endforeach
            </div>

            @if($isMember)

            <h2 class="text-xl font-semibold mt-6 mb-4">Invite Members</h2>
            <form action="{{ route('spaces.invite', $space->id) }}" method="POST" class="flex items-center space-x-4 mb-6">
                @csrf
                <input type="email" name="email" placeholder="Invite by Email" class="border border-gray-300 rounded-lg p-2 w-full" required>
                <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 shadow">Invite</button>
            </form>

            <a href="{{ route('spaces.chat', $space->id) }}" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 shadow">Open Group Chat</a>

            @endif
        </div>
    </div>
</div>
@endsection