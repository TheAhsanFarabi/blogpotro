<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\SummarizeController;
use App\Http\Controllers\ParaphraseController;
use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\FeedController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\BookmarkController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\GrammarController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\ToneController;
use App\Http\Controllers\ShortsController;
use App\Http\Controllers\StreakController;
use App\Http\Controllers\CreditController;
use App\Http\Controllers\ChallengeController;
use App\Http\Controllers\BookSnapController;
use App\Http\Controllers\SpaceController;
use App\Http\Controllers\InvitationController;
use App\Http\Controllers\CollabBlogController;
use App\Http\Controllers\SpaceMessageController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\PasswordController;
use App\Http\Controllers\AdController;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\ModuleController;
use Illuminate\Support\Facades\Route;

// Authentication Routes
Route::get('login', [LoginController::class, 'showLoginForm'])->name('login');
Route::post('login', [LoginController::class, 'login']);
Route::post('logout', [LoginController::class, 'logout'])->name('logout');
Route::get('register', [RegisterController::class, 'showRegistrationForm'])->name('register');
//Route::post('register', [RegisterController::class, 'register']);


// Route to show the verification form
Route::get('/verify-email', [RegisterController::class, 'showVerifyEmailForm'])->name('verify.email.form');


//Route::post('/verify-email', [RegisterController::class, 'verifyEmail'])->name('verify.email');


Route::get('/verify-old-email', [LoginController::class, 'showVerifyOldEmailForm'])->name('verify.old.email.form');
//Route::post('/send-verification-code', [LoginController::class, 'sendVerificationCode'])->name('send.verification.code')->middleware('throttle:1,2');
//Route::post('/verify-old-email', [LoginController::class, 'verifyOldEmail'])->name('verify.old.email');




Route::get('/password/reset', [PasswordController::class, 'showResetRequestForm'])->name('password.request');
//Route::post('/password/email', [PasswordController::class, 'sendResetLinkEmail'])->name('password.email')->middleware('throttle:1,2');
//Route::get('/password/reset/{token}', [PasswordController::class, 'showResetForm'])->name('password.reset');
//Route::post('/password/reset', [PasswordController::class, 'reset'])->name('password.update');



// Blog Routes
Route::get('/', [BlogController::class, 'index'])->name('blogs.index');
Route::get('/blogs/{id}', [BlogController::class, 'show'])->name('blogs.show');


