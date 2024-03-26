export const DashboardIcon = ({ isActive }) => {
    return (
        <svg width="100%" height="100%" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.58984 9.49683C9.58984 8.94454 10.0376 8.49683 10.5898 8.49683H16.5898C17.1421 8.49683 17.5898 8.94454 17.5898 9.49683V16.4968C17.5898 17.0491 17.1421 17.4968 16.5898 17.4968H10.5898C10.0376 17.4968 9.58984 17.0491 9.58984 16.4968V9.49683Z" stroke={isActive ? '#4285F4' : '#5D7285'} stroke-width="2" stroke-linecap="round" />
            <path d="M1.58984 2.49683C1.58984 1.94454 2.03756 1.49683 2.58984 1.49683H5.58984C6.14213 1.49683 6.58984 1.94454 6.58984 2.49683V16.4968C6.58984 17.0491 6.14213 17.4968 5.58984 17.4968H2.58984C2.03756 17.4968 1.58984 17.0491 1.58984 16.4968V2.49683Z" stroke={isActive ? '#4285F4' : '#5D7285'} stroke-width="2" stroke-linecap="round" />
            <path d="M9.58984 2.49683C9.58984 1.94454 10.0376 1.49683 10.5898 1.49683H16.5898C17.1421 1.49683 17.5898 1.94454 17.5898 2.49683V4.49683C17.5898 5.04911 17.1421 5.49683 16.5898 5.49683H10.5898C10.0376 5.49683 9.58984 5.04911 9.58984 4.49683V2.49683Z" stroke={isActive ? '#4285F4' : '#5D7285'} stroke-width="2" stroke-linecap="round" />
        </svg>

    )
}

export const EarthIcon = ({ isActive }) => {
    return (
        <svg width="100%" height="100%" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10.5898" cy="10.7683" r="9" stroke={isActive ? '#4285F4' : '#5D7285'} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M11.5905 1.81641C11.2425 2.1093 10.929 2.45495 10.6622 2.85096C9.11944 5.14121 9.72538 8.2485 12.0156 9.79129C12.1964 9.91308 12.3823 10.0215 12.5721 10.1167C14.5905 11.1295 15.3611 9.76447 16.454 10.5006C17.1629 10.9782 17.3504 11.9399 16.8729 12.6488C16.3725 13.3917 15.5905 13.7683 15.7258 14.9851C15.8022 15.6719 16.2241 16.2637 16.7708 16.7683" stroke={isActive ? '#4285F4' : '#5D7285'} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M2.58984 8.04834C3.67172 8.31162 4.67284 8.93612 5.39585 9.89425C6.16652 10.9155 6.48599 12.1367 6.38769 13.3187C6.33563 13.9447 6.74389 14.5766 7.26925 14.921C7.52308 15.0873 7.75307 15.2995 7.94639 15.5557C8.80241 16.6901 8.63161 18.2793 7.58984 19.209" stroke={isActive ? '#4285F4' : '#5D7285'} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

    )
}

