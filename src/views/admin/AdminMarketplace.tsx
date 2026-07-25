import { MarketplaceAdminOverview } from "@/components/marketplace/Marketplaceadminoverview";

export default function AdminMarketplacePage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-calma-ink">Marketplace</h1>
        <p className="text-sm text-calma-taupe">manage your marketplace</p>
      </div>
      <MarketplaceAdminOverview />
    </div>
  );
}
