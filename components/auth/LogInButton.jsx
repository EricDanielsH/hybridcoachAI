"use client"; // This ensures the component is treated as a client-side component

import { useRouter } from 'next/navigation';

export default function LogInButton() {
  const router = useRouter();

  const handleLogIn = () => {
    router.push("/login");
  };

  return (
    <button className="px-4 py-2 rounded font-extrabold bg-lime-300 text-black text-lg" onClick={handleLogIn}>Log In</button>
  );
}
