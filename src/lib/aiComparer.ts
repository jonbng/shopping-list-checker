"use server";

import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { ShoppingList } from "./shoppingListClient";

export async function compareItems(itemName: string, todoList: ShoppingList) {
  "use server";

  const uncheckedItems = todoList.items.filter((item) => item.status !== "completed");

  const isNameExact = uncheckedItems.some((item) => item.name === itemName);

  if (isNameExact) {
    return itemName;
  }

  const { text } = await generateText({
    model: openai("gpt-4o"),
    system: `
      Your job is to compare the items in the list. The one you are comparing is the subject. 
      You need to return the exact name of the item in the list that is most similar to the subject. 
      If there is no similar item, return 'none'. 

      IMPORTANT: You must return the EXACT name of the item from the shopping list. 
      DO NOT RETURN the subject itself (${itemName}). ALSO DO NOT RETURN a similar item that is not in the list. DONT CORRECT SPELLING ERRORS OR STUFF LIKE "Cheddar chesse *things*" OR ANYTHING ELSE.

      Examples:
      - If the subject is 'apple' and the list contains 'apple', 'banana', 'orange', return 'apple'.
      - If the subject is 'apple' and the list contains 'banana', 'orange', return 'none'.
      - If the subject is 'apple' and the list contains 'apples', 'banana', 'orange', return 'apples'.
      - If the subject is 'apple' and the list contains 'apple pie', 'banana', 'orange', return 'apple pie'.
    `,
    messages: [
      ...uncheckedItems.map((item) => ({
        role: "user" as const,
        content: item.name,
      })),
      {
        role: "system" as const,
        content: "Subject: " + itemName,
      },
    ],
  });

  if (text === itemName) {
    console.log("The AI returned the subject. This is not allowed.");
  }

  console.log(text, uncheckedItems);

  return text;
}