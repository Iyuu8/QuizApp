import{useState,useEffect,useRef} from 'react';
import { useParams } from 'react-router-dom';

const Pagination=({indStuff,pages})=>{
  const [currInd,setCurrInd] = indStuff;
  let start = Math.max(0,currInd-2);
  let end = Math.min(currInd+3,pages.length);
  const r=2-currInd;
  const c=currInd+3-end;
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
      {end<= pages.length -1&&
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

const QuizInfo=({title,slides,topic,currSlideStuff})=>{
    const [currSlide,setCurrSlide]=currSlideStuff;
    
    return(
        <>
            <Pagination 
                indStuff={currSlideStuff}
                pages={slides}
            />
            <div className='solve-quiz-info'>
                <h2 className='solve-quiz-info-NbQuestions'>Questions: {slides.length}</h2>
                <h2 className='solve-quiz-info-topic center'>{topic}</h2>
                <h2 className='solve-quiz-info-title'>"{title}"</h2>

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
        <header className='solve-header'>
            <QuizInfo
                title={title}
                topic={topic}
                slides={slidesRef.current}
                currSlideStuff={[currSlide,setCurrSlide]}
            />
        </header>
    )
}

export default Solve;