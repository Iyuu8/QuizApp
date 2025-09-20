import{useState,useEffect,useRef, createContext, useContext} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {motion,AnimatePresence} from 'framer-motion';
import { FaCheck, FaCaretLeft, FaCaretRight, FaTrash } from 'react-icons/fa';
import { FaXmark } from 'react-icons/fa6';

const SolveContext=createContext();

const ScoreModal=({score,nbQuestions,scoreModalStuff,blurStuff})=>{
  const [openScore,setOpenScore]=scoreModalStuff;
  const [isBlur,setIsblur]=blurStuff;
  const navigate=useNavigate();
  const ConfirmOp=()=>{
    setOpenScore(false);
    setIsblur(false);
    navigate('/Player')
  }
  return(
    <motion.div 
      className='solve-score-modal'
      initial={{top:'-100%'}}
      animate={{top:'45%'}}
      exit={{top:'-100%'}}
      transition={{type:'spring'}}
    >
      <div className='solve-results center'>
        <h2> Your Score is: </h2>
        <h2>{score}/{nbQuestions}</h2>

      </div>
      <button 
        className='solve-score-confrim'
        onClick={ConfirmOp}
      >
        Confirm
      </button>

    </motion.div>
  )
}

const Pagination=()=>{
  const {isMobile,currSlideStuff,slidesStuff}=useContext(SolveContext);
  const [slides,setSlides]=slidesStuff;
  const pages = slides;
  const [currInd,setCurrInd] = currSlideStuff;

  let start = Math.max(0,isMobile? currInd-1:currInd-2);
  let end = Math.min(isMobile? currInd+2:currInd+3,pages.length);
  const r=isMobile? 1-currInd:2-currInd;
  const c=isMobile? currInd+2-end:currInd+2-end+3;
  if(r>0) end = Math.min(pages.length,end+r);
  if(c>0) start = Math.max(0,start-c);
  return (
    <div className='pagination'>
      {pages.slice(start,end).map((page,ind)=>{
        const actualInd = start+ind;
        const bkg = actualInd===currInd? "var(--pagination-bkg-primary)":"var(--pagination-bkg-inherit)";
        return(
          <button 
            style={{backgroundColor:bkg}}
            key={page.question}
            onClick={()=> setCurrInd(actualInd)}
            className='center'
          >{actualInd+1}</button>
        )
      })}
      {end<= pages.length -1&&!isMobile&&
        <>
          <button className='pagination-dots'>...</button>
          <button 
            onClick={()=>setCurrInd(pages.length-1)}
            style={{backgroundColor:"var(--pagination-bkg-inherit)"}}
          >last</button>
        </>
      }
    </div>
  )
}

const QuizInfo=()=>{
    const {title,slidesStuff,topic,currSlideStuff}=useContext(SolveContext);
    const [slides,setSlides]=slidesStuff;
    
    return(
        <>
            <Pagination />
            <div className='solve-quiz-info'>
                <h2 className='solve-quiz-info-NbQuestions center'>Questions: {slides.length}</h2>
                <h2 className='solve-quiz-info-topic center'>{topic}</h2>
                <h2 className='solve-quiz-info-title center'>{title}</h2>

            </div>
        </>
    )
}

