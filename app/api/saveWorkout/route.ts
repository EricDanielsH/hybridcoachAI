import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Workout from "@/lib/models/workout";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }

  try {
    const body = await req.json();
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

    // Get current session (assuming this gives you the user object)
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Check if the workout already exists
    const existingWorkout = await Workout.findOne({
      workoutName,
      userId,
    });

    if (existingWorkout) {
      return NextResponse.json(
        { message: "Workout already exists" },
        { status: 409 },
      );
    }

    // Creating a new workout object in DB
    const newWorkout = await Workout.create({
      workoutName,
      userId,
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
    console.error("Error saving workout:", error);
    return NextResponse.json(
      { message: "Error saving workout" },
      { status: 500 },
    );
  }
}
