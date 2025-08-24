import {Link} from 'react-router-dom';
const Home = ()=>{
    return(
        <>  
            <div className="home-container center">
                <h1 className="home-title">yuuQuiz, create and play!</h1>
                <div className="role-choice">
                    <button 
                        className="hover-scale click-button"
                    ><Link 
                        className='redirect-page'
                        to='/QuizMaker'
                    >Quiz Maker</Link></button>
                    <button 
                        className="hover-scale click-button"
                    ><Link 
                        className='redirect-page'
                        to='/Player'
                    >Player</Link></button>
                </div>
            </div>
        </>
    )
}

export default Home;