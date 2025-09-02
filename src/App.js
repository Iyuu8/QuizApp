import Home from "./home";
import HomeBackground from "./home_background";
import Player from './player'
import { useState,useEffect} from "react";
import {Routes, Route , Link, useLocation} from 'react-router-dom';
import {motion,AnimatePresence} from 'framer-motion';
import QuizMaker from "./QuizMaker";
import NotFound from "./NotFound";
import QuizMakerBackground from "./QuizMakerBackground";
import CreateQuiz from './CreateQuiz';

const HomePage = ()=>{
  return(
    <motion.section
      className="home center"
      initial={{opacity:0}}
      animate={{opacity:1}}
      exit={{opacity:0}}
      transition={{ease:'easeOut'}}
    >
      <div className="blur-overlay"></div>
      <HomeBackground/>
      <Home/> 
    </motion.section>
  )
}

const QuizMakerPage=()=>{
  return(
    <motion.div
      initial={{opacity:0}}
      animate={{opacity:1}}
      exit={{opacity:0}}
      transition={{ease:'easeOut'}}
      className="quiz-page"
    >
      <QuizMakerBackground/>
      <QuizMaker/>
    </motion.div>
  )
}

const CreateQuizPage=({blurStuff})=>{
  return(
    <motion.div
      initial={{opacity:0}}
      animate={{opacity:1}}
      exit={{opacity:0}}
      transition={{ease:'easeOut'}}
      className="create-quiz-page"
    >
      <CreateQuiz blurStuff={blurStuff}/>
    </motion.div>
  )
}

const Blur=()=>{
  return(
    <motion.div
      className="blur-overlay"
      initial={{opacity:0}}
      animate={{opacity:1}}
      exit={{opacity:0}}
    >
    </motion.div>
  )
}


function App() {
  const location = useLocation();
  const [isBlur,setIsblur]=useState(false);
  return (
    <div className="App">
      {/*multipuropse blur overlay*/}
      <AnimatePresence>
        {isBlur &&
          <Blur/>
        }
      </AnimatePresence>

      {/* the pages of the website*/}
      <AnimatePresence exitBeforeEnter mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />}/>
        <Route path="player" element={<Player/>}/>
        <Route path="/QuizMaker" element={<QuizMakerPage/>}/>
        <Route path="/CreateQuiz" element={<CreateQuizPage blurStuff={[isBlur,setIsblur]}/>}/>
        <Route path="/*" element={<NotFound/>} />
        
      </Routes>
      </AnimatePresence>
      
    </div>
  );
}

export default App;
