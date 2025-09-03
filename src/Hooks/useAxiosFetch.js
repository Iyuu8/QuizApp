import api  from '../api/QuizAxios';
import {useState,useEffect} from 'react';
const useAxiosFetch=(dataUrl)=>{
    const [data,setData]=useState([]);
    const [error,setError]=useState(false);
    const [loading,setLoading]=useState(false);
    useEffect(()=>{
        const controller=new AbortController();
        let mounted = true;
        const fetchData=async (url)=>{
            setLoading(true);
            try{
                const response = await api.get(url,{
                    signal:controller.signal
                })
                if(mounted){
                    setData(response.data);
                    setError(null);
                }
            }catch(err){
                if(err.name === "CanceledError" || err.message === "canceled") setError(null);
                else{
                    setError(err.message);
                    setData([]);
                }
            }finally{
                mounted && setLoading(false);
            }
        }
        (async()=> await fetchData(dataUrl))();
        return(()=>{
            mounted=false;
            controller.abort();
        })
    },[dataUrl])
    return {data,error,loading}
}

export default useAxiosFetch;