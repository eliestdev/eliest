import { Link } from 'react-router-dom'
import './index.css';
import Logo from '../../assets/img/footer-white.png'
// import Insta from '../../assets/svg/Instagram.svg'
import Facebook from '../../assets/svg/Facebook.svg'
import Twitter from '../../assets/svg/Twit.svg'
import YouTube from '../../assets/svg/Youtube.svg'
import NLRC from '../../assets/img/NLRC.png'

const Footer = () => {
    const routes = [
        // { name: 'Home', link: '/' },
        { name: 'Play Game', link: 'https://play.eliestlotto.biz/', href: true },
        { name: 'Become a supervisor', link: 'https://supervisors.eliestlotto.biz/', href: true },
        { name: 'Become an agent', link: 'https://agents.eliestlotto.biz/', href: true },
    ]

    return (
        <>
            <div className="footer-bg flex justify-between px-10 py-10 mx-auto text-white items-center justify-center">
                <div className="pt-2 items-center content-center justify-center flex">
                    <img src={Logo} className="footer-icon" alt="icon" />
                </div>
                <div className="pt-1 md:flex gap-10 link hidden items-center">
                    {routes.map((route) => {
                        return route.href ? <a href={route.link} className="link">{route.name}</a> : <Link to={route.link} className="link">{route.name}</Link>
                    })}
                </div>
            </div>
            <div className="py-9 px-10 md:flex justify-between">
                <div className="footer-left--text">

                <div className="footer-left--text">
                    <span className="">Address: 90 Norman Williams off Ribadu South West Ikoyi Lagos</span>
                    <br />
                    <span className="">Email: Eliestlotto11@gmail.com</span>
                    <br />
                    <span className="">Phone: 0700 404 404 404</span>
                </div>
                
                    <img src={NLRC} className="nlrc" />
                    <span className="set">Powered by SET PLC</span>
                </div>
                <div className="flex sm:pt-10 md:gap-4 gap-6 cursor-pointer">

               

                    <a href="https://www.instagram.com/eliestlotto_/"><img src={Twitter} alt="instagram" /></a>
                    <a href="https://m.facebook.com/EliestLotto/"><img src={Facebook} alt="facebook" /></a>
                    <a href="https://www.youtube.com/channel/UCtAF5BwohJhMlcx7QMcbdGw"><img src={YouTube} alt="Youtube" /></a>
                </div>
            </div>
            <div className="colored py-1 px-10 md:flex justify-between">
              
            </div>
        </>
    );
}

export default Footer;