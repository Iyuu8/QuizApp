import {motion} from 'framer-motion';
const QuizMaker=()=>{
    return(
        <motion.div
            initial={{x:'100%'}}
            animate={{x:'0%'}}
            exit={{x:'-100%'}}
            transition={{ease:'easeOut'}}
        >QuizMaker
        </motion.div>
    )
}

export default QuizMaker;