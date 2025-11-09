import * as React from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { axiosInstance } from "@/config/axios/axios.config";
import { toast } from "sonner";

// shadcn ui
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Copy, Ghost, Loader2 } from "lucide-react";
import useStorage from "@/config/storage/storage.global";
import { ScrollArea } from "@radix-ui/react-scroll-area";

// -------- Types & helpers --------
const IncomingSchema = z.object({
  walletId: z.string().trim().min(1, "walletId requerido"),
  amount: z
    .coerce.number()
    .int()
    .positive("debe ser > 0")
    .transform((n) => String(n)), // backend expects string per your example
});

type IncomingValues = z.infer<typeof IncomingSchema>;

type IncomingPaymentResponse = {
  id: string;
  walletAddress: string;
  incomingAmount: { value: string; assetCode: string; assetScale: number };
  receivedAmount: { value: string; assetCode: string; assetScale: number };
  completed: boolean;
  createdAt: string;
  expiresAt: string;
  methods: Array<{
    type: "ilp";
    ilpAddress: string;
    sharedSecret: string;
  }>;
};

function extractIncomingPaymentId(idUrl: string | undefined) {
  if (!idUrl) return "";
  try {
    const parts = idUrl.split("/");
    return parts[parts.length - 1] || "";
  } catch {
    return "";
  }
}

function CopyBtn({ value, label }: { value: string; label: string }) {
  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      onClick={() => {
        navigator.clipboard.writeText(value);
        toast(`${label} copiado`);
      }}
      className="h-8"
    >
      <Copy className="mr-2 h-4 w-4" />
      Copiar {label}
    </Button>
  );
}

// -------- Component --------
type Props = {
  defaultAmount?: number;
  onCreated?: (resp: IncomingPaymentResponse, incomingPaymentId: string) => void;
};

export function IncomingPaymentModal({
  defaultAmount = 100,
  onCreated,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [resp, setResp] = React.useState<IncomingPaymentResponse | null>(null);
  const walletId = useStorage((s)=>s.wallet.id);

  const form = useForm<IncomingValues>({
    resolver: zodResolver(IncomingSchema),
    defaultValues: {
      walletId: walletId,
      amount: defaultAmount as unknown as any, // coerce.number handles it
    },
    mode: "onChange",
  });

  const incomingPaymentId = React.useMemo(
    () => extractIncomingPaymentId(resp?.id),
    [resp?.id]
  );

  async function onSubmit(values: IncomingValues) {
    try {
      setLoading(true);
      setResp(null);

      const payload = {
        walletId: values.walletId,
        amount: values.amount, // already string from transform
      };

      const { data } = await axiosInstance.post<IncomingPaymentResponse>(
        "/payment/incoming-payment",
        payload
      );

      setResp(data);
      const idOnly = extractIncomingPaymentId(data?.id);
      toast.success("Incoming payment creado");

      onCreated?.(data, idOnly);
    } catch (e: any) {
      toast.error("No se pudo crear el incoming-payment", {
        description: e?.response?.data?.message ?? "Revisa la consola",
      });
      // console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full size-16" variant={"outline"}>
          <IncomingPaymentModal/>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Create incoming payment</DialogTitle>
        </DialogHeader>
        <ScrollArea>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="walletId"
              render={({ field }) => (
                <FormItem>
                  <Label>Wallet ID</Label>
                  <FormControl>
                    <Input
                      placeholder="http://ilp.interledger-test.dev/interledger-hack"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <Label>Amount</Label>
                  <FormControl>
                    <Input type="number" min={1} step={1} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Create
              </Button>
              {resp?.id ? (
                <CopyBtn value={incomingPaymentId} label="incomingPaymentId" />
              ) : null}
            </div>
          </form>
        </Form>

        {resp ? (
          <>
            <Separator className="my-4" />
            <div className="space-y-3">
              <div className="text-sm font-medium">Result</div>

              <div className="rounded-md border p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <div className="text-xs text-muted-foreground">id</div>
                  <CopyBtn value={resp.id} label="id" />
                </div>
                <div className="break-all text-sm">{resp.id}</div>
              </div>

              <div className="rounded-md border p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <div className="text-xs text-muted-foreground">
                    incomingPaymentId
                  </div>
                  <CopyBtn
                    value={incomingPaymentId}
                    label="incomingPaymentId"
                  />
                </div>
                <div className="break-all text-sm">{incomingPaymentId}</div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-md border p-3">
                  <div className="mb-2 text-xs text-muted-foreground">
                    walletAddress
                  </div>
                  <div className="break-all text-sm">{resp.walletAddress}</div>
                </div>

                <div className="rounded-md border p-3">
                  <div className="mb-2 text-xs text-muted-foreground">
                    incomingAmount
                  </div>
                  <div className="text-sm">
                    {resp.incomingAmount.value} {resp.incomingAmount.assetCode}{" "}
                    / scale {resp.incomingAmount.assetScale}
                  </div>
                </div>
              </div>

              {resp.methods?.[0]?.type === "ilp" ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-md border p-3">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <div className="text-xs text-muted-foreground">
                        ilpAddress
                      </div>
                      <CopyBtn
                        value={resp.methods[0].ilpAddress}
                        label="ilpAddress"
                      />
                    </div>
                    <div className="break-all text-sm">
                      {resp.methods[0].ilpAddress}
                    </div>
                  </div>

                  <div className="rounded-md border p-3">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <div className="text-xs text-muted-foreground">
                        sharedSecret
                      </div>
                      <CopyBtn
                        value={resp.methods[0].sharedSecret}
                        label="sharedSecret"
                      />
                    </div>
                    <div className="break-all text-sm">
                      {resp.methods[0].sharedSecret}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </>
        ) : null}
        </ScrollArea>

      </DialogContent>
    </Dialog>
  );
}