export const GiftIcon = ({ isActive }) => {
    return (
        <svg width="100%" height="100%" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2.58984" y="7.04004" width="20" height="5" rx="2" stroke={isActive ? '#4285F4' : '#5D7285'} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M4.58984 12.04H20.5898V19.04C20.5898 20.1446 19.6944 21.04 18.5898 21.04H6.58984C5.48527 21.04 4.58984 20.1446 4.58984 19.04V12.04Z" stroke={isActive ? '#4285F4' : '#5D7285'} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M12.5898 7.04004V21.04" stroke={isActive ? '#4285F4' : '#5D7285'} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M5.58984 5.27442C5.58984 4.04433 6.58703 3.04004 7.81712 3.04004H8.71888C10.8568 3.04004 12.5898 4.77313 12.5898 6.91101V6.91101C12.5898 6.98227 12.5321 7.04004 12.4608 7.04004H7.34984C6.37782 7.04004 5.58984 6.24644 5.58984 5.27442V5.27442Z" stroke={isActive ? '#4285F4' : '#5D7285'} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M19.5898 5.27442C19.5898 4.04433 18.5927 3.04004 17.3626 3.04004H16.4608C14.3229 3.04004 12.5898 4.77313 12.5898 6.91101V6.91101C12.5898 6.98227 12.6476 7.04004 12.7189 7.04004H17.8298C18.8019 7.04004 19.5898 6.24644 19.5898 5.27442V5.27442Z" stroke={isActive ? '#4285F4' : '#5D7285'} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    )
}

export const RadarIcon = ({isActive})=>{
    return(
        <svg width="100%" height="100%" viewBox="0 0 25 25" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M1.00488 10.4162C1.05615 10.039 1.09717 9.65701 1.16382 9.27989C1.58936 6.9584 2.74805 5.02382 4.59375 3.47126C6.15747 2.15869 7.97754 1.34568 10.0437 1.0959C13.4583 0.679597 16.4114 1.61995 18.8979 3.89246C19.1953 4.16673 19.1799 4.50957 18.8723 4.80343C18.1033 5.53808 17.3342 6.26783 16.5652 7.00248C15.6731 7.85467 14.7759 8.70687 13.8787 9.55906C13.8274 9.60804 13.7556 9.64232 13.6992 9.6815C13.9556 10.1125 14.0837 10.5239 14.0889 10.9696C14.1094 12.1499 13.2122 13.2078 12.0125 13.4233C10.7512 13.6437 9.53101 13.007 9.08496 11.8903C8.70044 10.9206 8.96704 9.85292 9.7771 
            9.16235C10.5718 8.48157 11.7253 8.33954 12.679 8.80972C12.7969 8.86849 12.8687 8.87828 12.9763 8.77543C13.571 8.19261 14.1812 7.61959 14.7964 7.03187C14.3093 6.64985 13.7761 6.36578 13.1814 6.19437C11.146 5.61154 9.32593 5.99846 7.78271 7.39429C6.80347 8.28077 6.26514 9.39744 6.20874 10.6904C6.11646 12.767 7.02393 14.3686 8.90039 15.3971C10.6128 16.3325 12.397 16.3129 14.1145 15.3922C15.668 14.5596 16.5344 13.2519 16.7754 11.5671C16.8062 11.3663 16.801 11.1655 16.8164 10.9647C16.8523 10.6219 17.124 10.3917 17.4573 10.4113C17.7854 10.4308 18.0366 10.6806 18.0366 11.0088C18.0315 11.6651 
            17.9341 12.3066 17.7136 12.9287C17.1753 14.4469 16.1807 15.6175 14.7195 16.4158C13.8428 16.8958 12.8943 17.1651 11.8792 17.2141C10.2334 17.2974 8.76196 16.8615 7.46484 15.8966C6.29077 15.02 5.52686 13.8837 5.14746 12.5075C4.50147 10.137 5.46021 7.52163 7.51099 6.04744C8.87476 5.0679 10.4077 4.6467 12.1047 4.78384C13.3198 4.88179 14.4272 5.2932 15.4065 5.99846C15.4885 6.05723 15.5706 6.116 15.6372 6.16498C16.2781 5.55277 16.9138 4.94546 17.5701 4.32346C17.365 4.16673 17.1548 3.99531 16.9292 3.83859C15.8064 3.06476 14.5605 2.5554 13.1968 2.30562C8.50562 1.45343 3.8811 4.21081 2.5686 
            8.65789C1.34839 12.7866 3.5376 17.2582 7.63916 19.0262C12.4175 21.0882 17.9495 19.0556 20.031 14.4616C20.5027 13.4135 20.7488 12.3213 20.7744 11.1802C20.7795 11.0626 20.7795 10.9451 20.8103 10.8325C20.8821 10.5876 21.0667 10.4504 21.323 10.4162C21.5742 10.3868 21.7742 10.4896 21.9126 10.6904C21.9434 10.7394 21.9741 10.7884 22.0049 10.8373C22.0049 11.0871 22.0049 11.332 22.0049 11.5818C21.9946 11.6504 21.9792 11.7189 21.969 11.7875C21.9177 12.1499 21.887 12.5124 21.8203 12.8699C21.4255 14.8632 20.4719 16.5872 18.9749 18.0271C17.406 19.5356 15.5193 20.4906 13.3198 20.8482C12.925 20.9118 
            12.5251 20.951 12.1252 21C11.7151 21 11.3049 21 10.8948 21C10.623 20.9706 10.3513 20.9412 10.0847 20.9069C7.99292 20.6278 6.14209 19.8295 4.56812 18.4924C2.73779 16.9398 1.59448 15.0151 1.17407 12.7132C1.09717 12.3458 1.05615 11.9638 1.00488 11.5867C1.00488 11.1949 1.00488 10.8031 1.00488 10.4162ZM12.8635 10.999C12.8635 10.2839 12.2637 9.70599 11.5151 9.70599C10.7666 9.70109 10.1565 10.2741 10.1514 10.9892C10.1462 11.7091 10.7563 12.2969 11.51 12.292C12.2585 12.292 12.8584 11.714 12.8635 10.999Z" fill="#5D7285" stroke={isActive ? '#4285F4':'#5D7285'} stroke-width="0.5"/>
        </svg>
    )
}

export const MapIcon = ({ isActive }) => {
    return (
        <svg width="100%" height="100%" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.58984 17.3453V3.68414C1.58984 3.25371 1.86527 2.87157 2.27362 2.73545L6.95739 1.1742C7.36792 1.03735 7.81177 1.03735 8.2223 1.1742L12.9574 2.75256C13.3679 2.8894 13.8118 2.8894 14.2223 2.75256L18.2736 1.40212C18.9211 1.18628 19.5898 1.66825 19.5898 2.35081V15.3453C19.5898 15.7241 19.3758 16.0704 19.0371 16.2398L14.4843 18.5162C13.9212 18.7977 13.2585 18.7977 12.6954 18.5162L8.48427 16.4106C7.92122 16.1291 7.25847 16.1291 6.69542 16.4106L3.03706 18.2398C2.37216 18.5722 1.58984 18.0887 1.58984 17.3453Z" stroke={isActive ? '#4285F4' : '#5D7285'} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M13.5898 2.96338V18.4634" stroke={isActive ? '#4285F4' : '#5D7285'} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M7.58984 1.96338L7.58984 15.9634" stroke={isActive ? '#4285F4' : '#5D7285'} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    )
}

export const DroneIcon = ({ isActive }) => {
    return (
        <svg width="100%" height="100%" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.5898 10.2349H14.5898V14.2349H10.5898V10.2349Z" stroke={isActive ? '#4285F4' : '#5D7285'} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M10.5898 10.2349L7.08984 6.73486" stroke={isActive ? '#4285F4' : '#5D7285'} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M10.5507 6.23477C10.4588 5.59134 10.1894 4.98622 9.77295 4.48723C9.35646 3.98823 8.80925 3.61507 8.19262 3.40955C7.576 3.20403 6.91433 3.17428 6.28174 3.32362C5.64916 3.47297 5.07066 3.79551 4.61106 4.25511C4.15146 4.71471 3.82892 5.29321 3.67958 5.92579C3.53024 6.55837 3.55999 7.22004 3.76551 7.83667C3.97103 8.45329 4.34419 9.0005 4.84318 9.417C5.34218 9.83349 5.94729 10.1028 6.59073 10.1948" stroke={isActive ? '#4285F4' : '#5D7285'} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M14.5898 10.2349L18.0898 6.73486" stroke={isActive ? '#4285F4' : '#5D7285'} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M18.5889 10.1948C19.2323 10.1028 19.8375 9.83349 20.3365 9.417C20.8354 9.0005 21.2086 8.45329 21.4141 7.83667C21.6196 7.22004 21.6494 6.55837 21.5001 5.92579C21.3507 5.29321 21.0282 4.71471 20.5686 4.25511C20.109 3.79551 19.5305 3.47297 18.8979 3.32362C18.2653 3.17428 17.6036 3.20403 16.987 3.40955C16.3704 3.61507 15.8232 3.98823 15.4067 4.48723C14.9902 4.98622 14.7209 5.59134 14.6289 6.23477" stroke={isActive ? '#4285F4' : '#5D7285'} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M14.5898 14.2349L18.0898 17.7349" stroke={isActive ? '#4285F4' : '#5D7285'} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M14.6289 18.2349C14.7209 18.8783 14.9902 19.4835 15.4067 19.9824C15.8232 20.4814 16.3704 20.8546 16.987 21.0601C17.6036 21.2656 18.2653 21.2954 18.8979 21.1461C19.5305 20.9967 20.109 20.6742 20.5686 20.2146C21.0282 19.755 21.3507 19.1765 21.5001 18.5439C21.6494 17.9113 21.6196 17.2496 21.4141 16.633C21.2086 16.0164 20.8354 15.4692 20.3365 15.0527C19.8375 14.6362 19.2323 14.3669 18.5889 14.2749" stroke={isActive ? '#4285F4' : '#5D7285'} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M10.5898 14.2349L7.08984 17.7349" stroke={isActive ? '#4285F4' : '#5D7285'} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M6.59073 14.2749C5.94729 14.3669 5.34218 14.6362 4.84318 15.0527C4.34419 15.4692 3.97103 16.0164 3.76551 16.633C3.55999 17.2496 3.53024 17.9113 3.67958 18.5439C3.82892 19.1765 4.15146 19.755 4.61106 20.2146C5.07066 20.6742 5.64916 20.9967 6.28174 21.1461C6.91433 21.2954 7.576 21.2656 8.19262 21.0601C8.80925 20.8546 9.35646 20.4814 9.77295 19.9824C10.1894 19.4835 10.4588 18.8783 10.5507 18.2349" stroke={isActive ? '#4285F4' : '#5D7285'} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    )
}


export const ShoppingBagsIcon = ({ isActive }) => {
    return (
        <svg width="100%" height="100%" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.5898 21.5063H5.58984C4.48527 21.5063 3.58984 20.6109 3.58984 19.5063V8.50635C3.58984 7.95406 4.03756 7.50635 4.58984 7.50635H14.5898C15.1421 7.50635 15.5898 7.95406 15.5898 8.50635V11.0063" stroke={isActive ? '#4285F4' : '#5D7285'} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M9.58984 12.5063C9.58984 11.9541 10.0376 11.5063 10.5898 11.5063H20.5898C21.1421 11.5063 21.5898 11.9541 21.5898 12.5063V19.5063C21.5898 20.6109 20.6944 21.5063 19.5898 21.5063H11.5898C10.4853 21.5063 9.58984 20.6109 9.58984 19.5063V12.5063Z" stroke={isActive ? '#4285F4' : '#5D7285'} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M12.5898 7.50635V6.50635C12.5898 4.84949 11.2467 3.50635 9.58984 3.50635V3.50635C7.93299 3.50635 6.58984 4.84949 6.58984 6.50635V7.50635" stroke={isActive ? '#4285F4' : '#5D7285'} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M13.5898 14.5063L13.5898 15.5063C13.5898 16.6109 14.4853 17.5063 15.5898 17.5063V17.5063C16.6944 17.5063 17.5898 16.6109 17.5898 15.5063L17.5898 14.5063" stroke={isActive ? '#4285F4' : '#5D7285'} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    )
}

export const WalletIcon = ({ isActive }) => {
    return (
        <svg width="100%" height="100%" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.5898 8.77808V6.77808C19.5898 5.67351 18.6944 4.77808 17.5898 4.77808H6.58984C5.48527 4.77808 4.58984 5.67351 4.58984 6.77808V18.7781C4.58984 19.8826 5.48527 20.7781 6.58984 20.7781H17.5898C18.6944 20.7781 19.5898 19.8826 19.5898 18.7781V16.7781" stroke={isActive ? '#4285F4' : '#5D7285'} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <rect x="13.5898" y="8.77808" width="8" height="8" rx="1" stroke={isActive ? '#4285F4' : '#5D7285'} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <circle cx="17.5898" cy="12.7781" r="1.5" fill="#5D7285" />
        </svg>

    )
}

export const HelpQuestionIcon = ({ isActive, color }) => {
    return (
        <svg width="100%" height="100%" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.5898 9.42969C10.5898 9.03413 10.7071 8.64745 10.9269 8.31855C11.1467 7.98965 11.459 7.7333 11.8245 7.58193C12.1899 7.43055 12.5921 7.39095 12.98 7.46812C13.368 7.54529 13.7244 7.73577 14.0041 8.01548C14.2838 8.29518 14.4742 8.65155 14.5514 9.03951C14.6286 9.42747 14.589 9.8296 14.4376 10.1951C14.2862 10.5605 14.0299 10.8729 13.701 11.0926C13.3721 11.3124 12.9854 11.4297 12.5898 11.4297V12.4297M14.8398 19.4297L13.3898 21.363C12.9898 21.8964 12.1898 21.8964 11.7898 21.363L10.3398 19.4297H7.58984C5.3807 19.4297 3.58984 17.6388 3.58984 15.4297V7.42969C3.58984 5.22055 5.3807 3.42969 7.58984 3.42969H17.5898C19.799 3.42969 21.5898 5.22055 21.5898 7.42969V15.4297C21.5898 17.6388 19.799 19.4297 17.5898 19.4297H14.8398Z" stroke={color ? 'white' : isActive ? '#4285F4' : '#5D7285'} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <circle cx="12.5898" cy="15.4297" r="1" fill={color | `#5D7285`} />
        </svg>
    )
}

export const LogoutIcon = ({ isActive }) => {
    return (
        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.5898 17.2013V19.7013C15.5898 20.8059 14.6944 21.7013 13.5898 21.7013H6.58984C5.48527 21.7013 4.58984 20.8059 4.58984 19.7013V5.70129C4.58984 4.59672 5.48527 3.70129 6.58984 3.70129H13.5898C14.6944 3.70129 15.5898 4.59672 15.5898 5.70129V8.76379M11.5898 12.7013H21.5898M21.5898 12.7013L19.0898 10.2013M21.5898 12.7013L19.0898 15.2013" stroke={isActive ? '#4285F4' : '#5D7285'} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    )
}

export const ArrowCompressIcon = ({ isActive }) => {
    return (
        <svg width="100%" height="100%" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.70703 17.2885H14.7781M14.7781 17.2885L11.2426 13.7529M14.7781 17.2885L11.2426 20.824" stroke={isActive ? '#4285F4' : '#5D7285'} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M27.5059 17.2885L20.4348 17.2885M20.4348 17.2885L23.9703 20.824M20.4348 17.2885L23.9703 13.7529" stroke={isActive ? '#4285F4' : '#5D7285'} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    )
}

export const ArrowExpandIcon = ({ isActive }) => {
    return (
        <svg width="100%" height="100%" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.5 12L4.5 12M20.5 12L17 15.5M20.5 12L17 8.5M4.5 12L8 8.5M4.5 12L8 15.5" stroke={isActive ? '#4285F4' : '#5D7285'} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

    )
}

export const UserIcon = () => {
    return (
        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.9696 19.5047C16.7257 17.5293 15.0414 16 13 16H11C8.95858 16 7.27433 17.5293 7.03036 19.5047M16.9696 19.5047C19.3986 17.893 21 15.1335 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 15.1335 4.60137 17.893 7.03036 19.5047M16.9696 19.5047C15.5456 20.4496 13.8371 21 12 21C10.1629 21 8.45441 20.4496 7.03036 19.5047M15 10C15 11.6569 13.6569 13 12 13C10.3431 13 9 11.6569 9 10C9 8.34315 10.3431 7 12 7C13.6569 7 15 8.34315 15 10Z" stroke="#5D7285" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

    )
}

export const ShareIcon = ({ color }) => {
    return (
        <svg width="100%" height="100%" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M27 1.5L1.5 9.47058L12.75 15.75M27 1.5L18.75 27L12.75 15.75M27 1.5L12.75 15.75" stroke={color || '#4285F4'} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

    )
}

export const FacebookIcon = () => {
    return (
        <svg width="10" height="19" viewBox="0 0 10 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.34475 10.6068L9.86301 7.19417H6.621V4.98058C6.621 4.04672 7.07306 3.13592 8.52512 3.13592H10V0.230583C10 0.230583 8.6621 0 7.38356 0C4.71233 0 2.96804 1.63483 2.96804 4.5932V7.19417H0V10.6068H2.96804V18.857C3.56393 18.9516 4.17352 19 4.79452 19C5.41553 19 6.02511 18.9516 6.621 18.857V10.6068H9.34475Z" fill="#0000FF" />
        </svg>
    )
}

export const LinkedInIcon = () => {
    return (
        <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_372_3677)">
                <path d="M0 3.16832C0 2.52481 0.225232 1.99392 0.675676 1.57566C1.12612 1.15737 1.71172 0.948242 2.43243 0.948242C3.14029 0.948242 3.71299 1.15415 4.15058 1.566C4.60102 1.99071 4.82626 2.54411 4.82626 3.22623C4.82626 3.844 4.60747 4.35878 4.16988 4.77064C3.71944 5.19535 3.12741 5.4077 2.39382 5.4077H2.37452C1.66666 5.4077 1.09396 5.19535 0.656371 4.77064C0.218784 4.34593 0 3.81181 0 3.16832ZM0.250965 20.0602V7.16446H4.53668V20.0602H0.250965ZM6.9112 20.0602H11.1969V12.8594C11.1969 12.409 11.2484 12.0615 11.3514 11.817C11.5315 11.3794 11.805 11.0094 12.1718 10.7069C12.5386 10.4045 12.9987 10.2533 13.5521 10.2533C14.9936 10.2533 15.7143 11.2249 15.7143 13.1683V20.0602H20V12.6664C20 10.7616 19.5496 9.31697 18.6486 8.33241C17.7477 7.34786 16.5573 6.85558 15.0772 6.85558C13.417 6.85558 12.1236 7.56986 11.1969 8.99844V9.03705H11.1776L11.1969 8.99844V7.16446H6.9112C6.93693 7.57629 6.94981 8.85685 6.94981 11.0062C6.94981 13.1554 6.93693 16.1735 6.9112 20.0602Z" fill="#0000FF" />
            </g>
            <defs>
                <clipPath id="clip0_372_3677">
                    <rect width="20" height="20" fill="white" transform="translate(0 0.5)" />
                </clipPath>
            </defs>
        </svg>

    )
}

export const GoogleIcon = () => {
    return (
        <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_372_3679)">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M19.6 10.7271C19.6 10.018 19.5364 9.33619 19.4182 8.68164H10V12.5498H15.3818C15.15 13.7998 14.4455 14.8589 13.3864 15.568V18.0771H16.6182C18.5091 16.3362 19.6 13.7725 19.6 10.7271Z" fill="#0000FF" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M9.99984 20.5004C12.6998 20.5004 14.9635 19.6049 16.618 18.0777L13.3862 15.5686C12.4907 16.1686 11.3453 16.5231 9.99984 16.5231C7.39529 16.5231 5.19075 14.764 4.40439 12.4004H1.06348V14.9913C2.70893 18.2595 6.09075 20.5004 9.99984 20.5004Z" fill="#0000FF" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M4.40455 12.3997C4.20455 11.7997 4.09091 11.1588 4.09091 10.4997C4.09091 9.84061 4.20455 9.1997 4.40455 8.5997V6.00879H1.06364C0.386364 7.35879 0 8.88606 0 10.4997C0 12.1133 0.386364 13.6406 1.06364 14.9906L4.40455 12.3997Z" fill="#0000FF" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M9.99984 4.47727C11.468 4.47727 12.7862 4.98182 13.8226 5.97273L16.6907 3.10455C14.9589 1.49091 12.6953 0.5 9.99984 0.5C6.09075 0.5 2.70893 2.74091 1.06348 6.00909L4.40439 8.6C5.19075 6.23636 7.39529 4.47727 9.99984 4.47727Z" fill="#0000FF" />
            </g>
            <defs>
                <clipPath id="clip0_372_3679">
                    <rect y="0.5" width="20" height="20" rx="6" fill="white" />
                </clipPath>
            </defs>
        </svg>

    )
}

export const XIcon = () => {
    return (
        <svg width="20" height="25" viewBox="0 0 20 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.3678 3.34533L19.1348 3.36336L1.78434 21.9095L0.0161908 21.9233L17.3678 3.34533Z" fill="#0000FF" />
            <mask id="path-2-inside-1_372_3681" fill="white">
                <path d="M0.176241 3.28207L6.113 3.31181L19.828 21.7145L13.9072 21.7145L0.176241 3.28207Z" />
            </mask>
            <path d="M0.176241 3.28207L6.113 3.31181L19.828 21.7145L13.9072 21.7145L0.176241 3.28207Z" fill="white" />
            <path d="M0.176241 3.28207L0.241373 -9.71777L-25.8155 -9.84832L-10.2491 11.0482L0.176241 3.28207ZM6.113 3.31181L16.5366 -4.4566L12.662 -9.65554L6.17813 -9.68802L6.113 3.31181ZM19.828 21.7145L19.828 34.7145L45.7297 34.7145L30.2516 13.9461L19.828 21.7145ZM13.9072 21.7145L3.48185 29.4807L7.38071 34.7145L13.9072 34.7145L13.9072 21.7145ZM0.11111 16.2819L6.04787 16.3117L6.17813 -9.68802L0.241373 -9.71777L0.11111 16.2819ZM-4.31061 11.0802L9.40439 29.4829L30.2516 13.9461L16.5366 -4.4566L-4.31061 11.0802ZM19.828 8.71452L13.9072 8.71452L13.9072 34.7145L19.828 34.7145L19.828 8.71452ZM24.3325 13.9484L10.6015 -4.48407L-10.2491 11.0482L3.48185 29.4807L24.3325 13.9484Z" fill="#0000FF" mask="url(#path-2-inside-1_372_3681)" />
        </svg>

    )
}

export const FriendsIcon = () => {
    return (
        <svg width="100%" height="100%" viewBox="0 0 28 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.25 20.9163V19.4997C1.25 16.3701 3.78705 13.833 6.91667 13.833H12.5833C15.7129 13.833 18.25 16.3701 18.25 19.4997V20.9163M18.25 9.58301C20.5972 9.58301 22.5 7.68022 22.5 5.33301C22.5 2.9858 20.5972 1.08301 18.25 1.08301M26.75 20.9163V19.4997C26.75 16.3701 24.2129 13.833 21.0833 13.833H20.375M14 5.33301C14 7.68022 12.0972 9.58301 9.75 9.58301C7.40279 9.58301 5.5 7.68022 5.5 5.33301C5.5 2.9858 7.40279 1.08301 9.75 1.08301C12.0972 1.08301 14 2.9858 14 5.33301Z" stroke="#4285F4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

    )
}

export const PropertyIcon = () => {
    return (
        <svg width="100%" height="100%" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.18551 9.4818V21.3337C4.18551 22.4382 5.08094 23.3337 6.18551 23.3337H13.0003M4.18551 9.4818L12.2932 1.3741C12.6837 0.983574 13.3169 0.983575 13.7074 1.3741L20.792 8.45866M4.18551 9.4818L1.66699 12.0003M21.8151 9.4818V21.3337C21.8151 22.4382 20.9197 23.3337 19.8151 23.3337H13.0003M21.8151 9.4818L24.3337 12.0003M21.8151 9.4818L20.792 8.45866M20.792 8.45866V3.50032M13.0003 23.3337V16.2503" stroke="#4285F4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

    )
}

export const MagnifyingGlassIcon = () => {
    return (
        <svg width="100%" height="100%" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M10.7118 11.7481C8.12238 13.822 4.33202 13.6588 1.93164 11.2584C-0.643879 8.6829 -0.643879 4.50716 1.93164 1.93164C4.50716 -0.64388 8.68289 -0.643879 11.2584 1.93164C13.6588 4.33202 13.822 8.12238 11.7481 10.7118L16.7854 15.7491C17.0715 16.0352 17.0715 16.4992 16.7854 16.7854C16.4992 17.0715 16.0352 17.0715 15.7491 16.7854L10.7118 11.7481ZM2.96795 10.2221C0.964766 8.21893 0.964766 4.97113 2.96795 2.96795C4.97113 0.964767 8.21892 0.964767 10.2221 2.96795C12.2238 4.96966 12.2253 8.21416 10.2265 10.2177C10.225 10.2192 10.2236 10.2206 10.2221 10.2221C10.2206 10.2236 10.2192 10.225 10.2177 10.2265C8.21416 12.2253 4.96966 12.2238 2.96795 10.2221Z" fill="#252530" fillOpacity="0.55" />
        </svg>

    )
}

export const WarningIcon = () => {
    return (
        <svg width="100%" height="100%" viewBox="0 0 24 25" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 7.5V13.5M21 12.5C21 17.4706 16.9706 21.5 12 21.5C7.02944 21.5 3 17.4706 3 12.5C3 7.52944 7.02944 3.5 12 3.5C16.9706 3.5 21 7.52944 21 12.5Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <circle cx="12" cy="17" r="1" fill="black" />
        </svg>
    )
}

export const LocationPointIcon = () => {
    return (
        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="10" r="3" stroke="#222222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M19 9.75C19 15.375 12 21 12 21C12 21 5 15.375 5 9.75C5 6.02208 8.13401 3 12 3C15.866 3 19 6.02208 19 9.75Z" stroke="#222222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

    )
}

export const ChevronRightIcon = () => {
    return (
        <svg width="100%" height="100%" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.5 1L7.79289 7.29289C8.18342 7.68342 8.18342 8.31658 7.79289 8.70711L1.5 15" stroke="#222222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

    )
}

export const CloseIcon = () => {
    return (
        <svg width="100%" height="100%" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.3767 0.358305C13.9425 -0.0759428 13.241 -0.0759428 12.8067 0.358305L7.36195 5.79197L1.91714 0.34717C1.4829 -0.0870776 0.781418 -0.0870776 0.34717 0.34717C-0.0870776 0.781418 -0.0870776 1.4829 0.34717 1.91714L5.79197 7.36195L0.34717 12.8067C-0.0870776 13.241 -0.0870776 13.9425 0.34717 14.3767C0.781418 14.811 1.4829 14.811 1.91714 14.3767L7.36195 8.93192L12.8067 14.3767C13.241 14.811 13.9425 14.811 14.3767 14.3767C14.811 13.9425 14.811 13.241 14.3767 12.8067L8.93192 7.36195L14.3767 1.91714C14.7998 1.49403 14.7998 0.781419 14.3767 0.358305Z" fill="#222222" />
        </svg>

    )
}
export const CloseIconWhite = () => {
    return (
        <svg width="100%" height="100%" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.3767 0.358305C13.9425 -0.0759428 13.241 -0.0759428 12.8067 0.358305L7.36195 5.79197L1.91714 0.34717C1.4829 -0.0870776 0.781418 -0.0870776 0.34717 0.34717C-0.0870776 0.781418 -0.0870776 1.4829 0.34717 1.91714L5.79197 7.36195L0.34717 12.8067C-0.0870776 13.241 -0.0870776 13.9425 0.34717 14.3767C0.781418 14.811 1.4829 14.811 1.91714 14.3767L7.36195 8.93192L12.8067 14.3767C13.241 14.811 13.9425 14.811 14.3767 14.3767C14.811 13.9425 14.811 13.241 14.3767 12.8067L8.93192 7.36195L14.3767 1.91714C14.7998 1.49403 14.7998 0.781419 14.3767 0.358305Z" fill="white" />
        </svg>
    )
}
export const SuccessIconwhite = () => {
    return (
        <svg width="100%" height="100%" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 0.5C4.032 0.5 0 4.532 0 9.5C0 14.468 4.032 18.5 9 18.5C13.968 18.5 18 14.468 18 9.5C18 4.532 13.968 0.5 9 0.5ZM9 16.7C5.031 16.7 1.8 13.469 1.8 9.5C1.8 5.531 5.031 2.3 9 2.3C12.969 2.3 16.2 5.531 16.2 9.5C16.2 13.469 12.969 16.7 9 16.7ZM12.492 6.161L7.2 11.453L5.508 9.761C5.157 9.41 4.59 9.41 4.239 9.761C3.888 10.112 3.888 10.679 4.239 11.03L6.57 13.361C6.921 13.712 7.488 13.712 7.839 13.361L13.77 7.43C14.121 7.079 14.121 6.512 13.77 6.161C13.419 5.81 12.843 5.81 12.492 6.161Z" fill="white" />
        </svg>
    )
}

export const ArrowLeftIcon = () => {
    return (
        <svg width="100%" height="100%" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 7H1M1 7L7 1M1 7L7 13" stroke="#222222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

    )
}

export const ShieldIcon = () => {
    return (
        <svg width="100%" height="100%" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.34875 9.50002L7.34875 11.5L11.5 7.34878M7.72528 1.07852L1.72528 2.7928C1.29598 2.91546 1 3.30784 1 3.75432L1 8.85384C1 12.0834 2.55966 15.1141 5.18762 16.9912L7.41876 18.5849C7.76646 18.8332 8.23354 18.8332 8.58124 18.5849L10.8124 16.9912C13.4403 15.1141 15 12.0834 15 8.85384V3.75432C15 3.30784 14.704 2.91546 14.2747 2.7928L8.27472 1.07852C8.09517 1.02721 7.90483 1.02721 7.72528 1.07852Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

    )
}

export const InfoIcon = () => {
    return (
        <svg width="100%" height="100%" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 9.16667V13.3333M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z" stroke="#222222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <circle cx="10.0003" cy="6.25008" r="0.833333" fill="#222222" />
        </svg>

    )
}

export const SuccessIcon = () => {
    return (
        <svg width="100%" height="100%" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 0.5C4.032 0.5 0 4.532 0 9.5C0 14.468 4.032 18.5 9 18.5C13.968 18.5 18 14.468 18 9.5C18 4.532 13.968 0.5 9 0.5ZM9 16.7C5.031 16.7 1.8 13.469 1.8 9.5C1.8 5.531 5.031 2.3 9 2.3C12.969 2.3 16.2 5.531 16.2 9.5C16.2 13.469 12.969 16.7 9 16.7ZM12.492 6.161L7.2 11.453L5.508 9.761C5.157 9.41 4.59 9.41 4.239 9.761C3.888 10.112 3.888 10.679 4.239 11.03L6.57 13.361C6.921 13.712 7.488 13.712 7.839 13.361L13.77 7.43C14.121 7.079 14.121 6.512 13.77 6.161C13.419 5.81 12.843 5.81 12.492 6.161Z" fill="#1FD387" />
        </svg>

    )
}

export const FailureIcon = () => {
    return (
        <svg width="100%" height="100%" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 0.5C4.032 0.5 0 4.532 0 9.5C0 14.468 4.032 18.5 9 18.5C13.968 18.5 18 14.468 18 9.5C18 4.532 13.968 0.5 9 0.5ZM9 16.7C5.031 16.7 1.8 13.469 1.8 9.5C1.8 5.531 5.031 2.3 9 2.3C12.969 2.3 16.2 5.531 16.2 9.5C16.2 13.469 12.969 16.7 9 16.7ZM11.6352 11.6648L11.6648 11.6352L9 9.00002L6.33519 11.6648L6.3046 11.6954L6.3352 11.726L8.99998 14.3908L11.6648 11.726L11.6954 11.6954L11.6648 11.6648L14.3296 9.00002L11.6648 6.33521L11.6352 6.30461L11.6046 6.3352L9 9.00002L11.6046 11.6046L11.6352 11.6352L11.6648 11.6648Z" fill="#FF5C5C"/>
        </svg>
    );
};


export const chevronDownIcon = () => {
    return (
        <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
       stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 15l7-7 7 7"
        />
      </svg>

    )
}
export const chevronUpIcon = () => {
    return (
        <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>

    )
}

export const RadarLocationIcon = () => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="6.75" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12 5.25V3" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M18.75 12H21" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12 18.75V21" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M5.25 12H3" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    )
 }

