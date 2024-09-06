import React from "react";
import { auth } from "@/auth";

interface PricingCardProps {
  title: string;
  popular?: boolean; // Make popular optional
  oldprice: number;
  price: number;
  features: string[];
  nofeatures?: string[];
  cta: string;
  link: string; // New property
}

export default async function PricingCard({
  title,
  popular = false, // Default to false if not provided
  oldprice,
  price,
  features,
  nofeatures,
  cta,
  link,
}: PricingCardProps) {
  const session = await auth();

  return (
    <article
      className={`relative flex flex-col justify-center items-center p-8 transition-shadow duration-300 border rounded-xl shadow-sm sm:items-center hover:shadow ${
        popular ? "border-lime-300 border-[3px]" : ""
      }`}
    >
      {popular && (
        <div className="absolute inset-x-0  top-0 flex justify-center items-center -mt-3">
          <div className="inline-block px-3 py-1 text-xs font-medium tracking-wider text-black uppercase rounded-full  bg-lime-300 ">
            Most Popular
          </div>
        </div>
      )}
      <div className="text-center">
        <div className="text-lg font-semibold text-gray-50">{title}</div>
        <div className="flex items-center justify-center mt-2 gap-2">
          <p className="relative opacity-80 text-gray-50">
            <span className="absolute h-[1.5px] inset-x-0 top-[48%] bg-gray-400"></span>
            <span className=" text-2xl text-gray-400">${oldprice}</span>
          </p>
          <div className="mr-1 text-5xl font-bold text-gray-50">${price}</div>
        </div>
        <div className="mt-8 flex flex-col gap-2">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-gray-200 text-left flex gap-2 items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-[18px] h-[18px] opacity-80 shrink-0"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                ></path>
              </svg>
              {feature}
            </div>
          ))}
          {nofeatures &&
            nofeatures.map((feature, index) => (
              <div
                key={index}
                className="text-gray-500 text-left flex gap-2 items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5 text-base-content/30 shrink-0 text-gray-500"
                >
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"></path>
                </svg>
                {feature}
              </div>
            ))}
        </div>
      </div>
      <div>
        <a
          href={
            session
              ? link + `?prefilled_email=` + session?.user?.email
              : `${process.env.PUBLIC_URL}/register?warning=payfirst`
          }
          className="inline-flex items-center justify-center w-full h-12 px-6 mt-6 font-medium tracking-wide text-black transition duration-200 rounded shadow-md bg-lime-300 hover:bg-deep-purple-accent-700 focus:shadow-outline focus:outline-none"
        >
          {cta}
        </a>
        <p className="max-w-xs mt-6 text-xs text-gray-300 sm:text-sm sm:text-center sm:max-w-sm sm:mx-auto">
          Pay <span className="font-bold">once</span>, plan{" "}
          <span className="text-lime-300 font-bold">unlimited</span> times!
        </p>
      </div>
    </article>
  );
}
