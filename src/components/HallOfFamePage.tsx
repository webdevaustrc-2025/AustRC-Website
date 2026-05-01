import { HallOfFameSection } from './HallOfFameSection';
import { useTokens } from '@/tokens/useTokens';

export function HallOfFamePage() {
  const t = useTokens();
  return (
    <div className="min-h-screen pt-20" style={{ backgroundColor: t.pageBg }}>
      <HallOfFameSection />
    </div>
  );
}
