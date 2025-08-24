import Home from "./home";
import HomeBackground from "./home_background";
import Player from './player'
import { useState,useEffect} from "react";
import {Routes, Route , Link, useLocation} from 'react-router-dom';
import {motion,AnimatePresence} from 'framer-motion';
import QuizMaker from "./QuizMaker";
import NotFound from "./NotFound";

const HomePage = ()=>{
  return(
    <motion.section
      className="home center"
      initial={{x:'-100%'}}
      animate={{x:'0%'}}
      exit={{x:'-100%'}}
    >
      <div className="blur-overlay"></div>
      <HomeBackground/>
      <Home/> 
    </motion.section>
  )
}


function App() {
  const location = useLocation();
  return (
    <div className="App center">

      <AnimatePresence exitBeforeEnter mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />}/>
        <Route path="player" element={<Player/>}/>
        <Route path="/QuizMaker" element={<QuizMaker/>}/>
        <Route path="/*" element={<NotFound/>} />
      </Routes>
      </AnimatePresence>
      
    </div>
  );
}

export default App;
