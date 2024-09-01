"use client";
import ReactMarkdown from "react-markdown";
import { useState, FormEvent } from "react";

export default function NewWorkout() {
  const [loading, setLoading] = useState<boolean>(false);

  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string>("");
  const [pdfBase64, setPdfBase64] = useState<string>("");

  const [workoutName, setWorkoutName] = useState<string>("");
  const [strengthSessions, setStrengthSessions] = useState<number>(0);
  const [runningSessions, setRunningSessions] = useState<number>(0);
  const [otherSpecifications, setOtherSpecifications] = useState<string>("");

  const [openAIResponse, setOpenAIResponse] = useState<string>("");

  const [error, setError] = useState<string>("");

  const [count, setCount] = useState<number>(0);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!workoutName || !strengthSessions || !runningSessions) {
      setError("Please fill out all fields. We need more information!");
      return;
    }

    if (strengthSessions < 0 || runningSessions < 0) {
      setError("Number of sessions cannot be negative. You have to train!");
      return;
    }

    if (strengthSessions === 0 && runningSessions === 0) {
      setError(
        "You must have at least one strength or running session. You need to train!",
      );
      return;
    }

    if (strengthSessions > 7 || runningSessions > 7) {
      setError("Number of sessions cannot exceed 7. You need to rest!");
      return;
    }

    setLoading(true);
    console.log("Creating workout plan...");

    // Get res from openai
    try {
      const res = await fetch("/api/getOpenAIRes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workoutName,
          strengthSessions,
          runningSessions,
          otherSpecifications,
        }),
      });

      if (res.ok) {
        const { text } = await res.json();
        console.log("OpenAI response:", text);
        setOpenAIResponse(text);

        // Send openai response to generatePDF api
        console.log("Generating PDF...");
        console.log("workoutName:", workoutName);
        console.log("strengthSessions:", strengthSessions);
        console.log("runningSessions:", runningSessions);
        console.log("otherSpecifications:", otherSpecifications);
        console.log("text:", text);
        try {
          const res = await fetch("/api/generatePDF", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              workoutName,
              strengthSessions,
              runningSessions,
              otherSpecifications,
              text,
            }),
          });

          if (res.ok) {
            const { pdfBase64 } = await res.json();
            const pdfBlob = new Blob(
              [new Uint8Array(Buffer.from(pdfBase64, "base64"))],
              { type: "application/pdf" },
            );
            const pdfUrl = URL.createObjectURL(pdfBlob);

            // Set the PDF preview URL
            setPdfPreviewUrl(pdfUrl);
            setPdfBase64(pdfBase64); // Save base64 for download      }
          }
        } catch (error) {
          console.error("Error generating pdf:", error);
        }
      } else {
        console.error("Error generating workout plan:", res.statusText);
      }
    } catch (error) {
      console.error("Error generating openai answer:", error);
    }

    setCount((prevCount) => prevCount + 1);
    setLoading(false);
    setError("");
  };

  const handleDownloadPDF = () => {
    if (!pdfBase64) return;
    const pdfBlob = new Blob(
      [new Uint8Array(Buffer.from(pdfBase64, "base64"))],
      { type: "application/pdf" },
    );
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "workout-plan.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col items-center min-h-full pt-[10vh]">
      <div className="max-w-[90%] w-full p-8">
        <h1 className="text-6xl font-bold text-gray-100 font-bebas">
          <span className="text-lime-300">New</span> Workout
        </h1>
        <h2 className="text-xl font-semibold text-gray-100 mb-4">
          Create your personalized workout plan
          <span className="text-lime-300"> here</span>
        </h2>

        <div className="flex gap-8 flex-col md:flex-row">
          <form
            className="flex flex-col gap-4 items-center w-full flex-1"
            onSubmit={handleSubmit}
          >
            <div className="w-full">
              <label className="font-semibold text-lg">Workout Name</label>
              <input
                type="text"
                placeholder="4 Day Split"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                className="p-2 text-white text-base bg-gray-800 rounded w-full"
              />
            </div>

            <div className="w-full">
              <label className="font-semibold text-lg">
                Number of strength sessions
              </label>
              <input
                type="number"
                placeholder="5"
                value={strengthSessions}
                onChange={(e) => setStrengthSessions(Number(e.target.value))}
                className="p-2 text-white text-base bg-gray-800 rounded w-full"
              />
            </div>

            <div className="w-full">
              <label className="font-semibold text-lg">
                Number of running sessions
              </label>
              <input
                type="number"
                placeholder="4"
                value={runningSessions}
                onChange={(e) => setRunningSessions(Number(e.target.value))}
                className="p-2 text-white text-base bg-gray-800 rounded w-full"
              />
            </div>

            <div className="w-full">
              <label className="font-semibold text-lg">
                Other specifications
              </label>
              <input
                type="text"
                value={otherSpecifications}
                onChange={(e) => setOtherSpecifications(e.target.value)}
                placeholder="E.g. I don't want to run on Mondays, and I want to do a 5k on Fridays"
                className="p-2 text-white text-base bg-gray-800 rounded w-full"
              />
            </div>

            {error && (
              <div className="text-red-500 font-semibold text-lg">{error}</div>
            )}

            <button
              className={`px-4 py-4 text-gray-100 bg-gray-700 rounded-lg`}
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <div className="flex gap-2">
                  Creating workout...
                  <div className="loading loading-spinner loading-md"></div>
                </div>
              ) : (
                <div>Create workout</div>
              )}
            </button>
          </form>

          {/* Preview of pdf */}
          {pdfPreviewUrl && (
            <div className="flex-1">
              <h2 className="text-lg text-gray-500 mb-2">PDF Preview</h2>
              <iframe
                src={pdfPreviewUrl}
                className="w-full h-72 sm:h-80 lg:h-96 border-0"
                title="PDF Preview"
              />
              <button
                className="px-4 py-4 text-gray-100 bg-gray-700 rounded-lg mt-4"
                onClick={handleDownloadPDF}
              >
                Download PDF
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
