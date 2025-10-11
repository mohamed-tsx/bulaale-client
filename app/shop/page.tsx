import { redirect } from 'next/navigation';

export default function ShopPage() {
  // Redirect /shop to /products for unified routing
  redirect('/products');
}
