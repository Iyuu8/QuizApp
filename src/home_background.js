
import questionBox1 from "./assets/question_box1.png";
import questionBox2 from "./assets/question_box2.png";
import questionMark1 from "./assets/question_mark1.png";
import questionMark2 from "./assets/question_mark2.png";
import questionMark3 from "./assets/question_mark3.png";
import questionMark4 from "./assets/question_mark4.png";
import yubiSmall from "./assets/yubi_small.png";

const HomeBackground = ()=>{
    return(
        <div className="home-background">
            <div id="img1" className="question-box-container">
                <img src={questionBox1} alt="questionLogo" className="question-box"/>
                <h1>play!</h1>
            </div>
            <img id="img3" src={questionMark1} alt="questionLogo" className="question-mark"/>
            <img id="img4" src={questionMark2} alt="questionLogo" className="question-mark"/>
            <img id="img6" src={questionMark4} alt="questionLogo" className="question-mark"/>
            <img id="img5" src={questionMark3} alt="questionLogo" className="question-mark"/>
            <img id="img7" src={questionMark4} alt="questionLogo" className="question-mark"/>
            <img id="img8" src={yubiSmall} alt="questionLogo" className="question-mark"/>
            <div id="img2" className="question-box-container">
                <img src={questionBox2} alt="questionLogo" className="question-box"/>
                <h1>Create & Innovate</h1>
            </div>
        </div>
    )
}

export default HomeBackground;