const SolveSlider=()=>{
  const {solSlidesStuff,currSlideStuff,scoreStuff,slidesStuff,scoreModalStuff,blurStuff}=useContext(SolveContext);
  const [solSlides,setSolSlides]=solSlidesStuff;
  const [currSlide,setCurrSlide]=currSlideStuff;
  const [slides,setSlides]=slidesStuff;
  const [score,setScore]=scoreStuff;
  const [openScore,setOpenScore]=scoreModalStuff;
  const [isBlur,setIsblur]=blurStuff;

  const handleFinishQuiz=()=>{
    let c=0;
    for(let i=0; i<slides.length;i++){
      const choices=slides[i].choices;
      console.log(choices);
      const solChoices=solSlides[i].choices;
      for(let i=0; i<choices.length; i++){
        if(choices[i].correct) {
          c=(choices[i].choice === solChoices[i].choice && solChoices[i].correct)? c+1:c;
        }
      }      
    }
    setScore(c);
    setIsblur(true);
    setOpenScore(true);
  }

  const SolveSlide=()=>{
    const handleChoice=(currSlide,ind)=>{
      setSolSlides(solSlides.map((slide,j)=>(
        currSlide===j?
          {...slide,choices:slide.choices.map((item,i)=>(
            ind===i? {...item,correct:true}:{...item,correct:false}
          ))
        }:slide
      )))
    }
    return(
    <motion.div 
      className='cq-nq-slide center solve-slide'
      initial={false}
      animate={{opacity:1}}
      exit={{opacity:0}}
      transition={{duration:0.3}}

    >
      
      <div className='cq-nq-slide-question'>
        <div className='cq-nq-slide-question-input-container center'>
          <h2 className="cq-nq-slide-ind center">{currSlide+1}</h2>
          <h2 className='cq-nq-slide-question-input'> 
            {solSlides[currSlide] && solSlides[currSlide].question}
          </h2>
        </div>
        <div className='cq-nq-slide-choices-container'>
          {solSlides[currSlide] && 
            <ul 
              className='cq-nq-slide-choices-list' 
              style={{'--nb-items':solSlides[currSlide].choices.length}}
            >
              {solSlides[currSlide].choices.map((item,ind)=>(
                  <li className='cq-nq-choice center' key={`choiceNb${ind}`}>
                    <h2 className='cq-nq-choice-input solve-choice'
                    > {item.choice}</h2>
                    <button 
                      className='cq-nq-value-choice center'
                      onClick={()=>handleChoice(currSlide,ind)}
                    >
                      {item.correct? <FaCheck/>:<FaXmark/>}
                    </button>
                        
                  </li>
              ))}
            </ul>
          }
        </div>
      </div>
      {currSlide===solSlides.length-1 &&
        <div className='cq-nq-save-delete-container center'>
          <button 
            className='cq-nq-finish-quiz'
            onClick={()=>handleFinishQuiz()}
          >
            Finish Quiz
          </button>
        </div>
    }
</motion.div>
    )
  }
  return(
    <div className='cq-qs-container'>
      <button 
        className='cq-qs-next-slide center'
        onClick={()=>setCurrSlide(currSlide<slides.length-1?currSlide+1:currSlide)}
      ><FaCaretRight/></button>

      <button 
        className='cq-qs-prev-slide center'
        onClick={()=>setCurrSlide( currSlide>0? currSlide-1:currSlide)}
      ><FaCaretLeft/></button>

      <AnimatePresence mode='wait' initial={false}>         
        <SolveSlide key={`quizSlide${currSlide}`}/>
      </AnimatePresence>
    
                
    </div>
  )
}

const Solve=({quizesStuff,blurStuff})=>{
  const {id} = useParams();
  const [quizes,setQuizes]=quizesStuff;
  const [isBlur,setIsblur]=blurStuff;
  const quizRef = useRef();

  // quiz info 
  const [title,setTitle]=useState('');
  const [topic,setTopic]=useState('MATH');
  const [solSlides,setSolSlides]=useState([]);
  const [slides,setSlides]=useState([]);
  const [currSlide,setCurrSlide]=useState(0);

  // to adjust based on screen size
  const [isMobile,setIsMobile]=useState(false);
  useEffect(()=>{
    const handleResize=()=>setIsMobile(window.innerWidth<=715);
    window.addEventListener("resize",handleResize);
    handleResize();
    return ()=> window.removeEventListener("resize",handleResize);
  },[])

  // to manage the state of the score modal
  const [openScore,setOpenScore]=useState(false);
  const [score,setScore]=useState(0);

  useEffect(()=>{
    quizRef.current = quizes.find(quiz=> quiz.quizPath===id.slice(id.indexOf(":")+1));
    if(quizRef.current){
      setSlides([...quizRef.current.slides]);
      setTitle(quizRef.current.title);
      setTopic(quizRef.current.topic);
      setSolSlides(quizRef.current.slides.map((item)=>(
        {...item,choices:item.choices.map((choice)=>(
          {...choice,correct:false}
        ))}
      )));
      setCurrSlide(0);
    }

  },[quizes])


    console.log(solSlides);

  return (
    <SolveContext.Provider 
      value={{
        isMobile,title,topic,
        slidesStuff:[slides,setSlides],
        currSlideStuff:[currSlide,setCurrSlide],
        solSlidesStuff:[solSlides,setSolSlides],
        scoreStuff:[score,setScore],
        scoreModalStuff:[openScore,setOpenScore],
        blurStuff:[isBlur,setIsblur]
      }}
    >
    <header className='solve-header'>
        <QuizInfo/>
    </header>
    <main className='cq-main center solve-main'>
      <SolveSlider slidesStuff={[slides,setSlides]}/>
      <AnimatePresence mode='wait'>
      {openScore &&
        <ScoreModal
          score={score}
          nbQuestions={slides.length}
          scoreModalStuff={[openScore,setOpenScore]}
          blurStuff={[isBlur,setIsblur]}
        />
      }
      </AnimatePresence>

    </main>
    </SolveContext.Provider>
  )
}

export default Solve;