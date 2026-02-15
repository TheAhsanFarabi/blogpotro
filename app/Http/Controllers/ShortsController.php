<?php

namespace App\Http\Controllers;

use App\Models\Short;
use Illuminate\Http\Request;

class ShortsController extends Controller
{
    // Display all shorts with blogs on the index page
    public function index()
    {
        $shorts = Short::latest()->get();

        return view('shorts.index', compact('shorts'));
    }

    public function show($id)
    {
        $short = Short::findOrFail($id); // Finds the short by ID or throws a 404 if not found
        return view('shorts.show', compact('short'));
    }


    // Show the form for creating a new short
    public function create()
    {
        return view('shorts.create');
    }

    // Store a new short
    public function store(Request $request)
    {
        $validated = $request->validate([
            'image' => 'required|image',
            'text' => 'nullable|string|max:300', // Max 100 words
        ]);

        // Upload the image
        $path = $request->file('image')->store('shorts', 'public');

        Short::create([
            'user_id' => auth()->id(),
            'image' => $path,
            'text' => $request->text,
        ]);

        return redirect()->route('shorts.index');
    }

    // Show the form for editing the short
    public function edit($id)
    {
        $short = Short::findOrFail($id);
        return view('shorts.edit', compact('short'));
    }

    // Update the short
    public function update(Request $request, Short $short)
    {
        $validated = $request->validate([
            'image' => 'nullable|image',
            'text' => 'nullable|string|max:300',
        ]);

        if ($request->hasFile('image')) {
            // Upload new image and delete the old one
            Storage::disk('public')->delete($short->image);
            $short->image = $request->file('image')->store('shorts', 'public');
        }

        $short->update([
            'text' => $request->text,
        ]);

        return redirect()->route('shorts.index');
    }

    public function destroy(Short $short)
    {
        if ($short->image && Storage::disk('public')->exists($short->image)) {
            Storage::disk('public')->delete($short->image);
        }
    
        $short->delete();
    
        return redirect()->route('shorts.index')->with('success', 'Short deleted successfully.');
    }
    
}
