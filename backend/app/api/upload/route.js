import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

// POST - Upload gambar
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json(
        { success: false, error: "File tidak ditemukan" },
        {
          status: 400
        }
      );
    }

    // Validasi tipe file
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return Response.json(
        { success: false, error: "Tipe file tidak didukung. Gunakan JPG, PNG, GIF, atau WebP" },
        {
          status: 400
        }
      );
    }

    // Validasi ukuran file (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return Response.json(
        { success: false, error: "Ukuran file terlalu besar. Maksimal 5MB" },
        {
          status: 400
        }
      );
    }

    // Buat folder Gambar jika belum ada
    const uploadDir = path.join(process.cwd(), "Gambar");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate nama file unik
    const timestamp = Date.now();
    const originalName = file.name.replace(/\s+/g, "-");
    const fileName = `${timestamp}-${originalName}`;
    const filePath = path.join(uploadDir, fileName);

    // Convert file to buffer dan simpan
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Return URL file (format yang sama dengan data seed)
    const fileUrl = `/images/${fileName}`;

    return Response.json(
      {
        success: true,
        message: "File berhasil diupload",
        data: {
          fileName,
          fileUrl,
          fileSize: file.size,
          fileType: file.type
        }
      },
      {
        status: 201
      }
    );
  } catch (error) {
    console.error("Error uploading file:", error);
    return Response.json(
      { success: false, error: "Gagal mengupload file" },
      {
        status: 500
      }
    );
  }
}
