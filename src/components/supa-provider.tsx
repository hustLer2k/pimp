"use client";

import { createContext, useContext, useState } from "react";
import { createClient } from "../utils/supa-browser";

import type { SupabaseClient } from "@supabase/auth-helpers-nextjs";

export type SupabaseContext = {
  supabase: SupabaseClient;
};

export const Context = createContext<SupabaseContext | undefined>(undefined);

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [supabase] = useState(() => createClient());

  return (
    <Context.Provider value={{ supabase }}>
      <>{children}</>
    </Context.Provider>
  );
}
