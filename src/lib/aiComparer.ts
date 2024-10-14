"use server";

import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { ShoppingList } from "./shoppingListClient";

export async function compareItems(itemName: string, todoList: ShoppingList) {
  "use server";

  const uncheckedItems = todoList.items.filter((item) => item.status !== "completed");

  const { text } = await generateText({
    model: openai("gpt-4o"),
    system:
      "Your job is to compare the items in the list. The one you are comparing is the subject. You need to return the exact name of the item in the list that is most similar to the subject. If there is no similar item, return 'none'.",
    messages: [
      ...uncheckedItems.map((item) => ({
        role: "user" as const,
        content: item.name,
      })),
      {
        role: "user" as const,
        content: "subject: " + itemName,
      },
    ],
  });

  console.log(text, todoList.items);

  return text;
}