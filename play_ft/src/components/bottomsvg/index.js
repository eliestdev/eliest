import './bottomSvg.css'
import Layer1 from '../../assets/svg/Layer1.svg';
import Layer2 from '../../assets/svg/Layer2.svg';

const BottomSVG = () => {
    return (
        <div className="md:flex justify-evenly md:h-20 md:w-full bottom--svg sm:hidden">
            <img src={Layer1} />
            <img src={Layer2} />
            <img src={Layer1} />
            {/* <img src={Layer2} /> */}
        </div>
    )
}

export default BottomSVG;