import OrderDetailClient from './OrderDetailClient';

// Required for static HTML export (output: 'export')
export function generateStaticParams() {
  return [
    { id: 'view' },
  ];
}

export default function OrderDetailPage() {
  return <OrderDetailClient />;
}
