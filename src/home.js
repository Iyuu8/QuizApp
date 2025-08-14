const Home = ({pageStuff})=>{
    const [page,setPage] = pageStuff;
    return(
        <>  
            <div className="home-container center">
                <h1 className="home-title">yuuQuiz, create and play!</h1>
                <div className="role-choice">
                    <button 
                        className="hover-scale click-button"
                        onClick={()=>setPage('maker')}
                    >Quiz Maker</button>
                    <button 
                        className="hover-scale click-button"
                        onClick={()=>setPage('player')}
                    >Player</button>
                </div>
            </div>
        </>
    )
}

export default Home;