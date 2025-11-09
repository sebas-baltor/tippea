import * as React from "react";
import QRCode from "react-qr-code";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Copy, Check, QrCode, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import useStorage from "@/config/storage/storage.global";
import { maskUrl } from "@/lib/url";

type Props = {
  className?: string;
  onBeforeRedirect?: (args: { username: string; walletUrl: string; addUrl: string }) => Promise<void> | void;
  redirectPathBuilder?: (args: { username: string; walletUrl: string; origin: string }) => string;
};

export function WalletCardShare({
  className,
  onBeforeRedirect,
  redirectPathBuilder,
}: Props) {
//   const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);
  const [qrOpen, setQrOpen] = React.useState(false);
//   const {walletUrl,username} = useStorage((s)=>({walletUrl:s.wallet,username:s.username }));
const walletUrl = useStorage((s)=>s.wallet.id);
const username = useStorage((s)=>s.username);
const wallet = useStorage((s)=>s.wallet);

//   const normalized = React.useMemo(() => normalizeWallet(walletUrl), [walletUrl]);

  const addUrl = React.useMemo(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    if (redirectPathBuilder) return redirectPathBuilder({ username, walletUrl: walletUrl, origin });
    // default path example: /users/:username/add-wallet?wallet=...
    const path = `/users/${encodeURIComponent(username)}/add-wallet?wallet=${encodeURIComponent(walletUrl)}`;
    return `${origin}${path}`;
  }, [username, walletUrl, redirectPathBuilder]);

  const masked = React.useMemo(() => maskUrl(walletUrl), [walletUrl]);

  async function handleCopy() {
    await navigator.clipboard.writeText(addUrl);
    setCopied(true);
    toast("Link copiado",{ description: "Pegalo donde quieras compartir" });
    setTimeout(() => setCopied(false), 1500);
  }

  async function handleAddAndRedirect() {
    try {
      if (onBeforeRedirect) {
        await onBeforeRedirect({ username, walletUrl, addUrl });
      }
      window.location.href = addUrl;
    } catch (e) {
      toast.error("No se pudo continuar",{ description: "Intenta de nuevo" });
    }
  }

  return (
    <TooltipProvider>
      <Card
        className={cn(
          "relative overflow-hidden border-0 text-white",
          "bg-black/90",
          "shadow-2xl rounded-2xl",
          className
        )}
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-20 blur-2xl bg-white" />
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <span className="tracking-wide">{wallet.assetCode}</span>
            <span className="text-xs font-normal opacity-90">User • {username}</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="text-sm opacity-90">Dirección</div>
            <span className="font-mono text-xs opacity-90">{masked}</span>
          </div>

          <div className="rounded-xl bg-white/10 p-3 backdrop-blur">
            <div className="text-xs opacity-90">URL completa</div>
            <div className="mt-1 truncate font-mono text-sm">{walletUrl}</div>
          </div>

          <div className="mt-2 flex flex-row gap-2">
            <Tooltip>
              <TooltipTrigger className="w-full">
                <Button
                  onClick={handleCopy}
                  variant="secondary"
                  className="w-full bg-white/90 text-gray-900 hover:bg-white"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copiado" : "Copiar link"}
                </Button>
              </TooltipTrigger>
              <TooltipContent className={buttonVariants({variant:"default"})}>Copia el link para compartir o agregar</TooltipContent>
            </Tooltip>

            <Dialog open={qrOpen} onOpenChange={setQrOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost">
                  <QrCode className="h-4 max-w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Escanea para agregar</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center gap-4 py-2">
                  <div className="rounded-lg bg-white p-3">
                    <QRCode value={addUrl} size={168} />
                  </div>
                  <div className="w-full text-center text-xs text-muted-foreground break-all">
                    {addUrl}
                  </div>
                </div>
                <DialogFooter className="flex items-center justify-between gap-2 sm:justify-end">
                  <Button variant="secondary" onClick={handleCopy}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copiar link
                  </Button>
                  <Button onClick={handleAddAndRedirect}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Agregar y redirigir
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={handleAddAndRedirect} className="w-full">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Agregar a usuario
                </Button>
              </TooltipTrigger>
              <TooltipContent>Agrega la wallet al usuario y redirige</TooltipContent>
            </Tooltip> */}
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}

/* helpers */

// function normalizeWallet(raw: string) {
//   const trimmed = (raw || "").trim().replace(/^\$/, "");
//   if (/^https?:\/\//i.test(trimmed)) return trimmed;
//   if (!trimmed) return "";
//   return `http://${trimmed}`;
// }

