import React from "react";
import PricingCard from "@/components/PricingCard";

export const plans = [
  {
    title: "Basic",
    popular: false,
    oldprice: 25,
    price: 19,
    priceId:
      process.env.NODE_ENV === "development"
        ? "price_1PvGXPCr3YzcSMS9pX6fHCuX"
        : "price_1PjNDFCr3YzcSMS90Pcs1DDM",
    features: ["Create personalised workouts", "Download workouts in PDFs"],
    nofeatures: ["Store workouts"],
    cta: "Buy Basic",
    link:
      process.env.NODE_ENV === "development"
        ? "https://buy.stripe.com/test_5kAbJFeMV4Te4c8bII"
        : "https://buy.stripe.com/bIYbK4ehz8U27O8288",
  },
  {
    title: "Pro",
    popular: true,
    oldprice: 39,
    price: 29,
    priceId:
      process.env.NODE_ENV === "development"
        ? "price_1PvGcRCr3YzcSMS9SGqqebHK"
        : "price_1PjNEZCr3YzcSMS9XdywSuhj",
    features: [
      "Create personalised workouts",
      "Download workouts in PDFs",
      "Workouts stored forever",
    ],
    cta: "Buy Pro",
    link:
      process.env.NODE_ENV === "development"
        ? "https://buy.stripe.com/test_aEU9Bx7ktady9ws3cd"
        : "https://buy.stripe.com/fZe01m7Tb7PY2tO001",
  },
];

export const Pricing = () => {
  // Stripe plans

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
      <p className="text-gray-200 mb-6 text-center">
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
