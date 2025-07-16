import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/Sidebar";
import { ChatProvider } from "../contexts/ChatContext";
import { UserProvider } from "../contexts/UserContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Verilia",
  description: "AI-powered Bible counselling and guidance",
  icons: {
    icon: '/verilia-logo.jpeg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserProvider>
          <ChatProvider>
            <div className="flex h-screen bg-gray-50">
              <Sidebar />
              <main className="flex-1 flex flex-col">
                {children}
              </main>
            </div>
          </ChatProvider>
        </UserProvider>
      </body>
    </html>
  );
}
