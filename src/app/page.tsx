import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Tokenomics from '@/components/Tokenomics';
import ProtocolStats from '@/components/ProtocolStats';
import AdvancedStrategies from '@/components/AdvancedStrategies';

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <Hero />
      <ProtocolStats />
      <Features />
      <Tokenomics />
      <AdvancedStrategies />
    </div>
  );
}
