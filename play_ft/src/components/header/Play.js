import Logo from '../../assets/img/logo.png'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { BellIcon, MenuIcon, XIcon } from '@heroicons/react/outline'
import { Link, withRouter } from 'react-router-dom'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

function PlayHeader(props) {
    const { location } = props;
    const navigation = [
        { name: 'Home', href: 'https://www.eliestlotto.biz/', current: location.pathname === '/', external: true },
        { name: 'Play Game', href: '/play/games', current: location.pathname === '/play/games', external: false },
        { name: 'Become an agent', href: 'https://agents.eliestlotto.biz/auth/register', current: false, external: true },
        { name: 'Become a supervisor', href: 'https://supervisors.eliestlotto.biz/auth/register', current: false, external: true },
        { name: 'Sign Out', href: '/', current: false, external: false },
    ]

    return (
        <Disclosure as="nav" className="bg-white" style={{
            background: location.pathname === '/' ? '#E5FFF2' : '#fff'
        }}>
            {({ open }) => (
                <>
                    <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-2 pt-2">
                        <div className="relative flex items-center justify-between h-16">
                            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
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
                                <div className="flex-shrink-0 flex items-center mx-10 sm:mx-0">
                                    <img
                                        className="block lg:hidden h-16 w-auto"
                                        src={Logo}
                                        alt="Eliest"
                                    />
                                    <img
                                        className="hidden lg:block h-16 w-auto"
                                        src={Logo}
                                        alt="Eliest"
                                    />
                                </div>
                                <div className="hidden sm:block sm:ml-6">
                                    <div className="flex space-x-4 pt-4">
                                        {navigation.map((item) => (
                                            <div>
                                                {item.external ? <a key={item.name} href={item.href} className={classNames(
                                                    item.current ? 'text-primary' : 'text-gray-400 hover:text-green-500',
                                                    'px-3 py-2 rounded-md text-sm font-medium'
                                                )}
                                                    aria-current={item.current ? 'page' : undefined}>
                                                        {item.name}
                                                    </a> : <Link
                                                        key={item.name}
                                                        to={item.href}
                                                        className={classNames(
                                                            item.current ? 'text-primary' : 'text-gray-400 hover:text-green-500',
                                                            'px-3 py-2 rounded-md text-sm font-medium'
                                                        )}
                                                        aria-current={item.current ? 'page' : undefined}
                                                    >
                                                    {item.name}
                                                </Link>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <Disclosure.Panel className="sm:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            {navigation.map((item) => (
                                <div>
                                {item.external ? <a key={item.name} href={item.href} className={classNames(
                                    item.current ? 'text-primary' : 'text-gray-400 hover:text-green-500',
                                    'px-3 py-2 rounded-md text-sm font-medium'
                                )}
                                    aria-current={item.current ? 'page' : undefined}>
                                        {item.name}
                                    </a> : <Link
                                        key={item.name}
                                        to={item.href}
                                        className={classNames(
                                            item.current ? 'text-primary' : 'text-gray-400 hover:text-green-500',
                                            'px-3 py-2 rounded-md text-sm font-medium'
                                        )}
                                        aria-current={item.current ? 'page' : undefined}
                                    >
                                    {item.name}
                                </Link>}
                            </div>
                            ))}
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    )
}

export default withRouter(PlayHeader)