/**
 * File parsing utilities for extracting text from various file formats
 * Note: This file is for server-side use only (API routes)
 */

import mammoth from "mammoth";
import { createWorker } from "tesseract.js";

// Use require for pdf-parse and officeparser as they are CommonJS modules
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdf = require("pdf-parse");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const officeParser = require("officeparser");

/**
 * Extract text from a PDF file
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const data = await pdf(buffer);
    if (!data.text || data.text.trim().length === 0) {
      throw new Error("PDF appears to be empty or contains no readable text");
    }
    return data.text;
  } catch (error) {
    throw new Error(`Failed to parse PDF: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Extract text from a DOCX file
 */
export async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    if (!result.value || result.value.trim().length === 0) {
      throw new Error("DOCX appears to be empty or contains no readable text");
    }
    return result.value;
  } catch (error) {
    throw new Error(`Failed to parse DOCX: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Extract text from a TXT file
 */
export async function extractTextFromTXT(buffer: Buffer): Promise<string> {
  const text = buffer.toString("utf-8");
  if (!text || text.trim().length === 0) {
    throw new Error("TXT file appears to be empty");
  }
  return text;
}

/**
 * Extract text from an image file using OCR
 */
export async function extractTextFromImage(buffer: Buffer): Promise<string> {
  try {
    const worker = await createWorker("eng");
    const { data } = await worker.recognize(buffer);
    await worker.terminate();

    if (!data.text || data.text.trim().length === 0) {
      throw new Error("No text could be extracted from the image. Make sure the image contains readable text.");
    }

    return data.text;
  } catch (error) {
    throw new Error(`Failed to extract text from image: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Extract text from a PPTX/PPT file
 */
export async function extractTextFromPPTX(buffer: Buffer): Promise<string> {
  try {
    const text = await new Promise<string>((resolve, reject) => {
      officeParser.parseOfficeAsync(buffer, (data: string, err: Error) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });

    if (!text || text.trim().length === 0) {
      throw new Error("PowerPoint file appears to be empty or contains no readable text");
    }

    return text;
  } catch (error) {
    throw new Error(`Failed to parse PowerPoint file: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

/**
 * Main function to extract text from any supported file type
 */
export async function extractTextFromFile(
  buffer: Buffer,
  filename: string
): Promise<string> {
  const extension = filename.toLowerCase().split(".").pop();

  switch (extension) {
    case "pdf":
      return extractTextFromPDF(buffer);
    case "docx":
      return extractTextFromDOCX(buffer);
    case "txt":
      return extractTextFromTXT(buffer);
    case "jpg":
    case "jpeg":
    case "png":
      return extractTextFromImage(buffer);
    case "ppt":
    case "pptx":
      return extractTextFromPPTX(buffer);
    default:
      throw new Error(`Unsupported file type: ${extension}. Supported types: PDF, DOCX, TXT`);
  }
}
