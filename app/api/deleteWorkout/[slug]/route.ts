import { connectMongoDB } from "@/lib/mongodb";
import Workout from "@/lib/models/workout";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    // Connect to MongoDB
    await connectMongoDB();

    // Get the workout ID from the URL
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json(
        { message: "Invalid workout ID" },
        { status: 400 },
      );
    }

    // Find the workout by ID and delete it
    const deleted = await Workout.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { message: "Workout not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Workout deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An error occurred while deleting the workout" },
      { status: 500 },
    );
  }
}