Route::middleware('auth')->group(function () {

    // Blog management routes
    Route::get('/create', [BlogController::class, 'create'])->name('blogs.create');
    Route::post('/blogs', [BlogController::class, 'store'])->name('blogs.store');
    Route::get('/blogs/{id}/edit', [BlogController::class, 'edit'])->name('blogs.edit');
    Route::put('/blogs/{id}', [BlogController::class, 'update'])->name('blogs.update');
    Route::delete('/blogs/{id}', [BlogController::class, 'destroy'])->name('blogs.destroy');
    Route::post('/blogs/{id}/use-credit', [BlogController::class, 'useCredit'])->name('blogs.useCredit');
    Route::get('/search', [BlogController::class, 'search'])->name('search');


    Route::get('/people', [UserController::class, 'index'])->name('user.index');
    // Profile Management routes
    Route::get('/profile/{id}', [ProfileController::class, 'show'])->name('profile.show');
    Route::put('/profile/{id}', [ProfileController::class, 'update'])->name('profile.update');
    //Route::put('/profile/{id}', [ProfileController::class, 'customize'])->name('profile.customize');
    Route::post('/profile/{id}/follow', [ProfileController::class, 'follow'])->name('profile.follow');
    Route::post('/profile/{id}/unfollow', [ProfileController::class, 'unfollow'])->name('profile.unfollow');

    // Settings
    Route::get('/settings', [SettingsController::class, 'edit'])->name('settings.edit');
    Route::put('/settings', [SettingsController::class, 'update'])->name('settings.update');
    Route::delete('/settings', [SettingsController::class, 'destroy'])->name('settings.destroy');

    // Likes Comments Bookmarks
    Route::post('/blogs/{blog}/like', [LikeController::class, 'like'])->name('blogs.like');
    Route::post('/blogs/{blog}/comments', [CommentController::class, 'store'])->name('comments.store');
    Route::delete('/blogs/{blog}/comments/{comment}', [CommentController::class, 'destroy'])->name('comments.destroy');
    Route::post('/blogs/{blog}/bookmark', [BookmarkController::class, 'toggle'])->name('blogs.bookmark');

    //Bookmarks and Feed Page
    Route::get('/bookmarks', [BookmarkController::class, 'index'])->name('bookmarks.index');
    Route::get('/feed', [FeedController::class, 'index'])->name('feed.index');

    // Chats
    Route::get('/chats', [ChatController::class, 'index'])->name('chat.index');
    Route::get('/chats/{user}', [ChatController::class, 'show'])->name('chat.show');
    Route::post('/chats/{user}', [ChatController::class, 'store'])->name('chat.store');

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::get('/notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');

    // Subscriptions
    Route::get('/subscribe', function () {
        return view('user.subscribe');
    })->name('subscribe.show');
    Route::post('/subscribe', [SubscriptionController::class, 'purchase'])->name('subscribe.purchase');

    Route::post('/check-plagiarism', [BlogController::class, 'checkPlagiarism'])->name('check.plagiarism');
    // GEMINI API
    Route::post('/chatbot/respond', [ChatbotController::class, 'getResponse']);
    Route::post('/summarize', [SummarizeController::class, 'summarize']);
    Route::post('/fix', [GrammarController::class, 'fix']);
    Route::post('/paraphrase', [ParaphraseController::class, 'paraphrase'])->name('paraphrase');
    Route::post('/tone', [ToneController::class, 'analyzeTone'])->name('tone');



    Route::get('/shorts', [ShortsController::class, 'index'])->name('shorts.index');
    Route::get('shorts/{id}', [ShortsController::class, 'show'])->name('shorts.show');
    Route::get('/create-shorts', [ShortsController::class, 'create'])->name('shorts.create');
    Route::post('/shorts', [ShortsController::class, 'store'])->name('shorts.store');
    Route::get('/shorts/{id}/edit', [ShortsController::class, 'edit'])->name('shorts.edit');
    Route::put('/shorts/{id}', [ShortsController::class, 'update'])->name('shorts.update');
    Route::delete('/shorts/{id}', [ShortsController::class, 'destroy'])->name('shorts.destroy');




    Route::get('/streaks', [StreakController::class, 'show'])->name('streaks.show');
    Route::get('/credits', [CreditController::class, 'index'])->name('credits.index');
    Route::post('/credits/redeem', [CreditController::class, 'redeemCoupon'])->name('credits.redeem');




    Route::get('/challenges', [ChallengeController::class, 'index'])->name('challenges.index');
    Route::get('/challenges/create', [ChallengeController::class, 'create'])->name('challenges.create');
    Route::post('/challenges', [ChallengeController::class, 'store'])->name('challenges.store');
    Route::get('/challenges/{id}', [ChallengeController::class, 'show'])->name('challenges.show');
    Route::post('/challenges/{id}/submit', [ChallengeController::class, 'submit'])->name('challenges.submit');
    Route::get('/challenges/{id}/review', [ChallengeController::class, 'review'])->name('challenges.review');
    Route::post('/challenges/{id}/declare-winner', [ChallengeController::class, 'declareWinner'])->name('challenges.declareWinner');


    Route::get('/book-snaps/create', [BookSnapController::class, 'create'])->name('book_snaps.create');
    Route::post('/book-snaps', [BookSnapController::class, 'store'])->name('book_snaps.store');
    Route::get('/book-snaps', [BookSnapController::class, 'index'])->name('book_snaps.index');
    Route::get('/book-snaps/{id}', [BookSnapController::class, 'show'])->name('book_snaps.show'); // Show details route
    Route::get('/snaps/approve', [BookSnapController::class, 'approvePage'])->name('book_snaps.approve');
    Route::post('/snaps/approve/{id}', [BookSnapController::class, 'approve'])->name('book_snaps.approved');




    Route::resource('spaces', SpaceController::class);

    Route::post('spaces/{space}/invite', [InvitationController::class, 'invite'])->name('spaces.invite');

    Route::get('spaces/{space}/blogs/create', [CollabBlogController::class, 'create'])->name('collab_blogs.create');
    Route::get('spaces/{space}/blogs/{collabBlog}', [CollabBlogController::class, 'show'])->name('collab_blogs.show');
    Route::post('spaces/{space}/blogs', [CollabBlogController::class, 'store'])->name('collab_blogs.store');
    Route::get('spaces/{space}/blogs/{collabBlog}/edit', [CollabBlogController::class, 'edit'])->name('collab_blogs.edit');
    Route::put('spaces/{space}/blogs/{collabBlog}/update', [CollabBlogController::class, 'update'])->name('collab_blogs.update');
    Route::delete('spaces/{space}/blogs/{collabBlog}', [CollabBlogController::class, 'destroy'])->name('collab_blogs.destroy');

    Route::post('/invitations/{id}/accept', [InvitationController::class, 'accept'])->name('invitations.accept');


    Route::get('/spaces/{space}/chat', [SpaceMessageController::class, 'index'])->name('spaces.chat');
    Route::post('/spaces/{space}/chat', [SpaceMessageController::class, 'store'])->name('spaces.chat.store');

    Route::post('spaces/{space}/blogs/{collabBlog}/rollback/{history}', [CollabBlogController::class, 'rollback'])->name('collab_blogs.rollback');


    Route::post('/spaces/{space}/tasks', [SpaceController::class, 'addTask'])->name('tasks.add');
    Route::delete('/tasks/{task}', [SpaceController::class, 'deleteTask'])->name('tasks.delete');

    Route::patch('/tasks/{task}/update-status', [SpaceController::class, 'updateTaskStatus'])->name('tasks.update-status');

Route::get('/feedback', [FeedbackController::class, 'create'])->name('feedback.create');
Route::post('/feedback', [FeedbackController::class, 'store'])->name('feedback.store');
Route::view('/support', 'user.support')->name('support');
});













