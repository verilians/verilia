import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/Sidebar";
import { ChatProvider } from "../contexts/ChatContext";
import { UserProvider } from "../contexts/UserContext";
import { ChatHistoryProvider } from "../contexts/ChatHistoryContext";
import { ChatSessionProvider } from "../contexts/ChatSessionContext";
import SignInModal from "../components/SignInModal";

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
            <ChatSessionProvider>
              <ChatProvider>
                <div className="flex h-screen bg-gray-50">
                  {/* Responsive Sidebar */}
                  <Sidebar />
                  
                  <main className="flex-1 flex flex-col">
                    {children}
                  </main>
                </div>
                <SignInModal />
              </ChatProvider>
            </ChatSessionProvider>
          </ChatHistoryProvider>
        </UserProvider>
      </body>
    </html>
  );
}
