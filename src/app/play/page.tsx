import { UnifiedPlayPage } from '@/components/UnifiedPlayPage';

export default async function PlayPage({ searchParams }: { searchParams: Promise<{ data?: string; id?: string }> }) {
  const { data, id } = await searchParams;

  return <UnifiedPlayPage gameId={id ?? undefined} encodedData={data ?? undefined} />;
}