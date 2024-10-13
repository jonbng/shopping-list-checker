"use client";
import { useEffect, useState } from "react";
import { getTodoLists } from "./msGraphApi";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShoppingCart, LogOut } from "lucide-react";

export default function Dashboard() {
  const [todoLists, setTodoLists] = useState([]);

  useEffect(() => {
    console.warn("fetchData");
    async function fetchData() {
      console.warn("fetchData2");
      const response = await getTodoLists();
      alert("response " + response.value);
      setTodoLists(response.value);
      console.warn("todoLists", todoLists);
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
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatar.png" alt="User avatar" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="container py-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {todoLists.map((list) => (
            <Link href={`/list/${list.id}`} key={list.id}>
              <Card className="hover:bg-accent transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {list.name}
                  </CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{list.itemCount}</div>
                  <p className="text-xs text-muted-foreground">
                    {list.itemCount === 1 ? "item" : "items"}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}