import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import { connectMongoDB } from "@/lib/mongodb";
import Workout from "@/lib/models";
//import OpenAI,{ Configuration, OpenAIApi } from "openai";
import { PDFDocument, rgb } from "pdf-lib";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { name, strengthSessions, runningSessions, otherSpecifications } =
      req.body;

    const prompt = `Create a workout plan with the following specifications:
Workout Name: ${name}
Number of strength sessions: ${strengthSessions}
Number of running sessions: ${runningSessions}
Other specifications: ${otherSpecifications}`;

    // First, create a new object in DB with the prompt information
    await connectMongoDB();

    const newWorkout = await Workout.new({
      name,
      strengthSessions,
      runningSessions,
      otherSpecifications,
      answer: prompt,
    });

    console.log("Create new workout successfully:", newWorkout);

    const assistant = await openai.beta.assistants.create({
      name: "HybridCoach AI",
      instructions:
        "You are a professional workout coach specializing in hybrid training. Your approach combines strength training, cardiovascular exercises, and flexibility workouts to provide a balanced fitness plan. You are creating tailored workout plans for clients to help them achieve their specific fitness goals. Your response should be informative and within the context of a workout plan and the realm of fitness and well-being",
      model: "gpt-4o-mini",
    });

    // Create a new thread and save it to db
    const thread = await openai.beta.threads.create();
    newWorkout.threadId = thread.id;

    const message = await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: prompt,
    });

    const text = completion.data.choices[0].message.content;

    // Add the response from OpenAI to the workout object
    newWorkout.content += `\n\n${text}`;

    // Create a PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    const { width, height } = page.getSize();
    const fontSize = 12;
    const textWidth = width - 100;

    page.drawText(text, {
      x: 50,
      y: height - 4 * fontSize,
      size: fontSize,
      color: rgb(0, 0, 0),
      maxWidth: textWidth,
      lineHeight: 16,
    });

    const pdfBytes = await pdfDoc.save();

    // Set response headers to download PDF
    res.setHeader("Content-Disposition", "attachment; filename=output.pdf");
    res.setHeader("Content-Type", "application/pdf");

    res.send(pdfBytes);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
