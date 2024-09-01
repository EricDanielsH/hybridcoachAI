import { NextApiRequest, NextApiResponse } from "next";
import { connectMongoDB } from "@/lib/mongodb";
import Workout from "@/lib/models/workout";
import { NextResponse } from "next/server";

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  try {
    // Convert the ReadableStream to JSON
    const buffers: Buffer[] = [];
    for await (const chunk of req.body) {
      buffers.push(chunk);
    }
    const body = JSON.parse(Buffer.concat(buffers).toString());

    const {
      workoutName,
      strengthSessions,
      runningSessions,
      otherSpecifications,
      pdfBase64,
    } = body;

    if (!workoutName || !strengthSessions || !runningSessions || !pdfBase64) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    // First, create a new object in DB with the prompt information
    await connectMongoDB();

    // Creating a new workout object in DB
    const newWorkout = await Workout.create({
      workoutName,
      strengthSessions,
      runningSessions,
      otherSpecifications,
      pdfBase64,
    });

    await newWorkout.save();

    console.log("Create new workout successfully:", newWorkout);

    return NextResponse.json(
      { message: "Workout created successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { message: "Error generating PDF" },
      { status: 500 },
    );
  }
}
