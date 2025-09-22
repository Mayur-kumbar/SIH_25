import { Link } from "react-router-dom";
export function BottomWarning({label,buttonText,to}){
    return (<div className="py-2 text-sm flex justify-center">
        <div>{label}</div>
        <Link className="pointer text-blue-500 font-bold px-2" to={to}>
            {buttonText}
        </Link>
    </div>)
}