import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Define the POST handler
export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 405 },
    );
  }

  try {
    // Parse the request body as JSON
    const body = await req.json();
    console.log(body);

    const {
      workoutName,
      strengthSessions,
      runningSessions,
      otherSpecifications,
    } = body;

    // Validate required fields
    if (
      !workoutName ||
      strengthSessions === undefined ||
      runningSessions === undefined
    ) {
      return NextResponse.json(
        {
          message:
            "Workout name, strength sessions, and running sessions are required",
        },
        { status: 400 },
      );
    }

    // Create the prompt for OpenAI
    const prompt = `Create a workout plan with the following specifications:
Workout Name: ${workoutName}
Number of strength sessions: ${strengthSessions}
Number of running sessions: ${runningSessions}
Other specifications: ${otherSpecifications}`;

    console.log("Creating workout plan...");
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a professional workout coach specializing in hybrid training. Your approach combines strength training, cardiovascular exercises, and flexibility workouts to provide a balanced fitness plan. You are creating tailored workout plans for clients to help them achieve their specific fitness goals. Your response should be informative and within the context of a workout plan and the realm of fitness and well-being. Do not answer in a conversational tone. MOST IMPORTANTLY, be sure to include any other specifications made, as this is important to make a personalized program for the client. MAKE SURE TO MATCH THE NUMBER OF STRENGTH SESSIONS, RUNNING SESSIONS, AND OTHER SPECIFICATIONS TO THE CLIENT'S REQUEST.",
        },
        { role: "user", content: prompt },
      ],
      model: "gpt-4o-mini",
    });

    const responseText = completion.choices[0].message?.content;
    if (!responseText) {
      console.error("Error generating workout plan");
      return NextResponse.json(
        { message: "Error generating workout plan" },
        { status: 500 },
      );
    }

    console.log("Finished creating workout plan");
    return NextResponse.json({ text: responseText }, { status: 200 });
  } catch (error) {
    console.error("Error generating an OpenAI answer: ", error);
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 },
    );
  }
}
