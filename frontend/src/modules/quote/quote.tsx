import * as React from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { axiosInstance } from "@/config/axios/axios.config";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Copy, Loader2, StickyNote } from "lucide-react";

const QuoteSchema = z.object({
  walletId: z.string().trim().min(1, "walletId requerido"),
  incomingPaymentId: z.string().trim().url("debe ser una URL válida"),
});

type QuoteValues = z.infer<typeof QuoteSchema>;

type QuoteResponse = {
  id: string;
  walletAddress: string;
  receiveAmount: { value: string; assetCode: string; assetScale: number };
  debitAmount: { value: string; assetCode: string; assetScale: number };
  receiver: string;
  expiresAt: string;
  createdAt: string;
  method: string;
};

type Props = {
  triggerLabel?: string;
  defaultWalletId?: string;
  defaultIncomingPaymentId?: string;
  endpoint?: string; // default: "/payment/quote"
  onQuoted?: (debitAmount: QuoteResponse["debitAmount"]) => void;
};

export function QuoteModal({
  triggerLabel = "Generate quote",
  defaultWalletId = "",
  defaultIncomingPaymentId = "",
  endpoint = "/payment/quote",
  onQuoted,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [debit, setDebit] = React.useState<QuoteResponse["debitAmount"] | null>(null);

  const form = useForm<QuoteValues>({
    resolver: zodResolver(QuoteSchema),
    defaultValues: {
      walletId: defaultWalletId,
      incomingPaymentId: defaultIncomingPaymentId,
    },
    mode: "onChange",
  });

  async function onSubmit(values: QuoteValues) {
    try {
      setLoading(true);
      setDebit(null);

      const { data } = await axiosInstance.post<QuoteResponse>(endpoint, {
        walletId: values.walletId,
        incomingPaymentId: values.incomingPaymentId,
      });

      setDebit(data.debitAmount);
      onQuoted?.(data.debitAmount);
      toast.success("Quote creado");
    } catch (e: any) {
      toast.error("No se pudo crear el quote", {
        description: e?.response?.data?.message ?? "Revisa la consola",
      });
    } finally {
      setLoading(false);
    }
  }

  function copyDebit() {
    if (!debit) return;
    // copy the exact object you’ll need next:
    const payload = JSON.stringify(
      {
        assetCode: debit.assetCode,
        assetScale: debit.assetScale,
        value: debit.value,
      },
      null,
      0
    );
    navigator.clipboard.writeText(payload);
    toast("debitAmount copiado");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"} className="size-16 rounded-full"><StickyNote/></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Create quote</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="walletId"
              render={({ field }) => (
                <FormItem>
                  <Label>Wallet ID</Label>
                  <FormControl>
                    <Input placeholder="http://ilp.interledger-test.dev/jhon-address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="incomingPaymentId"
              render={({ field }) => (
                <FormItem>
                  <Label>Incoming Payment ID (URL)</Label>
                  <FormControl>
                    <Input
                      placeholder="https://ilp.interledger-test.dev/.../incoming-payments/xxxxx"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Create
              </Button>

              {debit ? (
                <Button type="button" variant="secondary" onClick={copyDebit}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy debitAmount
                </Button>
              ) : null}
            </div>
          </form>
        </Form>

        {/* Only show debitAmount */}
        {debit ? (
          <div className="mt-4 rounded-md border p-3 text-sm">
            <div className="mb-1 font-medium">debitAmount</div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <div className="text-xs text-muted-foreground">value</div>
                <div>{debit.value}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">assetCode</div>
                <div>{debit.assetCode}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">assetScale</div>
                <div>{debit.assetScale}</div>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
