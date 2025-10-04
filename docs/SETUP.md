# Developer Setup Guide

Complete instructions for setting up uptask-o for local development.

## Prerequisites

- Node.js 18+ and npm
- A Supabase account
- A GitHub OAuth App (for authentication)

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/ehlvg/uptask-o.git
cd uptask-o
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Authentication** → **Providers** → Enable **GitHub**
3. Create a GitHub OAuth App:
   - Go to GitHub Settings → Developer settings → OAuth Apps → New OAuth App
   - **Application name**: uptask-o (or your choice)
   - **Homepage URL**: `http://localhost:5173`
   - **Authorization callback URL**: `https://your-project.supabase.co/auth/v1/callback`
   - Copy the Client ID and Client Secret
4. Add the GitHub OAuth credentials to your Supabase project
5. Run the database schema from `supabase-schema.sql`:
   - Go to **SQL Editor** in Supabase dashboard
   - Paste the contents of `supabase-schema.sql`
   - Run the query

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

You can find these values in your Supabase project settings under **API**.

### 5. Start the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

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
│   │   ├── AuthContext.tsx # Authentication state
│   │   └── ThemeContext.tsx # Theme management
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
├── public/                 # Static assets
├── docs/                   # Documentation
└── supabase-schema.sql     # Database schema
```

## Database Schema

### Tables

#### **projects**

Stores user projects with customizable names and icons.

| Column     | Type      | Description               |
| ---------- | --------- | ------------------------- |
| id         | uuid      | Primary key               |
| user_id    | uuid      | Foreign key to auth.users |
| name       | text      | Project name              |
| icon       | text      | Icon identifier           |
| created_at | timestamp | Creation timestamp        |

#### **tasks**

Stores tasks with title, description, completion status, and due dates.

| Column      | Type      | Description                 |
| ----------- | --------- | --------------------------- |
| id          | uuid      | Primary key                 |
| user_id     | uuid      | Foreign key to auth.users   |
| project_id  | uuid      | Foreign key to projects     |
| title       | text      | Task title                  |
| description | text      | Task description (optional) |
| completed   | boolean   | Completion status           |
| due_date    | timestamp | Due date (optional)         |
| created_at  | timestamp | Creation timestamp          |

### Security

- **Row Level Security (RLS)** enabled on all tables
- Users can only access their own data
- Automatic user isolation at the database level
- Policies enforce user-specific queries

### Real-time Subscriptions

The app uses Supabase real-time subscriptions to sync changes:

- Task updates sync automatically across all connected clients
- Project changes reflect immediately
- No manual refresh needed

## Deployment

### Prerequisites

1. Update your GitHub OAuth App with production URLs:

   - Homepage URL: `https://yourdomain.com`
   - Callback URL: `https://your-project.supabase.co/auth/v1/callback`

2. Configure Supabase redirect URLs:

   - Go to **Authentication** → **URL Configuration**
   - Add your production domain to **Site URL**
   - Add redirect URLs to **Redirect URLs**

3. Set environment variables in your hosting platform:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Hosting Options

The app can be deployed to:

- **Vercel** (recommended for Next.js/Vite apps)
- **Netlify**
- **Cloudflare Pages**
- Any static hosting service

For Docker deployment, a `Dockerfile` and `nginx.conf` are included in the repository.

## Development Tips

### Code Style

- TypeScript strict mode enabled
- ESLint configured for code quality
- Modern React patterns (hooks, context)
- Functional components throughout
- Tailwind CSS for styling

### Theme System

The app includes a comprehensive theme system:

- Light/Dark/System themes
- 8 customizable accent colors
- Persisted to localStorage
- CSS custom properties for colors

### Adding New Components

When adding shadcn/ui components:

```bash
npx shadcn@latest add <component-name>
```

## Troubleshooting

### OAuth Callback Error

If you get a redirect error after GitHub sign-in:

1. Verify your GitHub OAuth App callback URL matches Supabase
2. Check that the redirect URLs are configured in Supabase
3. Ensure environment variables are loaded correctly

### Real-time Not Working

If changes don't sync in real-time:

1. Check that real-time is enabled for your tables in Supabase
2. Verify your RLS policies allow SELECT operations
3. Check browser console for WebSocket errors

### Build Errors

If the build fails:

1. Clear node_modules: `rm -rf node_modules && npm install`
2. Clear Vite cache: `rm -rf node_modules/.vite`
3. Check TypeScript errors: `npm run build`

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `npm run lint` to check code quality
5. Submit a pull request

## License

MIT License - see LICENSE file for details
