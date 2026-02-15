<?php
namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index()
    {
        $courses = Course::all();
        return view('courses.index', compact('courses'));
    }

    public function show(Course $course)
    {
        return view('courses.show', compact('course'));
    }

    public function buyCourse(Course $course)
    {
        $user = auth()->user();

        if ($user->purchaseCourse($course)) {
            return redirect()->route('courses.show', $course)->with('success', 'Course purchased successfully!');
        }

        return redirect()->route('courses.show', $course)->with('error', 'Not enough credits to purchase this course.');
    }
}
