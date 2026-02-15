<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Module;
use Illuminate\Http\Request;
use App\Models\Quiz;
use App\Models\UserCourse; // Make sure to import UserCourse model

class ModuleController extends Controller
{
    // Show a specific module
    public function show(Course $course, Module $module)
    {
        if (auth()->user()->courses->contains($course)) {
            // Check user's score for this module
            $userScore = $this->getUserScore($course);
            return view('modules.show', compact('module', 'course', 'userScore'));
        }

        return redirect()->route('courses.show', $course)->with('error', 'You have not purchased this course.');
    }

    // Show the quiz for a specific module
    public function showQuiz(Course $course, Module $module)
    {
        if (auth()->user()->courses->contains($course)) {
            $quizzes = $module->quizzes; // Assuming you have a relationship in the Module model
            return view('modules.quiz', compact('module', 'course', 'quizzes'));
        }

        return redirect()->route('courses.show', $course)->with('error', 'You have not purchased this course.');
    }

    // Store the quiz answers and calculate the score
    public function storeQuiz(Request $request, Course $course, Module $module)
    {
        // Validate the quiz answers
        $validatedData = $request->validate([
            'quiz.*' => 'required|string',
        ]);

        // Logic to calculate the score
        $score = 0;
        $totalQuestions = count($validatedData['quiz']);

        foreach ($validatedData['quiz'] as $quizId => $selectedOption) {
            $quiz = Quiz::findOrFail($quizId); // Ensure you retrieve the quiz
            if ($selectedOption === $quiz->correct_option) {
                $score++;
            }
        }

        // Update the user's score in the user_course table only for the last module
        $this->updateUserScore(auth()->user(), $course, $score);

        // Redirect with score feedback
        return redirect()->route('modules.show', [$course, $module])->with('success', "Quiz submitted successfully! Your score is: $score out of $totalQuestions");
    }

    // Get the user's score for the specific course
    private function getUserScore(Course $course)
    {
        // Retrieve the user_course record for the given course
        $userCourse = UserCourse::where('user_id', auth()->id())
            ->where('course_id', $course->id)
            ->first();

        return $userCourse ? $userCourse->score : null; // Return the score or null if not found
    }

    // Update the user's score in the user_course table
    private function updateUserScore($user, Course $course, $score)
    {
        // Find the user_course record and update the score
        UserCourse::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->update(['score' => $score]);
    }
}
