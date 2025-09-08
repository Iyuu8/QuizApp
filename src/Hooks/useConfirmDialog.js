import {useState} from "react";
const useConfirmDialog = () => {
    const [confirmBoxObj, setConfirmBoxObj] = useState({
        state:false,
        message:'',
        resolve:null
    });

    const confirmDialog=(message)=>{
        return new Promise(resolve=>{
            setConfirmBoxObj({
                state:true,
                message,
                resolve,
            })
        });
    }

    return {confirmBoxObj, setConfirmBoxObj , confirmDialog};
}
export default useConfirmDialog;