import Home from "./home";
import HomeBackground from "./home_background";
import Player from './player'
import { useState,useEffect, useRef} from "react";
import {Routes, Route , Link, useLocation, useNavigate} from 'react-router-dom';
import {motion,AnimatePresence} from 'framer-motion';
import QuizMaker from "./QuizMaker";
import NotFound from "./NotFound";
import QuizMakerBackground from "./QuizMakerBackground";
import CreateQuiz from './CreateQuiz';
import FetchError from './FetchError';
import useAxiosFetch from './Hooks/useAxiosFetch';

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

const QuizMakerPage=({blurStuff})=>{
  const [isBlur,setIsblur]=blurStuff;
  return(
    <motion.div
      initial={{opacity:0}}
      animate={{opacity:1}}
      exit={{opacity:0}}
      transition={{ease:'easeOut'}}
      className="quiz-page"
    >
      <QuizMakerBackground/>
      <QuizMaker blurStuff={[isBlur,setIsblur]}/>
    </motion.div>
  )
}

const CreateQuizPage=({blurStuff,quizesStuff})=>{
  return(
    <motion.div
      initial={{opacity:0}}
      animate={{opacity:1}}
      exit={{opacity:0}}
      transition={{ease:'easeOut'}}
      className="create-quiz-page"
    >
      <CreateQuiz blurStuff={blurStuff} quizesStuff={quizesStuff}/>
    </motion.div>
  )
}

const Blur=()=>{
  return(
    <motion.div
      className="blur-overlay-modal"
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
  const navigate = useNavigate();

  /* the api request to get the quizes*/
  const {data,error,loading}=useAxiosFetch('quizes');
  const [quizes,setQuizes]=useState([]);
  useEffect(()=>{
    if(!error && !loading) setQuizes(data);
    if(error) navigate('/FetchError')
  },[data])
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
        <Route path="/QuizMaker" element={<QuizMakerPage blurStuff={[isBlur,setIsblur]}/>}/>
        <Route path="/CreateQuiz/:id" element={<CreateQuizPage blurStuff={[isBlur,setIsblur]} quizesStuff={[quizes,setQuizes]}/>}/>
        <Route path="/FetchError" element={<FetchError/>}/>
        <Route path="/*" element={<NotFound/>} />
        
      </Routes>
      </AnimatePresence>
      
    </div>
  );
}

export default App;
