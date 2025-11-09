import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type z from "zod";
import { AuthSchema } from "@/types/auth/auth.zod";
// import useStorage from "@/config/storage/global.storage";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { axiosInstance } from "@/config/axios/axios.config";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useNavigate } from "react-router";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
//   const setLogin = useStorage((s) => s.setLogin);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMssg, setErrorMssg] = useState<string | null>(null);
  const navigate = useNavigate();
//   const username = useStorage(s=>s.username);

  const form = useForm<z.infer<typeof AuthSchema>>({
    resolver: zodResolver(AuthSchema),
    defaultValues: {
      username:
        // @ts-ignore
        import.meta.env.VITE_ENVIRONMENT === "dev" ? import.meta.env.VITE_DEFAULT_USERNAME : "",
      password:
        // @ts-ignore
        import.meta.env.VITE_ENVIRONMENT === "dev" ? import.meta.env.VITE_DEFAULT_PASSWORD : "",
    },
  });

  const onSubmit = async (values: z.infer<typeof AuthSchema>) => {
    setLoading(true);
    axiosInstance
      .post(`/auth/login`, values)
      .then(async (res: any) => {
        const object = {
          ...res.data,
          ...{
            username:values.username
          },
          ...(res.data.permission?.content && {
            permissions: res.data.permission.content,
          }),
        };
        console.log(object);
        // setLogin(object);
        setLoading(false);
        setErrorMssg(null);
        navigate("/dashboard")
      })
      .catch((err: any) => {
        console.error(err);
        // const msg =
        //   err?.response?.data?.message || "Error desconocido al iniciar sesión";
        // setErrLogin(msg);
        setLoading(false);
        setErrorMssg("usuario o contraseña incorrectos");
      });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-pretty text-center">
            Inicia sesion en tu cuenta
          </CardTitle>
          {errorMssg ? (
            <div className="text-red-400 text-center text-sm mt-4">
              {errorMssg}
            </div>
          ) : null}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="username">Usuario</Label>

                    <FormControl>
                      <Input
                        id="username"
                        className="text-white"
                        placeholder="Nombre de usuario"
                        {...field}
                        onChange={(e) => {
                          const valueWithoutSpaces = e.target.value.replace(
                            /\s/g,
                            ""
                          );
                          field.onChange(valueWithoutSpaces);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === " ") {
                            e.preventDefault();
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center">
                      <Label htmlFor="password">Contraseña</Label>
                      <a
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Olvidaste tu contraseña?
                      </a>
                    </div>
                    <FormControl>
                      <Input
                        id="password"
                        placeholder="Contraseña"
                        className="text-white"
                        type="password"
                        autoComplete="off"
                        {...field}
                        onChange={(e) => {
                          const valueWithoutSpaces = e.target.value.replace(
                            /\s/g,
                            ""
                          );
                          field.onChange(valueWithoutSpaces);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === " ") {
                            e.preventDefault();
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-2">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full max-h-8 md:max-h-none"
                  disabled={loading}
                >
                  {loading ? <Spinner /> : "Iniciar Sesión"}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                No tienes cuenta?{" "}
                <a href="#" className="underline underline-offset-4">
                  Registrate
                </a>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
