import{useState,useEffect,useRef} from 'react';
import { useParams } from 'react-router-dom';

const QuizInfo=({title,slides,topic})=>{
    const [currSlide,setCurrSlide]=useState(0);
    return(
        <>
            <div className='solve-slide-link'>
                <ul className='solve-slide-link-list'>
                    {
                        slides.map((slide,ind)=>(
                        [currSlide-2,currSlide,currSlide,currSlide,currSlide+1].includes(ind)?
                            (<li 
                                key={`slide:${ind}`}
                                className='solve-slide-link-item'
                            >
                                {ind+1}
                            </li>):(null)
                        ))
                    }

                </ul>
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
    const [slides,setSlides]=useState([]);
    const slidesRef=useRef([]);

    useEffect(()=>{
        quizRef.current = quizes.find(quiz=> quiz.quizPath===id.slice(id.indexOf(":")+1));
        if(quizRef.current){
            slidesRef.current = [...quizRef.current.slides];
            setTitle(quizRef.current.title);
            setTopic(quizRef.current.topic);
            setSlides(slidesRef.current);
        }

    },[quizes])

    return (
        <header className='solve-header'>
            <QuizInfo
                title={title}
                topic={topic}
                slides={slides}
            />
        </header>
    )
}

export default Solve;