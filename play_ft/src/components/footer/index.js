import { Link } from 'react-router-dom'
import './index.css';
import Logo from '../../assets/img/footer-logo.png'
import Insta from '../../assets/svg/Instagram.svg'
import Facebook from '../../assets/svg/Facebook.svg'
import Twitter from '../../assets/svg/Twit.svg'

const Footer = () => {
    const routes = [
        { name: 'Home', link: '/' },
        { name: 'Play Game', link: '/play/game' },
        { name: 'Become a supervisor', link: '/' },
        { name: 'Become an agent', link: '/' }
    ]

    return (
        <>
            <div className="footer-bg flex justify-between px-10 w-full py-10 mx-auto text-white items-center justify-center">
                <div className="pt-2">
                    <img src={Logo} className="footer-icon" />
                </div>
                <div className="pt-1 flex gap-10 link">
                    {routes.map((route) => {
                        return <Link to={route.link} className="link">{route.name}</Link>
                    })}
                </div>
            </div>
            <div className="py-10 px-10 md:flex justify-between">
                <div className="footer-left--text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolorLorem ipsum dolo</div>
                <div className="flex gap-4 cursor-pointer">
                    <img src={Twitter} />
                    <img src={Facebook} />
                    <img src={Insta} />
                </div>
            </div>
        </>
    );
}

export default Footer;