// api/getOpenAIRes
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const {
      workoutName,
      strengthSessions,
      runningSessions,
      otherSpecifications,
    } = req.body;

    const prompt = `Create a workout plan with the following specifications:
Workout Name: ${workoutName}
Number of strength sessions: ${strengthSessions}
Number of running sessions: ${runningSessions}
Other specifications: ${otherSpecifications}`;

    // Creating a chat completion with OpenAI
    console.log("Creating workout plan...");
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a professional workout coach specializing in hybrid training. Your approach combines strength training, cardiovascular exercises, and flexibility workouts to provide a balanced fitness plan. You are creating tailored workout plans for clients to help them achieve their specific fitness goals. Your response should be informative and within the context of a workout plan and the realm of fitness and well-being. Do not answer in a conversational tone.",
        },
        { role: "user", content: prompt },
      ],
      model: "gpt-4o-mini",
    });

    if (!completion.choices[0].message?.content) {
      console.error("Error generating workout plan");
      return NextResponse.json(
        { message: "Error generating workout plan" },
        { status: 500 },
      );
    }

    console.log("Finished creating workout plan");
    const text = completion.choices[0].message?.content;

    return NextResponse.json({ text }, { status: 200 });
  } catch (error) {
    console.error("Error generating an OpenAI answer: ", error);
    return NextResponse.json(
      { message: "Error catched generating answer from OpenAI" },
      { status: 500 },
    );
  }
}
