import * as React from "react"
import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { axiosInstance } from "@/config/axios/axios.config"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Copy, ExternalLink, Loader2 } from "lucide-react"
import useStorage from "@/config/storage/storage.global"
import { toUtcIso } from "@/lib/dates"
import type { GrantItem } from "./tip-grant"

const GrantSchema = z.object({
  walletId: z.string().trim().min(1, "requerido"),
  assetCode: z.string().trim().min(1, "requerido"),
  assetScale: z.coerce.number().int().min(0),
  value: z.coerce.number().int().positive(),
  withInterval: z.boolean().default(false),
  repetitions: z.coerce.number().int().min(1).optional(),
  startDateLocal: z.string().optional(), // input datetime-local
  periodMonths: z.coerce.number().int().min(1).optional(),
})

type GrantValues = z.infer<typeof GrantSchema>

type Props = {
  setItems:React.Dispatch<GrantItem>
}

export function CreateGrantForm({
    setItems
}: Props) {
  const [loading, setLoading] = React.useState(false)
  const [redirectUrl, setRedirectUrl] = React.useState<string | null>(null)
  const walletId = useStorage((s)=>s.wallet.id);
  const form = useForm<GrantValues>({
    resolver: zodResolver(GrantSchema),
    defaultValues: {
      walletId: walletId,
      assetCode: "MXN",
      assetScale: 2,
      value: 100,
      withInterval: false,
    },
    mode: "onChange",
  })

  async function onSubmit(values: GrantValues) {
    try {
      setLoading(true)
      setRedirectUrl(null)

      const debitAmount = {
        assetCode: values.assetCode,
        assetScale: values.assetScale,
        value: String(values.value),
      }

      let intervals:
        | { repetitions: number; startDateUTC: string; period: string }
        | undefined

      if (values.withInterval) {
        const start = values.startDateLocal
          ? toUtcIso(values.startDateLocal)
          : new Date().toISOString()
        intervals = {
          repetitions: values.repetitions ?? 1,
          startDateUTC: start,
          period: String(values.periodMonths ?? 1), // el servicio agrega la M
        }
      }

      const payload = {
        walletId: values.walletId,
        debitAmount,
        ...(intervals ? { intervals } : {}),
      }

      const { data } = await axiosInstance.post("/payment/grant", payload)

      const url =
        data?.interact?.redirect ??
        data?.outgoingPaymentGrant?.interact?.redirect ??
        null
    
      setItems(prev => [data, ...prev]); 

      if (url) {
        setRedirectUrl(url)
        toast.success("grant creado, continúa con la interacción")
      } else {
        toast("respuesta recibida, revisa consola o payload")
        console.log("grant response", data)
      }
    } catch (e: any) {
      toast.error("no se pudo crear el grant", {
        description: e?.response?.data?.message ?? "intenta de nuevo",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl shadow-none border-none">
      <CardHeader>
        {/* <CardTitle className="text-center">Create grant</CardTitle> */}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* <FormField
              control={form.control}
              name="walletId"
              render={({ field }) => (
                <FormItem>
                  <Label>Wallet ID</Label>
                  <FormControl>
                    <Input placeholder="https://ilp.interledger-test.dev/mi-wallet" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* <FormField
                control={form.control}
                name="assetCode"
                render={({ field }) => (
                  <FormItem>
                    <Label>Asset code</Label>
                    <FormControl>
                      <Input placeholder="MXN" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="assetScale"
                render={({ field }) => (
                  <FormItem>
                    <Label>Asset scale</Label>
                    <FormControl>
                      <Input type="number" min={0} step={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <Label>Tip</Label>
                    <FormControl>
                      <Input type="number" min={1} step={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="rounded-lg border p-4 space-y-4">
              <div className="flex items-center justify-between">
                <Label className="font-medium">Configuration</Label>
                <FormField
                  control={form.control}
                  name="withInterval"
                  render={({ field }) => (
                    <FormItem className="m-0">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {form.watch("withInterval") && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="repetitions"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Repetitions</Label>
                        <FormControl>
                          <Input type="number" min={1} step={1} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="startDateLocal"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Start</Label>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="periodMonths"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Times per month</Label>
                        <FormControl>
                          <Input type="number" min={1} step={1} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                create
              </Button>

              {redirectUrl && (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      navigator.clipboard.writeText(redirectUrl)
                      toast("link copiado")
                    }}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    copiar redirect
                  </Button>
                  <Button type="button" onClick={() => (window.location.href = redirectUrl)}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    abrir redirect
                  </Button>
                </>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

/* helpers */


