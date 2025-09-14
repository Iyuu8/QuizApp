import {motion} from 'framer-motion';
import {useState,useEffect,useRef} from 'react';
import { useNavigate , Link } from 'react-router-dom';
import useAxiosFetch from './Hooks/useAxiosFetch';
import { QuizFilters,Quizes } from './QuizMaker';


const Player = ({modeStuff})=>{
    const navigate = useNavigate();
    const {data,error,loading}=useAxiosFetch('quizes');
    const [quizes,setQuizes]=useState([]);
    const [filteredQuizes,setFilteredQuizes]=useState([]); // quizes after filtering
    const [page,setPage]=useState('Player');

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
                modalStuff={false} 
                quizesStuff={[quizes,setQuizes]}
                filteredQuizesStuff={[filteredQuizes,setFilteredQuizes]}
                modeStuff={modeStuff}

            />

        </main>
        </>
        
    )
}

export default Player;