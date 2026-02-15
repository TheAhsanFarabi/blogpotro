<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Purchase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StoreController extends Controller
{
    // Display all products in the store
    public function index()
    {
        $products = Product::all();
        return view('store.index', compact('products'));
    }

    // Display the details of a specific product
    public function show($id)
    {
        $product = Product::findOrFail($id);
        return view('store.show', compact('product'));
    }
    public function purchase(Request $request, $id)
    {
        $user = auth()->user();
        $product = Product::findOrFail($id);
    
        // Get the number of purchases made by the user for this product
        $userPurchasesCount = Purchase::where('user_id', $user->id)
            ->where('product_id', $product->id)
            ->count();
    
        // Calculate the maximum quantity the user can still purchase
        $maxPurchasable = 2 - $userPurchasesCount;
    
        // Check if user has reached the purchase limit
        if ($maxPurchasable <= 0) {
            return redirect()->back()->with('error', 'You have reached the purchase limit for this product.');
        }
    
        // Check if user has enough credits
        if ($user->credits < $product->price) {
            return redirect()->back()->with('error', 'Insufficient credits.');
        }
    
        // Deduct credits and create the purchase record
        $user->credits -= $product->price;
        $user->save();
    
        // Create the purchase record
        Purchase::create([
            'user_id' => $user->id,
            'product_id' => $product->id
        ]);
    
        return redirect()->route('store.index')->with('success', 'Purchase successful!');
    }
    

    // Show the form for creating a new product
    public function create()
    {
        return view('store.create');
    }

    // Store the newly created product
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'type' => 'required|in:tshirt,book,notebook',
            'image_path' => 'required|image|mimes:jpeg,png,jpg|max:2048', // Product image (required)
            'file_path' => 'nullable|mimes:pdf|max:2048' // PDF only for book type
        ]);

        // Create the product
        $product = new Product();
        $product->name = $request->name;
        $product->description = $request->description;
        $product->price = $request->price;
        $product->type = $request->type;

        if ($request->hasFile('image_path')) {
            $product->image_path = $request->file('image_path');
        }

        if ($request->type === 'book' && $request->hasFile('file_path')) {
            $product->file_path = $request->file('file_path');
        }

        $product->save();

        return redirect()->route('store.index')->with('success', 'Product created successfully!');
    }


    public function purchases()
    {
        $user = Auth::user();
        $purchases = Purchase::with('product')->where('user_id', $user->id)->get();

        return view('store.purchases', compact('purchases'));
    }
}
