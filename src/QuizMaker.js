import {AnimatePresence, motion} from 'framer-motion';
import { FaCaretDown, FaCaretLeft, FaCaretRight, FaCheck, FaPlus } from 'react-icons/fa';
import { FaXmark } from 'react-icons/fa6';
import { useRef,useState,useEffect } from 'react';
import {Link,Routes,Route,useNavigate} from 'react-router-dom';
import { TitleModal } from './CreateQuiz';
import useAxiosFetch from './Hooks/useAxiosFetch';

export const QuizFilters =({filterStuff,quizesStuff,filteredQuizesStuff})=>{
    const [quizes,setQuizes]=quizesStuff; // all quizes from the api
    const [filteredQuizes,setFilteredQuizes]=filteredQuizesStuff; // quizes after filtering
    const [filters,setFilters]=filterStuff;
    const [openFilters,setOpenFilter]=useState(false);
    const handleFilter=(filter)=>{
        return (
            filters.map(item=>(
                item.topic===filter.topic?
                {...item,checked:!item.checked}:
                item
            ))
        )
    }
    //
    
    useEffect(()=>{
        const temp = quizes.filter(quiz => (
            filters.some(filter => filter.checked && filter.topic === quiz.topic)
        ));
        setFilteredQuizes(temp);
    },[filters.filter(item=>item.checked).length])

    // drop down handling
    const dropdownRef=useRef();
    const filterButtonRef=useRef();
    useEffect(()=>{
        const closeDrop=(e)=>{
            if(dropdownRef.current && !dropdownRef.current.contains(e.target) && !filterButtonRef.current.contains(e.target)) setOpenFilter(false);
        }
        document.addEventListener('click',closeDrop);

        return ()=>document.removeEventListener('click',closeDrop);
    },[])

    // handling scroll buttons in filter
    const filtersRef = useRef();
    const [showArrowLeft,setShowArrowLeft] = useState(false);
    const [showArrowRight,setShowArrowRight] = useState(false);
    const updateButtons = () => {
        if (!filtersRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = filtersRef.current;

        setShowArrowLeft(scrollLeft > 0);
        setShowArrowRight(scrollLeft + clientWidth < scrollWidth-1);
    };
    useEffect(()=>{
        updateButtons();
        window.addEventListener('resize',updateButtons);
        if(filtersRef.current) filtersRef.current.addEventListener('scroll',updateButtons);
        return ()=>{
            window.removeEventListener('resize',updateButtons);
            if(filtersRef.current) filtersRef.current.removeEventListener('scroll',updateButtons);
        }
    },[filters])
    const handleScrollFilter=(direction)=>{
        if(filtersRef.current){
            filtersRef.current.scrollBy({
                left:direction==='left'? -50:50,
                behavior:'smooth'
            });
        }
    }
    return(
        <>
            <div className='qm-fade-wrapper'>
                <div 
                    className='qm-filters'
                    ref={filtersRef}
                >
                    <ul className='qm-filters-list'>
                    <AnimatePresence>
                    {filters.filter(item=>item.checked).map((filter,ind)=>(
                        <motion.li 
                            className='qm-filter-item' 
                            key={filter.topic}
                            style={{backgroundColor:filter.color}}
                            onClick={()=>setFilters(handleFilter(filter))}
                            initial={{opacity:0}}
                            animate={{opacity:1}}
                            exit={{opacity:0}}
                        >
                            <p>{filter.topic}</p>
                            <div role='button'className='filter-icon center'><FaXmark/></div>
                        </motion.li>
                    ))}
                    </AnimatePresence>
                    </ul>
                </div> 
               { showArrowLeft &&
                <button 
                    className='qm-scroll-left center'
                    onClick={()=>handleScrollFilter('left')}
                ><FaCaretLeft/></button>}
               { showArrowRight &&
                <button 
                    className='qm-scroll-right center'
                    onClick={()=>handleScrollFilter('right')}
                ><FaCaretRight/></button>}
            </div>

            <div className='qm-filter-add center'>
                <button 
                    className='qm-btn-filter' 
                    onClick={()=>setOpenFilter(!openFilters)}
                    ref={filterButtonRef}
                >
                    <h2>Quiz Topic</h2>
                    <div className='qm-btn-icon center'><FaCaretDown/></div>
                </button>
                <AnimatePresence>
                {openFilters &&
                    <motion.div 
                        className='qm-dropdown'
                        initial={{height:'2rem',opacity:0}}
                        animate={{height:filters.length*2+'rem',opacity:1}}
                        exit={{height:'1rem',opacity:0}}
                        ref={dropdownRef}

                    >
                    <ul className='qm-dropwdown-list'>
                        {filters.map((filter,ind)=>(
                            <li 
                                className='qm-dropdown-item center' 
                                key={filter.topic}
                                onClick={()=>setFilters(handleFilter(filter))}
                            >
                                {filter.topic}

                                { filter.checked&& 
                                    <div className='checked-icon'><FaCheck/></div>
                                }
                            </li>
                        ))

                        }
                    </ul>    
                    </motion.div>
                }
                </AnimatePresence>
            </div>
        </>
    )
}
export const Quizes=({pageStuff,modalStuff,quizesStuff,filteredQuizesStuff,modeStuff})=>{
    const navigate=useNavigate();
    const [page,setPage]=pageStuff;
    if(modalStuff) {var [openModal,setOpenModal]=modalStuff;}
    const [mode,setMode]=modeStuff; // to set the mode create or edit
    const [quizes,setQuizes]=quizesStuff; // array of quizes from the api
    const [filteredQuizes,setFilteredQuizes]=filteredQuizesStuff;

    const handleNewQuiz=()=>{
        setMode('create');
        setOpenModal(true);
    }

    const handleEditQuiz=(path)=>{
        setMode('edit');
        navigate(path);
    }
    const handleSolve =(path)=>{
        setMode('solve');
        navigate(path);
    }
    const QuizItem=({title,topic,path})=>{
        const [showTopic,setShowTopic]=useState(false);
        return(
            <li 
                className='qm-quiz-item center'
                onMouseEnter={()=>setShowTopic(true)}
                onMouseLeave={()=>setShowTopic(false)}
                onClick={()=>{
                    if(page==='QuizMaker') handleEditQuiz(path)
                    else if(page==='Player') handleSolve(path);
                }}
            >
                <h2 className='qm-link-quiz-item'>{title}</h2>
                <AnimatePresence>
                {showTopic &&
                    <motion.div 
                        className='qm-quiz-topic-container center'
                        initial={{opacity:0,height:'20%'}}
                        animate={{opacity:1,height:'100%'}}
                        exit={{opacity:0,height:'20%'}}

                    ><h2 className='qm-quiz-item-topic'>{topic}</h2></motion.div>
                }
                </AnimatePresence>
            </li>
        )
    }
    const AddQuiz=()=>{
        return(
            <li 
                className='qm-add-quiz center'
                onClick={()=>{
                    if(page==='QuizMaker') handleNewQuiz();
                    else if(page==="Player") return;
                }}
            >
                <h3 className='qm-link-quiz-add center'
                ><FaPlus/></h3>
            </li>
        )
    }
    return(
        <div className='qm-quiz-container'>
            <ul className='qm-quiz-list'>
                {filteredQuizes && filteredQuizes.map((quiz,ind)=>(
                    <QuizItem 
                        key={quiz.title+ind}
                        title={quiz.title}
                        topic={quiz.topic}
                        path={`/${page==="QuizMaker"? 'CreateQuiz':'SolveQuiz'}/${page==="QuizMaker"? 'edit':'solve'}:${quiz.quizPath}`}
                    />
                ))}
                {page==='QuizMaker' &&
                    <AddQuiz/>
                }
            </ul>
        </div>
    )
}
const QuizMaker=({blurStuff,modeStuff})=>{
    const navigate=useNavigate();
    /* the api request to get the quizes*/
    const {data,error,loading}=useAxiosFetch('quizes');
    const [quizes,setQuizes]=useState([]);
    const [filteredQuizes,setFilteredQuizes]=useState([]); // quizes after filtering

    useEffect(() => {
        if (!error && !loading && data) {
            setQuizes(data);
            setFilteredQuizes(data);
        }
        if (error) navigate('/FetchError');
    }, [data, error, loading, navigate]);

    const [filters,setFilters]=useState([
        {topic:'MATH',color:'var(--math)',checked:true},
        {topic:'SCIENCE',color:'var(--science)',checked:true},
        {topic:'PHYSICS',color:'var(--physics)',checked:true},
        {topic:'CHEMISTRY',color:'var(--chemistry)',checked:true},
        {topic:'HISTORY',color:'var(--history)',checked:true}
    ]);
    const [openModal,setOpenModal]=useState(false);
    const [page,setPage]=useState('QuizMaker');
    const [title,setTitle]=useState('');
    const [isBlur,setIsblur]=blurStuff;
    useEffect(()=>{
        setIsblur(openModal);
    },[openModal])
    return(
        <>
            <header className='qm-header'>
                <QuizFilters 
                    filterStuff={[filters,setFilters]} 
                    quizesStuff={[quizes,setQuizes]}
                    filteredQuizesStuff={[filteredQuizes,setFilteredQuizes]}
                />    
            </header>
            <main className='qm-quizes'>
                <Quizes 
                    pageStuff={[page,setPage]}
                    modalStuff={[openModal,setOpenModal]} 
                    quizesStuff={[quizes,setQuizes]}
                    filteredQuizesStuff={[filteredQuizes,setFilteredQuizes]}
                    modeStuff={modeStuff}

                />

                <AnimatePresence>
                {openModal&&
                    <TitleModal
                        titleStuff={[title,setTitle]} 
                        modalStuff={[openModal,setOpenModal]}
                        link='/CreateQuiz'
                    />
                }
                </AnimatePresence>
            </main>
        </>
    )
}

export default QuizMaker;