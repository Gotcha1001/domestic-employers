// import { v2 as cloudinary } from "cloudinary";

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// console.log("Cloudinary config:", {
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET ? "[REDACTED]" : undefined,
// });

// export async function uploadImage(file) {
//   try {
//     // Validate file
//     if (!file || !(file instanceof File)) {
//       throw new Error("Invalid file: Expected a File object");
//     }

//     // Convert File to base64 data URL
//     const arrayBuffer = await file.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);
//     const base64 = buffer.toString("base64");
//     const dataUrl = `data:${file.type};base64,${base64}`;

//     // Upload to Cloudinary
//     const result = await cloudinary.uploader.upload(dataUrl, {
//       folder: "pet-adoption",
//     });

//     return result.secure_url;
//   } catch (error) {
//     console.error("Error in uploadImage:", error.message);
//     throw new Error("Image upload failed");
//   }
// }

// "use server";

// import { v2 as cloudinary } from "cloudinary";

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export async function uploadImage(file: File): Promise<string> {
//   try {
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET!);

//     const response = await fetch(
//       `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
//       {
//         method: "POST",
//         body: formData,
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`Cloudinary upload failed: ${response.statusText}`);
//     }

//     const result = await response.json();
//     console.log("Cloudinary raw response:", JSON.stringify(result, null, 2));
//     if (!result.secure_url) {
//       throw new Error("Cloudinary did not return a secure URL");
//     }

//     return result.secure_url;
//   } catch (error) {
//     console.error("Error in uploadImage:", error);
//     throw new Error("Failed to upload image");
//   }
// }
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    // Validate environment variables
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET ||
      !process.env.CLOUDINARY_UPLOAD_PRESET
    ) {
      console.error("Missing Cloudinary configuration:", {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
          ? "[REDACTED]"
          : undefined,
        upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
      });
      return NextResponse.json(
        { error: "Cloudinary configuration is incomplete" },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file || !(file instanceof File)) {
      console.error("Invalid file:", file);
      return NextResponse.json(
        { error: "Invalid file: Expected a File object" },
        { status: 400 }
      );
    }

    console.log("Uploading file to Cloudinary:", {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    });

    // Convert File to base64 data URL
    let arrayBuffer;
    try {
      arrayBuffer = await file.arrayBuffer();
    } catch (error) {
      console.error("File arrayBuffer error:", error);
      return NextResponse.json(
        { error: "Failed to read file data" },
        { status: 500 }
      );
    }
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;

    // Upload to Cloudinary
    let result;
    try {
      result = await cloudinary.uploader.upload(dataUrl, {
        folder: "pet-adoption",
        upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
      });
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      let uploadErrorMsg = "Unknown error";
      if (error instanceof Error) {
        uploadErrorMsg = error.message;
      }
      return NextResponse.json(
        { error: `Cloudinary upload failed: ${uploadErrorMsg}` },
        { status: 500 }
      );
    }

    console.log("Cloudinary raw response:", JSON.stringify(result, null, 2));

    if (!result.secure_url || typeof result.secure_url !== "string") {
      console.error("Invalid Cloudinary response:", result);
      return NextResponse.json(
        { error: "Cloudinary did not return a valid secure URL" },
        { status: 500 }
      );
    }

    return NextResponse.json({ imageUrl: String(result.secure_url) });
  } catch (error) {
    console.error("Error in uploadImage:", error);
    let errorMsg = "Unknown error";
    if (error instanceof Error) {
      errorMsg = error.message;
    }
    return NextResponse.json(
      { error: `Failed to upload image: ${errorMsg}` },
      { status: 500 }
    );
  }
}
