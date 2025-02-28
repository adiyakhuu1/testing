"use client";

import { Input } from "@/components/ui/input";
import { LinearProgress } from "@mui/material";
import { ChangeEvent, useRef, useState } from "react";
import React from "react";
import ReactPlayer from "react-player";

export default function Video() {
  const [uploading, setUploading] = useState(false);
  const [video, setVideo] = useState("");
  const [progressValue, setProgressValue] = useState(0);
  const InputFileRef = useRef<HTMLInputElement>(null);
  // useEffect(() => {
  //   let interval = setInterval(() => {
  //     setProgressValue((p) => p + 1);
  //   }, 1000);
  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, []);
  const onChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setUploading(true);
    if (
      !event.target.files ||
      !process.env.NEXT_PUBLIC_CLOUDINARY_PRESET ||
      !process.env.NEXT_PUBLIC_CLOUDINARY_URL
    )
      return;
    try {
      const response = await fetch(`/api/sign-upload`);
      const { timestamp, signature, api_key } = await response.json();
      console.log(timestamp, signature, api_key);
      const video = event.target.files[0];
      const data = new FormData();
      data.append("file", video);
      data.append("timestamp", timestamp.toString());
      data.append("signature", signature);
      data.append("api_key", api_key);
      data.append("resource_type", "video");
      const xhr = new XMLHttpRequest();
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded * 100) / event.total);
          setProgressValue(percent);
        }
      };
      xhr.onload = () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          setVideo(data.secure_url);
        }
        setUploading(false);
      };
      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/de1g2bwml/video/upload`
      );
      xhr.send(data);
      console.log(xhr);
    } catch (err) {
      console.error(err, "server aldaa");
      setUploading(false);
    }
  };
  // console.log(process.env.NEXT_PUBLIC_CLOUDINARY_PRESET);
  // console.log(process.env.CLOUDINARY_URL);

  return (
    <>
      <div>
        {video && (
          <ReactPlayer stopOnUnmount={false} controls loop url={`${video}`} />
        )}
      </div>
      <div className="min-h-screen">
        <input
          ref={InputFileRef}
          onChange={onChange}
          type="file"
          accept="mp4/*"
          className="hidden"
        />
        {uploading ? (
          <div>
            <div className="flex justify-around">
              <div>Uploading...</div>
              <div>{progressValue}</div>
            </div>
            <LinearProgress
              value={progressValue}
              valueBuffer={progressValue}
              variant="buffer"
            />
          </div>
        ) : (
          <div
            onClick={() => {
              InputFileRef.current?.click();
            }}
          >
            Upload file
          </div>
        )}
        {/* 
        <Image
          src={`/f4be0647e69ff3d1a8a414a7473e690bd43b0b6dr1-1448-2048v2_uhq.jpg`}
          width={1000}
          height={1000}
          alt="asdjfhasjkd"
        /> */}

        {/* <div>test progress</div>
        <LinearProgress value={20} variant="buffer" /> */}
      </div>
    </>
  );
}
