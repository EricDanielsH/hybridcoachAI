import { NextRequest, NextResponse } from "next/server";
import MarkdownIt from "markdown-it";
import puppeteer, { PDFOptions } from "puppeteer";

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
      text,
    } = body;

    if (!workoutName || !strengthSessions || !runningSessions || !text) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    // Markdown conversion to HTML
    const md = new MarkdownIt();
    const parsedText = md.render(text);

    const workoutPlan = `
      <html>
      <head>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
          
          body { font-family: Arial, sans-serif; margin: 0; }
          h1 { color: #333; }
          h2 { color: #444; margin-top: 20px; }
          h3 { color: #555; margin-top: 15px; }
          p { line-height: 1.6; }
          ul { margin: 10px 0; }
          li { margin: 5px 0; }
          .section { margin-bottom: 20px; }
          .note { font-style: italic; color: #666; }
          .bebas { font-family: 'Bebas Neue', sans-serif; }
          .content { margin: 60px 20px; } /* Ensure content has margin for header/footer */
        </style>
      </head>
      <body>
        <div class="content">
          <h1>${workoutName}</h1>
          <p><strong>Number of strength sessions:</strong> ${strengthSessions}</p>
          <p><strong>Number of running sessions:</strong> ${runningSessions}</p>
          <p><strong>Other specifications:</strong> ${otherSpecifications}</p>
          <hr>
          <div>${parsedText}</div>
        </div>
      </body>
      </html>
    `;

    // Generate PDF with Puppeteer
    console.log("Generating PDF...");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(workoutPlan, { waitUntil: "networkidle0" });

    // Define PDF options
    const pdfOptions: PDFOptions = {
      format: "A4",
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: `
  <div style="
    font-size: 10px; 
    width: 100%; 
    text-align: center; 
    padding: 10px; 
    margin-bottom: 20px;
    box-sizing: border-box;
    font-family: 'Bebas Neue', sans-serif;
  ">
    <a 
      href="${process.env.PUBLIC_URL}" 
      style="
        font-family: 'Bebas Neue', sans-serif;
        font-size: 24px; 
        font-weight: 800; 
        color: #000;
        text-decoration: none;
        display: inline-block; 
        padding: 5px;
      "
      target="_blank"
      rel="noopener noreferrer"
    >
      <span style="color: #a3e635;">Hybrid</span><span style="color: #e5e7eb;">Coach AI</span>
    </a>
  </div>
`,
      footerTemplate: `
  <div style="
    font-size: 10px; 
    width: 100%; 
    text-align: center; 
    padding: 10px; 
    margin-top: 20px;
    box-sizing: border-box;
    font-family: 'Bebas Neue', sans-serif;
  ">
    <a 
      href="${process.env.PUBLIC_URL}" 
      style="
        font-family: 'Bebas Neue', sans-serif; 
        font-size: 24px; 
        font-weight: 800; 
        color: #000;
        text-decoration: none;
        display: inline-block; 
        padding: 5px;
      "
      target="_blank"
      rel="noopener noreferrer"
    >
      Made with <span style="color: #a3e635;">Hybrid</span><span style="color: #e5e7eb;">Coach AI</span> 
    </a>
    <span style="
      float: right; 
      margin-right: 10px;
      font-size: 10px;
    ">
      Page <span class="pageNumber"></span> of <span class="totalPages"></span>
    </span>
  </div>
`,
      margin: {
        top: "60px", // Increased margin for header
        bottom: "60px", // Increased margin for footer
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
