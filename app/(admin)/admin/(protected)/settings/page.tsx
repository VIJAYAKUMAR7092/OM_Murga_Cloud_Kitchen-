import { getRestaurantSettings } from "@/server/queries/settings";
import { SettingsForm } from "@/components/admin/settings/SettingsForm";

export const metadata = {
  title: "Settings | Admin | OM MURGA CLOUD KITCHEN",
};

export default async function SettingsPage() {
  const settings = await getRestaurantSettings();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
          Restaurant Settings
        </h1>
        <p className="text-gray-400">
          Manage your global restaurant details, branding, and contact information.
        </p>
      </div>

      <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <SettingsForm initialData={settings} />
      </div>
    </div>
  );
}
