import ClientPage from './ClientPage';

export function generateStaticParams() {
  return [{ categoryId: 'dummy' }];
}

export default function Page({ params }: { params: any }) {
  return <ClientPage params={params} />;
}
