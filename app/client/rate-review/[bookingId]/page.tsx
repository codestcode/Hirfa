import ClientPage from './ClientPage';

export function generateStaticParams() {
  return [{ bookingId: 'dummy' }];
}

export default function Page() {
  return <ClientPage />;
}
