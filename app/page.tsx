import { Button } from "@/components/ui/button";
import { ClerkProvider } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
   
      <div>
        <h1>The Solution Analyst</h1>
        <Button>Subscribe</Button>
      </div>
    
  );  
}
