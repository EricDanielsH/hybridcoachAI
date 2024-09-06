"use client";
import { Pricing } from "@/components/Pricing";
import { useState, useEffect } from "react";

export default function Page() {
  return (
    <section className={`flex items-center justify-center flex-col p-4 `}>
      {/* Warning Message */}
      <div role="alert" className={`w-fit alert alert-warning `}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 shrink-0 stroke-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Warning! You need to pay before accessing the product!</span>
      </div>
      <div role="alert" className={`w-fit alert alert-success mt-10  `}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 shrink-0 stroke-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>If you already paid, please log out and log in to use the app.</span>
      </div>
      <Pricing />;
    </section>
  );
}
