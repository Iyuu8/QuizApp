import {motion} from 'framer-motion';
const Player = ()=>{
    return(
        <motion.div
            initial={{x:'100%'}}
            animate={{x:'0%'}}
            exit={{x:'-100%'}}
            transition={{ease:'easeOut'}}
        >
            Player

        </motion.div>
        
    )
}

export default Player;