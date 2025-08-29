import {motion,AnimatePresence} from 'framer-motion';
import { useState, useEffect, Children } from 'react';
import { FaCaretDown,FaCaretUp } from 'react-icons/fa';

const CreateQuizControls=({slidesStuff,choiceStuff,titleStuff})=>{
    const [nbSlides,setNbSlides]=slidesStuff;
    const [nbChoice,setNbChoice]=choiceStuff;
    const [title,setTitle]=titleStuff;
    const Counter=({children,value})=>{
        return(
            <div className='cq-counter'>
                <h2>{children}{value}</h2>
                <button 
                    className='cq-counter-up'
                    onClick={()=>setNbChoice(nbChoice<5? nbChoice+1:nbChoice)}
                ><FaCaretUp/></button>
                <button 
                    className='cq-counter-down'
                    onClick={()=>setNbChoice(nbChoice>0? nbChoice-1:nbChoice)}
                ><FaCaretDown/></button>
            </div>
        )
    }
    return(
        <>
        <h2>Slides:{nbSlides}</h2>
        <div className='cq-controls'>
            <button className='cq-topic'>
                <h2>Topic</h2>
                <div className='cq-topic-btn-icon'>
                    <FaCaretDown/>
                </div>
            </button>
            <Counter value={nbChoice}>choices: </Counter>
            <input 
                type="text"
                className='cq-title'
                value={title}
                onChange={(e)=>setTitle(e.target.value)}
                placeholder='Quiz Title'
            />
        </div>

        </>
    )
}

const CreateQuiz=()=>{
    const [created,setCreated] = useState(false);
    const [thereIsTitle,setThereIsTitle] = useState(false);
    const [costomize,setCostomize] = useState(false);
    const [nbSlides,setNbSlides]=useState(0);
    const [nbChoice,setNbChoice]=useState(0);
    const [title,setTitle]=useState('');
    return(
        <>
            <header className="cq-header">
                <CreateQuizControls
                    slidesStuff={[nbSlides,setNbSlides]}
                    choiceStuff={[nbChoice,setNbChoice]}
                    titleStuff={[title,setTitle]}
                />
            </header>
            <main className="cq-main">
            {created && <></>}
            {thereIsTitle&& <></>}
            {costomize && <></>}


            </main>
        </>
    )
}

export default CreateQuiz;