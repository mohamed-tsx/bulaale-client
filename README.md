# Bulaale Baby Care - Client Storefront

A comprehensive e-commerce storefront for Bulaale Baby Care, built with Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui components.

## 🚀 Features

### 🛍️ E-commerce Functionality
- **Product Catalog**: Browse products with advanced filtering and sorting
- **Shopping Cart**: Persistent cart with sidebar drawer and dedicated page
- **Checkout Process**: Complete order flow with multiple payment methods
- **Order Management**: Track orders with status timeline
- **User Authentication**: Secure login/register with JWT tokens

### 🎨 Design & UX
- **Modern UI**: Clean, minimal design with solid colors
- **Responsive Layout**: Mobile-first design that works on all devices
- **Accessibility**: Keyboard navigation and screen reader support
- **Loading States**: Skeleton loaders and smooth transitions
- **Error Handling**: Graceful error states and fallbacks

### 🔧 Technical Features
- **TypeScript**: Full type safety throughout the application
- **State Management**: Zustand for cart state with localStorage persistence
- **API Integration**: Axios-based API client with error handling
- **SEO Optimized**: Meta tags, sitemap, and robots.txt
- **Performance**: Lazy loading, image optimization, and code splitting

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI primitives
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Icons**: Lucide React

### Design System
- **Primary Color**: #3B82F6 (Blue)
- **Accent Color**: #EC4899 (Pink)
- **Background**: #F9FAFB (Light Gray)
- **Text**: #111827 (Dark Gray)
- **Cards**: White with subtle shadows
- **Border Radius**: 1rem (rounded-2xl)

## 📁 Project Structure

```
bulaale-client/
├── app/                          # Next.js App Router pages
│   ├── (auth)/                  # Auth pages group
│   │   └── login/
│   │   └── register/
│   ├── (pages)/                 # Main pages
│   │   ├── about/
│   │   ├── cart/
│   │   ├── categories/
│   │   ├── checkout/
│   │   ├── contact/
│   │   ├── faq/
│   │   ├── orders/
│   │   ├── privacy/
│   │   ├── profile/
│   │   ├── returns/
│   │   ├── shop/
│   │   └── terms/
│   ├── order/[orderNo]/         # Dynamic order detail page
│   ├── product/[id]/           # Dynamic product detail page
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   ├── robots.ts               # SEO robots.txt
│   └── sitemap.ts              # SEO sitemap
├── components/                  # Reusable components
│   ├── cart/                   # Cart-related components
│   │   └── CartDrawer.tsx
│   ├── layout/                 # Layout components
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── ui/                     # shadcn/ui components
│       ├── AddToCart.tsx
│       ├── CategoryCard.tsx
│       ├── Filters.tsx
│       ├── OrderStatusTimeline.tsx
│       ├── ProductCard.tsx
│       ├── ProductGrid.tsx
│       └── [shadcn components]
├── lib/                        # Utilities and configurations
│   ├── api.ts                  # API client and types
│   ├── stores/                 # Zustand stores
│   │   └── cart-store.ts
│   └── utils.ts                # Utility functions
└── public/                     # Static assets
    └── placeholder-image.svg
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API running on `http://localhost:4321`

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   # Create .env.local file
   NEXT_PUBLIC_API_URL=http://localhost:4321/api/v1
   NEXT_PUBLIC_IMAGE_URL=http://localhost:4321
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

## 📱 Pages Overview

### 🏠 Home Page (`/`)
- Hero section with clear value proposition
- Featured categories grid
- Featured products showcase
- Trust badges and testimonials
- Newsletter signup
- Call-to-action sections

### 🛍️ Shop Page (`/shop`)
- Product grid with filtering and sorting
- Search functionality
- Pagination
- Grid/list view toggle
- Category filtering
- Price range filtering

### 📦 Product Detail (`/product/[id]`)
- Product image gallery
- Variant selection (size, color)
- Add to cart with quantity controls
- Product specifications
- Related products
- Reviews section

### 🛒 Cart & Checkout
- **Cart Drawer**: Slide-out sidebar with cart items
- **Cart Page**: Full cart management page
- **Checkout**: Multi-step checkout process
- **Payment**: Multiple payment methods (EVC, Zaad, Sahal, COD)

### 👤 User Account
- **Login/Register**: Secure authentication
- **Profile**: User information management
- **Orders**: Order history and tracking
- **Order Detail**: Detailed order view with status timeline

### 📄 Static Pages
- **About**: Company information and values
- **Contact**: Contact form and information
- **FAQ**: Frequently asked questions
- **Returns**: Return policy and process
- **Privacy**: Privacy policy
- **Terms**: Terms of service

## 🔧 API Integration

### Backend Endpoints
The client connects to the backend API at `http://localhost:4321/api/v1`:

- **Products**: `/products` (list, featured, by category)
- **Categories**: `/categories`
- **Orders**: `/orders` (create, list, detail)
- **Payments**: `/payments` (create, process)
- **Auth**: `/user` (register, login, profile)

### API Client Features
- Automatic token management
- Request/response interceptors
- Error handling
- Type-safe API calls
- Image URL construction

## 🎨 Component Library

### Reusable Components
- **ProductCard**: Product display with variants
- **ProductGrid**: Responsive product grid with loading states
- **CategoryCard**: Category display cards
- **Filters**: Advanced filtering component
- **AddToCart**: Product variant selection and cart addition
- **OrderStatusTimeline**: Visual order status tracking
- **CartDrawer**: Slide-out cart sidebar

### shadcn/ui Components
- Button, Input, Label, Textarea
- Card, Badge, Separator
- Select, Checkbox, Tabs
- Sheet (drawer), Collapsible
- Dropdown Menu, Avatar

## 🛒 Cart Management

### Zustand Store
- Persistent cart state (localStorage)
- Add/remove/update quantities
- Real-time subtotal calculation
- Cart item management

### Cart Features
- Sidebar drawer for quick access
- Dedicated cart page for full management
- Quantity controls with validation
- Remove items functionality
- Clear cart option

## 🔐 Authentication

### Auth Flow
- JWT token-based authentication
- Secure token storage (localStorage)
- Automatic token refresh
- Protected routes
- User profile management

### Auth Pages
- **Login**: Email/password authentication
- **Register**: Account creation with validation
- **Profile**: User information management

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Mobile Features
- Touch-friendly interactions
- Mobile-optimized navigation
- Responsive image galleries
- Mobile cart drawer
- Touch gestures support

## ♿ Accessibility

### Features
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- ARIA labels and roles
- Color contrast compliance
- Semantic HTML structure

## 🚀 Performance

### Optimizations
- Image lazy loading
- Code splitting
- Bundle optimization
- Caching strategies
- Loading states
- Error boundaries

## 🔍 SEO

### Features
- Meta tags and descriptions
- Open Graph tags
- Structured data
- Sitemap generation
- Robots.txt
- URL optimization

## 🧪 Development

### Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Husky for git hooks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Email: info@bulaale.com
- Phone: +252 61 123 4567
- Website: [Contact Page](/contact)

---

Built with ❤️ for Bulaale Baby Care