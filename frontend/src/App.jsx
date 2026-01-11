import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <button onClick={() => setCount((prev) => prev + 1)}>Click me</button>
      <p>{count}</p>
    </>
  );
}

export default App;
