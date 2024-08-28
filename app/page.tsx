import "./globals.css";
import { Pricing } from "@/components/Pricing";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Demo from "@/components/Demo";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex flex-col items-center w-full h-full min-h-screen">
      <div
        className="w-full"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(17, 24, 39, 0.7), rgba(17, 24, 39, 1)), url('/assets/hero.jpg')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className=" backdrop-blur-sm w-full flex justify-center items-center">
          <Hero />
        </div>
      </div>
      <About />
      <Demo />
      <Pricing />
    </div>
  );
}
