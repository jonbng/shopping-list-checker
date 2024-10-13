import { getToken } from '@/msal/msal';

export async function getTodoLists() {
  console.log('=> Fetching tasks');
  const token = await getToken();

  const headers = new Headers();
  headers.append("Authorization", `Bearer ${token}`);
  
  const options = {
    method: "GET",
    headers: headers,
  };

  const response = await fetch(
    "https://graph.microsoft.com/v1.0/me/todo/lists",
    options
  );

  const json = await response.json();

  console.log("=> Tasks fetched", json);

  return json;
}
