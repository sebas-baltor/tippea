import * as React from "react"
import QRCode from "react-qr-code"
import { HandCoins, Copy, ExternalLink, Code2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// import your existing form (patched with onGrantCreated)
import { CreateGrantForm } from "./grant-form"

export type GrantItem = {
  interact: {
    redirect: string;
    finish: string;
  };
  continue: {
    access_token: { value: string };
    uri: string;
    wait: number;
  };
};

export function TipGrantsManager({ className }: { className?: string }) {
  const [openCreate, setOpenCreate] = React.useState(false)
  const [items, setItems] = React.useState<GrantItem[]>([])
  const [active, setActive] = React.useState<GrantItem | null>(null)

//   function handleCreated({ redirectUrl, payload }: { redirectUrl: string; payload: any }) {
//     const item: GrantItem = {
//     //   id: crypto.randomUUID(),
//       redirectUrl,
//       createdAt: new Date().toISOString(),
//       payload,
//     }
//     setItems((prev) => [item, ...prev])
//     setOpenCreate(false)
//     setActive(item)
//     toast.success("Grant guardado")
//   }

  return (
    <div className={cn("relative", className)}>
      {/* horizontal list of saved grants */}
      <Card className="p-3">
        <div className="mb-2 flex items-center gap-2">
          <HandCoins className="h-4 w-4" />
          <span className="text-sm font-medium">Tip grants</span>
        </div>

        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex items-stretch gap-3 pr-16">
            {items.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setActive(g)}
                className="group relative inline-flex min-w-56 max-w-72 flex-col items-start gap-2 rounded-xl border p-3 text-left transition hover:shadow"
                title={g.redirectUrl}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="text-sm font-medium">Grant</span>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(g.createdAt).toLocaleString()}
                  </span>
                </div>
                <Separator />
                <div className="line-clamp-2 w-full break-all text-xs text-muted-foreground">
                  {g.redirectUrl}
                </div>
              </button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </Card>

      {/* floating circular tip button to open the CreateGrantForm */}
      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogTrigger asChild>
          <Button
            size="icon"
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl"
            aria-label="Create tip grant"
          >
            <HandCoins className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-none">
          <DialogHeader>
            <DialogTitle>Crear Tip Grant</DialogTitle>
          </DialogHeader>
          <CreateGrantForm setItems={setItems}/>
        </DialogContent>
      </Dialog>

      {/* view/share/embed a saved grant */}
      <GrantViewerDialog item={active} onOpenChange={(v) => !v && setActive(null)} />
    </div>
  )
}

/* ---------- grant viewer (QR + copy + embed) ---------- */

function GrantViewerDialog({
  item,
  onOpenChange,
}: {
  item: GrantItem | null
  onOpenChange?: (open: boolean) => void
}) {
  const open = !!item
  const url = item?.redirectUrl ?? ""

  const htmlButton = `<a href="${url}" target="_blank" rel="noopener noreferrer" class="tip-btn">Tip me via Interledger</a>`
  const markdown = `[Tip me via Interledger](${url})`
  const iframe = `<iframe src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
    url
  )}" width="180" height="180" style="border:0;"></iframe>`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Share tip grant</DialogTitle>
        </DialogHeader>

        {item ? (
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-3">
              <div className="rounded-lg bg-white p-3">
                <QRCode value={url} size={164} />
              </div>
              <div className="break-all text-center text-xs text-muted-foreground">{url}</div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    navigator.clipboard.writeText(url)
                    toast("link copiado")
                  }}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copiar link
                </Button>
                <Button onClick={() => (window.location.href = url)}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Abrir
                </Button>
              </div>
            </div>

            <Separator />

            <Tabs defaultValue="html">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="html">HTML</TabsTrigger>
                <TabsTrigger value="md">Markdown</TabsTrigger>
                <TabsTrigger value="iframe">QR iframe</TabsTrigger>
              </TabsList>

              <TabsContent value="html" className="mt-2">
                <EmbedBlock code={htmlButton} label="HTML Button" />
              </TabsContent>
              <TabsContent value="md" className="mt-2">
                <EmbedBlock code={markdown} label="Markdown Link" />
              </TabsContent>
              <TabsContent value="iframe" className="mt-2">
                <EmbedBlock code={iframe} label="Iframe QR" />
              </TabsContent>
            </Tabs>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

/* ---------- small helper for copyable code blocks ---------- */

function EmbedBlock({ code, label }: { code: string; label: string }) {
  return (
    <div className="rounded-lg border">
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-2 text-sm">
          <Code2 className="h-4 w-4" />
          <span>{label}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            navigator.clipboard.writeText(code)
            toast("copiado")
          }}
        >
          <Copy className="mr-2 h-4 w-4" /> Copiar
        </Button>
      </div>
      <Separator />
      <pre className="max-h-60 overflow-auto p-3 text-xs text-wrap">
        <code>{code}</code>
      </pre>
    </div>
  )
}
