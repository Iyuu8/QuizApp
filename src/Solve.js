import{useState,useEffect,useRef, createContext, useContext} from 'react';
import { useParams } from 'react-router-dom';
import {motion,AnimatePresence} from 'framer-motion';
import { FaCheck, FaCaretLeft, FaCaretRight, FaTrash } from 'react-icons/fa';
import { FaXmark } from 'react-icons/fa6';

const SolveContext=createContext();

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

const SolveSlider=({slidesStuff})=>{
  const {solSlidesStuff,currSlideStuff}=useContext(SolveContext);
  const [solSlides,setSolSlides]=solSlidesStuff;
  const [currSlide,setCurrSlide]=currSlideStuff;
  const [slides,setSlides]=slidesStuff;

  const handleFinishQuiz=()=>{
    return;
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

const Solve=({quizesStuff})=>{
    const {id} = useParams();
    const [quizes,setQuizes] = quizesStuff;
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
            solSlidesStuff:[solSlides,setSolSlides]
          }}
        >
        <header className='solve-header'>
            <QuizInfo/>
        </header>
        <main className='cq-main center'>
          <SolveSlider slidesStuff={[slides,setSlides]}/>

        </main>
        </SolveContext.Provider>
    )
}

export default Solve;