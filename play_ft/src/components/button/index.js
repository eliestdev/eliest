import './button.css'

const TButton = ({text, onClick}) => {
    return (
        <button onClick={onClick} className="tbutton bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded ml-5">
            {text}
        </button>
    );
}

export default TButton;