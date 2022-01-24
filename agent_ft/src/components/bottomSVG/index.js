import './index.css'
import Layer1 from '../../assets/svg/Layer1.svg';
import Layer2 from '../../assets/svg/Layer2.svg';

const BottomSVG = ({ component }) => {
    return (
        <div className="md:flex justify-evenly md:h-20 md:w-full bottom--svg sm:hidden">
            <img src={Layer1} />
            <img src={Layer2} />
            <img src={Layer1} />
            {/* <img src={Layer2} /> */}
            <div className="absolute bottom-20 md:bottom-10 px-8 md:px-1 md:w-2/5 flex w-full">{component}</div>
        </div>
    )
}

export default BottomSVG;