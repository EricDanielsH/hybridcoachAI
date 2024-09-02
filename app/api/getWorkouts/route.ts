import { NextApiRequest, NextApiResponse } from "next";
import { connectMongoDB } from "@/lib/mongodb";
import Workout from "@/lib/models/workout";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Connect to MongoDB
    await connectMongoDB();

    // Get current session (assuming this gives you the user object)
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = session.user.id;

    // Fetch workouts from the database for the authenticated user
    const workouts = await Workout.find({ userId }).sort({ createdAt: -1 });

    if (!workouts.length) {
      return NextResponse.json(
        { message: "No workouts found" },
        { status: 404 },
      );
    }
    // Respond with the workouts
    return NextResponse.json(workouts, { status: 200 });
  } catch (error) {
    console.error("Error fetching workouts:", error);
    return NextResponse.json(
      { message: "Failed to fetch workouts" },
      { status: 500 },
    );
  }
}
