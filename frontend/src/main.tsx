import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import "@/index.css";
import Layout from "@/components/layout/layout";

const router = createBrowserRouter([
  {
    path: "/",
    lazy: () =>
      import("@/pages/auth/login").then((module) => ({
        Component: module.default,
      })),
  },
  {
    Component:Layout,
    children:[
      {
        path: "/wallet",
        lazy: async () => {
          const [ component] = await Promise.all([
            import("@/pages/wallet/wallet"),
          ]);
          return {
            element: (
                <component.default />
            ),
          };
        },
      },
      {
        path: "/settings",
        lazy: async () => {
          const [ component] = await Promise.all([
            import("@/pages/setting/setting"),
          ]);
          return {
            element: (
                <component.default />
            ),
          };
        },
      },
    ]
    },
  
])

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);