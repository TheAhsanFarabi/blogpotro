<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = ['name', 'description', 'price', 'type', 'image_path', 'file_path'];

    public function purchases()
    {
        return $this->hasMany(Purchase::class);
    }

    // Handle image upload
    public function setImagePathAttribute($image)
    {
        if ($image) {
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->storeAs('uploads/products/images', $imageName, 'public');
            $this->attributes['image_path'] = 'uploads/products/images/' . $imageName;
        }
    }

    // Handle PDF file upload (for books)
    public function setFilePathAttribute($file)
    {
        if ($file && $this->type === 'book') {
            $fileName = time() . '_' . $file->getClientOriginalName();
            $file->storeAs('uploads/products/files', $fileName, 'public');
            $this->attributes['file_path'] = 'uploads/products/files/' . $fileName;
        }
    }
}
