import cloudinary from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export async function GET() {
  console.log(`api secret`, process.env.CLOUDINARY_API_SECRET);
  console.log(`api key`, process.env.CLOUDINARY_API_KEY);
  console.log(`cloudinary name`, process.env.CLOUDINARY_CLOUD_NAME);
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.v2.utils.api_sign_request(
      { timestamp },
      process.env.CLOUDINARY_API_SECRET as string
    );

    return NextResponse.json({
      timestamp,
      signature,
      api_key: process.env.CLOUDINARY_API_KEY,
    });
  } catch (err) {
    console.error(err, "route aldaa");
  }
}
