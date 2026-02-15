<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\Streak;
use App\Models\Short;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Category;
use App\Models\Notification;
use App\Models\User;
use App\Models\Subscription; // Import the Subscription model
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Cache;

class BlogController extends Controller
{
    public function index(Request $request)
    {
        $featuredBlogs = Blog::where('views', '>', 10)
            ->orderByDesc('views')
            ->take(3)
            ->get();
    
        $topUsers = User::whereHas('blogs')
            ->whereNotNull('profile_picture')
            ->withCount('blogs')
            ->orderByDesc('blogs_count')
            ->take(3)
            ->get();
    
        $shorts = Short::latest()->get();
    
        $query = Blog::withCount(['likes', 'comments'])->where('privacy', 'public');
    
        // Check if a category filter is applied
        if ($request->has('category') && $request->category) {
            $query->where('category_id', $request->category);
        }
    
        // Check if user is authenticated and has categories
        $user = Auth::user();
        if ($user && $request->has('categories')) {
            // Convert the comma-separated string into an array
            $categories = explode(',', $request->input('categories')); // Split string into an array
    
            if (!empty($categories)) {
                // Fetch the category IDs based on the names
                $categoryIds = Category::whereIn('name', $categories)->pluck('id')->toArray();
                $query->whereIn('category_id', $categoryIds); // Filter based on category IDs
            }
        }
    
        // Search filter
        if ($request->has('search') && $request->search) {
            $query->where(function ($query) use ($request) {
                $query->where('title', 'like', '%' . $request->search . '%')
                    ->orWhere('content', 'like', '%' . $request->search . '%');
            });
        }
    
        $blogs = $query->latest()->paginate(12);
        $categories = Category::all();
    
        if ($user) {
            $this->updateCredits($user);
            $this->updateStreak($user);
        }
    
        return view('blogs.index', compact('featuredBlogs', 'topUsers', 'blogs', 'categories', 'shorts'));
    }
    
    



    public function create()
    {
        // Attempt to read the blacklist of cyberbullying words
        $cyberbullyWords = [];
        $filePath = public_path('en.txt'); // Use public_path to construct the correct file path

        if (file_exists($filePath)) {
            $cyberbullyWords = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        } else {
            // Handle the error (log it, or set a default value)
            \Log::warning('Cyberbully words file not found: ' . $filePath);
        }

        // Fetch categories from the database
        $categories = Category::all();

        // Return the view with categories and cyberbully words
        return view('blogs.create', compact('categories', 'cyberbullyWords'));
    }


