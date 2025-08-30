import {motion,AnimatePresence} from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { FaCaretDown,FaCaretUp, FaCheck } from 'react-icons/fa';


const QuizControls=({topicStuff,titleStuff,quizTopicStuff})=>{
    const [counter,setCounter]=useState(0);
    const [openDrop,setOpenDrop]=useState(false);

    const [topic,setTopic]=topicStuff;
    const [title,setTitle]=titleStuff;
    const [quizTopic,setQuizTopic]=quizTopicStuff;

    /*for the dropdown menu that contains the chosen topic for the quiz*/
    const dropdownRef=useRef();
    const dropdownBtnRef=useRef();

    const handleSelectTopic=(selectedTopic)=>{
        setTopic(topic.map((item)=>(
            item.topic===selectedTopic?
            {...item,checked:true}:
            {...item,checked:false}
        )))
        setQuizTopic(selectedTopic);
    }

    useEffect(()=>{
        const closeDrop=(e)=>{
            if(
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target) &&
                !dropdownBtnRef.current.contains(e.target)
            ) setOpenDrop(false);
        }
        document.addEventListener('click',closeDrop);
        return ()=>document.removeEventListener('click',closeDrop);
    },[])

    return(
        <div className='cq-controls'>
            <div className='dropdown-container center'>
                <button 
                    className='cq-topic'
                    onClick={()=>setOpenDrop(!openDrop)}
                    ref={dropdownBtnRef}
                >
                    <h2>Topic</h2>
                    <div className='cq-topic-icon center'><FaCaretDown/></div>
                </button>
                <AnimatePresence>
                {openDrop&&
                    <motion.div 
                        className='cq-dropdown-topic'
                        style={{'--nb-items':topic.length}}
                        initial={{opacity:0,y:-2,height:'2rem'}}
                        animate={{opacity:1,y:0,height:topic.length*2+'rem'}}
                        exit={{opacity:0,y:-2,height:'4rem'}}
                        ref={dropdownRef}
                    >
                        <ul className='cq-dropdown-list'>
                            {topic.map((item)=>(
                                <li 
                                    className='cq-dropdown-item'
                                    onClick={()=>handleSelectTopic(item.topic)}
                                    key={item.topic}
                                >
                                    <h2>{item.topic}</h2>
                                    {
                                        item.checked && 
                                        <div className='cq-dropdown-item-icon center'><FaCheck/></div>
                                    }
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                }
                </AnimatePresence>

            </div>
            <div className='cq-counter'>
                <h2>choices: {counter}</h2>
                <div className='cq-counter-contols'>
                    <div 
                        role='button' 
                        className='cq-counter-up'
                        onClick={()=>setCounter(counter<5? counter+1:counter)}
                    ><FaCaretUp/></div>
                    <div 
                        role='button' 
                        className='cq-counter-down'
                        onClick={()=>setCounter(counter>0? counter-1:counter)}
                    ><FaCaretDown/></div>

                </div>
            </div>
            <input 
                type='text'
                placeholder='Quiz Title'
                className='cq-title'
                value={title}
                onChange={(e)=>setTitle(e.target.value)}
                required
            />

        </div>
    )
}

const CreateQuiz=()=>{
    const [nbSlides,setNbSlides]=useState(0);
    const [topic,setTopic]=useState([
        {topic:'MATH',checked:true},
        {topic:'SCIENCE',checked:false},
        {topic:'PHYSICS',checked:false},
        {topic:'CHEMISTRY',checked:false},
        {topic:'HISTORY',checked:false}
    ]);
    const [title,setTitle]=useState('');
    const [quizTopic,setQuizTopic]=useState('MATH');
    return(
        <>
            <header className='cq-header'>
                <h2 className='cq-slide-counter center'>Slides: {nbSlides}</h2>
                <QuizControls 
                    topicStuff={[topic,setTopic]}
                    titleStuff={[title,setTitle]}
                    quizTopicStuff={[quizTopic,setQuizTopic]}
                />
            </header>
            
        </>
    )
}


export default CreateQuiz;