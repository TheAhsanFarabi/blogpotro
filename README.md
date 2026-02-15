# Blogpotro

**Blogpotro** is a next-generation social blogging and gamified learning ecosystem built on the **Laravel** framework. It merges traditional content creation with advanced AI tools, collaborative workspaces, and an integrated educational platform.

## Key Features

### 🤖 AI-Powered Writing Suite

Leveraging the **Gemini API**, Blogpotro provides creators with sophisticated tools to enhance their writing:

* **AI Chatbot**: A dedicated assistant for real-time interaction and support.
* **Grammar & Tone**: Tools to fix grammar, analyze writing tone, and paraphrase content.
* **Content Optimization**: One-click summarization and integrated plagiarism checking.

### 🤝 Collaborative "Spaces"

Collaborate with others in dedicated hubs designed for shared productivity:

* **Collab Blogs**: Create content together with full version history and rollback capabilities.
* **Space Management**: Internal group chats, task management (To-Do lists), and invitation systems.

### 🎓 Gamified Learning & Discovery

Engagement is driven through interactive education and competitive features:

* **Learning Management**: Enroll in courses, complete modules, and take quizzes to climb the leaderboard.
* **Educational Games**: Sharpen your skills with games like *TypeWizard*, *Synonym Game*, and *Complete a Sentence*.
* **Engagement Tools**: Maintain daily streaks, earn credits, and participate in community challenges.

### 💰 Monetization & Commerce

A built-in economy for creators and learners:

* **Digital Store**: Create and purchase products or courses directly on the platform.
* **Ad System**: Claim and manage advertisements to monetize your reach.
* **Subscriptions**: Premium models for exclusive access and enhanced features.

### 📱 Social Networking

* **Rich Blogging**: Support for long-form articles and "Shorts" for quick updates.
* **Community Interaction**: Follow users, like posts, comment on discussions, and bookmark favorites.
* **Messaging**: Direct real-time chat between users.

---

## Tech Stack

* **Framework**: Laravel 11
* **Language**: PHP, JavaScript
* **Styling**: Tailwind CSS
* **Build Tool**: Vite
* **Database**: MySQL

## Getting Started

### Prerequisites

* PHP >= 8.2
* Composer
* Node.js & NPM

### Installation

1. **Clone the repository**:
```bash
git clone https://github.com/your-username/blogpotro.git
cd blogpotro

```


2. **Install dependencies**:
```bash
composer install
npm install

```


3. **Configure Environment**:
```bash
cp .env.example .env
php artisan key:generate

```


4. **Setup Database**:
Update your `.env` file with your database credentials and run:
```bash
php artisan migrate --seed

```


5. **Run the application**:
```bash
npm run dev
php artisan serve

```



---

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

* [Simple, fast routing engine](https://laravel.com/docs/routing).
* [Powerful dependency injection container](https://laravel.com/docs/container).
* Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
* Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).

## Learning Laravel

Laravel has extensive [documentation](https://laravel.com/docs) and video tutorials. You may also try the [Laravel Bootcamp](https://bootcamp.laravel.com) or [Laracasts](https://laracasts.com).

## License

The Blogpotro project, like the Laravel framework, is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
