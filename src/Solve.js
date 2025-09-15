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
        return(
          <button 
            key={page}
            onClick={()=> setCurrInd(actualInd)}
          >{actualInd+1}</button>
        )
      })}
      {end< pages.length -1&&
        <>
          <button>...</button>
          <button onClick={()=>setCurrInd(pages.length-1)}>last</button>
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