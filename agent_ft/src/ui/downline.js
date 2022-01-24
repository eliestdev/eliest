import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';
import './modal/index.css'
// import UserCircle from '../assets/svg/UserCircle_small.svg'

const DownTime = () => {
    const data = {
        name: 'Usman kamaru',
        active: 'Active since: 24th january, 2021',
        downlines: 10,
    }
    const a = Array(12).fill(data);

    return (
        <div className="mt-20 mx-10">
            <Accordion className="grid grid-cols-4 gap-6">
                {a.map((down) => (
                    <AccordionItem className="w-full border border-0 border-gray-200 rounded py-2 px-4 h-auto">
                        <AccordionItemHeading>
                            <AccordionItemButton className="flex gap-3">
                                {/* <img src={UserCircle} className="mt-5" /> */}
                                <div className="d-name">{down.name}
                                    <p className="d-p">{down.active}</p>
                                </div>
                            </AccordionItemButton>
                        </AccordionItemHeading>
                        <AccordionItemPanel className="">
                            <div className="mt-10 flex justify-center gap-4">
                                <div className="bg-gray-100 rounded px-4 py-1 down">
                                   <div className="items-center content-center mt-1"> Downlines <span className="count">{down.downlines}</span></div>
                                </div>
                                <button className="text-green-500 rounded border border-0 border-green-500 py-1 px-4">Activated</button>
                            </div>
                        </AccordionItemPanel>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}

export default DownTime;