Route::middleware('auth')->group(function () {
    Route::get('/analytics', [AnalyticsController::class, 'index'])->name('analytics.index');
    Route::post('/analytics/activate-monetization', [AnalyticsController::class, 'activateMonetization'])->name('analytics.activate.monetization');
    Route::get('/ads', [AdController::class, 'index'])->name('ads.index');
    Route::get('/ads/create', [AdController::class, 'create'])->name('ads.create');
    Route::post('/ads', [AdController::class, 'store'])->name('ads.store');
    Route::get('/ads/{id}', [AdController::class, 'show'])->name('ads.show');
    Route::get('/ads/{id}/claim', [AdController::class, 'claim'])->name('ads.claim');
    Route::get('/store', [StoreController::class, 'index'])->name('store.index');
    Route::get('/store/{id}', [StoreController::class, 'show'])->name('store.show');
    Route::post('/store/{id}/purchase', [StoreController::class, 'purchase'])->name('store.purchase');
    Route::get('/create-product', [StoreController::class, 'create'])->name('store.create'); // Show product creation form
    Route::post('/store', [StoreController::class, 'store'])->name('store.store'); // Handle product creation
    Route::get('/purchases', [StoreController::class, 'purchases'])->name('purchases.index');
});




// Admin dashboard routes
Route::middleware(['auth'])->group(function () {
    Route::get('/admin/reports', [AdminController::class, 'reports'])->name('admin.reports');
    Route::get('/admin/feedbacks', [AdminController::class, 'showFeedbacks'])->name('admin.feedbacks');
    Route::post('/admin/warning/user/{user}', [AdminController::class, 'sendWarning'])->name('admin.warning.user');
    Route::post('/admin/delete/user/{user}', [AdminController::class, 'deleteUser'])->name('admin.delete.user');
    Route::post('/admin/delete/blog/{blog}', [AdminController::class, 'deleteBlog'])->name('admin.delete.blog');
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');

    // Routes for reporting
Route::post('/report/user/{user}', [ReportController::class, 'reportUser'])->name('report.user');
Route::post('/report/blog/{blog}', [ReportController::class, 'reportBlog'])->name('report.blog');


// Route for the index page showing the list of games
Route::get('/games', [GameController::class, 'index'])->name('games.index');

// Routes for TypeWizard Game
Route::get('/games/typewizard', [GameController::class, 'typeWizard'])->name('games.typewizard');
Route::post('/games/typewizard/result', [GameController::class, 'typeWizardResult'])->name('games.typewizard.result');

// Routes for Synonym Game
Route::get('/games/synonym', [GameController::class, 'synonymGame'])->name('games.synonym');
Route::post('/games/synonym/result', [GameController::class, 'synonymGameResult'])->name('games.synonym.result');

// Routes for Complete a Sentence Game
Route::get('/games/complete-sentence', [GameController::class, 'completeSentenceGame'])->name('games.completeSentence');
Route::post('/games/complete-sentence/result', [GameController::class, 'completeSentenceResult'])->name('games.completeSentence.result');




// Store user categories
Route::post('/store-categories', [UserController::class, 'storeCategories']);

// Update first login status
Route::post('/update-first-login', [UserController::class, 'updateFirstLoginStatus']);

Route::get('/learning', [CourseController::class, 'index']);
Route::get('/courses/{course}', [CourseController::class, 'show'])->name('courses.show');
Route::post('/courses/{course}/buy', [CourseController::class, 'buyCourse'])->name('courses.buy');
Route::get('/courses/{course}/modules/{module}', [ModuleController::class, 'show'])->name('modules.show');

// Route::resource('courses.modules', ModuleController::class)->except(['index', 'edit', 'update', 'destroy']);
Route::get('courses/{course}/modules/{module}/quiz', [ModuleController::class, 'showQuiz'])->name('modules.quiz');
Route::post('courses/{course}/modules/{module}/quiz', [ModuleController::class, 'storeQuiz'])->name('modules.storeQuiz');



Route::get('/chat/{user}/fetch', [ChatController::class, 'fetchMessages'])->name('chat.fetch');
Route::post('/users/make-admin/{id}', [UserController::class, 'makeAdmin'])->name('admin.make');



Route::get('/search', [SearchController::class, 'index'])->name('search.index');


Route::get('/profile/{user}/followers', [UserController::class, 'followers'])->name('users.followers');
Route::get('/profile/{user}/followings', [UserController::class, 'followings'])->name('users.followings');



Route::get('/referral', [AuthController::class, 'showReferralPage'])->name('referral.page');
Route::post('/generate-referral-link', [AuthController::class, 'generateReferralLink'])->name('generate.referral.link');
});






Route::view('/terms', 'user.terms')->name('terms');
Route::view('/privacy', 'user.privacy')->name('privacy');