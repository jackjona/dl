import Header from "@/components/Header";
import "./globals.css";

export const metadata = {
  title: "Origin Proxy",
  description: "Download files from a specified origin.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
