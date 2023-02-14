"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Context, SupabaseContext } from "./supa-provider";
import { useContext } from "react";

export default function SupabaseListener({
  serverAccessToken,
}: {
  serverAccessToken?: string;
}) {
  const { supabase } = useContext(Context) as SupabaseContext;
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.access_token !== serverAccessToken) {
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [serverAccessToken, router, supabase]);

  return null;
}
