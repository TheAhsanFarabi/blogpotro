<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BookSnap;
use Illuminate\Support\Facades\Auth;

class BookSnapController extends Controller
{

    public function index()
    {
        $bookSnaps = BookSnap::where('approved', true)->paginate(12); // Paginate the results
        return view('book_snaps.index', compact('bookSnaps'));
    }

    public function show($id)
    {
        $bookSnap = BookSnap::findOrFail($id); // Find the specific book snap by its ID

        return view('book_snaps.show', compact('bookSnap')); // Pass the book snap to the view
    }


    // Show form to create a Book Snap
    public function create()
    {
        return view('book_snaps.create');
    }

    // Store a new Book Snap
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'summary' => 'required|string',
            'cover_photo' => 'required|image',
            'affiliate_link' => 'required|url',
        ]);

        // Handle file upload
        $coverPath = $request->file('cover_photo')->store('book_snaps', 'public');

        BookSnap::create([
            'title' => $request->title,
            'summary' => $request->summary,
            'cover_photo' => $coverPath,
            'affiliate_link' => $request->affiliate_link,
            'user_id' => Auth::id(),
        ]);

        return redirect()->route('book_snaps.index')->with('success', 'Your snap is waiting for approval.');
    }

    // Show list of snaps waiting for approval (Admin only)
    public function approvePage()
    {
        $bookSnaps = BookSnap::where('approved', false)->get();
        return view('book_snaps.approve', compact('bookSnaps'));
    }

    // Approve a Book Snap (Admin only)
    public function approve($id)
    {
        $bookSnap = BookSnap::findOrFail($id);
        $bookSnap->approved = true;
        $bookSnap->save();

        return redirect()->route('book_snaps.approve')->with('success', 'Book Snap approved successfully.');
    }
}