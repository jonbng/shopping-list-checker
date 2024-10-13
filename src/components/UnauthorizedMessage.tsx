"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    handleSignIn();
    // Implement your Microsoft sign-in logic here
    // For example: await signIn('azure-ad')
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 flex flex-col justify-between p-4">
      <Card className="w-full max-w-md mx-auto mt-8 shadow-lg">
        <CardHeader className="space-y-1 flex flex-col items-center pt-8">
          <div className="w-24 h-24 mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <Image
              src="/placeholder.svg?height=96&width=96"
              alt="ScanShop Logo"
              width={96}
              height={96}
              className="rounded-full"
            />
          </div>
          <h1 className="text-2xl font-bold text-center">
            Welcome to ScanShop
          </h1>
          <p className="text-muted-foreground text-center">
            Sign in to start scanning and shopping
          </p>
        </CardHeader>
        <CardContent className="flex flex-col items-center pb-8 px-4">
          <Button
            className="w-full mt-6"
            size="lg"
            onClick={handleSignIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin mr-2"></div>
                Signing In...
              </div>
            ) : (
              <>
                {/* <Microsoft className="mr-2 h-5 w-5" /> */}
                <svg>
                  <path d="M2 3h9v9H2V3m9 19H2v-9h9v9M21 3v9h-9V3h9m0 19h-9v-9h9v9Z" />
                </svg>
                Sign in with Microsoft
              </>
            )}
          </Button>
        </CardContent>
      </Card>
      <footer className="mt-auto text-center text-sm text-muted-foreground pb-4">
        <p>By signing in, you agree to our</p>
        <p>
          <a href="#" className="underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline">
            Privacy Policy
          </a>
        </p>
      </footer>
    </div>
  );
}
