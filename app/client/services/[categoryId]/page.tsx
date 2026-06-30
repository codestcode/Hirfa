import ClientPage from './ClientPage';

export function generateStaticParams() {
  return [{ categoryId: 'dummy' }];
}

export default function Page() {
  return <ClientPage />;
}
