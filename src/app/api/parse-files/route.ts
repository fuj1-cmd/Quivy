import { NextRequest, NextResponse } from "next/server";
import { extractTextFromFile } from "@/lib/fileParser";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No files provided",
        },
        { status: 400 }
      );
    }

    // Process each file and extract text
    const textPromises = files.map(async (file) => {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const text = await extractTextFromFile(buffer, file.name);
        return {
          filename: file.name,
          text,
          success: true,
        };
      } catch (error) {
        return {
          filename: file.name,
          error: error instanceof Error ? error.message : "Unknown error",
          success: false,
        };
      }
    });

    const results = await Promise.all(textPromises);

    // Check if any files failed
    const failures = results.filter((r) => !r.success);
    const successes = results.filter((r) => r.success);

    // If all files failed, return error
    if (successes.length === 0) {
      const errorMessages = failures.map(f => `${f.filename}: ${f.error}`).join("; ");
      return NextResponse.json(
        {
          success: false,
          error: `Failed to process all files. ${errorMessages}`,
          details: failures,
        },
        { status: 400 }
      );
    }

    // Combine all successful text
    const combinedText = successes
      .map((r) => r.text)
      .join("\n\n");

    if (!combinedText || combinedText.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No text could be extracted from the uploaded files",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        text: combinedText,
        filesProcessed: successes.length,
        failedFiles: failures.length > 0 ? failures.map(f => f.filename) : undefined,
        warnings: failures.length > 0 ? `${failures.length} file(s) could not be processed` : undefined,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error parsing files:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
