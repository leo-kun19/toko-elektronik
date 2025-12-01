import { readFileSync, existsSync } from "fs";
import { join } from "path";

export async function GET(request, { params }) {
  try {
    // Get the image path from params
    const imagePath = params.path.join("/");
    
    // Construct full path to image
    const fullPath = join(process.cwd(), "Gambar", imagePath);
    
    // Check if file exists
    if (!existsSync(fullPath)) {
      return new Response("Image not found", { 
        status: 404,
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:5173",
          "Access-Control-Allow-Credentials": "true",
        }
      });
    }
    
    // Read file
    const imageBuffer = readFileSync(fullPath);
    
    // Determine content type based on extension
    const ext = imagePath.split(".").pop().toLowerCase();
    const contentTypes = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      webp: "image/webp",
      svg: "image/svg+xml",
    };
    
    const contentType = contentTypes[ext] || "image/jpeg";
    
    // Return image with proper headers
    return new Response(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Access-Control-Allow-Origin": "http://localhost:5173",
        "Access-Control-Allow-Credentials": "true",
      },
    });
  } catch (error) {
    console.error("Error serving image:", error);
    return new Response("Error loading image", { 
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:5173",
        "Access-Control-Allow-Credentials": "true",
      }
    });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "http://localhost:5173",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Credentials": "true",
    },
  });
}
