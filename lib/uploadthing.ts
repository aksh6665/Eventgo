import { createUploadthing, type FileRouter } from "uploadthing/next";
import { generateReactHelpers } from '@uploadthing/react'
import { generateComponents } from '@uploadthing/react'
import type { OurFileRouter } from '@/app/api/uploadthing/core'

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async () => {
      return { userId: "user" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>()
export const { UploadButton, UploadDropzone, Uploader } = generateComponents<OurFileRouter>() 