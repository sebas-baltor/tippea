// import { CreateGrantForm } from "@/modules/grant/grant-form";
import { TipGrantsManager } from "@/modules/grant/tip-grant";
import { IncomingPaymentModal } from "@/modules/payment/request-payment";
import { WalletCardShare } from "@/modules/wallet/wallet-card";
import { WalletAvatarScroller } from "@/modules/wallet/wallet-list/wallet-list";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4">
        <WalletCardShare/>
      </div>
      <WalletAvatarScroller/>
      <IncomingPaymentModal/>
      <TipGrantsManager/>
    </div>
  );
}
