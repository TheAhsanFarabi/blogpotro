<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    protected $fillable = ['module_id', 'question', 'option_1', 'option_2', 'option_3', 'option_4', 'correct_option'];

    public function module()
    {
        return $this->belongsTo(Module::class);
    }
}
