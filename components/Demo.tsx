import React from "react";

export default function Demo() {
  return (
    <section
      className="flex flex-col gap-4 items-center max-w-2xl p-4 justify-center pt-[10vh]"
      id="demo"
    >
      <div>
        <h2 className="inline-block px-3 py-px mb-4 text-sm font-semibold tracking-wider text-lime-300 uppercase rounded-full bg-teal-accent-400">
          Demo
        </h2>
      </div>
      <h3 className="mb-2 font-sans text-3xl text-center font-bold leading-none tracking-tight text-gray-100 sm:text-4xl md:mx-auto">
        Check how it works!
      </h3>

      <div className="relative overflow-hidden rounded-xl bg-gray-800 w-[300px] h-[170px] sm:w-[450px] sm:h-[253px] md:w-[600px] md:h-[338px] lg:w-[800px] lg:h-[450px] xl:w-[1000px] xl:h-[563px] flex items-center justify-center">
        <p className="text-gray-200 text-xl font-semibold text-center">
          Demo coming out soon...
        </p>
      </div>
    </section>
  );
}
