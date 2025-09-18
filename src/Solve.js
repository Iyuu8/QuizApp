import{useState,useEffect,useRef, createContext, useContext} from 'react';
import { useParams } from 'react-router-dom';

const SolveContext=createContext();

const Pagination=()=>{
  const {isMobile,currSlideStuff,slidesRef}=useContext(SolveContext);
  const pages = slidesRef.current;
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
    const {title,slidesRef,topic,currSlideStuff}=useContext(SolveContext);
    
    return(
        <>
            <Pagination 
                indStuff={currSlideStuff}
                pages={slidesRef.current}
            />
            <div className='solve-quiz-info'>
                <h2 className='solve-quiz-info-NbQuestions center'>Questions: {slidesRef.current.length}</h2>
                <h2 className='solve-quiz-info-topic center'>{topic}</h2>
                <h2 className='solve-quiz-info-title center'>{title}</h2>

            </div>
        </>
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
    const slidesRef=useRef([]);

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
            slidesRef.current = [...quizRef.current.slides];
            setTitle(quizRef.current.title);
            setTopic(quizRef.current.topic);
            setSolSlides(slidesRef.current);
        }

    },[quizes])

    const [currSlide,setCurrSlide]=useState(0);

    return (
        <SolveContext.Provider 
          value={{isMobile,title,topic,slidesRef,currSlideStuff:[currSlide,setCurrSlide]}}
        >
        <header className='solve-header'>
            <QuizInfo
                /* title={title}
                topic={topic}
                slides={slidesRef.current}
                currSlideStuff={[currSlide,setCurrSlide]} */
            />
        </header>
        </SolveContext.Provider>
    )
}

export default Solve;