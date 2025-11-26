import "./globals.css";
import NavBar from "./components/NavBar";

export const metadata = {
  title: "SpinalSense",
  description: "AI Powered Cobb Angle Detection - Enterprise",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <main className="main-container">{children}</main>
      </body>
    </html>
  );
}
