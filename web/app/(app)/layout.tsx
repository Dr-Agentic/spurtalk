import { AppLayout } from "@/components/layout";
import { Toaster } from "@/components/ui/sonner";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppLayout>{children}</AppLayout>
      <Toaster position="bottom-center" duration={4000} />
    </>
  );
}
