import "./App.css";
import React, { useState, useEffect } from "react";
import Home from "./component/Home/Home";
function App() {
  
 /* useEffect(() => {
    const value = 5;
    fetch("/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: {
        value:value,
      },
    })
      .then((response) => response.json())
      .then((data) => setdata(data));
  }, []);*/

  return (
    <div className="App">
      <Home/>
    </div>
  );
}

export default App;
