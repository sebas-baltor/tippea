import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import useStorage from "@/config/storage/storage.global";
import axios from "axios";

// import useStorage from "@/config/storage/global.storage";

// esquema de validación
const ConfigSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "mínimo 3 caracteres")
    .max(50, "máximo 50 caracteres"),
  wallet: z
    .string()
    .trim()
    .min(1, "requerido")
    .transform((v) => v.replace(/^\$/, "")) // quita $ inicial si viene con formato $ilp…
    .transform((v) => {
      // si viene solo el handle tipo ilp.interledger-test.dev/jhon-address, antepone http://
      if (/^https?:\/\//i.test(v)) return v;
      return `http://${v}`;
    })
    .refine(
      (v) =>
        /^http:\/\/[a-zA-Z0-9.-]+\/[^\s]+$/.test(v) ||
        /^https:\/\/[a-zA-Z0-9.-]+\/[^\s]+$/.test(v),
      "formato esperado http://ilp.interledger-test.dev/jhon-address"
    ),
});

type ConfigValues = z.infer<typeof ConfigSchema>;

type Props = React.ComponentProps<"div"> & {
  redirectTo?: string;
};

export default function DefaultConfigForm({ className, redirectTo = "/wallet", ...props }: Props) {
  const navigate = useNavigate();
  const setUser = useStorage((s) => s.setUser);

  const [loading, setLoading] = useState(false);
  const [errorMssg, setErrorMssg] = useState<string | null>(null);

  const form = useForm<ConfigValues>({
    resolver: zodResolver(ConfigSchema),
    defaultValues: {
      username:
        // @ts-ignore
        import.meta.env.VITE_ENVIRONMENT === "dev"
          ? // @ts-ignore
            import.meta.env.VITE_DEFAULT_USERNAME ?? ""
          : "",
      wallet:
        // @ts-ignore
        import.meta.env.VITE_ENVIRONMENT === "dev"
          ? // @ts-ignore
            (import.meta.env.VITE_DEFAULT_WALLET ?? "http://ilp.interledger-test.dev/jhon-address")
          : "",
    },
    mode: "onChange",
  });

  const normalizedPreview = useMemo(() => {
    const raw = form.watch("wallet") || "";
    const withoutDollar = raw.replace(/^\$/, "");
    const withProto = /^https?:\/\//i.test(withoutDollar)
      ? withoutDollar
      : withoutDollar
      ? `http://${withoutDollar}`
      : "";
    return withProto;
  }, [form.watch("wallet")]);

  const onSubmit = async (values: ConfigValues) => {
    try {
      setLoading(true);
      setErrorMssg(null);
      console.log("walletId ",values.wallet)
      
      const { data } = await axios.get(values.wallet)
      console.log(data)

      setUser({
        username: values.username,
        wallet: data,
      });

      setLoading(false);
      navigate(redirectTo);
    } catch (err: any) {
      setLoading(false);
      setErrorMssg("no se pudo guardar la configuración");
      console.error(err);
    }
  };

  return (
    <main className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-pretty text-center">
            Configuración de la wallet
          </CardTitle>
          {errorMssg ? (
            <div className="text-red-400 text-center text-sm mt-4">{errorMssg}</div>
          ) : null}
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="username">Usuario</Label>
                    <FormControl>
                      <Input
                        id="username"
                        placeholder="tu usuario"
                        className="text-white"
                        {...field}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\s/g, "");
                          field.onChange(v);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === " ") e.preventDefault();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="wallet"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="wallet">Wallet</Label>
                    <FormControl>
                      <Input
                        id="wallet"
                        placeholder="http://ilp.interledger-test.dev/jhon-address"
                        className="text-white"
                        {...field}
                        onChange={(e) => {
                          // quita espacios y normaliza $ si el usuario lo pega con $
                          const raw = e.target.value.replace(/\s/g, "");
                          field.onChange(raw);
                        }}
                      />
                    </FormControl>
                    <div className="text-xs text-muted-foreground mt-1">
                      formato esperado http://ilp.interledger-test.dev/jhon-address sin el signo $
                    </div>
                    {normalizedPreview && (
                      <div className="text-xs mt-1">
                        vista previa <span className="font-mono">{normalizedPreview}</span>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-2">
                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                  {loading ? <Spinner /> : "Guardar configuración"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
    </div>
    </main>
  );
}
