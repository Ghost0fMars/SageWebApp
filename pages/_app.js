import Head from 'next/head';
import { SessionProvider } from "next-auth/react";
import '../styles/globals.css';

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
