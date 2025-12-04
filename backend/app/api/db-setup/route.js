import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");
    
    // Security check
    const validSecret = process.env.SEED_SECRET || "test123";
    if (secret !== validSecret) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("🔧 Starting database setup...");

    // Run prisma db push
    console.log("📊 Pushing Prisma schema to database...");
    const { stdout, stderr } = await execAsync("npx prisma db push --accept-data-loss");
    
    console.log("✅ Database schema pushed successfully!");
    console.log("STDOUT:", stdout);
    if (stderr) console.log("STDERR:", stderr);

    return NextResponse.json({
      success: true,
      message: "Database schema pushed successfully!",
      output: stdout
    });
  } catch (error) {
    console.error("❌ Error setting up database:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        stderr: error.stderr,
        stdout: error.stdout
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Use POST method with ?secret=test123 to setup database",
    endpoint: "/api/db-setup?secret=test123"
  });
}
