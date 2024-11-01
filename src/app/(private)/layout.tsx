import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userId = cookies().get("userId");

  if (!userId) {
    redirect("/");
  }

  return children;
}
