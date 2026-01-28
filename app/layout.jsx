import { Geist, Geist_Mono } from "next/font/google";
import styles from './styles/layouts.module.css';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Christina Mae Gerzon | Portfolio",
  description: "Web Developer, Automation Specialist, & Product Manager Portfolio",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className={styles.section}>
          <div className={styles.container}>
            {children}
            </div>
          </div>
      </body>
    </html>
  );
}
