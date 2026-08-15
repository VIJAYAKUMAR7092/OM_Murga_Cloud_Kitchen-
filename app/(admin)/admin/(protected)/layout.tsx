import { getRestaurantSettings } from "@/server/queries/settings";
import AdminProtectedLayoutClient from "./client-layout";

export default async function AdminProtectedLayoutServer({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getRestaurantSettings();

  return (
    <AdminProtectedLayoutClient logo={settings.logo} restaurantName={settings.restaurantName}>
      {children}
    </AdminProtectedLayoutClient>
  );
}
