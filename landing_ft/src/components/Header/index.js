import Logo from '../../assets/img/logo.png'
import { Disclosure,  } from '@headlessui/react'
import { MenuIcon, XIcon } from '@heroicons/react/outline'
import { Link, withRouter } from 'react-router-dom'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function Header(props) {
    const { location } = props;
    const navigation = [
        // { name: 'Home', href: '/', current: '', route: location.pathname === '/' },
        { name: 'How to play', href: '/how', current: '', route: location.pathname === '/how'},
        { name: 'How to become an agent', href: '/how/agent', current: '', route: location.pathname === '/how/agent'},
        { name: 'How to become a supervisor', href: '/how/supervisor', current: '', route: location.pathname === '/how/supervisor'},
        { name: 'Contact Us', href: '/contact', current: '', route: location.pathname === '/contact'},
        // { name: 'Play game', href: 'https://play.eliestlotto.biz/', current: 'external', route: false },
        { name: 'Become an agent', href: 'https://agents.eliestlotto.biz/', current: 'external', route: false },
        { name: 'Become a supervisor', href: 'https://supervisors.eliestlotto.biz/', current: 'external', route: false },
        // { name: 'Contact Us', href: '/contact', current: '', route: location.pathname === '/contact'},
       
    ]

    return (
        <Disclosure as="nav" className="bg-white" style={{
            background: location.pathname === '/' ? '#E5FFF2' : '#fff'
        }}>
            {({ open }) => (
                <>
                    <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 pt-2">
                        <div className="relative flex items-center justify-between h-16">
                            <div className="absolute inset-y-0 right-3 flex items-center sm:hidden">
                                {/* Mobile menu button*/}
                                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-green-500 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                    <span className="sr-only">Open main menu</span>
                                    {open ? (
                                        <XIcon className="block h-6 w-6" aria-hidden="true" />
                                    ) : (
                                        <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                                    )}
                                </Disclosure.Button>
                            </div>
                            <div className="flex-1 flex items-center justify-between sm:items-stretch sm:justify-between">
                                <div className="flex-shrink-0 flex items-center">
                                    <img
                                        className="block lg:hidden h-16 w-auto"
                                        src={Logo}
                                        alt="Eliest"
                                    />
                                   <Link to="/">
                                   <img
                                        className="hidden lg:block h-20 w-auto"
                                        src={Logo}
                                        alt="Eliest"
                                    /></Link>
                                </div>
                                <div className="hidden sm:block sm:ml-6 sm:mt-5">
                                    <div className="flex space-x-4">
                                        {navigation.map((item) => (
                                             item.current === 'external' ? <a href={item.href} key={item.name}  className={classNames(
                                                item.route ? 'bg-white text-green-500 hover:bg-green-700 hover:text-white' : 'text-gray-400 hover:text-green-500',
                                                'block px-3 py-2 rounded-md text-base font-medium'
                                            )}> {item.name}</a> :
                                            <Link
                                            href={item.href}
                                                key={item.name}
                                                to={item.href}
                                                className={classNames(
                                                    item.route ? 'text-green-500' : 'text-gray-400 hover:text-green-500',
                                                    'px-3 py-2 rounded-md text-sm font-medium'
                                                )}
                                                aria-current={item.route ? 'page' : undefined}
                                                style={{fontSize: 16, paddingTop: '10px'}}
                                            >
                                                {item.name}
                                            </Link>
                                        ))}

                                        <span className="mt-2 ml-4">
                                            {/* <a href="https://agents.eliestlotto.biz/auth/register" className="tbutton btn-primary hover:bg-green-700 text-white font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded ml-5">
                                                Create account
                                            </a> */}
                                        </span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <Disclosure.Panel className="sm:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            {navigation.map((item) => (
                                item.current === 'external' ? <a href={item.href} key={item.name}  className={classNames(
                                    item.route ? 'bg-white text-green-500 hover:bg-green-700 hover:text-white' : 'text-gray-400 hover:text-green-500',
                                    'block px-3 py-2 rounded-md text-base font-medium'
                                )}> {item.name}</a> :
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={classNames(
                                        item.route ? 'bg-white text-green-500 hover:bg-green-700 hover:text-white' : 'text-gray-400 hover:text-green-500',
                                        'block px-3 py-2 rounded-md text-base font-medium'
                                    )}
                                    aria-current={item.route ? 'page' : undefined}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    )
}

export default withRouter(Header)