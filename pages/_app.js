import "@/styles/globals.css";
import { SidebarProvider } from "@/lib/SidebarContext";
import { SessionProvider } from "next-auth/react"; // ✅ importe le provider NextAuth

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <SidebarProvider>
        <Component {...pageProps} />
      </SidebarProvider>
    </SessionProvider>
  );
}
