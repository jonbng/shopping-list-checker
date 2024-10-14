"use client";
import { useEffect, useState } from "react";
import { getTodoLists, ShoppingList } from "./msGraphApi";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShoppingCart, LogOut, Users, User } from "lucide-react";
import { handleLogout } from "@/msal/msal";
import UserAvatar from "@/components/UserAvatar";

export default function Dashboard() {
  const [todoLists, setTodoLists] = useState<ShoppingList[]>([]);

  useEffect(() => {
    async function fetchData() {
      const response = await getTodoLists();
      setTodoLists(response);
      console.log(response);
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background border-b">
        <div className="container flex items-center justify-between p-4">
          <h1 className="text-2xl font-bold">ShopScan</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <UserAvatar />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleLogout("redirect")}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="container py-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 px-4">
          {todoLists.map((list) => (
            <Link href={`/list/${list.id}`} key={list.id}>
              <Card className="hover:bg-accent transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-semibold">
                    {list.displayName}
                  </CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex flex-row justify-between px-6 py-2">
                    <div className="items-center flex flex-col w-fit">
                      <div className="text-2xl font-bold">
                        {list.remainingItemCount}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {list.remainingItemCount === 1 ? "Item" : "Items"}
                      </p>
                    </div>
                    <div className="items-center flex flex-col w-fit">
                      <div className="text-2xl font-bold">
                        {list.totalItemCount}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {list.remainingItemCount === 1
                          ? "Item total"
                          : "Items total"}
                      </p>
                    </div>
                    <div className="items-center flex flex-col w-fit">
                      {list.isShared ? (
                        <Users size={32} strokeWidth={2.4} />
                      ) : (
                        <User size={32} strokeWidth={2.4} />
                      )}
                      <p className="text-xs text-muted-foreground">
                        {list.isShared ? "Shared list" : "Personal list"}
                      </p>
                    </div>
                  </div>
                  {list.lastModifiedDateTime && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Last modified:{" "}
                        {new Date(
                          list.lastModifiedDateTime
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
