import React, { ReactNode, useEffect, useRef } from 'react';
import {  DashboardIcon, DroneIcon, EarthIcon, GiftIcon, HelpQuestionIcon, LogoutIcon, MapIcon, ShoppingBagsIcon, WalletIcon } from './Icons';
import useAuth from '@/hooks/useAuth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { EarthIconsidebar, GiftIconsidebar } from './Shared/Icons';

interface PropsI {
  setShowMobileNavbar: React.Dispatch<React.SetStateAction<boolean>>
}

interface SidebarItemProps {
  href?: string;
  text: string;
  children: ReactNode;
  style?: string;
  onClick?: () => void;
  numberOfUnseenNotifications?: number;
  target?: string;
}

const MobileNavbar = ({ setShowMobileNavbar }: PropsI) => {
    const pathname = usePathname()
    const { signOut } = useAuth();
    const { user } = useAuth()

  const SidebarItem = ({ href, text, children, style, onClick, numberOfUnseenNotifications, target = "_self" }: SidebarItemProps) => {
      const isActive = href ? pathname?.includes(href) : false;
  
      if (onClick !== undefined) {
        return (
          <div title={text} onClick={onClick} className={`${style || ''} cursor-pointer py-[7.32px] flex items-center gap-[14.64px] px-[14.64px] w-full hover:text-[#4285F4] hover:bg-[#E9F5FE] hover:font-semibold ${isActive && 'bg-[#E9F5FE] text-[#4285F4]'} rounded-[3.66px]`}>
            <div className='w-6 h-6 flex items-center justify-center'>
              {React.cloneElement(children as React.ReactElement, { isActive })}
            </div>
            {
              <p className={`${isActive ? 'font-semibold text-[#4285F4]' : 'font-normal text-[#5D7285]'} text-[14.64px] tracking-[1%]`}>{text}</p>
            }
          </div>
        )
      }
  
      return (
        <Link title={text} target={target} href={href || ""} className={`${style || ''} ${href ? 'cursor-pointer' : 'cursor-not-allowed'} relative py-[7.32px] flex items-center gap-[14.64px] px-[14.64px] w-full hover:text-[#4285F4] hover:bg-[#E9F5FE] hover:font-semibold ${isActive && 'bg-[#E9F5FE] text-[#4285F4]'} rounded-[3.66px]`}>
          <div className='relative w-6 h-6 flex items-center justify-center'>
            {React.cloneElement(children as React.ReactElement, { isActive })}
            {(numberOfUnseenNotifications !== undefined && numberOfUnseenNotifications >= 1 ) && <div className='absolute bg-[#E04F64] left-[110%] top-1/2 -translate-y-1/2 p-[7px] text-white w-[18px] h-[19px] text-[11.89px] leading-[0px] font-normal flex items-center justify-center rounded-[3px]'>{numberOfUnseenNotifications}</div>}
          </div>
          {
           
            <>
              <p className={`${isActive ? 'font-semibold text-[#4285F4]' : 'font-normal text-[#5D7285]'} text-[14.64px] tracking-[1%]`}>{text}</p>
              {(numberOfUnseenNotifications !== undefined && numberOfUnseenNotifications >= 1) && <div className='bg-[#E04F64] p-[7px] text-white w-[18px] h-[19px] text-[11.89px] font-normal flex items-center justify-center rounded-[3px] ml-auto leading-[0px]'>{numberOfUnseenNotifications}</div>}
            </>
          }
        </Link>
      )
    }
  
    const logoutHandler = async () => {
      await signOut()
    };

    const divRef = useRef<HTMLDivElement | null>(null); 

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (divRef.current && !divRef.current.contains(event.target)) {
          setShowMobileNavbar(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [divRef])

   return ( 
    <div className=" w-full h-[70%] z-50">
    <div ref={divRef}  className=" w-full h-[80%] fixed bottom-0">
    <div className=" w-full h-full bg-white rounded-t-3xl overflow-y-scroll">
        <div onClick={() => setShowMobileNavbar(false)}  className='mt-4 flex flex-col justify-center items-center gap-4'>
            <p className='mt-4 border-4 border-dark-grey w-[20%] rounded-md'></p>
            <p className='font-medium text-xl'>Menu</p>
        </div>
        <div className='bg-white mt-4 px-6 flex flex-col gap-4 text-lg'>
            <SidebarItem href={'/dashboard'} text={'Dashboard'} children={<DashboardIcon isActive={false} />} />
            <SidebarItem href={'/airspaces'} text={'Airspaces'} children={<EarthIconsidebar isActive={false} />} />
            <SidebarItem href={'/points'} text={'Points Program'} children={<GiftIconsidebar isActive={false} />} />
            <div className='bg-[#00000012] w-full h-[1px]' />
            <p className='font-normal tracking-[1%] text-[#5D7285] self-start px-[14.64px]'>MARKETPLACE</p>
            <SidebarItem href={'https://sky.trade/waitlist'} target='_blank' text={'Buy Airspace'} children={<MapIcon isActive={false} />} />
            <SidebarItem href={'/rent'} text={'Rent Airspace'} children={<DroneIcon isActive={false} />} />
            <SidebarItem href={'/portfolio'} text={'Portfolio'} children={<ShoppingBagsIcon isActive={false} />} numberOfUnseenNotifications={0} />
            <SidebarItem href={'/funds'} text={'Funds'} children={<WalletIcon isActive={false} />} />
            <div className='bg-[#00000012] w-full h-[1px]' />
            <SidebarItem href={'https://skytrade.tawk.help'} target='_blank' text={'Help Center'} children={<HelpQuestionIcon isActive={false} color={undefined} />} />
            {user?.blockchainAddress &&
            <div onClick={logoutHandler} className='cursor-pointer mb-8 flex items-center gap-[14.64px] px-[14.64px] w-full hover:text-[#4285F4] hover:bg-[#E9F5FE] hover:font-semibold rounded-[3.66px]'>
            <div className='w-6 h-6 flex items-center justify-center'>
                <LogoutIcon isActive={false} />
            </div>
            <p className='font-normal text-[#5D7285] text-[14.64px] tracking-[1%]'>Logout</p>
        </div>
            }
            
        </div>
    </div>
     </div>
     </div>
  )
}

export default MobileNavbar
