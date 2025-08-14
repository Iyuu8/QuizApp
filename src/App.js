import Home from "./home";
import HomeBackground from "./home_background";
import Player from './player'
import { useState,useEffect } from "react";


function App() {
  const [page,setPage] = useState("home");
  return (
    <div className="App center">
      {page==="home" && <section className="home center">
        <div className="blur-overlay"></div>
        <HomeBackground/>
        <Home
        pageStuff={[page,setPage]}/> 
      </section>}  {/*  main page */}
      {page==='player' && <section className="player">
        <Player/>
      </section>}
      
    </div>
  );
}

export default App;
