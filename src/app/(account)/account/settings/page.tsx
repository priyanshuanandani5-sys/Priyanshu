import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "@/components/account/settings-form";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone")
    .eq("id", user!.id)
    .single();

  return (
    <div>
      <h1 className="font-display text-3xl text-cocoa-900">Settings</h1>
      <SettingsForm
        fullName={profile?.full_name ?? null}
        phone={profile?.phone ?? null}
        email={user!.email!}
      />
    </div>
  );
}
