"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { handleLogin } from "@/msal/msal";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 flex flex-col justify-between p-4">
      <Card className="w-full max-w-md mx-auto mt-8 shadow-lg">
        <CardHeader className="space-y-1 flex flex-col items-center pt-8">
          <div className="w-24 h-24 mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <svg
              width="96"
              height="96"
              viewBox="0 0 96 96"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="96" height="96" fill="white" />
              <path
                d="M17.6001 31.9999V24.7999C17.6001 22.8904 18.3587 21.059 19.7089 19.7087C21.0592 18.3585 22.8905 17.5999 24.8001 17.5999H32.0001M68.0001 17.5999H75.2001C77.1097 17.5999 78.941 18.3585 80.2913 19.7087C81.6415 21.059 82.4001 22.8904 82.4001 24.7999V31.9999M82.4001 67.9999V75.1999C82.4001 77.1095 81.6415 78.9408 80.2913 80.2911C78.941 81.6413 77.1097 82.3999 75.2001 82.3999H68.0001M32.0001 82.3999H24.8001C22.8905 82.3999 21.0592 81.6413 19.7089 80.2911C18.3587 78.9408 17.6001 77.1095 17.6001 75.1999V67.9999M35.6001 31.9999V67.9999M50.0001 31.9999V67.9999M68.0001 31.9999V67.9999"
                stroke="black"
                stroke-width="7.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
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
            onClick={() => {
              setIsLoading(true);
              handleLogin();
            }}
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
                <svg width={25} height={25} className="mr-2">
                  <path
                    fill="#FFFFFFFF"
                    d="M2 3h9v9H2V3m9 19H2v-9h9v9M21 3v9h-9V3h9m0 19h-9v-9h9v9Z"
                  />
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
