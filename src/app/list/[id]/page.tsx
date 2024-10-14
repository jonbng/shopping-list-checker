"use client";

import BarcodeReader from "../../BarcodeReader";
import { ProductType } from "@/lib/krogerClient";
import { useEffect, useState } from "react";
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
import { addItemToListAndRefresh, getShoppingListInfo, ShoppingList } from "@/lib/shoppingListClient";

export default function ListDetailClient({ params }: { params: { id: string } }) {
  const id = params.id;
  const [product, setProduct] = useState<ProductType | null>(null);
  const [todoList, setTodoList] = useState<ShoppingList>(null);

  useEffect(() => {
    async function fetchData() {
      const response = await getShoppingListInfo(id);
      setTodoList(response);
      console.log(response);
    }
    fetchData();
  }, []);

  const handleProduct = (product: ProductType) => {
    setProduct(product);
  };

  const [newItem, setNewItem] = useState("");

  const toggleItem = (id: string) => {
    const updatedItems = todoList.items.map((item) =>
      item.id === id ? { ...item, status: (item.status === "completed" ? "notStarted" : "completed" )  } : item
    );
    
    setTodoList(
      (prevState) => ({
        ...prevState,
        items: updatedItems,
      })
    );
  };

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.trim()) {
      addItemToListAndRefresh(id, newItem).then((response) => {
        setTodoList(response);
      });
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
            <h1 className="text-2xl font-bold">
              {todoList ? todoList.displayName : "List"}
            </h1>
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

      <main className="container p-4">
        <Card className="mb-6 h-fit w-full">
          <CardContent className="p-2 h-fit w-full">
            <div className="flex items-center justify-center rounded-lg h-fit w-full py-1.5">
              <BarcodeReader
                handleProduct={(product) => handleProduct(product)}
              />
            </div>
          </CardContent>
        </Card>

        {todoList && (
          <div className="space-y-2">
            {todoList.items.map((item) => (
              <div key={item.id} className="flex items-center space-x-2">
                <Checkbox
                  id={item.id}
                  checked={item.status === "completed"}
                  onCheckedChange={() => toggleItem(item.id)}
                />
                <label
                  htmlFor={item.id}
                  className={`flex-grow text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                    item.status === "completed"
                      ? "line-through text-muted-foreground"
                      : ""
                  }`}
                >
                  {item.name}
                </label>
              </div>
            ))}
          </div>
        )}
        <form onSubmit={addItem} className="flex bottom-0 fixed w-screen left-0">
          <Input
            type="text"
            placeholder="Add new item..."
            value={newItem}
            className="rounded-none focus-visible:ring-0 h-14"
            onChange={(e) => setNewItem(e.target.value)}
          />
          <Button type="submit" className="rounded-none h-14 w-28 font-semibold text-lg">Add</Button>
        </form>
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