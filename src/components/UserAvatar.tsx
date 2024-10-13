/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from "react";
import { getUserPhotoAvatar } from "@/msal/msalGraph";
import { msalInstance } from "@/msal/msal";
import { extractInitials } from "@/msal/userHelper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UserAvatar() {
    const [userPhoto, setUserPhoto] = useState<string | null>(null);
    const [userInitials, setUserInitials] = useState('?');

    const user = msalInstance.getActiveAccount();

    useEffect(() => {
        if (user) {
            getUserPhotoAvatar().then((response: any) => {
                console.log("getUserPhotoAvatar", response);
                if (response instanceof Blob) {
                    const url = URL.createObjectURL(response);
                    setUserPhoto(url);
                } else if (typeof response === "string") {
                    setUserPhoto(response);
                } else {
                    console.log("Unsupported photo data type.");
                }
            });
            setUserInitials(extractInitials(user.name));
            console.log(user);
        }
    }, []) //intentionally left the dependency blank.


    return (
        <Avatar className="h-8 w-8">
            <AvatarImage src={userPhoto} alt="User avatar" />
            <AvatarFallback>{userInitials}</AvatarFallback>
        </Avatar>
    );
}
