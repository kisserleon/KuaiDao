import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { error: "Unauthorized", status: 401 } as const;
  }
  const role = (session.user as { role?: string }).role;
  if (role !== "admin") {
    return { error: "Forbidden", status: 403 } as const;
  }
  return { user: session.user } as const;
}
