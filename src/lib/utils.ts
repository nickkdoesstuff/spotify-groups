import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import { env } from "@/env"

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