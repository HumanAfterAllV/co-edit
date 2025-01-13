import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { ClerkProvider } from "@clerk/nextjs";
import Provider from "./Provider";

const generalSansFont = localFont({
  src: [
    {
      path: "./fonts/GeneralSans/GeneralSans-Light.otf",
      weight: "300",
    },
    {
      path: "./fonts/GeneralSans/GeneralSans-Regular.otf",
      weight: "400",
    },
    {
      path: "./fonts/GeneralSans/GeneralSans-Medium.otf",
      weight: "500",
    },
    {
      path:"./fonts/GeneralSans/GeneralSans-Semibold.otf",
      weight: "600",
    },
    {
      path: "./fonts/GeneralSans/GeneralSans-Bold.otf",
      weight: "700",
    }
  ],
  variable: "--font-general-sans",
});


export const metadata: Metadata = {
  title: "CoEdit",
  description: "Your go-to collaborative platform for type design",
  icons: {
    icon: "/assets/icons/logo-co_edit.svg",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider 
    appearance={{
      variables:{
        fontSize: "16px",
      } 
      }}>
      <html lang="en">
        <body
          className={`min-h-screen ${generalSansFont.variable}  antialiased`}
          suppressHydrationWarning={true}
        >
          <Provider>
            {children}
          </Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}
