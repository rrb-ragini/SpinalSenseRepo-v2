import "./globals.css";
import NavBar from "./components/NavBar";

export const metadata = {
  title: "SpinalSense",
  description: "AI Powered Spine Analysis"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <NavBar />
        {children}
      </body>
    </html>
  );
}
