export function generateStaticParams() {
  return [
    { step: '1' },
    { step: '2' },
    { step: '3' },
    { step: '4' }
  ];
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
