import { Metadata } from 'next';
import { WalletProvider } from './providers/WalletProvider';

export const metadata: Metadata = {
  title: '$LARRY Dashboard - Wild Trading',
  description: 'Manage your $LARRY tokens and leverage positions',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black">
      <div className="bg-gradient-to-b from-purple-900/20 to-black">
        <WalletProvider>
          {children}
        </WalletProvider>
      </div>
    </div>
  );
}