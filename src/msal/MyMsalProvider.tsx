"use client";

import { useEffect, useState } from "react";
import { initializeMsal, msalInstance } from "@/msal/msal";
import {
  AuthenticatedTemplate,
  MsalProvider,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import UnauthorizedMessage from "@/components/LoginPage";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";
import Image from "next/image";

export default function AppWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    initializeMsal();

    const checkMobile = () => {
      setIsMobile(
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      );
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) {
    return (
      <MsalProvider instance={msalInstance}>
        <AuthenticatedTemplate>{children}</AuthenticatedTemplate>
        <UnauthenticatedTemplate>
          <UnauthorizedMessage />
        </UnauthenticatedTemplate>
      </MsalProvider>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-8xl font-bold mb-4 text-center " style={{ fontSize: "3rem"}}>
        ScanShop Mobile App
      </h1>
      <p className="text-xl mb-8 text-center">
        This app is designed for mobile devices. Please open it on your
        smartphone or tablet.
      </p>

      <div className="bg-white p-4 rounded-lg shadow-lg mb-8">
        <Image alt="qr code" src="https://raw.githubusercontent.com/arctixdev/shopping-list-checker/refs/heads/main/qr-code(3).svg" height={200} width={200}/>
      </div>

      <p className="text-lg mb-4 text-center">
        Scan the QR code or visit{" "}
        <a href="https://scanshop.arctix.dev" className="underline">
          scanshop.arctix.dev
        </a>{" "}
        on your mobile device
      </p>

      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Video className="w-4 h-4 mr-2" />
            Watch Demo
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <div className="aspect-video">
            <video controls className="w-full h-full">
              <source
                src="https://github.com/user-attachments/assets/2c73d4eb-2325-417f-a09c-00d876509cc7"
                type="video/webm"
              />
              Your browser does not support the video tag.
            </video>
          </div>
        </DialogContent>
      </Dialog>

      <p className="mt-8 text-sm text-center">
        Are you from Low Skies? Check out the demo video above!
      </p>
    </div>
  );
}
