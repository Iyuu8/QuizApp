import {motion,AnimatePresence} from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { FaCaretDown,FaCaretLeft,FaCaretRight,FaCaretUp, FaCheck, FaPlus } from 'react-icons/fa';
import { FaXmark } from 'react-icons/fa6';
import { WiDayCloudy } from 'react-icons/wi';

/* cq stands create quiz, nq stands for new quiz and qs stands for quiz slider*/

const QuizControls=({topicStuff,titleStuff,quizTopicStuff,screenSize,modalStuff})=>{
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

    /* for screen resize*/
    const [isMobile,setIsMobile] = screenSize;
    const [openModal,setOpenModal]=modalStuff;

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
            { !isMobile?
                (<input 
                    type='text'
                    placeholder='Quiz Title'
                    className='cq-title'
                    value={title}
                    onChange={(e)=>setTitle(e.target.value)}
                    required
                />)
                :(
                <button 
                    className='cq-change-title-btn'
                    onClick={()=>setOpenModal(!openModal)}
                >Title</button>
                )
            }
        </div>
    )
}

const QuizSlider=({quizSliderStuff,currIndStuff})=>{
    const [quizSlides,setQuizSlides]=quizSliderStuff;
    const [currInd,setCurrInd]=currIndStuff;
    const NewQuiz=()=>{
        return(
            <motion.div 
                className='cq-nq-container center' 
                role='button'
                onClick={()=>setQuizSlides([...quizSlides,{}])}
                initial={{opacity:0}}
                animate={{opacity:1}}
                exit={{opacity:0}}

            >
                <div className='cq-nq-icon center'>
                    <FaPlus/>
                </div>

            </motion.div>
        )
    }

    const QuizSlide=()=>{
        return(
            <motion.div 
                className='cq-nq-slide'
                initial={{opacity:0}}
                animate={{opacity:1}}
                exit={{opacity:0}}

            >
                new quiz

            </motion.div>
        )
    }
    return(
        <div className='cq-qs-container'>
            <button 
                className='cq-qs-next-slide center'
                onClick={()=>setCurrInd(
                    !(!quizSlides.length || currInd>=quizSlides.length)?
                    currInd+1:currInd
                )}
            ><FaCaretRight/></button>
            <button 
                className='cq-qs-prev-slide center'
                onClick={()=>setCurrInd( currInd>0? currInd-1:currInd)}
            ><FaCaretLeft/></button>

            <AnimatePresence mode='wait' initial={false}>

                {(!quizSlides.length || currInd>=quizSlides.length)&&
                    <NewQuiz key='newQuiz'/>
                }            
                {!(!quizSlides.length || currInd>=quizSlides.length) && 
                    <QuizSlide 
                        key={`quizSlide${currInd}`}
                    />
                }
            </AnimatePresence>

            
        </div>
    )
}

/* the modal to change the title ( for mobiles only )*/
const TitleModal=({titleStuff,modalStuff})=>{
    const [title,setTitle]=titleStuff;
    const [openModal,setOpenModal]=modalStuff;
    const handleSubmit=(e)=>{
        e.preventDefault();
        setOpenModal(false);
    }
    return(
        <motion.div 
            className='cq-change-title-modal'
            initial={{top:'-100%',opacity:0}}
            animate={{top:'50%',opacity:1}}
            exit={{top:'-100%',opacity:0}}
            transition={{type:'spring',duration:1}}

        >
            <form 
                action="submit" 
                className='cq-title-form'
                onSubmit={(e)=>handleSubmit(e)}
            >
                <input 
                    type='text'
                    placeholder='Quiz Title'
                    className='cq-title cq-title-mobile'
                    value={title}
                    onChange={(e)=>setTitle(e.target.value)}
                    required
                />
                <button className='cq-submit-title'>Confirm</button>

            </form>
            <button 
                className='cq-modal-exit center'
                onClick={()=>setOpenModal(false)}
            ><FaXmark/></button>
        </motion.div>  
    )
}

const CreateQuiz=({blurStuff})=>{
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

    /*state of the quiz creating area*/
    const [quizSlides,setQuizSlides]=useState([]);
    const [currInd,setCurrInd]=useState(0);

    /* for adjucements on smaller screens the title input is replaced with a modal*/
    const [isMobile,setIsMobile]=useState(false);
    const [openModal,setOpenModal]=useState(false);
    useEffect(()=>{
        const hanldeResize=()=>setIsMobile(window.innerWidth<=670? true:false);
        hanldeResize();
        window.addEventListener('resize',hanldeResize);
        return ()=>window.removeEventListener('resize',hanldeResize);

    },[]) 
    useEffect(()=>{
        setOpenModal(!isMobile? false:openModal)
    },[isMobile])

    /* to set the blur based on the whether the modal is mounted or not*/
    const [isBlur,setIsblur]=blurStuff;
    useEffect(()=>{
        setIsblur(openModal);
    },[openModal])

    return(
        <>
            <header className='cq-header'>
                <h2 className='cq-slide-counter center'>Slides: {nbSlides}</h2>
                <QuizControls 
                    topicStuff={[topic,setTopic]}
                    titleStuff={[title,setTitle]}
                    quizTopicStuff={[quizTopic,setQuizTopic]}
                    screenSize={[isMobile,setIsMobile]}
                    modalStuff={[openModal,setOpenModal]}
                />
            </header>
            <main className='cq-main center'>
                <QuizSlider
                    quizSliderStuff={[quizSlides,setQuizSlides]}
                    currIndStuff={[currInd,setCurrInd]}
                    screenSize={[isMobile,setIsMobile]}
                />

                <AnimatePresence>
                {openModal &&
                    <TitleModal
                        titleStuff={[title,setTitle]}
                        modalStuff={[openModal,setOpenModal]}
                    />
                }
                </AnimatePresence>
            </main>
            
        </>
    )
}


export default CreateQuiz;

/*never give up and always believe in yourself benazizab*/