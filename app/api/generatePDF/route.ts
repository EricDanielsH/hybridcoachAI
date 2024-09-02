import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import MarkdownIt from "markdown-it";
import puppeteer, { PDFOptions } from "puppeteer";

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
      text,
    } = body;

    if (!workoutName || !strengthSessions || !runningSessions || !text) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    // Markdown conversion to plain text (or HTML if you prefer)
    const md = new MarkdownIt();
    const parsedText = md.render(text); // Convert markdown to HTML

    const workoutPlan = `
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; }
          h2 { color: #444; margin-top: 20px; }
          h3 { color: #555; margin-top: 15px; }
          p { line-height: 1.6; }
          ul { margin: 10px 0; }
          li { margin: 5px 0; }
          .section { margin-bottom: 20px; }
          .note { font-style: italic; color: #666; }
        </style>
      </head>
      <body>
        <h1>${workoutName}</h1>
        <p><strong>Number of strength sessions:</strong> ${strengthSessions}</p>
        <p><strong>Number of running sessions:</strong> ${runningSessions}</p>
        <p><strong>Other specifications:</strong> ${otherSpecifications}</p>
        <hr>
        <div>${parsedText}</div>
      </body>
      </html>
    `;

    // Generate PDF with puppeteer
    console.log("Generating PDF...");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(workoutPlan, { waitUntil: "networkidle0" });

    // Define PDF options with proper type
    const pdfOptions: PDFOptions = {
      format: "A4", // or use { width: '210mm', height: '297mm' } for custom dimensions
      printBackground: true,
      displayHeaderFooter: true, // Enable header and footer
      headerTemplate: `
  <div style="font-size:10px; width:100%; text-align:center;">
    <span style="font-size:12px;">
      <span style="color:#a3e635;">Hybrid</span><span style="color:#e5e7eb;">Coach</span>
    </span>
  </div>
`,
      footerTemplate: `
  <div style="font-size:10px; width:100%; text-align:center;">
    <span style="font-size:12px;">
      Made with <span style="color:#a3e635;">Hybrid</span><span style="color:#e5e7eb;">Coach</span> AI
    </span>
    <span style="float:right; margin-right:10px;">
      Page <span class="pageNumber"></span> of <span class="totalPages"></span>
    </span>
  </div>
`,
      margin: {
        top: "50px", // Increase top margin to accommodate header
        bottom: "50px", // Increase bottom margin to accommodate footer
      },
    };

    const pdfBuffer = await page.pdf(pdfOptions);
    await browser.close();

    // Convert PDF bytes to base64 string
    const pdfBase64 = Buffer.from(pdfBuffer).toString("base64");

    return NextResponse.json({ pdfBase64 }, { status: 200 });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { message: "Error generating PDF" },
      { status: 500 },
    );
  }
}
