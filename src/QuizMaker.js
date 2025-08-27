import {motion} from 'framer-motion';
import { FaCaretDown, FaCaretLeft, FaCaretRight } from 'react-icons/fa';
import { FaXmark } from 'react-icons/fa6';
import { useRef,useState,useEffect } from 'react';
const QuizFilters =()=>{
    const filters=[
        {topic:'MATH',color:'rgb(99, 99, 255)'},
        {topic:'SCIENCE',color:'var(--quiz-maker)'},
        {topic:'PHYSICS',color:'var(--player)'}
    ];
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
    },[])
    const handleFilter=()=>{
        return;
    }
    const handleScrollFilter=(direction)=>{
        if(filtersRef.current){
            filtersRef.current.scrollBy({
                left:direction==='left'? -100:100,
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
                    {filters.map((filter,ind)=>(
                        <li 
                            className='qm-filter-item' 
                            key={ind}
                            style={{backgroundColor:filter.color}}
                        >
                            <p>{filter.topic}</p>
                            <div className='filter-icon center'><FaXmark/></div>
                        </li>
                    ))}
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
                <button className='qm-btn-filter' onClick={handleFilter}>
                    <h2>Quiz Topic</h2>
                    <div className='qm-btn-icon center'><FaCaretDown/></div>
                </button>
            </div>
        </>
    )
}
const Quizes=()=>{
    return(
        <></>
    )
}
const QuizMaker=()=>{
    return(
        <>
            <header className='qm-header'>
                <QuizFilters/>    
            </header>
            <main className='qm-quizes'>

            </main>
        </>
    )
}

export default QuizMaker;