import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import useStorage from "@/config/storage/storage.global";

// your mock data
export const mockWalletProfiles = [
  { path: "https://randomuser.me/api/portraits/men/1.jpg",    walletId: "http://ilp.interledger-test.dev/interledger-hack" },
  { path: "https://randomuser.me/api/portraits/women/2.jpg",  walletId: "http://ilp.interledger-test.dev/jhon-address" },
  { path: "https://randomuser.me/api/portraits/men/3.jpg",    walletId: "http://ilp.interledger-test.dev/interledger-hack-03" },
  { path: "https://randomuser.me/api/portraits/women/4.jpg",  walletId: "http://ilp.interledger-test.dev/interledger-hack-04" },
  { path: "https://randomuser.me/api/portraits/men/5.jpg",    walletId: "http://ilp.interledger-test.dev/interledger-hack-05" },
  { path: "https://randomuser.me/api/portraits/women/6.jpg",  walletId: "http://ilp.interledger-test.dev/interledger-hack-06" },
  { path: "https://randomuser.me/api/portraits/men/7.jpg",    walletId: "http://ilp.interledger-test.dev/interledger-hack-07" },
  { path: "https://randomuser.me/api/portraits/women/8.jpg",  walletId: "http://ilp.interledger-test.dev/interledger-hack-08" },
  { path: "https://randomuser.me/api/portraits/men/9.jpg",    walletId: "http://ilp.interledger-test.dev/interledger-hack-09" },
  { path: "https://randomuser.me/api/portraits/women/10.jpg", walletId: "http://ilp.interledger-test.dev/interledger-hack-10" },
];

type WalletAvatar = (typeof mockWalletProfiles)[number];

type Props = {
  className?: string;
  onAddWallet?: (nextIndex: number) => WalletAvatar | Promise<WalletAvatar>; // optional custom add flow
  onSelect?: (item: WalletAvatar) => void; // click avatar
};

export function WalletAvatarScroller({ className, onAddWallet, onSelect }: Props) {
  const [items, setItems] = React.useState<WalletAvatar[]>(mockWalletProfiles);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const walletId = useStorage((s)=>s.wallet.id);

  const nextIndex = items.length + 1;

  const handleAdd = async () => {
    const makeDefault = (i: number): WalletAvatar => ({
      path: `https://randomuser.me/api/portraits/${i % 2 ? "men" : "women"}/${(i % 70) + 1}.jpg`,
      walletId: `http://ilp.interledger-test.dev/interledger-hack-${String(i).padStart(2, "0")}`,
    });

    const newItem = onAddWallet ? await onAddWallet(nextIndex) : makeDefault(nextIndex);
    setItems((prev) => [...prev, newItem]);

    // scroll to end smoothly
    requestAnimationFrame(() => {
      if (!scrollRef.current) return;
      scrollRef.current.scrollTo({ left: scrollRef.current.scrollWidth, behavior: "smooth" });
    });
  };

  return (
    <div className={cn("relative", className)}>
      {/* scroll area */}
      <div
        ref={scrollRef}
        className={cn(
          "flex items-center gap-4 overflow-x-auto whitespace-nowrap",
          "px-2 py-3 pr-14", // extra right padding so last avatar isn't under the sticky button
          "scroll-smooth"
        )}
      >
        {items.map((item) => (
          item.walletId === walletId ? null :
          <button
            key={item.walletId}
            onClick={() => onSelect?.(item)}
            className="group flex flex-col items-center gap-2 shrink-0 focus:outline-none"
            title={item.walletId}
            type="button"
          >
            <Avatar className="h-12 w-12 ring-2 ring-transparent transition group-hover:ring-white/40">
              <AvatarImage src={item.path} alt={item.walletId} />
              <AvatarFallback className="text-xs">WL</AvatarFallback>
            </Avatar>
            <span className="pointer-events-none select-none text-[10px] text-muted-foreground max-w-24 truncate">
              {item.walletId.replace("http://", "")}
            </span>
          </button>
        ))}
      </div>

      {/* right edge gradient for nicer fade */}
      <div className="pointer-events-none absolute right-12 top-0 h-full w-10" />

      {/* sticky + button */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2">
        <Button
          size="icon"
          className="h-10 w-10 rounded-full shadow-lg"
          aria-label="Add wallet"
          onClick={handleAdd}
          type="button"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
