<?php

namespace App\Http\Controllers;

use App\Models\Invitation;
use App\Models\Space;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SpaceController extends Controller
{
    public function index()
    {
        $spaces = Space::all();
        return view('spaces.index', compact('spaces'));
    }

    public function create()
    {
        return view('spaces.create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'cover_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $coverPicturePath = $request->file('cover_picture')->store('space_cover_pictures', 'public');

        $space = Space::create([
            'name' => $request->name,
            'description' => $request->description,
            'created_by' => Auth::id(),
            'cover_picture' => $coverPicturePath,
        ]);

        $space->users()->attach(Auth::id());

        return redirect()->route('spaces.index')->with('success', 'Space created successfully.');
    }

    public function show(Space $space)
    {
 // Load the collaborative blogs related to the space
$collabBlogs = $space->blogs()->with('histories', 'author')->get();

// Collect unique contributors from all collaborative blogs
$contributors = collect();

foreach ($collabBlogs as $collabBlog) {
    // Fetch contributors who made updates in the current blog's history
    $collabContributors = $collabBlog->histories()
        ->with('user') // assuming 'histories' has a 'user' relation pointing to the contributor
        ->select('updated_by') // Get the user IDs who made the updates
        ->distinct()
        ->get()
        ->pluck('user'); // Fetch the 'user' data
    
    // Merge contributors into the overall collection
    $contributors = $contributors->merge($collabContributors);
}

// Remove duplicate contributors based on their unique 'id'
$contributors = $contributors->unique('id');

// Now $contributors contains only those who contributed to specific blogs in the space




        $invitation = Invitation::where('space_id', $space->id)
            ->where('email', auth()->user()->email)
            ->where('accepted', false)
            ->first();

        $isMember = $space->users()->where('user_id', auth()->id())->exists();

        $members = $space->users;

        return view('spaces.show', compact('space', 'invitation', 'isMember', 'members', 'contributors'));
    }

    public function edit(Space $space)
    {
        return view('spaces.edit', compact('space'));
    }

    public function update(Request $request, Space $space)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'cover_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('cover_picture')) {
            $coverPicturePath = $request->file('cover_picture')->store('space_cover_pictures', 'public');
            $space->update(['cover_picture' => $coverPicturePath]);
        }

        $space->update($request->only('name', 'description'));

        return redirect()->route('spaces.show', $space)->with('success', 'Space updated successfully.');
    }
    public function destroy(Space $space)
    {
        // Check if the user is the creator of the space
        if ($space->created_by !== Auth::id()) {
            return redirect()->route('spaces.index')->with('error', 'You do not have permission to delete this space.');
        }

        // Check for associated collab blogs
        if ($space->blogs()->count() > 0) {
            return redirect()->route('spaces.index')->with('error', 'You cannot delete this space because it has associated blogs.');
        }

        // Detach users associated with the space (cleaning up the pivot table)
        $space->users()->detach();

        // Delete the space
        $space->delete();

        return redirect()->route('spaces.index')->with('success', 'Space deleted successfully.');
    }


    public function addTask(Request $request, Space $space)
    {
        $request->validate(['title' => 'required|string|max:255']);

        $space->tasks()->create(['title' => $request->title]);

        return redirect()->route('spaces.show', $space->id)->with('success', 'Task added successfully.');
    }

    public function deleteTask(Task $task)
    {
        $task->delete();

        return redirect()->back()->with('success', 'Task deleted successfully.');
    }

    public function updateTaskStatus(Request $request, Task $task)
    {
        // Validate that the status is correct
        $request->validate(['status' => 'required|in:to-do,in progress,done']);

        // Update the status
        $task->update(['status' => $request->status]);

        // Respond with success and updated task data
        return response()->json([
            'success' => true,
            'task_id' => $task->id,
            'new_status' => $task->status
        ]);
    }

    // New method to fetch tasks in JSON format (for easier front-end integration if needed)
    public function getTasks(Space $space)
    {
        $tasks = $space->tasks()->get(['id', 'title', 'status']);
        return response()->json($tasks);
    }
}
