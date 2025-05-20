import React from "react";
import {TypewriterLoader} from "./typewriter-loader";

interface LoadingPageProps {
  message?: string;
}

export function LoadingPage({ message = "Loading..." }: LoadingPageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <TypewriterLoader />
      <p className="mt-6 text-muted-foreground">{message}</p>
    </div>
  );
}
