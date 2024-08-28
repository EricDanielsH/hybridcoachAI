"use client";
import { useState } from "react";

export default function Dashboard() {
  const [search, setSearch] = useState("");

  const examples = [
    {
      name: "4 day workout split",
      url: "https://nextjs.org",
    },
    {
      name: "5 day workout split",
      url: "https://nextjs.org",
    },
    {
      name: "6 day workout split",
      url: "https://nextjs.org",
    },
  ];

  return (
    <div className="flex flex-col items-center min-h-full pt-[10vh]">
      <div className="max-w-2xl w-full p-8">
        <h1 className="text-6xl font-bold text-gray-100 font-bebas">
          <span className="text-lime-300">Dash</span>board
        </h1>
        <h2 className="text-xl font-semibold text-gray-100 mb-4">
          Find your personalized workout plans{" "}
          <span className="text-lime-300">here</span>
        </h2>

        <div className="flex gap-2 items-center">
          <div className="text-lg">Eric Workouts Plans</div>

          <div className="flex items-center gap-4 p-4 my-4 bg-gray-800 rounded-lg">
            <a
              className="px-4 py-2 text-black font-extrabold text-2xl bg-lime-300 rounded-lg cursor-pointer"
              title="New workout"
              href="/newWorkout"
            >
              +
            </a>
          </div>
        </div>

        <section>
          {examples.map((example, index) => (
            <div
              key={index}
              className="flex items-center flex-col md:flex-row gap-4 justify-between p-4 my-4 bg-gray-800 rounded-lg"
            >
              <a
                href={example.url}
                className="text-lg font-semibold text-gray-100"
              >
                {example.name}
              </a>
              <div className="flex gap-4">
                <button
                  className="px-4 py-4 text-gray-100 bg-gray-700 rounded-lg"
                  title="View PDF"
                >
                  <svg
                    fill="#ffffff"
                    width="20px"
                    height="20px"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M21.92,11.6C19.9,6.91,16.1,4,12,4S4.1,6.91,2.08,11.6a1,1,0,0,0,0,.8C4.1,17.09,7.9,20,12,20s7.9-2.91,9.92-7.6A1,1,0,0,0,21.92,11.6ZM12,18c-3.17,0-6.17-2.29-7.9-6C5.83,8.29,8.83,6,12,6s6.17,2.29,7.9,6C18.17,15.71,15.17,18,12,18ZM12,8a4,4,0,1,0,4,4A4,4,0,0,0,12,8Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,12,14Z" />
                  </svg>
                </button>
                {/* TODO: EDIT can only be done with pro membership */}
                <button
                  className="px-4 py-4 text-gray-100 bg-gray-700 rounded-lg text-3xl"
                  title="Edit"
                >
                  <svg
                    fill="#ffffff"
                    width="20px"
                    height="20px"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M22,7.24a1,1,0,0,0-.29-.71L17.47,2.29A1,1,0,0,0,16.76,2a1,1,0,0,0-.71.29L13.22,5.12h0L2.29,16.05a1,1,0,0,0-.29.71V21a1,1,0,0,0,1,1H7.24A1,1,0,0,0,8,21.71L18.87,10.78h0L21.71,8a1.19,1.19,0,0,0,.22-.33,1,1,0,0,0,0-.24.7.7,0,0,0,0-.14ZM6.83,20H4V17.17l9.93-9.93,2.83,2.83ZM18.17,8.66,15.34,5.83l1.42-1.41,2.82,2.82Z" />
                  </svg>
                </button>
                <button
                  className="px-4 py-4 text-gray-100 bg-gray-700 rounded-lg"
                  title="Delete"
                >
                  <svg
                    fill="#ffffff"
                    width="20px"
                    height="20px"
                    viewBox="-3 -2 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="xMinYMin"
                    className="jam jam-trash"
                  >
                    <path d="M6 2V1a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1h4a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-.133l-.68 10.2a3 3 0 0 1-2.993 2.8H5.826a3 3 0 0 1-2.993-2.796L2.137 7H2a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h4zm10 2H2v1h14V4zM4.141 7l.687 10.068a1 1 0 0 0 .998.932h6.368a1 1 0 0 0 .998-.934L13.862 7h-9.72zM7 8a1 1 0 0 1 1 1v7a1 1 0 0 1-2 0V9a1 1 0 0 1 1-1zm4 0a1 1 0 0 1 1 1v7a1 1 0 0 1-2 0V9a1 1 0 0 1 1-1z" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
