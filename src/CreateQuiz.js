import {motion,AnimatePresence, color} from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { FaCaretDown,FaCaretLeft,FaCaretRight,FaCaretUp, FaCheck, FaPlus, FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import { FaXmark } from 'react-icons/fa6';
import { useNavigate, useParams } from 'react-router-dom';
import api from './api/QuizAxios';
import { type } from '@testing-library/user-event/dist/type';
import useConfirmDialog from './Hooks/useConfirmDialog'


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
                <h2>choices: {(counter.length!==0 && currInd<counter.length)? counter[currInd]:1}</h2>
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
                                (ind===currInd && item>1)?
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
                    onChange={(e)=>setTitle(e.target.value.length<=15? e.target.value:e.target.value.slice(0,e.target.value.length-1))}
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

const QuizSlider=({quizSlidesRef,currIndStuff,nbSlidesStuff,counterStuff,quizesStuff,isCheckedRef,quizTopicStuff,titleStuff,openToastStuff,path,modeStuff,quizRef,confirmBoxStuff})=>{
    const navigate=useNavigate();
    const [mode,setMode]=modeStuff;
    const [quizes,setQuizes]=quizesStuff; // the array of quizes
    
    const [nbSlides,setNbSlides]=nbSlidesStuff; // the number of slides in the quiz
    const quizSlides=quizSlidesRef; // the array that stores the questions
    const [currInd,setCurrInd]=currIndStuff; // the index of the current displayed slide
    const [counter,setCounter]=counterStuff; // the counter for choices ( answers )
    const [quizTopic,setQuizTopic]=quizTopicStuff; // the topic of the quiz
    const [quizTitle,setQuizTitle]=titleStuff; // the title of the quiz
    const [openToast,setOpenToast]=openToastStuff; // the toast box state
    const {confirmBoxObj,setConfirmBoxObj,confirmDialog}=confirmBoxStuff; // the confirm box state

    
    /* functions for handling slides and quiz submission */
    const handleNewSlide=()=>{
        setNbSlides(nbSlides+1);
        setCounter([...counter,1]);
        quizSlides.current.push({question:'',choices:[]});
        isCheckedRef.current.push(0);
        
    }

    const validateSaveQuiz=()=>{
        for(let ind=0; ind<quizSlides.current.length; ind++){
            const slide = quizSlides.current[ind];
            if(!slide.question || slide.choices.length<2){
                setOpenToast({
                    state:true,
                    message:`Please fill the question and add at least 2 choices: slide ${ind+1}`,
                    color:'var(--exit)',
                    icon:<FaExclamationTriangle/>,
                    duration:4
                });
                return false;
            }
            for(let cInd=0; cInd<slide.choices.length; cInd++){
                if(!slide.choices[cInd].choice){
                    setOpenToast({
                        state:true,
                        message:`Please fill all the choices: slide ${ind+1}`,
                        color:'var(--exit)',
                        icon:<FaExclamationTriangle/>,
                        duration:4
                    });
                    return false;
                }
            }
        }
        return true;
    }

    const handleSaveQuiz= async (mode)=> { // change the alert with some warning notifications
        if(validateSaveQuiz()){
            try{
                if(mode==='create'){
                    const response=await api.post('/quizes',{
                        title: quizTitle,
                        slides: quizSlides.current,
                        topic: quizTopic,
                        quizPath:path.slice(path.indexOf(":")+1)
                    });
                    setQuizes([...quizes,response.data]);

                }else{
                    const quizId=quizRef.current.id;
                    const response = await api.put(`/quizes/${quizId}`,{
                        title: quizTitle,
                        slides: quizSlides.current,
                        topic: quizTopic,
                        quizPath:path.slice(path.indexOf(":")+1)
                    })
                    setQuizes(quizes.map(quiz=>quiz.quizPath===quizRef.current.quizPath? response.data:quiz) );
                }
                navigate('/QuizMaker');

            }catch(err){
                setOpenToast({
                    state:true,
                    message:'Error saving the quiz',
                    icon:<FaExclamationTriangle/>,
                    color:'var(--exit)',
                    duration:4
                })
                console.error(err.message);
                if(err.response){
                    console.error(err.response.data);
                    console.error(err.response.status);
                }
            }

            
        }
        return;
    }

    const handleDeleteQuiz=async (mode)=>{
        const confirm = await confirmDialog("are you sure to delete this quiz?");
        if(confirm){
            if(mode==='create') navigate('/QuizMaker');
            else{
                try{
                    const response=await api.delete(`/quizes/${quizRef.current.id}`);
                    setQuizes(quizes.filter(quiz=>quiz.quizPath!==quizRef.current.quizPath));
                    navigate('/QuizMaker');
                }catch(err){
                    setOpenToast({
                        state:true,
                        message:'Error deleting the quiz',
                        icon:<FaExclamationTriangle/>,
                        color:'var(--exit)',
                        duration:4
                    });
                    console.error(err.message);
                    if(err.response){
                        console.error(err.response.data);
                        console.error(err.response.status);
                    }
    
                }
            }
        }else{
            setOpenToast({
                state:true,
                message:'Quiz deletion cancelled',
                icon:<FaCheck/>,
                color:'var(--exit)',
                duration:4
            });
        }
    }
    /* components */
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

        if(choicesLen<counter[currInd]) {
            quizSlides.current[currInd].choices.push({choice:'',correct:false});
        }
        else if(choicesLen>counter[currInd]) {
            const temp=quizSlides.current[currInd].choices.pop();
            if(temp.correct){
                isCheckedRef.current[currInd]=0;
                
            }
        }
        if(quizSlides.current[currInd].choices[0]){
            quizSlides.current[currInd].choices[isCheckedRef.current[currInd]].correct=true;

        }
        

        const [choicesArr,setChoicesArr]=useState(quizSlides.current[currInd].choices);

        const handleChoice=(e,ind)=>{
            setChoicesArr(choicesArr.map((choice,i)=>(
                i===ind? {choice:e.target.value,correct:choice.correct}:choice
            )))
            if(choiceTimeRef.current) clearTimeout(choiceTimeRef.current);

            choiceTimeRef.current=setTimeout(()=>{
                quizSlides.current[currInd].choices[ind].choice=e.target.value;
                choiceTimeRef.current=null;
            },200);
        }

        const handleChekcedChoice=(ind,currInd)=>{
            isCheckedRef.current[currInd]=ind;
            quizSlides.current[currInd].choices.forEach(
                (item,i) => (i===ind? item.correct=true:item.correct=false) 
            );
            setChoicesArr(choicesArr.map((choice,i)=>(
                {...choice,correct:i===ind? true:false}
            )));
        }

        const handleQuestion=(e)=>{
            setQuestion(e.target.value);
            if(timeRef.current) clearTimeout(timeRef.current);

            timeRef.current=setTimeout(()=>{
                quizSlides.current[currInd].question=e.target.value;
                timeRef.current=null;
            },200)
        }

        const handleDeleteSlide=(currInd)=>{
            quizSlides.current.splice(currInd,1);
            isCheckedRef.current.splice(currInd,1);
            setCounter(counter.filter((item,ind)=>ind!==currInd));
            setNbSlides(nbSlides-1);
            if(currInd>=quizSlides.current.length && currInd>0){
                setCurrInd(currInd-1);
            }
            setOpenToast({
                state:true,
                message:'Slide deleted successfully',
                duration:4,
                icon:<FaCheck/>,
                color:'var(--success)'
            });
        }
        return(
            <motion.div 
                className='cq-nq-slide center'
                initial={false}
                animate={{opacity:1}}
                exit={{opacity:0}}
                transition={{duration:0.3}}

            >
                <button 
                    className='cq-nq-delete-slide center'
                    onClick={()=>handleDeleteSlide(currInd)}        
                ><FaTrash/></button>
                <div className='cq-nq-slide-question'>
                    <div className='cq-nq-slide-question-input-container center'>
                        <h2 className="cq-nq-slide-ind center">{currInd+1}</h2>
                        <textarea
                            type="text"
                            className='cq-nq-slide-question-input'
                            onChange={(e)=>handleQuestion(e)}
                            value={question}
                            required
                        />
                    </div>
                    <div className='cq-nq-slide-choices-container'>
                        <ul 
                            className='cq-nq-slide-choices-list' 
                            style={{'--nb-items':counter[currInd]}}
                        >
                            {choicesArr.map((item,ind)=>(
                                <li className='cq-nq-choice center' key={`choiceNb${ind}`}>
                                    <input type='text'
                                        className='cq-nq-choice-input'
                                        value={item.choice}
                                        onChange={(e)=>handleChoice(e,ind)}
                                    />
                                    <button 
                                        className='cq-nq-value-choice center'
                                        onClick={()=>handleChekcedChoice(ind,currInd)}
                                    >
                                        {item.correct? <FaCheck/>:<FaXmark/>}
                                    </button>
                                    
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                {currInd===quizSlides.current.length-1 &&
                    <div className='cq-nq-save-delete-container center'>
                        <button 
                            className='cq-nq-finish-quiz'
                            onClick={async ()=> await handleSaveQuiz(mode)}
                        >
                            Save Quiz
                        </button>
                        <button 
                            className='cq-nq-delete-quiz cq-nq-finish-quiz'
                            onClick={async ()=> await handleDeleteQuiz(mode)}
                        >
                            Delete Quiz
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
        if (link) navigate(`${link}/create:${title}:${x}`);
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
                    onChange={(e)=>setTitle(e.target.value.length<=15? e.target.value:e.target.value.slice(0,e.target.value.length-1))}
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

export const Toast=({openToastStuff})=>{
    const [openToast,setOpenToast]=openToastStuff;
    const {message,duration,icon,color}=openToast;
    useEffect(()=>{
        if(duration && duration>0){
            const timer=setTimeout(()=>{
                setOpenToast({...openToast,state:false});
            },duration*1000);
            return ()=>clearTimeout(timer);
        }
    },[duration]);
    return(
        <motion.div
            className='toast center'
            style={{'--toast-color':color? color:'var(--exit)'}}
            initial={{x:'100%',opacity:0}}
            animate={{x:'-5%',opacity:1}}
            exit={{x:'100%',opacity:0}}
            transition={{type:'spring',duration:duration}}
        >
            {icon && <span className='toast-icon center'>{icon}</span>}
            <span className='toast-message'>{message}</span>
        </motion.div>
    )
}

export const ConfirmBox=({confirmBoxStuff})=>{
    const [confirmBoxObj,setConfirmBoxObj]=confirmBoxStuff;
    return(
        <motion.div
            className="confirm-box"
            initial={{opacity:0,scale:0.8,x:'-50%',y:'-50%'}}
            animate={{opacity:1,scale:1,x:'-50%',y:'-50%'}}
            exit={{opacity:0,scale:0,x:'-50%',y:'-50%'}}
            transition={{type:'spring',duration:0.6}}
        >
            <h3 className='confirm-message center'>{confirmBoxObj.message}</h3>
            <div className='confirm-buttons-container'>
                <button 
                    className='confirm-box-button center'
                    onClick={()=>{
                        confirmBoxObj.resolve(true);
                        setConfirmBoxObj({...confirmBoxObj,confirmState:true,state:false});
                    }}
                >Confirm</button>
                <button 
                    className='confirm-box-button center'
                    style={{backgroundColor:'var(--exit)'}}
                    onClick={()=>{
                        confirmBoxObj.resolve(false);
                        setConfirmBoxObj({...confirmBoxObj,confirmState:false,state:false});
                    }}
                >cancel</button>
            </div>
        </motion.div>
    )
}

const CreateQuiz=({blurStuff,quizesStuff,modeStuff})=>{

    const {id}=useParams();

    /* the array of quizes*/
    const [quizes,setQuizes]=quizesStuff;    
    
    const [nbSlides,setNbSlides]=useState(0);
    const [counter,setCounter]=useState([1]); // the number of slides for each question in the quiz
    const [topic,setTopic]=useState([
        {topic:'MATH',checked:true},
        {topic:'SCIENCE',checked:false},
        {topic:'PHYSICS',checked:false},
        {topic:'CHEMISTRY',checked:false},
        {topic:'HISTORY',checked:false}
    ]);

    /*we get th title from the*/
    
    const [title,setTitle]=useState(id.split(':')[1]);
    const [quizTopic,setQuizTopic]=useState('MATH');

    /*state of the quiz creating area ( slides = questions )*/
    const quizSlides = useRef([]);
    const [currInd,setCurrInd]=useState(0);

    const [openToast,setOpenToast]=useState({state:false,message:'',duration:3,icon:null,color:null}); // for the toast box ( notify/warn )
    const {confirmBoxObj,setConfirmBoxObj, confirmDialog}=useConfirmDialog(); // for the confirm box ( delete quiz/slide )

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
        setIsblur(openModal || confirmBoxObj.state);
    },[openModal,confirmBoxObj.state])

    const isCheckedRef=useRef([]); // to choose the correct answer in each slide

    // when in edit mode we load the quiz data into the states

    const [mode,setMode]=modeStuff;
    useEffect(()=>{
        setMode(id? id.split(':')[0]:null);

    },[])
    
    const quizRef=useRef();
    
    useEffect(()=>{
        quizRef.current = mode==='edit' ? quizes.find((quiz)=>quiz.quizPath===id.slice(id.indexOf(":")+1)) : null;
        if(mode==='edit' && quizRef.current){
            quizSlides.current=quizRef.current.slides;
            setTitle(quizRef.current.title);
            setQuizTopic(quizRef.current.topic);
            setNbSlides(quizRef.current.slides.length);
            setCounter(quizRef.current.slides.map((slide)=>slide.choices.length));
            isCheckedRef.current=quizRef.current.slides.map(slide=>(
                slide.choices.findIndex((choice)=>choice.correct)
            ))
        }
    },[mode,quizes])
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
                    quizesStuff={[quizes,setQuizes]}
                    isCheckedRef={isCheckedRef}
                    quizTopicStuff={[quizTopic,setQuizTopic]}
                    titleStuff={[title,setTitle]}
                    openToastStuff={[openToast,setOpenToast]}
                    modeStuff={[mode,setMode]}
                    path={id}
                    quizRef={quizRef}
                    confirmBoxStuff={{confirmBoxObj,setConfirmBoxObj,confirmDialog}}

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

                <AnimatePresence>
                    {openToast.state &&  
                        <Toast
                            openToastStuff={[openToast,setOpenToast]}
                        />
                    }
                </AnimatePresence>

                <AnimatePresence>
                    {confirmBoxObj.state &&
                        <ConfirmBox confirmBoxStuff={[confirmBoxObj,setConfirmBoxObj]}/>
                    }
                </AnimatePresence>
            </main>
            
        </>
    )
}


export default CreateQuiz;

/*never give up and always believe in yourself benazizab*/