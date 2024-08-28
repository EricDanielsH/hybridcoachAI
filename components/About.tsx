import React from "react";

export default function About() {
  return (
    <section
      className="flex flex-col gap-4 items-center max-w-2xl p-4 justify-center pt-[10vh]"
      id="about"
    >
      <div>
        <h2 className="inline-block px-3 py-px mb-4 text-sm font-semibold tracking-wider text-lime-300 uppercase rounded-full bg-teal-accent-400">
          About
        </h2>
      </div>
      <h3 className="mb-2 font-sans text-3xl text-center font-bold leading-none tracking-tight text-gray-100 sm:text-4xl md:mx-auto">
        Creating personalized workouts is <span className="text-lime-300 font-extrabold">HARD</span>
      </h3>

      <p className="text-gray-200 mb-6 text-center">
        We are here to help you create personalized workouts that fit seamlessly into your lifestyle with <span className="text-lime-300">AI</span>
      </p>

      <p className="text-gray-200 mb-6 text-center">
        Hybrid training is the future of fitness. Become overall stronger, faster, and more healthier with your own personalized workouts. 
      </p>

    </section>
  );
}

