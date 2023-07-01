import Loading from "../Loading/Loading";
import "./Home.css";
import React, { useState } from "react";
function Home() {
  const [link, setlink] = useState("");
  const [data, setdata] = useState("");
  const [loading, setloading] = useState(false);
  console.log(data);
  const postData = async (e) => {
    e.preventDefault();
    setloading(true);
    fetch("/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ link }),
    }).then((response) => {
      response.json().then((data) => {
        setdata(data);
        setloading(false);
      });
    });
  };

  function download(){
    fetch('api/download', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ link }),
    })
  }

  return (
    <div className="Main">
      <div className="container">
        <h2>YOUTUBE VIDEO DOWNLOADER</h2>
        <form method="POST" onSubmit={postData}>
          <div className="input-group">
            <input
              style={{ backgroundColor: "#ffff" }}
              type="text"
              name="link"
              value={link}
              onChange={(event) => setlink(event.target.value)}
              placeholder="Paste your link here..."
            />
            {loading ? (
              <Loading />
            ) : (
              <div>
                <h4>{data.title}</h4>
                <p>{data.channel}</p>
                <img src={data.thumbnail} alt="" />
              </div>
            )}

            <button id="submitButton" onClick={download}  type="submit">
              DOWNLOAD
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Home;
