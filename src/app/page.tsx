"use client";
import { useEffect, useState } from "react";
import { getTodoLists } from "./msGraphApi";

export default function App() {
  const [todoLists, setTodoLists] = useState([]);

  useEffect(() => {
    console.warn('fetchData');
    async function fetchData() {
      console.warn('fetchData2');
      const response = await getTodoLists();
      alert('response ' + response.value);
      setTodoLists(response.value);
      console.warn('todoLists', todoLists);
    }
    fetchData();
  }, []);

  return (
    <div className="overflow-hidden">
      <h1>HELLO!!</h1>
      {todoLists && (
        <div>
          {todoLists.map((list) => (
            <div key={list.id}>
              <div>{list.displayName}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}