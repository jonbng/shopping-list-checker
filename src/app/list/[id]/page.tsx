"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import BarcodeReader from "../../BarcodeReader";
import { ProductType } from "@/lib/krogerClient";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, LogOut, DollarSign } from "lucide-react";
import UserAvatar from "@/components/UserAvatar";
import { handleLogout } from "@/msal/msal";
import {
  addItemToListAndRefresh,
  getShoppingListInfo,
  markItemAsCompletedAndRefresh,
  ShoppingList,
} from "@/lib/shoppingListClient";
import { compareItems } from "@/lib/aiComparer";

export default function ListDetailClient({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;
  const [product, setProduct] = useState<ProductType | null | false>(null);
  const [todoList, setTodoList] = useState<ShoppingList | null>(null);
  const [newItem, setNewItem] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const response = await getShoppingListInfo(id);
      setTodoList(response);
      console.log(response);
    }
    fetchData();
  }, [id]);

  const handleProduct = (product: ProductType) => {
    if (!product) {
      setProduct(false);
      setIsDialogOpen(true);
    } else {
      setProduct(product);
      setIsDialogOpen(true);
    }
  };

  const toggleItem = async (id: string) => {
    const item = todoList!.items.find((item) => item.id === id);
    setTodoList({
      ...todoList!,
      items: todoList!.items.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === "completed" ? "notStarted" : "completed",
            }
          : item
      ),
    });
    setTodoList(await markItemAsCompletedAndRefresh(todoList.id, id, item.status === "completed" ? true : false));
  };

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.trim()) {
      setTodoList(await addItemToListAndRefresh(id, newItem));
      setNewItem("");
    }
  };

  const acceptScannedItem = async () => {
    if (product) {
      setTotalPrice(totalPrice + parseFloat(product.price));
      const itemToRemove = await compareItems(product.name, todoList!);
      console.log("Item to remove", itemToRemove, todoList);
      const actualItem = todoList!.items.find(
        (item) => item.name === itemToRemove
      );

      if (actualItem) {
        setTodoList(await markItemAsCompletedAndRefresh(todoList!.id, actualItem!.id, false));
      }
    }
    setIsDialogOpen(false);
    setProduct(null);
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

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Shopping List</h2>
          <div className="flex items-center">
            <DollarSign className="h-5 w-5 mr-1" />
            <span className="text-lg font-semibold">
              {totalPrice.toFixed(2) }
            </span>
          </div>
        </div>

        {todoList && (
          <div className="space-y-4">
            {todoList.items.map((item) => (
              <Card
                key={item.id}
                className={`p-4 ${
                  item.status === "completed" ? "bg-gray-100" : ""
                }`}
              >
                <div className="flex items-center space-x-4">
                  <Checkbox
                    id={item.id}
                    checked={item.status === "completed"}
                    onCheckedChange={() => toggleItem(item.id)}
                  />
                  <div className="flex-grow">
                    <label
                      htmlFor={item.id}
                      className={`text-lg font-medium ${
                        item.status === "completed"
                          ? "line-through text-muted-foreground"
                          : ""
                      }`}
                    >
                      {item.name}
                    </label>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <form
          onSubmit={addItem}
          className="flex bottom-0 fixed w-screen left-0"
        >
          <Input
            type="text"
            placeholder="Add new item..."
            value={newItem}
            className="rounded-none focus-visible:ring-0 h-14"
            onChange={(e) => setNewItem(e.target.value)}
          />
          <Button
            type="submit"
            className="rounded-none h-14 w-28 font-semibold text-lg"
          >
            Add
          </Button>
        </form>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="mx-auto w-[90vw] rounded-lg" >
            <DialogHeader>
              <DialogTitle>
                {product ? "Scanned Item" : "Unknown Item"}
              </DialogTitle>
              <DialogDescription>
                {product
                  ? "Is this the correct item?"
                  : "The scanned item was not recognized."}
              </DialogDescription>
            </DialogHeader>
            {product ? (
              <div className="flex flex-col items-center">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="mb-4"
                />
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-muted-foreground mb-1">
                  Price: ${product.price}
                </p>
                <p className="text-muted-foreground mb-1">UPC: {product.upc}</p>
                {product.categories && product.categories.length > 0 ? (
                  <p className="text-muted-foreground mb-1">
                    Categories: {product.categories.join(", ") ?? product.categories[0]}
                  </p>
                ) : (
                  ""
                )}
              </div>
            ) : (
              <p>Please try scanning again or try a different item.</p>
            )}
            <DialogFooter className="flex gap-4">
              {product ? (
                <>
                  <Button
                    onClick={() => setIsDialogOpen(false)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button onClick={acceptScannedItem}>Accept</Button>
                </>
              ) : (
                <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
