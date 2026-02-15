<?php

namespace App\Http\Controllers;

use App\Models\CollabBlog;
use App\Models\CollabBlogHistory;
use App\Models\Space;
use Illuminate\Http\Request;
 
class CollabBlogController extends Controller
{
    public function show(Space $space, CollabBlog $collabBlog)
    {
        // Load the blog along with its histories and author
        $collabBlog->load('histories', 'author');

        // Get all unique contributors (authors of the blog and those who made updates)
        $contributors = $collabBlog->histories()
            ->with('user') // assuming histories table has a 'user' relation pointing to the contributor
            ->select('updated_by')
            ->distinct()
            ->get()
            ->pluck('user'); // Retrieve the users who made the updates

        // Ensure to include the original author as a contributor
        if (!$contributors->contains($collabBlog->author)) {
            $contributors->push($collabBlog->author);
        }

        return view('collab_blogs.show', compact('space', 'collabBlog', 'contributors'));
    }

    public function create(Space $space)
    {
        return view('collab_blogs.create', compact('space'));
    }

    public function store(Request $request, Space $space)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Validation for image
        ]);

        // Handle image upload if present
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('collab_blog_images', 'public');
        }

        $space->blogs()->create([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'author_id' => auth()->id(),
            'image' => $imagePath, // Save the image path if uploaded
        ]);

        return redirect()->route('spaces.show', $space->id)->with('success', 'Collaborative blog created successfully.');
    }

    public function edit(Space $space, CollabBlog $collabBlog)
    {
        return view('collab_blogs.edit', compact('space', 'collabBlog'));
    }

    public function update(Request $request, Space $space, CollabBlog $collabBlog)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Validation for image
        ]);
    
        // Store the current state of the blog in the history table before updating
        CollabBlogHistory::create([
            'collab_blog_id' => $collabBlog->id,
            'title' => $collabBlog->title,
            'content' => $collabBlog->content,
            'image' => $collabBlog->image, // Store the previous image in history
            'updated_by' => auth()->id(),
        ]);
    
        // Update the blog with new content first
        $collabBlog->update($validated);
    
        // Handle image upload if present
        if ($request->hasFile('image')) {
            // Store the new image
            $imagePath = $request->file('image')->store('collab_blog_images', 'public');
            // Update the collabBlog with the new image path
            $collabBlog->update(['image' => $imagePath]);
        }
    
        return redirect()->route('collab_blogs.show', ['space' => $space->id, 'collabBlog' => $collabBlog->id])
            ->with('success', 'Collaborative blog updated successfully.');
    }
    

    public function destroy(Space $space, CollabBlog $collabBlog)
    {
        // Delete the blog and image if necessary
        if ($collabBlog->image) {
            \Storage::delete('public/' . $collabBlog->image);
        }

        $collabBlog->delete();
        return redirect()->route('spaces.show', $space->id)->with('success', 'Collaborative blog deleted successfully.');
    }

    public function rollback(Space $space, CollabBlog $collabBlog, $historyId)
    {
        // Find the specific history version
        $history = CollabBlogHistory::findOrFail($historyId);

        // Prevent redundant rollback if the blog is already at the same version
        if ($collabBlog->title === $history->title && $collabBlog->content === $history->content && $collabBlog->image === $history->image) {
            return redirect()->route('spaces.show', $space->id)->with('warning', 'Blog is already at this version.');
        }

        // Restore the blog to the previous version
        $collabBlog->update([
            'title' => $history->title,
            'content' => $history->content,
            'image' => $history->image, // Restore the previous image if present
        ]);

        return redirect()->route('collab_blogs.show', ['space' => $space->id, 'collabBlog' => $collabBlog->id])
            ->with('success', 'Blog rolled back to previous version.');
    }
}
