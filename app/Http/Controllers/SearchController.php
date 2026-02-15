<?php


namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User; // Import User model
use App\Models\Blog; // Import Blog model

class SearchController extends Controller
{
    public function index(Request $request)
    {
        $searchTerm = $request->input('search');

        // Search for users and blogs
        $users = User::where('name', 'LIKE', '%' . $searchTerm . '%')->get();
        $blogs = Blog::where('title', 'LIKE', '%' . $searchTerm . '%')->get();

        return view('search.results', compact('users', 'blogs', 'searchTerm'));
    }
}
