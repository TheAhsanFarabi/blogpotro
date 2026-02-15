<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run()
    {
        $categories = [
            'Personal', 'Lifestyle', 'Health', 'Business', 'Politics', 'Books', 
            'Finance', 'Family', 'Travel', 'Food', 'Fashion', 'Technology', 
            'Entertainment', 'Education', 'Science'
        ];

        foreach ($categories as $category) {
            Category::create(['name' => $category]);
        }
    }
}
