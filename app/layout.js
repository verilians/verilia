import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/Sidebar";
import { ChatProvider } from "../contexts/ChatContext";
import { UserProvider } from "../contexts/UserContext";
import { ChatHistoryProvider } from "../contexts/ChatHistoryContext";
import MobileSidebar from "../components/MobileSidebar";

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
          <ChatHistoryProvider>
            <ChatProvider>
              <div className="flex h-screen bg-gray-50">
                {/* Desktop Sidebar */}
                <div className="hidden md:block">
                  <Sidebar />
                </div>
                
                {/* Mobile Sidebar */}
                <div className="md:hidden">
                  <MobileSidebar />
                </div>
                
                <main className="flex-1 flex flex-col">
                  {children}
                </main>
              </div>
            </ChatProvider>
          </ChatHistoryProvider>
        </UserProvider>
      </body>
    </html>
  );
}
