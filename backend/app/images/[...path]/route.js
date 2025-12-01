import { readFile } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const imagePath = params.path.join("/");
    const filePath = join(process.cwd(), "..", "image", imagePath);
    
    const imageBuffer = await readFile(filePath);
    
    // Detect content type
    let contentType = "image/jpeg";
    if (imagePath.endsWith(".png")) contentType = "image/png";
    if (imagePath.endsWith(".gif")) contentType = "image/gif";
    if (imagePath.endsWith(".webp")) contentType = "image/webp";
    
    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Access-Control-Allow-Origin": "http://localhost:5173",
      },
    });
  } catch (error) {
    console.error("Error serving image:", error);
    return new NextResponse("Image not found", { status: 404 });
  }
}
