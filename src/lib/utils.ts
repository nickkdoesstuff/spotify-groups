import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import { env } from "@/env"
import { Metadata } from "next"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateUrl(){
  if(env.NODE_ENV == "production") {
    return  'https://sync.nickkirkwood.cc'
  } else {
    return "http://localhost:3000"
  }
}

interface GenerateMetadataProps {
  title?: string;
  description?: string
}

export function generateMetadata({ title, description }: GenerateMetadataProps): Metadata {
  return {
    title: `spotify groups ${title && `| ${title}`}`,
    description: description ?? 'share spotify stats',
    icons: [{ rel: "icon", url: "/favicon.ico" }],
  };
}