    public function store(Request $request)
    {
        // Rate limit the request
        $this->rateLimit($request);
    
        // Validate the request inputs
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:5000',
            'category_id' => 'required|exists:categories,id',
            'theme' => 'nullable|array',
            'privacy' => 'required|in:private,public',
            'is_pro' => 'boolean', // Validate the new 'is_pro' field as a boolean
        ]);
    
        // Create a new Blog instance and set its attributes
        $blog = new Blog();
        $blog->title = $request->title;
        $blog->content = $request->content;
        $blog->user_id = Auth::id();
        $blog->category_id = $request->category_id;
        $blog->theme = $request->theme;
        $blog->privacy = $request->privacy;
        $blog->is_pro = $request->is_pro ?? false; // Set is_pro to false if not present
    
        // Handle the image file upload if it exists
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('images', 'public');
            $blog->image = $path;
        }
    
        // Save the blog to the database
        $blog->save();
    
        // Redirect to the blogs index page with a success message
        return redirect()->route('blogs.index')->with('success', 'Blog created successfully!');
    }
    
    public function useCredit($id)
    {
        $blog = Blog::findOrFail($id);
        $user = auth()->user();
    
        // Check if the user has an active subscription
        $hasSubscription = auth()->check() ? Subscription::where('user_id', auth()->id())->exists() : false;
    
        if ($hasSubscription) {
            // Redirect back to the blog content if the user has an active subscription
            return redirect()->route('blogs.show', $id)->with('success', 'You have an active subscription. No credits deducted.');
        }
    
        // Check if the user has enough credits
        if ($user->credits < 1) {
            // Redirect back with error message if not enough credits
            return redirect()->route('blogs.show', $id)->with('error', 'Not enough credits. Please subscribe or recharge.');
        }
    
        // Deduct 1 credit
        $user->decrement('credits', 1);

        if ($blog->user->is_monetized) {
            $blog->user->increment('balance', 1.25); // Add 0.01 to the user's balance per view
        }
    
        // Redirect back to the blog content with success message
        return redirect()->route('blogs.show', $id)->with('success', 'Credit deducted successfully. You can now read the blog.');
    }
    
    
    

    public function show($id)
    {
        $blog = Blog::with('category')->findOrFail($id);
    
        // Increment views only if the blog hasn't been viewed in the current session
    if (!session()->has("viewed_blog_{$id}")) {
        $blog->increment('views');

        // Check if the blog owner is monetized
        if ($blog->user->is_monetized) {
            $blog->user->increment('balance', 0.01); // Add 0.01 to the user's balance per view
        }

        session()->put("viewed_blog_{$id}", true);
    }

        
    
        // Check if the user has an active subscription
        $isSubscribed = auth()->check() ? Subscription::where('user_id', auth()->id())->exists() : false;
    
        // Send a notification if the blog reaches exactly 20 views
        if ($blog->views === 20) {
            Notification::create([
                'user_id' => $blog->user_id,
                'type' => 'views',
                'data' => [
                    'sender_id' => null,
                    'sender_profile_pic' => null,
                    'message' => 'Wow! You got so many views on: ',
                    'blog_id' => $blog->id,
                    'blog_title' => $blog->title,
                ],
            ]);
        }

       
        return view('blogs.show', compact('blog', 'isSubscribed'));
    }
    

    public function edit($id)
    {
        $blog = Blog::findOrFail($id);

        // Attempt to read the blacklist of cyberbullying words
        $cyberbullyWords = [];
        $filePath = public_path('en.txt'); // Use public_path to construct the correct file path

        if (file_exists($filePath)) {
            $cyberbullyWords = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        } else {
            // Handle the error (log it, or set a default value)
            \Log::warning('Cyberbully words file not found: ' . $filePath);
        }

        if ($blog->user_id !== Auth::id()) {
            return redirect()->route('blogs.index')->withErrors('You do not have permission to edit this blog.');
        }

        $categories = Category::all();
        return view('blogs.edit', compact('blog', 'categories','cyberbullyWords'));
    }

    public function update(Request $request, $id)
    {
        //$this->rateLimit($request);
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:5000',
            'category_id' => 'required|exists:categories,id',
            'theme' => 'nullable|array',
            'privacy' => 'required|in:private,public',
        ]);

        $blog = Blog::findOrFail($id);

        if ($blog->user_id !== Auth::id()) {
            return redirect()->route('blogs.index')->withErrors('You do not have permission to update this blog.');
        }

        $blog->title = $request->title;
        $blog->content = $request->content;
        $blog->category_id = $request->category_id;
        $blog->theme = $request->theme;
        $blog->privacy = $request->privacy;

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('images', 'public');
            $blog->image = $path;
        }

        $blog->save();

        return redirect()->route('blogs.show', $blog->id)->with('success', 'Blog updated successfully!');
    }

    public function destroy($id)
    {
        //$this->rateLimit($id);
        $blog = Blog::findOrFail($id);

        if ($blog->user_id !== Auth::id()) {
            return redirect()->route('blogs.index')->withErrors('You do not have permission to delete this blog.');
        }

        $blog->delete();

        return redirect()->route('blogs.index')->with('success', 'Blog deleted successfully!');
    }

    public function search(Request $request)
    {
        try {
            $request->validate([
                'query' => 'required|string|min:3',
            ]);

            $query = $request->input('query');

            $results = Blog::where('title', 'LIKE', "%{$query}%")
                ->select('id', 'title')
                ->get();

            return response()->json($results);
        } catch (\Exception $e) {
            \Log::error('Search Error: ' . $e->getMessage());
            return response()->json(['error' => 'An error occurred while searching.'], 500);
        }
    }

    public function checkPlagiarism(Request $request)
    {
        $content = $request->input('content');
        $userId = Auth::id(); // Get the logged-in user's ID

        $existingBlog = Blog::where('content', 'like', '%' . $content . '%')
            ->where('user_id', '!=', $userId) // Exclude the blogs of the current user
            ->first();

        if ($existingBlog) {
            return response()->json(['message' => 'This content is plagiarized! It already exists in another blog.'], 400);
        }

        return response()->json(['message' => 'Content is unique.'], 200);
    }


    private function updateStreak($user)
    {
        $today = now()->startOfDay();
        $lastReadDate = $user->last_read_at ? $user->last_read_at->startOfDay() : null;

        if (!$lastReadDate || $lastReadDate->lt($today)) {
            if ($lastReadDate && $lastReadDate->eq($today->subDay())) {
                $user->streak_count += 1;
            } else {
                $user->streak_count = 1;
                Streak::where('user_id', $user->id)->delete();
            }

            if ($user->streak_count === 7) {
                $user->credits += 7;

                Notification::create([
                    'user_id' => $user->id,
                    'type' => 'streaks',
                    'data' => [
                        'message' => 'You got 7 Credits!! You maintained your streaks for 3 days.',
                    ],
                ]);
            }

            $user->last_read_at = now();
            $user->save();

            Streak::create([
                'user_id' => $user->id,
                'date' => $user->last_read_at,
            ]);
        }
    }

    private function updateCredits($user)
    {
        $featuredBlogsCount = Blog::where('user_id', $user->id)
            ->withCount(['likes', 'comments'])
            ->having('likes_count', '>=', 2)
            ->having('comments_count', '>=', 1)
            ->where('views', '>=', 10)
            ->count();

        if ($user->streak_count === 7) {
            $user->credits += $featuredBlogsCount;
        }
        $user->save();
    }


    protected function rateLimit(Request $request)
    {
        $key = $request->ip();

        if (RateLimiter::tooManyAttempts($key, 5)) {
            abort(429, 'Too many requests. Please try again later.');
        }

        RateLimiter::hit($key, 60);
    }
}
