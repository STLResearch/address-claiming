import React, {useState } from 'react';
import {  DashboardIcon, DroneIcon, EarthIcon, GiftIcon, HelpQuestionIcon, LogoutIcon, MapIcon, ShoppingBagsIcon, WalletIcon,MenuIcon } from './Icons';
import useAuth from '@/hooks/useAuth';
import Link from 'next/link';
import { useRouter } from 'next/router';

const MobileNavbar = ({setShowMobileNavbar}) => {
    const router = useRouter();
    const { asPath } = router;
    const { signOut } = useAuth();

    const SidebarItem = ({ href, text, children, style, onClick, numberOfUnseenNotifications }) => {
      const isActive = href ? asPath.includes(href) : false;
  
      if (onClick !== undefined) {
        return (
          <div title={text} onClick={onClick} className={`${style || ''} cursor-pointer py-[7.32px] flex items-center gap-[14.64px] px-[14.64px] w-full hover:text-[#4285F4] hover:bg-[#E9F5FE] hover:font-semibold ${isActive && 'bg-[#E9F5FE] text-[#4285F4]'} rounded-[3.66px]`}>
            <div className='w-6 h-6 flex items-center justify-center'>
              {React.cloneElement(children, { isActive })}
            </div>
            {
              <p className={`${isActive ? 'font-semibold text-[#4285F4]' : 'font-normal text-[#5D7285]'} text-[14.64px] tracking-[1%]`}>{text}</p>
            }
          </div>
        )
      }
  
      return (
        <Link title={text} target={text === 'Help Center' ? "_blank" : "_self"} href={href} className={`${style || ''} ${href ? 'cursor-pointer' : 'cursor-not-allowed'} relative py-[7.32px] flex items-center gap-[14.64px] px-[14.64px] w-full hover:text-[#4285F4] hover:bg-[#E9F5FE] hover:font-semibold ${isActive && 'bg-[#E9F5FE] text-[#4285F4]'} rounded-[3.66px]`}>
          <div className='relative w-6 h-6 flex items-center justify-center'>
            {React.cloneElement(children, { isActive })}
            {(numberOfUnseenNotifications >= 1 ) && <div className='absolute bg-[#E04F64] left-[110%] top-1/2 -translate-y-1/2 p-[7px] text-white w-[18px] h-[19px] text-[11.89px] leading-[0px] font-normal flex items-center justify-center rounded-[3px]'>{numberOfUnseenNotifications}</div>}
          </div>
          {
           
            <>
              <p className={`${isActive ? 'font-semibold text-[#4285F4]' : 'font-normal text-[#5D7285]'} text-[14.64px] tracking-[1%]`}>{text}</p>
              {( numberOfUnseenNotifications >= 1) && <div className='bg-[#E04F64] p-[7px] text-white w-[18px] h-[19px] text-[11.89px] font-normal flex items-center justify-center rounded-[3px] ml-auto leading-[0px]'>{numberOfUnseenNotifications}</div>}
            </>
          }
        </Link>
      )
    }
  
      const logoutHandler = async () => {
        await signOut()
      };

      
    

  return (
    <div className=' absolute flex items-end h-screen z-50  w-screen'> 
    <div className="bg-white w-screen flex flex-col rounded-t-3xl overflow-y-auto" style={{ width: '100%', height: '87%' }}>
       
       <div className='   h-[50%] mt-4 flex flex-col justify-center items-center gap-7'>
           <p onClick={() => setShowMobileNavbar(false)}  className='border-4 border-dark-grey w-[20%] rounded-md'></p>
            <p className='font-medium text-xl'>Menu</p>
       </div>
       <div>
        <div className='mt-6 px-6 flex flex-col gap-[20px] text-lg '>
        <SidebarItem href={'/homepage/dashboard2'} text={'Dashboard'} children={<DashboardIcon />} />
        <SidebarItem href={'/homepage/airspace2'} text={'Airspaces'} children={<EarthIcon />} />
        <SidebarItem href={'/homepage/referral'} text={'Referral Program'} children={<GiftIcon />} />
        <div className='bg-[#00000012] w-full h-[1px]' />
       <p className='font-normal tracking-[1%] text-[#5D7285] self-start px-[14.64px]'>MARKETPLACE</p>
        <SidebarItem href={''} text={'Buy Airspace'} children={<MapIcon />} />
        <SidebarItem href={'/homepage/rent'} text={'Rent Airspace'} children={<DroneIcon />} />
        <SidebarItem href={'/homepage/portfolio'} text={'Portfolio'} children={<ShoppingBagsIcon />} numberOfUnseenNotifications={0} />
        <SidebarItem href={'/homepage/funds'} text={'Funds'} children={<WalletIcon />} />
        <SidebarItem href={'/homepage/portfolio'} text={'Portfolio'} children={<ShoppingBagsIcon />} numberOfUnseenNotifications={0} />
        <div className='bg-[#00000012] w-full h-[1px]' />
        <SidebarItem href={'https://skytrade.tawk.help'} text={'Help Center'} children={<HelpQuestionIcon />} />      
        <div  onClick={logoutHandler} className={`cursor-pointer mb-8  flex items-center gap-[14.64px] px-[14.64px] w-full hover:text-[#4285F4] hover:bg-[#E9F5FE] hover:font-semibold rounded-[3.66px]`}>       
            <div className='w-6 h-6 flex items-center justify-center'>
            <LogoutIcon />
            </div>
            <p className='font-normal text-[#5D7285] text-[14.64px] tracking-[1%]'>Logout</p>
        </div>
        </div>       
       </div>
       </div>
    </div> 
   
  )
}

export default MobileNavbar
