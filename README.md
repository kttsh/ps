# WBS Management System

A sophisticated project management application designed for managing Work Breakdown Structure (WBS) in engineering and construction projects.

## Features

### 📊 Item Management
- Manage project items with detailed attributes (Job No, Function/Group codes, Cost Elements)
- Advanced data table with inline editing and validation
- Virtual scrolling for handling large datasets (100K+ items)
- Real-time filtering and sorting capabilities
- Column-specific input types (text, number, dropdown)

### 👥 Vendor Assignment
- Package-based vendor assignment system
- Master vendor database with comprehensive vendor details
- Drag-and-drop vendor assignment to project packages
- Multi-vendor selection and bulk operations
- Vendor status tracking (Active, Inactive, Pending)

### 🔧 Technical Features
- Type-safe with comprehensive TypeScript definitions
- Accessible UI components built with Radix UI
- Performance optimized for enterprise-scale data
- Component-driven development with Storybook
- Mobile-responsive design

## Tech Stack

- **React 19** with TypeScript
- **TanStack Table** for advanced data grid functionality
- **TanStack Virtual** for performance optimization
- **Radix UI** components for accessibility
- **Tailwind CSS** for styling
- **Storybook** for component development
- **Vite** for build tooling

## Getting Started

### Prerequisites
- Node.js (18+ recommended)
- npm or bun

### Installation

```bash
# Install dependencies
npm install
# or
bun install
```

### Development

```bash
# Start development server
npm run dev

# Start Storybook
npm run storybook
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Testing & Quality

```bash
# Run linting
npm run lint

# Build Storybook
npm run build-storybook
```

## Project Structure

```
src/
├── features/
│   └── wbs-management/        # Core WBS management functionality
│       ├── components/        # Feature-specific components
│       ├── types/            # TypeScript type definitions
│       └── mock/             # Mock data for development
├── components/
│   └── ui/                   # Reusable UI components
├── pages/                    # Application pages
└── lib/                      # Utility functions
```

## Key Components

- **ItemTable**: Advanced data table with virtual scrolling and inline editing
- **VendorAssignment**: Vendor management and assignment interface
- **UI Components**: Accessible, reusable components built with Radix UI

## Business Context

This application is designed for engineering and construction project management, where:

- Projects are broken down into work packages using WBS methodology
- Items represent work elements with specific classifications and cost tracking
- Vendors are assigned to packages for project execution
- Cost elements track different expense categories (material, labor, equipment)
- IBS codes categorize building system components
