import ClientPage from './ClientPage';

export function generateStaticParams() {
  return [{ bookingId: 'dummy' }];
}

export default function Page({ params }: { params: any }) {
  return <ClientPage params={params} />;
}
