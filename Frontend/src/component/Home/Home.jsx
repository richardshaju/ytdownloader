import "./Home.css";
import React, { useState } from "react";
function Home() {
  const [link, setlink] = useState("");
  const [data, setdata] = useState('');

  console.log(data);
  const postData = async (e) => {
    e.preventDefault();
    fetch("/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ link }),
    }).then(response => {
      response.json().then(data =>{
        setdata(data)
      });
    });
  };
  return (
    <div className="Main">
      <div className="container">
        <h2>YOUTUBE VIDEO DOWNLOADER</h2>
        <div className="input-group">
          <form method="POST">
            <input
              style={{ backgroundColor: "#ffff" }}
              type="text"
              name="link"
              value={link}
              onChange={(event) => setlink(event.target.value)}
              placeholder="Paste your link here..."
            />
            <h4>{data.title}</h4>
            <p>{data.channel}</p>
            <img src={data.thumbnail} alt="" />
            <button id="submitButton" onClick={postData} type="submit">
              DOWNLOAD
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Home;
