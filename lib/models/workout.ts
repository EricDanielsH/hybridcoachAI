import mongoose, { Schema } from "mongoose";

const workoutSchema = new Schema(
  {
    workoutName: { type: String, required: true },
    strengthSessions: { type: Number, required: true },
    runningSessions: { type: Number, required: true },
    otherSpecifications: { type: String, required: false },
    message: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { timestamps: true },
);

const Workout =
  mongoose.models.Workout || mongoose.model("Workout", workoutSchema);

export default Workout;
