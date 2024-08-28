export default function Hero() {
  return (
    <section
      className="flex flex-col items-center max-w-2xl p-4 justify-center min-h-[60vh]"
      id="home"
    >
      <h1 className="text-6xl md:text-[96px] mb-4 md:-mb-1 font-bold text-lime-300 font-bebas tracking-tight">
        Hybrid<span className="text-white">Coach</span>
      </h1>

      <h2 className="text-xl md:text-2xl font-bold w-full text-center text-gray-100">
        Create <span className="text-lime-300">hybrid workouts</span>
        <br />
        that fit seamlessly into your lifestyle with{" "}
        <span className="text-lime-300">AI</span>
      </h2>
    </section>
  );
}
