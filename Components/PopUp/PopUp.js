import { WarningIcon, SuccessIcon } from "@/Components/Icons";

const PopUp = ({ isVisible, type, message }) => {
    let icon;
    let bgColor;
    switch (type) {
        case 'success':
            icon = <SuccessIcon />;
            bgColor = 'bg-white';
            break;
        case 'error':
            icon = <WarningIcon />;
            bgColor = 'bg-red-200';
            break;
        default:
            icon = null;
            bgColor = 'bg-white';
    }

    return (
        <div className={`z-50 absolute top-[14px] ${isVisible ? 'right-0' : '-right-[100%]'} ${bgColor} p-5 flex items-center gap-5 duration-500`}>
            <div className="flex items-center justify-center w-[18px] h-[18px]">
                {icon}
            </div>
            {message}
        </div>
    );
};

export default PopUp;
