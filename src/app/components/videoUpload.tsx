"use client";

import { LinearProgress } from "@mui/material";
import { ChangeEvent, useRef, useState } from "react";
import React from "react";
import ReactPlayer from "react-player";
import axios from "axios";

export default function VideoUpload() {
  const [uploading, setUploading] = useState(false);
  const [video, setVideo] = useState("");
  const [progressValue, setProgressValue] = useState(0);
  const InputFileRef = useRef<HTMLInputElement>(null);
  const onChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setUploading(true);
    if (!event.target.files) return;
    try {
      const response = await fetch(`/api/sign-upload`);
      const { timestamp, signature, api_key } = await response.json();

      const data = new FormData();
      const video = event.target.files[0];
      data.append("file", video);
      data.append("timestamp", timestamp.toString());
      data.append("signature", signature);
      data.append("api_key", api_key);
      data.append("resource_type", "video");

      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          setVideo(data.secure_url);
        }
        setUploading(false);
      };
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.floor((event.loaded * 100) / event.total);
          setProgressValue(percent);
        }
      };
      xhr.open(
        "POST",
        "https://api.cloudinary.com/v1_1/de1g2bwml/video/upload"
      );
      xhr.send(data);
    } catch (err) {
      console.error(err, "server aldaa");
    }
  };
  const onChangeAxios = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files) return;
      setUploading(true);
      const response = await fetch(`/api/sign-upload`);
      const { timestamp, signature, api_key } = await response.json();

      const data = new FormData();
      const video = event.target.files[0];
      data.append("file", video);
      data.append("timestamp", timestamp.toString());
      data.append("signature", signature);
      data.append("api_key", api_key);
      data.append("resource_type", "video");
      const response2 = await axios.post(
        "https://api.cloudinary.com/v1_1/de1g2bwml/video/upload",
        data,
        {
          onUploadProgress: (progressEvent) => {
            if (!progressEvent.total) return;
            const percentage = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgressValue(percentage);
          },
        }
      );
      setVideo(response2.data.secure_url);
      setUploading(false);
    } catch (e) {
      console.log(e, "caught an error");
      setUploading(false);
    }
  };
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
          onChange={onChangeAxios}
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
