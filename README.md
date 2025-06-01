# Studio Space - Creative Workspace Booking Platform

A modern web application for booking photo studio space and coworking facilities, built with Next.js 15, TypeScript, and Supabase.

## 🚀 Features

### Core Functionality
- **Photo Studio Booking**: Professional photography studio with equipment and lighting
- **Coworking Space**: Flexible workspace for freelancers and creative professionals
- **Real-time Booking System**: Form-based booking with time slot selection
- **Admin Dashboard**: Manage bookings, view analytics, and track reservations
- **FAQ System**: Dynamic FAQ management with categorization
- **Gallery**: Showcase studio and workspace images

### Technical Features
- **Modern UI**: Built with shadcn/ui, Radix UI, and Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Supabase integration ready
- **Responsive Design**: Mobile-first approach with modern UX
- **Dark/Light Mode**: Theme switching with next-themes
- **Type Safety**: Full TypeScript implementation
- **Server Components**: Optimized with Next.js App Router

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: PostgreSQL with Prisma ORM
- **Backend**: Supabase
- **UI Components**: Radix UI primitives
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 📁 Project Structure

```
studio-space/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard
│   ├── book/              # Booking form page
│   ├── coworking/         # Coworking space details
│   ├── faq/               # FAQ page with categories
│   ├── gallery/           # Image gallery
│   ├── studio/            # Studio details and pricing
│   ├── layout.tsx         # Root layout with navigation
│   └── page.tsx           # Homepage
├── components/            # Reusable components
│   ├── ui/                # shadcn/ui components
│   ├── booking-form.tsx   # Booking form component
│   ├── gallery.tsx        # Gallery component
│   ├── navbar.tsx         # Navigation component
│   └── footer.tsx         # Footer component
├── lib/                   # Utility functions
│   ├── prisma.ts          # Prisma client setup
│   └── utils.ts           # General utilities
├── prisma/                # Database schema
│   └── schema.prisma      # Prisma schema definition
└── public/                # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Supabase account (optional, for hosted database)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd studio-space
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/studio_space"
   
   # Supabase (optional)
   NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma db push
   
   # (Optional) Seed the database
   npx prisma db seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📊 Database Schema

### Booking Model
- User information (name, email, phone)
- Booking details (date, time slots, type)
- Status tracking (pending, confirmed, cancelled)
- Messages and special requests

### FAQ Model
- Question and answer content
- Category organization (studio, coworking, general)
- Ordering and timestamps

## 🎨 UI Components

The project uses a comprehensive set of UI components:

- **Forms**: Input, Select, Textarea, Calendar, Form validation
- **Navigation**: Tabs, Accordion, Dropdown menus
- **Feedback**: Badges, Buttons, Toast notifications
- **Layout**: Cards, Dialogs, Popovers

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Adding New Features

1. **New Pages**: Add to `app/` directory following App Router conventions
2. **Components**: Create in `components/` with TypeScript interfaces
3. **Database Changes**: Update `prisma/schema.prisma` and run migrations
4. **Styling**: Use Tailwind classes and shadcn/ui components

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify**: Configure build command and environment variables
- **Railway**: Connect database and deploy with one click
- **Docker**: Use the included Dockerfile for containerization

## 🔐 Environment Variables

```env
# Required
DATABASE_URL=                    # PostgreSQL connection string
NEXT_PUBLIC_SUPABASE_URL=       # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=  # Supabase anonymous key

# Optional
DIRECT_URL=                     # Direct database connection (for migrations)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the FAQ section in the application
- Review the documentation in the `/docs` folder

## 🎯 Roadmap

- [ ] User authentication and profiles
- [ ] Payment integration (Stripe)
- [ ] Email notifications
- [ ] Calendar integration
- [ ] Real-time availability checking
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Multi-location support

---

Built with ❤️ using Next.js and modern web technologies.
