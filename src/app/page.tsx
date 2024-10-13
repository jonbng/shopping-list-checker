"use client";
import { useEffect, useState } from "react";
import { getTodoLists } from "./msGraphApi";

function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setIsIOS(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    );

    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
  }, []);

  if (isStandalone) {
    return null; // Don't show install button if already installed
  }

  return (
    <div>
      <h3>Install App</h3>
      <button>Add to Home Screen</button>
      {isIOS && (
        <p>
          To install this app on your iOS device, tap the share button
          <span role="img" aria-label="share icon">
            {" "}
            ⎋{" "}
          </span>
          and then &quot;Add to Home Screen&quot;
          <span role="img" aria-label="plus icon">
            {" "}
            ➕{" "}
          </span>
          .
        </p>
      )}
    </div>
  );
}

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
      <InstallPrompt />
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