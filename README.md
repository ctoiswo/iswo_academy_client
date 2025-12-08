# ISWO Academy Platform

A comprehensive online learning platform where anyone can create their own academy and students can discover and purchase courses. Built with modern web technologies for optimal performance and user experience.

![Platform Preview](public/images/shadcn-admin.png)

## About the Platform

ISWO Academy is a multi-role learning management system that provides:

- **Public Catalog**: Browse featured academies and courses
- **Academy Creation**: Landing page and tools for educators to create their own academies
- **Student Experience**: Course discovery, purchasing, and learning interface
- **Dynamic Dashboards**: Role-based interfaces that adapt to user permissions (students, instructors, academy owners)
- **Multi-Academy Support**: Complete ecosystem supporting multiple independent academies

## Key Features

- **Multi-Role Platform**: Students, instructors, and academy owners with tailored experiences
- **Academy Management**: Complete tools for creating and managing online academies
- **Course Marketplace**: Public catalog with featured academies and courses
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI/UX**: Built with accessibility and user experience in mind
- **Light/Dark Mode**: User preference theme switching
- **RTL Support**: Right-to-left language compatibility
- **Global Search**: Command palette for quick navigation
- **Authentication**: Secure user management with role-based access

## Platform Structure

- **`/` (Home)**: Public catalog showcasing featured academies and courses
- **`/academy/create`**: Landing page and onboarding for new academy creators
- **`/dashboard`**: Role-based dashboard (students, instructors, academy owners)
- **`/courses`**: Course discovery and enrollment interface
- **`/academies`**: Academy browsing and selection

<details>
<summary>Technical Components (click to expand)</summary>

This platform uses Shadcn UI components, with modifications for RTL (Right-to-Left) support and platform-specific improvements. These customized components differ from the original Shadcn UI versions.

When updating components using the Shadcn CLI (e.g., `npx shadcn@latest add <component>`), it's safe for non-customized components. For customized ones, manually merge changes to preserve platform modifications and RTL support.

### Modified Components

- scroll-area
- sonner
- separator

### RTL Updated Components

- alert-dialog
- calendar
- command
- dialog
- dropdown-menu
- select
- table
- sheet
- sidebar
- switch

**Notes:**

- **Modified Components**: Platform-specific updates, including RTL adjustments
- **RTL Updated Components**: Specific changes for RTL language support (layout, positioning)
- For implementation details, check the source files in `src/components/ui/`
- All other Shadcn UI components are standard and can be safely updated via CLI

**UI Framework:** ShadcnUI (TailwindCSS + RadixUI)

**Build Tool:** Vite

**Routing:** TanStack Router

**Type Checking:** TypeScript

**Linting/Formatting:** Eslint & Prettier

**Icons:** Lucide Icons, Tabler Icons

**Authentication:** Clerk

## Development Setup

### Prerequisites

- Node.js 18+
- pnpm package manager
- ISWO Academy Core API running (see backend repository)

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd iswo_academy_client
```

2. Install dependencies

```bash
pnpm install
```

3. Configure environment variables

```bash
cp .env.example .env
# Edit .env with your API endpoints and configuration
```

4. Start the development server

```bash
pnpm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build
- `pnpm run lint` - Run ESLint
- `pnpm run type-check` - Run TypeScript checks

## License

Licensed under the [MIT License](https://choosealicense.com/licenses/mit/)
