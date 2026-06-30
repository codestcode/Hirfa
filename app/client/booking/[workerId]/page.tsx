import ClientPage from './ClientPage';

export function generateStaticParams() {
  return [{ workerId: 'dummy' }];
}

export default function Page() {
  return <ClientPage />;
}
