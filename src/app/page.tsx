import { Input } from "@/components/ui/input";
import Image from "next/image";
import { ChangeEvent } from "react";
import Video from "./components/videoUpload";
import { LinearProgress } from "@mui/material";

export default function Home() {
  // console.log(process.env.NEXT_PUBLIC_CLOUDINARY_PRESET);
  // console.log(process.env.CLOUDINARY_URL);
  return (
    <div>
      <Video />
    </div>
  );
}
