// import React, {
//   createContext,
//   useContext,
//   useState,
// } from "react";

// import type { ReactNode } from "react";

// export type GrantResponse = {
//   interact: {
//     redirect: string;
//     finish: string;
//   };
//   continue: {
//     access_token: { value: string };
//     uri: string;
//     wait: number;
//   };
// };

// interface GrantContextInterface {
//   items: GrantResponse[];
//   setItems: React.Dispatch<React.SetStateAction<GrantResponse[]>>;
// //   addItem: (g: GrantResponse) => void;
// //   clear: () => void;
// };

// export const GrantContext = createContext<GrantContextInterface>(null!);

// export const useGrantContext = () => {
//   const context = useContext(GrantContext);
//   if (context === undefined) {
//     throw new Error("useGrantContext must be used within a GrantProvider");
//   }
//   return context;
// };

// export function GrantProvider({ children }: { children: ReactNode }) {
//   const [items, setItems] = useState<GrantResponse[]>([]);

//   const value = {
//     items,
//     setItems,
//   };

//   return <GrantContext.Provider value={value}>{children}</GrantContext.Provider>;
// }
