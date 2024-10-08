"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

import { useRouter, useSearchParams } from "next/navigation";

// TODO: CHANGE FLOW TO MAKE USER PAY AFTER REGISTERING
// Command to listen to Stripe events
// stripe listen --forward-to localhost:3000/api/webhook/stripe

export default function SignInEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("warning") === "payfirst") {
      setWarning("Before paying, you need to create an account!");
    }
  }, [searchParams, error]);

  function isValidEmail(email) {
    const emailRegex = new RegExp(
      "(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])",
    );
    return emailRegex.test(email);
  }

  const handleSubmit = async (e) => {
    console.log("submitting");
    e.preventDefault();
    setIsLoading(true);
    try {
      if (email === "" || password === "" || name === "") {
        setError("Complete all fields.");
        return;
      }

      if (!isValidEmail(email)) {
        setError("Invalid email.");
        return;
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }

      // Using fetch to send a POST request to the API
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        console.log("res", res);
        const { message } = await res.json();
        console.log("message", message);
        setError("An error occurred while creating the account: " + message);
        return;
      }

      console.log("Account created successfully");
      const data = await res.json();
      console.log("teh data", data);

      const userEmail = data.email;
      console.log("user", email);

      document.getElementById("form").reset();

      // After creating account, send user to payment page
      // Send with the email so we can prepopulate
      console.log("Redirecting to plans with email:", userEmail);
      router.push(`/plans?email=${userEmail}`);
    } catch (error) {
      console.error("Caught error:");
      console.error(error);
      setError("An error occurred while creating the account: " + error);
    } finally {
      setIsLoading(false);
    }
    setError("");
    setWarning("");
  };

  return (
    <div className="flex flex-col items-center  justify-center bg-red-800 rounded-xl">
      <form
        id="form"
        className="w-fit p-10 flex flex-col gap-2"
        onSubmit={handleSubmit}
      >
        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
          </svg>
          <input
            type="text"
            className="grow"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
            <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
          </svg>
          <input
            type="text"
            name="email"
            className="grow"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="grow"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {/* Error Message */}
        <div
          role="alert"
          className={`w-fit alert alert-error ${error === "" ? "hidden" : ""}`}
        >
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
          <span>Error! {error}</span>
        </div>

        {/* Warning Message */}
        <div
          role="alert"
          className={`w-fit alert alert-warning ${warning === "" ? "hidden" : ""}`}
        >
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
          <span>Warning! {warning}</span>
        </div>

        <button className="btn mt-8" type="submit" disabled={isLoading}>
          {isLoading ? (
            <span className="loading loading-spinner loading-md"></span>
          ) : (
            "Register"
          )}
        </button>
      </form>

      <Link href="/login" className="text-white underline mb-4">
        Have an account? Log In
      </Link>
    </div>
  );
}
