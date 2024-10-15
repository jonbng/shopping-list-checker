"use client";
import { useEffect, useState } from "react";
import {
  getTodoLists,
  ShoppingList,
  createListAndRefresh,
} from "../lib/shoppingListClient";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShoppingCart, LogOut, Users, User, Plus } from "lucide-react";
import { handleLogout } from "@/msal/msal";
import UserAvatar from "@/components/UserAvatar";

export default function Dashboard() {
  const [todoLists, setTodoLists] = useState<ShoppingList[]>([]);
  const [newListName, setNewListName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const response = await getTodoLists();
      setTodoLists(response);
      console.log(response);
    }
    fetchData();
  }, []);

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newListName.trim()) {
      try {
        setTodoLists(await createListAndRefresh(newListName));
        setNewListName("");
        setIsDialogOpen(false);
      } catch (error) {
        console.error("Failed to create new list:", error);
      }
    }
  };

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
        <h2 className="text-2xl font-semibold mb-6 px-4">
          Your Shopping Lists
        </h2>
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
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Card className="bg-accent transition-colors cursor-pointer flex items-center justify-center">
                <CardContent className="flex flex-col items-center justify-center h-full mt-4">
                  <Plus className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-lg font-semibold">Create New List</p>
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="mx-auto w-[90vw] rounded-lg">
              <DialogHeader>
                <DialogTitle>Create a New Shopping List</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateList} className="space-y-4">
                <div>
                  <Label htmlFor="listName">List Name</Label>
                  <Input
                    id="listName"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    placeholder="Enter list name"
                  />
                </div>
                <Button type="submit">Create List</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
}