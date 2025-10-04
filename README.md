# uptask-o

A calm and welcoming task manager for real work.

## Features

- 🔐 **Secure Authentication** - GitHub OAuth integration via Supabase Auth
- 📊 **Project Management** - Organize tasks into customizable projects with icons
- ✅ **Task Tracking** - Create, complete, and manage tasks with descriptions and due dates
- 🔄 **Real-time Sync** - Changes sync automatically across devices
- 🎨 **Beautiful UI** - Modern, responsive design built with Tailwind CSS and shadcn/ui
- 🔒 **Private by Default** - Row-level security ensures your data stays yours

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Styling**: Tailwind CSS 4, shadcn/ui components
- **Authentication**: Supabase Auth with GitHub OAuth
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Type Safety**: Full TypeScript coverage with generated database types

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account
- A GitHub OAuth App (for authentication)

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd uptask-o
```

2. Install dependencies:

```bash
npm install
```

3. Set up Supabase:

   - Create a Supabase project
   - Configure GitHub OAuth
   - Run the database schema
   - Copy your environment variables

4. Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

5. Start the development server:

```bash
npm run dev
```

6. Open your browser to `http://localhost:5173`

## Project Structure

```
uptask-o/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── AuthForm.tsx    # GitHub sign-in form
│   │   ├── AppMenuBar.tsx  # Top navigation
│   │   ├── ProjectList.tsx # Sidebar projects
│   │   └── TaskList.tsx    # Task display
│   ├── contexts/           # React contexts
│   │   └── AuthContext.tsx # Authentication state
│   ├── hooks/              # Custom React hooks
│   │   └── useTaskManager.ts # Task/project management
│   ├── lib/                # Utilities
│   │   ├── supabase.ts     # Supabase client
│   │   ├── database.types.ts # Generated types
│   │   └── utils.ts        # Helper functions
│   ├── pages/              # Page components
│   │   ├── WelcomePage.tsx # Landing page
│   │   ├── AuthCallback.tsx # OAuth callback
│   │   └── Dashboard.tsx   # Main app
│   └── types/              # TypeScript types
│       └── tasks.ts        # Task/project types
└── .env.example            # Environment template
```

## Database Schema

### Tables

- **projects** - User projects with customizable names and icons
- **tasks** - Tasks with title, description, completion status, and due dates

### Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Automatic user isolation at the database level

### Real-time

- Live updates across all connected clients
- Changes sync automatically without refresh

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- TypeScript strict mode enabled
- ESLint for code quality
- Modern React patterns (hooks, context)
- Functional components throughout

## Deployment

### Prerequisites

1. Update GitHub OAuth App with production URLs
2. Configure Supabase redirect URLs for production
3. Set environment variables in your hosting platform

### Build Command

```bash
npm run build
```

### Output Directory

```
dist/
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

---

Built with ❤️ using React, TypeScript, and Supabase
