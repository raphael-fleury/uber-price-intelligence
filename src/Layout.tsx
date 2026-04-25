import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import Header from "./components/header";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-start pt-12 pb-16 px-4 sm:px-6">
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-10">
          <Outlet />
        </div>
      </main>
      <Toaster theme="light" position="bottom-center" />
    </div>
  );
}
