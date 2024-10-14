import { getToken } from '@/msal/msal';

export interface ShoppingListItem {
  id: string;
  name: string;
  status: string;
  lastModifiedDateTime: string;
}

export interface ShoppingList {
  id: string;
  displayName: string;
  totalItemCount: number;
  remainingItemCount: number;
  isShared: boolean;
  items: ShoppingListItem[];
  lastModifiedDateTime?: string;
}

export async function getOptions() {
  const token = await getToken();

  const headers = new Headers();
  headers.append("Authorization", `Bearer ${token}`);

  return {
    method: "GET",
    headers: headers,
  };
}

export async function getTodoListItems(listId: string, options: { method: string; headers: Headers; }) {
  console.log('=> Fetching tasks');

  const response = await fetch(
    `https://graph.microsoft.com/v1.0/me/todo/lists/${listId}/tasks`,
    options
  );

  const json = await response.json();

  console.log("=> Tasks fetched", json);

  if (!json.value || json.value.length === 0) {
    return [[], null];
  }

  let lastModifiedDateTime = json.value[0].lastModifiedDateTime;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const items = json.value.map((item: any) => {
    if (new Date(item.lastModifiedDateTime) > new Date(lastModifiedDateTime)) {
      lastModifiedDateTime = item.lastModifiedDateTime;
    }
    return {
      id: item.id,
      name: item.title,
      status: item.status,
      lastModifiedDateTime: item.lastModifiedDateTime,
    };
  });

  return [items, lastModifiedDateTime];
}

export async function getShoppingListInfo(listId: string, options: { method: string; headers: Headers; } | null = null, list: ShoppingList | null = null) {
  if (!options) {
    options = await getOptions();
  }

  if (!list) {
    const response = await fetch(
      `https://graph.microsoft.com/v1.0/me/todo/lists/${listId}`,
      options
    );

    list = await response.json();
  }
  
  const listName = list.displayName;
  const [listItems, lastModifiedDateTime] = await getTodoListItems(
    listId,
    options
  );

  // Find the number of items that are not completed
  const remainingItemCount = listItems.filter(
    (item) => item.status !== "completed"
  ).length;

  const finalList: ShoppingList = {
    id: listId,
    displayName: listName,
    totalItemCount: listItems.length,
    remainingItemCount: remainingItemCount,
    isShared: list.isShared,
    items: listItems,
    lastModifiedDateTime: lastModifiedDateTime,
  };

  return finalList;
}

export async function getTodoLists() {
  console.log('=> Fetching tasks');
  const options = await getOptions();

  const response = await fetch(
    "https://graph.microsoft.com/v1.0/me/todo/lists",
    options
  );

  const json = await response.json();

  console.log("=> Lists fetched", json);

  // Get the tasks for each list
  const lists = json.value;

  const fullLists: ShoppingList[] = [];

  for (const list of lists) {
    fullLists.push(await getShoppingListInfo(list.id, options, list));
  }

  return fullLists;
}

export async function markItemAsCompleted(listId: string, itemId: string, isCompleted: boolean) {
  console.log('=> Marking item as completed');

  const token = await getToken();

  const headers = new Headers();
  headers.append("Authorization", `Bearer ${token}`);
  headers.append("Content-Type", "application/json");

  const options = {
    method: "PATCH",
    headers: headers,
    body: JSON.stringify({
      status: isCompleted ? "completed" : "notStarted",
    }),
  };

  await fetch(
    `https://graph.microsoft.com/v1.0/me/todo/lists/${listId}/tasks/${itemId}`,
    options
  );

  console.log('=> Item marked as completed');
}

export async function markItemAsCompletedAndRefresh(listId: string, itemId: string, isCompleted: boolean) {
  await markItemAsCompleted(listId, itemId, isCompleted);
  return await getTodoLists();
}

export async function addItemToList(listId: string, itemName: string) {
  console.log('=> Adding item to list');

  const token = await getToken();

  const headers = new Headers();
  headers.append("Authorization", `Bearer ${token}`);
  headers.append("Content-Type", "application/json");

  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      title: itemName,
    }),
  };

  await fetch(
    `https://graph.microsoft.com/v1.0/me/todo/lists/${listId}/tasks`,
    options
  );

  console.log('=> Item added to list');
}

export async function addItemToListAndRefresh(listId: string, itemName: string) {
  await addItemToList(listId, itemName);
  return await getShoppingListInfo(listId);
}