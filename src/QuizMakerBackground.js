import cloud1 from './assets/pixel_cloud1.png';
import cloud2 from './assets/pixel_cloud2.png';

const QuizMakerBackground = ()=>{
    return(
        <div className="quiz-maker-bkg-images">
            <img id='pixel-img1' src={cloud1} alt="cloud-image1"/>
            <img id='pixel-img3' src={cloud2} alt="cloud-image3"/>
            <img id='pixel-img2' src={cloud1} alt="cloud-image2"/>
        </div>
    )
}

export default QuizMakerBackground;