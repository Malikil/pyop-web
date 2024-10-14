import { Inter } from "next/font/google";
import "bootstrap/dist/css/bootstrap.css";
import "./globals.css";
import BootstrapClient from "@/components/BootstrapClient";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
   title: "PYOP Tournament",
   description: "Pick Your Own Pool tournament website"
};

export default function RootLayout({ children }) {
   return (
      <html lang="en" data-bs-theme="dark">
         <body className={inter.className}>
            <Navbar />
            <div className="container">{children}</div>
            <BootstrapClient />
         </body>
      </html>
   );
}
