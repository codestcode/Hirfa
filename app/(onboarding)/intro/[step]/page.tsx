import ClientPage from './ClientPage';

export function generateStaticParams() {
  return [
    { step: '1' },
    { step: '2' },
    { step: '3' },
    { step: '4' }
  ];
}

export default function Page({ params }: { params: any }) {
  return <ClientPage params={params} />;
}
