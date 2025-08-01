import { UnifiedPlayPage } from '@/components/UnifiedPlayPage';

export default async function PlayPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <UnifiedPlayPage gameId={slug} encodedData={undefined} />;
}