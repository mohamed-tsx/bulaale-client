# Bulaale Baby Care - Client Application

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API running on port 4321

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:4321/api/v1
   NEXT_PUBLIC_DEBUG=true
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Features Implemented

### ✅ Core E-commerce Features
- **Product Catalog**: Browse products with search and filtering
- **Shopping Cart**: Add/remove items with persistent storage
- **Checkout Process**: Complete order flow with payment simulation
- **Order Management**: View order history and track status
- **Responsive Design**: Mobile-first approach

### ✅ User Experience
- **Real-time Feedback**: Visual feedback when adding items to cart
- **Error Handling**: Graceful error messages and fallbacks
- **Loading States**: Smooth loading indicators
- **Empty States**: Helpful messages when no data is available

### ✅ Technical Features
- **TypeScript**: Full type safety
- **Zustand**: State management for cart
- **Tailwind CSS**: Modern styling with custom brand colors
- **API Integration**: Axios-based API client with interceptors

## 🛠️ Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Ensure backend is running on port 4321
   - Check `.env.local` file has correct API URL
   - Verify CORS settings in backend

2. **Products Not Loading**
   - Check browser console for API errors
   - Verify backend has products and categories seeded
   - Check network tab for failed requests

3. **Cart Not Persisting**
   - Check browser localStorage permissions
   - Clear browser cache and try again
   - Verify Zustand persistence is working

4. **Styling Issues**
   - Ensure Tailwind CSS is properly configured
   - Check if custom CSS variables are loaded
   - Verify component imports are correct

### Debug Mode

Enable debug mode by setting `NEXT_PUBLIC_DEBUG=true` in your `.env.local` file. This will:
- Show detailed console logs
- Display API response data
- Show cart state changes

## 📱 Pages Overview

### `/` - Home Page
- Product catalog with search and filtering
- Category navigation
- Add to cart functionality
- Responsive grid/list views

### `/cart` - Shopping Cart
- View cart items
- Update quantities
- Remove items
- Proceed to checkout

### `/checkout` - Checkout Process
- Shipping information form
- Payment method selection
- Order processing with Waafi simulation
- Success confirmation

### `/dashboard` - User Dashboard
- Order history
- Order details modal
- Status tracking
- Payment information

## 🎨 Customization

### Brand Colors
The app uses custom brand colors defined in `globals.css`:
- **Brand Blue**: Primary color for buttons and accents
- **Brand Pink**: Secondary color for highlights
- **Gradient Brand**: Blue to pink gradient for CTAs

### Components
All UI components are in `/components/ui/` and follow the shadcn/ui pattern:
- `Button` - Various button styles and sizes
- `Card` - Container components
- `Badge` - Status indicators
- `Input` - Form inputs

## 🔗 API Integration

The app integrates with the backend API through:
- **Base URL**: Configurable via environment variables
- **Authentication**: JWT token handling
- **Error Handling**: Comprehensive error management
- **Type Safety**: Full TypeScript interfaces

### API Endpoints Used
- `GET /products` - Fetch product catalog
- `GET /categories` - Fetch product categories
- `POST /orders` - Create new orders
- `POST /payments` - Process payments
- `POST /waafi/:id/process` - Waafi payment simulation

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables for Production
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api/v1
NEXT_PUBLIC_DEBUG=false
```

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review browser console for errors
3. Verify backend API is running and accessible
4. Check network connectivity

---

**Built with ❤️ for Bulaale Baby Care**