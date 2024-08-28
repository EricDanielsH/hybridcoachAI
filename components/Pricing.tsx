import React from "react";
import PricingCard from "@/components/PricingCard";

export const Pricing = () => {
  const plans = [
    {
      title: "Starter",
      popular: false,
      oldprice: 25,
      price: 19,
      features: [
        "Create personalised workouts",
        "Workouts stored up to 10 days",
      ],
      nofeatures: ["Download workouts in PDFs", "Edit previous workouts"],
      cta: "Buy Starter",
      link: "https://www.google.com",
    },
    {
      title: "Pro",
      popular: true,
      oldprice: 39,
      price: 29,
      features: [
        "Create personalised workouts",
        "Workouts stored forever",
        "Download workouts in PDFs",
        "Edit previous workouts",
      ],
      cta: "Buy Pro",
      link: "https://www.google.com",
    },
  ];

  return (
    <section
      className="flex flex-col gap-4 max-w-2xl p-4 items-center justify-center pt-[10vh]"
      id="pricing"
    >
      <div>
        <h2 className="inline-block px-3 py-px mb-4 text-sm font-semibold tracking-wider text-lime-300 uppercase rounded-full bg-teal-accent-400">
          Our Pricing
        </h2>
      </div>
      <h3 className="mb-2 font-sans text-3xl text-center font-bold leading-none tracking-tight text-gray-100 sm:text-4xl md:mx-auto">
        Save time with <span className="text-lime-300">personalized</span>{" "}
        hybrid workouts to reach your peak health & performance
      </h3>
      <p className="text-gray-200 mb-6">
        Special Launch Discount:{" "}
        <span className="text-lime-300 font-bold">Save 35% Today!</span>
      </p>
      <div className="flex flex-col md:flex-row gap-8">
        {plans.map((plan) => (
          <PricingCard key={plan.title} {...plan} />
        ))}
      </div>
    </section>
  );
};
