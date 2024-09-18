"use client";
import { useState, useEffect } from "react";

// Define TypeScript interface for workout
interface Workout {
  _id: string;
  workoutName: string;
  pdfBase64: string;
}

interface PDFViewerProps {
  base64String: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ base64String }) => {
  // Convert the Base64 string to a data URL
  const pdfDataUrl = `data:application/pdf;base64,${base64String}`;

  return (
    <div className="pdf-viewer">
      <embed
        src={pdfDataUrl}
        type="application/pdf"
        width="100%"
        height="600px"
        title="PDF Document"
      />
    </div>
  );
};

export default function Dashboard() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    async function fetchWorkouts() {
      try {
        const res = await fetch("/api/getWorkouts");
        if (res.ok) {
          const data: Workout[] = await res.json();
          setWorkouts(data);
        } else {
          const error = await res.json();
          setErrorMessage(error.message || "Failed to fetch workouts.");
        }
      } catch (error) {
        setErrorMessage("An unexpected error occurred.");
      }
    }

    fetchWorkouts();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/deleteWorkout/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Remove deleted workout from the state
        setWorkouts(workouts.filter((workout) => workout._id !== id));
      } else {
        const error = await res.json();
        setErrorMessage(error.message || "Failed to delete workout.");
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred.");
    }
  };

  const closeModal = (id: string) => {
    const modal = document.getElementById(id) as HTMLDialogElement;
    if (modal) {
      modal.close();
    }
  };

  return (
    <div className="flex flex-col items-center min-h-full pt-[10vh]">
      <div className="max-w-2xl w-full p-8">
        <div className="flex gap-4 justify-between">
          <div>
            <h1 className="text-6xl font-bold text-gray-100 font-bebas">
              <span className="text-lime-300">Dash</span>board
            </h1>
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              Find your personalized workout plans{" "}
              <span className="text-lime-300">here</span>
            </h2>
          </div>
          <div className="flex items-center p-4 my-4 rounded-lg">
            <a
              className="px-2 py-2 text-black font-bold  text-2xl bg-lime-300 rounded-lg cursor-pointer"
              title="New workout"
              href="/newWorkout"
            >
              <svg
                fill="#000000"
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="jam jam-plus font-semibold"
              >
                <path
                  d="M12 2v20m-10-10h20"
                  stroke="currentColor"
                  strokeWidth="3" // Increased thickness here
                />
              </svg>
            </a>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 text-red-500">{errorMessage}</div>
        )}

        <div className="flex gap-2 items-center">
          <div className="text-lg">My Workout Plans</div>
        </div>

        <section>
          {workouts.length > 0 ? (
            workouts.map((workout) => (
              <div
                key={workout._id}
                className="flex items-center flex-col md:flex-row gap-4 justify-between p-4 my-4 bg-gray-800 rounded-lg"
              >
                <a
                  href="#"
                  className="text-lg font-semibold text-gray-100"
                  onClick={() => {
                    const modal = document.getElementById(
                      "my_modal_1",
                    ) as HTMLDialogElement;
                    if (modal) {
                      modal.showModal();
                    }
                  }}
                >
                  {workout.workoutName}
                </a>
                <div className="flex gap-4">
                  {/* Open pdf */}
                  <button
                    className=" p-2 text-gray-100 bg-gray-700 rounded-lg"
                    onClick={() => {
                      const modal = document.getElementById(
                        "my_modal_1",
                      ) as HTMLDialogElement;
                      if (modal) {
                        modal.showModal();
                      }
                    }}
                  >
                    <svg
                      fill="#ffffff"
                      width="24px"
                      height="24px"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M21.92,11.6C19.9,6.91,16.1,4,12,4S4.1,6.91,2.08,11.6a1,1,0,0,0,0,.8C4.1,17.09,7.9,20,12,20s7.9-2.91,9.92-7.6A1,1,0,0,0,21.92,11.6ZM12,18c-3.17,0-6.17-2.29-7.9-6C5.83,8.29,8.83,6,12,6s6.17,2.29,7.9,6C18.17,15.71,15.17,18,12,18ZM12,8a4,4,0,1,0,4,4A4,4,0,0,0,12,8Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,12,14Z" />
                    </svg>
                  </button>
                  {/* Modal for pdf viewer */}
                  <dialog id="my_modal_1" className="modal">
                    <div className="modal-box">
                      <h3 className="font-bold text-lg">
                        {workout.workoutName}
                      </h3>
                      <PDFViewer base64String={workout.pdfBase64} />
                      <div className="modal-action flex justify-center">
                        <button
                          className="btn hover:bg-lime-300 hover:text-black transition-colors duration-300 ease-in-out"
                          onClick={() => closeModal("my_modal_1")}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </dialog>

                  {/* Delete button */}
                  <button
                    className="p-2 text-gray-100 bg-gray-700 rounded-lg"
                    title="Delete"
                    onClick={() => {
                      const modal = document.getElementById(
                        "my_modal_2",
                      ) as HTMLDialogElement;
                      if (modal) {
                        modal.showModal();
                      }
                    }}
                  >
                    <svg
                      fill="#ffffff"
                      width="24px"
                      height="24px"
                      viewBox="-3 -2 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      preserveAspectRatio="xMinYMin"
                      className="jam jam-trash"
                    >
                      <path d="M6 2V1a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1h4a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-.133l-.68 10.2a3 3 0 0 1-2.993 2.8H5.826a3 3 0 0 1-2.993-2.796L2.137 7H2a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h4zm10 2H2v1h14V4zM4.141 7l.687 10.068a1 1 0 0 0 .998.932h6.368a1 1 0 0 0 .998-.934L13.862 7h-9.72zM7 8a1 1 0 0 1 1 1v7a1 1 0 0 1-2 0V9a1 1 0 0 1 1-1zm4 0a1 1 0 0 1 1 1v7a1 1 0 0 1-2 0V9a1 1 0 0 1 1-1z" />
                    </svg>
                  </button>
                  <dialog id="my_modal_2" className="modal">
                    <div className="modal-box">
                      <h3 className="font-bold text-lg">Confirm Delete</h3>
                      <p className="py-4">
                        Are you sure you want to delete this workout?
                      </p>
                      <div className="modal-action">
                        <button
                          className="btn bg-red-500 text-white"
                          title="Delete"
                          onClick={() => {
                            handleDelete(workout._id);
                            closeModal("my_modal_2");
                          }}
                        >
                          Delete
                        </button>

                        <button
                          className="btn hover:bg-lime-300 hover:text-black transition-colors duration-300 ease-in-out"
                          onClick={() => closeModal("my_modal_2")}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </dialog>

                  {/* Download button */}
                  <a
                    href={`data:application/pdf;base64,${workout.pdfBase64}`}
                    download={`${workout.workoutName}.pdf`}
                    className="p-2 text-gray-100 bg-gray-700 rounded-lg"
                    title="Download"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-download"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500">No workouts available.</div>
          )}
        </section>
      </div>
    </div>
  );
}
