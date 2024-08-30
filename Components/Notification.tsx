import React, { useState,  } from 'react';
import { AccountNotificationIcon, ChevronRightIcon } from './Icons';
import { useMobile } from '@/hooks/useMobile';


const VerificationNotification= () => {
  const [notificationCount, setNotificationCount] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const { isMobile } = useMobile();
  const triggerNotificationPopup = () => {
    setShowPopup(true);

  };

  return (
    <div className=''>
      <div className="relative cursor-pointer " onClick={triggerNotificationPopup}>
            <AccountNotificationIcon />
            {notificationCount > 0 &&(
                <div className="absolute top-[-6px] left-[-6px] w-[15px] h-[15px] bg-[#4285F4] rounded flex items-center justify-center text-white text-[10px] font-bold cursor-pointer">
                 {notificationCount}
                </div>
              )}
      </div>
      {showPopup && (
      <div className="">
       <div className={`fixed right-0 z-50 shadow-lg mt-10 md:mt-7 md:right-44 md:w-auto ${isMobile ? 'w-full flex justify-center' : ''}`}>

      <div className="md:w-[375px] md:h-[135px] w-[330px] py-[20px] px-[14px] md:py-[43px] md:px-[29px] flex items-center gap-4 bg-white border border-gray-100 rounded-lg">
      <div className="w-[24px] h-[24px] ">
          <AccountNotificationIcon />
        </div>
        <p className="text-[14px] text-[#222222]">
                Your airspace verification is under review. Visit the Pending Verification tab in your
                  <span className="text-[#4285F4] cursor-pointer"> Portfolio </span>
                to complete this process, we require additional documentation.
              </p>
        <div onClick={()=> { setShowPopup(false)}}  className="w-[24px] h-[24px] ">
          <ChevronRightIcon />
        </div>
      </div>
      </div>
      </div>
      )}
    </div>
  );
};

export default VerificationNotification;

