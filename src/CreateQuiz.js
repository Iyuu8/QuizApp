import {motion,AnimatePresence} from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { FaCaretDown,FaCaretLeft,FaCaretRight,FaCaretUp, FaCheck, FaPlus } from 'react-icons/fa';
import { FaXmark } from 'react-icons/fa6';
import { useNavigate, useParams } from 'react-router-dom';


/* cq stands create quiz, nq stands for new quiz and qs stands for quiz slider*/

const QuizControls=({topicStuff,titleStuff,quizTopicStuff,screenSize,modalStuff,counterStuff,currIndStuff})=>{
    /* to decide the number of choices for each question*/
    const [counter,setCounter]=counterStuff;
    const [currInd,setCurrInd]=currIndStuff
    
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
                <h2>choices: {(counter.length!==0 && currInd<counter.length)? counter[currInd]:0}</h2>
                <div className='cq-counter-contols'>
                    <div 
                        role='button' 
                        className='cq-counter-up'
                        onClick={()=>setCounter(
                            counter.map((item,ind)=>(
                                (ind===currInd && item<5)?
                                item+1:item
                            )
                        ))}
                    ><FaCaretUp/></div>
                    <div 
                        role='button' 
                        className='cq-counter-down'
                        onClick={()=>setCounter(
                            counter.map((item,ind)=>(
                                (ind===currInd && item>0)?
                                item-1:item
                            )
                        ))}
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

const QuizSlider=({quizSlidesRef,currIndStuff,nbSlidesStuff,counterStuff,quizStuff})=>{
    // the array of quizes
    const [quizes,setQuizes]=quizStuff;

    const [nbSlides,setNbSlides]=nbSlidesStuff; // the number of slides in the quiz
    const quizSlides=quizSlidesRef; // the array that stores the questions
    const [currInd,setCurrInd]=currIndStuff; // the index of the current displayed slide
    const [counter,setCounter]=counterStuff; // the counter for choices ( answers )
    
    const handleNewSlide=()=>{
        setNbSlides(nbSlides+1);
        setCounter([...counter,0]);
        quizSlides.current.push({question:'',choices:[]});
        
    }
    
    
    
    
    const NewSlide=()=>{
        return(
            <motion.div 
                className='cq-nq-container center' 
                role='button'
                onClick={handleNewSlide}
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

    const QuizSlide=({currInd,counter})=>{
        const [question,setQuestion]=useState(quizSlides.current[currInd].question);
        const timeRef=useRef(null);
        const choiceTimeRef=useRef(null);

        /* for the choices */
        
        const choicesLen = quizSlides.current[currInd].choices.length;
        if(choicesLen<counter[currInd]) quizSlides.current[currInd].choices.push('');
        else if(choicesLen>counter[currInd]) quizSlides.current[currInd].choices.pop();
        const [choicesArr,setChoicesArr]=useState(quizSlides.current[currInd].choices);

        const handleChoice=(e,ind)=>{
            setChoicesArr(choicesArr.map((choice,i)=>(
                i===ind? e.target.value:choice
            )))
            if(choiceTimeRef.current) clearTimeout(choiceTimeRef.current);

            choiceTimeRef.current=setTimeout(()=>{
                quizSlides.current[currInd].choices[ind]=e.target.value;
                choiceTimeRef.current=null;
            },200)
        }

        
        const handleQuestion=(e)=>{
            setQuestion(e.target.value);
            if(timeRef.current) clearTimeout(timeRef.current);

            timeRef.current=setTimeout(()=>{
                quizSlides.current[currInd].question=e.target.value;
                timeRef.current=null;
            },200)
        }
        
        return(
            <motion.div 
                className='cq-nq-slide'
                initial={{opacity:0}}
                animate={{opacity:1}}
                exit={{opacity:0}}

            >
                <div className='cq-nq-slide-question'>
                    <textarea
                        type="text"
                        className='cq-nq-slide-question-input'
                        onChange={(e)=>handleQuestion(e)}
                        value={question}
                        required
                    />
                    <div className='cq-nq-slide-choices-container'>
                        <ul className='cq-nq-slide-choices-list'>
                            {choicesArr.map((item,ind)=>(
                                <li className='cq-nq-choice' key={`choiceNb${ind}`}>
                                    <input type='text'
                                        className='cq-nq-choice-input'
                                        value={item}
                                        onChange={(e)=>handleChoice(e,ind)}
                                    />
                                </li>
                            ))

                            }
                        </ul>
                    </div>
                </div>
                {currInd===quizSlides.current.length-1 &&
                    <button className='cq-nq-finish-quiz'>
                        Save Quiz
                    </button>
                }

                {currInd}

            </motion.div>
        )
    }
    return(
        <div className='cq-qs-container'>
            <button 
                className='cq-qs-next-slide center'
                onClick={()=>{
                    setCurrInd(
                        !(!quizSlides.current.length || currInd>=quizSlides.current.length)?
                        currInd+1:currInd
                    );
                }}
            ><FaCaretRight/></button>
            <button 
                className='cq-qs-prev-slide center'
                onClick={()=>setCurrInd( currInd>0? currInd-1:currInd)}
            ><FaCaretLeft/></button>

            <AnimatePresence mode='wait' initial={false}>

                {(!quizSlides.current.length || currInd>=quizSlides.current.length)&&
                    <NewSlide key='newSlide'/>
                }            
                {!(!quizSlides.current.length || currInd>=quizSlides.current.length) && 
                    <QuizSlide 
                        key={`quizSlide${currInd}`}
                        currInd={currInd}
                        counter={counter}
                    />
                }
            </AnimatePresence>

            
        </div>
    )
}

/* the modal to change the title ( for mobiles only )*/
export const TitleModal=({titleStuff,modalStuff,link})=>{
    const [title,setTitle]=titleStuff;
    const [openModal,setOpenModal]=modalStuff;
    const navigate=useNavigate();
    const handleSubmit=(e,link=null)=>{
        e.preventDefault();
        setOpenModal(false);
        const x=Date();
        if (link) navigate(`${link}/${title}:${x}`);
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
                onSubmit={(e)=>handleSubmit(e,link)}
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

const CreateQuiz=({blurStuff,quizStuff})=>{

    /* the array of quizes*/
    const [quizes,setQuizes]=quizStuff;

    const [nbSlides,setNbSlides]=useState(0);
    const [counter,setCounter]=useState([]); // the number of slides for each question in the quiz
    const [topic,setTopic]=useState([
        {topic:'MATH',checked:true},
        {topic:'SCIENCE',checked:false},
        {topic:'PHYSICS',checked:false},
        {topic:'CHEMISTRY',checked:false},
        {topic:'HISTORY',checked:false}
    ]);

    /*we get th title from the*/
    const {id}=useParams();
    const [title,setTitle]=useState(id.split(':')[0]);
    const [quizTopic,setQuizTopic]=useState('MATH');

    /*state of the quiz creating area ( slides = questions )*/
    const quizSlides = useRef([]);
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
                    counterStuff={[counter,setCounter]}
                    currIndStuff={[currInd,setCurrInd]}

                />
            </header>
            <main className='cq-main center'>
                <QuizSlider
                    quizSlidesRef={quizSlides}
                    currIndStuff={[currInd,setCurrInd]}
                    screenSize={[isMobile,setIsMobile]}
                    counterStuff={[counter,setCounter]}
                    nbSlidesStuff={[nbSlides,setNbSlides]}
                    quizStuff={[quizes,setQuizes]}
                />

                <AnimatePresence>
                {openModal &&
                    <TitleModal
                        titleStuff={[title,setTitle]}
                        modalStuff={[openModal,setOpenModal]}
                        counter={counter}
                    />
                }
                </AnimatePresence>
            </main>
            
        </>
    )
}


export default CreateQuiz;

/*never give up and always believe in yourself benazizab*/