export const ChevronLeftIcon = () => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.5 19L8.20711 12.7071C7.81658 12.3166 7.81658 11.6834 8.20711 11.2929L14.5 5" stroke="#222222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    );
};
export const RectangleIcon = () => {
    return (
        <svg width="70" height="9" viewBox="0 0 70 9" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="70" height="9" rx="4.5" fill="#D9D9D9"/>
        </svg>

    );
};
export const RadarZoomOutIcon = () => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="6" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M14.5 14.5L19 19" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M8 10H10H12" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        
    );
};
export const RadarZoomInIcon = () => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="6" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M14.5 14.5L19 19" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M8 10H10M12 10H10M10 10V8M10 10V12" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        )
}
export const ClearIcon = () => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 8L16 16" stroke="#222222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M16 8L8 16" stroke="#222222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

    );
};
export const RadarLayerIcon = () => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 10L12 5L4 10L12 15L20 10Z" fill="black" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M20 14L12 19L4 14" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        
    );
};
export const DroneradarIcon = () => {
    return (
        <svg width="40" height="39" viewBox="0 0 40 39" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 17.3164H22V21.3164H18V17.3164Z" stroke="#222222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M18 17.3164L14.5 13.8164" stroke="#222222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M17.9599 13.3173C17.8679 12.6739 17.5986 12.0687 17.1821 11.5697C16.7656 11.0708 16.2184 10.6976 15.6018 10.4921C14.9852 10.2866 14.3235 10.2568 13.6909 10.4061C13.0583 10.5555 12.4798 10.878 12.0202 11.3376C11.5606 11.7972 11.2381 12.3757 11.0888 13.0083C10.9394 13.6409 10.9692 14.3026 11.1747 14.9192C11.3802 15.5358 11.7534 16.083 12.2524 16.4995C12.7514 16.916 13.3565 17.1853 13.9999 17.2773" stroke="#222222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M22 17.3164L25.5 13.8164" stroke="#222222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M26 17.2773C26.6435 17.1853 27.2486 16.916 27.7476 16.4995C28.2466 16.083 28.6197 15.5358 28.8253 14.9192C29.0308 14.3026 29.0605 13.6409 28.9112 13.0083C28.7618 12.3757 28.4393 11.7972 27.9797 11.3376C27.5201 10.878 26.9416 10.5555 26.309 10.4061C25.6764 10.2568 25.0148 10.2866 24.3981 10.4921C23.7815 10.6976 23.2343 11.0708 22.8178 11.5697C22.4013 12.0687 22.132 12.6739 22.04 13.3173" stroke="#222222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M22 21.3164L25.5 24.8164" stroke="#222222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M22.04 25.3155C22.132 25.9589 22.4013 26.564 22.8178 27.063C23.2343 27.562 23.7815 27.9352 24.3981 28.1407C25.0148 28.3462 25.6764 28.376 26.309 28.2266C26.9416 28.0773 27.5201 27.7547 27.9797 27.2951C28.4393 26.8355 28.7618 26.257 28.9112 25.6245C29.0605 24.9919 29.0308 24.3302 28.8253 23.7136C28.6197 23.097 28.2466 22.5497 27.7476 22.1332C27.2486 21.7167 26.6435 21.4474 26 21.3555" stroke="#222222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M18 21.3164L14.5 24.8164" stroke="#222222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M13.9999 21.3555C13.3565 21.4474 12.7514 21.7167 12.2524 22.1332C11.7534 22.5497 11.3802 23.097 11.1747 23.7136C10.9692 24.3302 10.9394 24.9919 11.0888 25.6245C11.2381 26.257 11.5606 26.8355 12.0202 27.2951C12.4798 27.7547 13.0583 28.0773 13.6909 28.2266C14.3235 28.376 14.9852 28.3462 15.6018 28.1407C16.2184 27.9352 16.7656 27.562 17.1821 27.063C17.5986 26.564 17.8679 25.9589 17.9599 25.3155" stroke="#222222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

    );
};
