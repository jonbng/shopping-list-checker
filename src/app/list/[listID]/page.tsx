"use client";

import BarcodeReader from "../../BarcodeReader";
import { ProductType } from "@/lib/krogerClient";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowLeft, LogOut } from "lucide-react";
import UserAvatar from "@/components/UserAvatar";
import { handleLogout } from "@/msal/msal";

// Mock data for list items
const initialItems = [
  { id: "1", name: "Milk", completed: false },
  { id: "2", name: "Bread", completed: true },
  { id: "3", name: "Eggs", completed: false },
];

export default function ListDetailClient({ id }: { id: string }) {
  const [product, setProduct] = useState<ProductType | null>(null);

  const handleProduct = (product: ProductType) => {
    setProduct(product);
  };

  const [items, setItems] = useState(initialItems);
  const [newItem, setNewItem] = useState("");

  const toggleItem = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.trim()) {
      setItems([
        ...items,
        { id: Date.now().toString(), name: newItem.trim(), completed: false },
      ]);
      setNewItem("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background border-b">
        <div className="container flex items-center justify-between p-4">
          <div className="flex items-center">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mr-2">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">List {id}</h1>
          </div>
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

      <main className="container p-6">
        <Card className="mb-6 h-fit w-full">
          <CardContent className="p-6 h-fit w-full">
            <div className="flex items-center justify-center bg-muted rounded-md h-fit w-full">
              <BarcodeReader
                handleProduct={(product) => handleProduct(product)}
              />
            </div>
          </CardContent>
        </Card>

        <form onSubmit={addItem} className="flex space-x-2 mb-4">
          <Input
            type="text"
            placeholder="Add new item..."
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
          />
          <Button type="submit">Add</Button>
        </form>

        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-2">
              <Checkbox
                id={item.id}
                checked={item.completed}
                onCheckedChange={() => toggleItem(item.id)}
              />
              <label
                htmlFor={item.id}
                className={`flex-grow text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                  item.completed ? "line-through text-muted-foreground" : ""
                }`}
              >
                {item.name}
              </label>
            </div>
          ))}
        </div>
        {product && (
          <div>
            <img src={product.image_url} alt={product.name} />
            <div>{product.name}</div>
            <div>{product.price}</div>
            <div>{product.upc}</div>
            <div>{product.categories}</div>
          </div>
        )}
      </main>
    </div>
  );
}