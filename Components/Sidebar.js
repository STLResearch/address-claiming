import React, { Fragment, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { createPortal } from 'react-dom';
import Spinner from './Spinner';
import Backdrop from './Backdrop';
import logo from '../public/images/logo.jpg';
import logoNoChars from '../public/images/logo-no-chars.png';
import { ArrowCompressIcon, ArrowExpandIcon, DashboardIcon, DroneIcon, EarthIcon, GiftIcon, HelpQuestionIcon, LogoutIcon, MapIcon, ShoppingBagsIcon, WalletIcon } from './Icons';
import { useAuth } from '@/hooks/useAuth';

const Sidebar = () => {
  const router = useRouter();
  const { asPath } = router;
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { signOut } = useAuth();

  const SidebarItem = ({ href, text, children, style, onClick, numberOfUnseenNotifications }) => {
    const isActive = asPath.includes(href);

    if (onClick !== undefined) {
      return (
        <div onClick={onClick} className={`${style || ''} cursor-pointer py-[7.32px] flex items-center gap-[14.64px] px-[14.64px] w-full hover:text-[#4285F4] hover:bg-[#E9F5FE] hover:font-semibold ${isActive && 'bg-[#E9F5FE] text-[#4285F4]'} rounded-[3.66px]`}>
          <div className='w-6 h-6 flex items-center justify-center'>
            {React.cloneElement(children, { isActive })}
          </div>
          {
            !isCollapsed &&
            <p className={`${isActive ? 'font-semibold text-[#4285F4]' : 'font-normal text-[#5D7285]'} text-[14.64px] tracking-[1%]`}>{text}</p>
          }
        </div>
      )
    }

    return (
      <Link target={text === 'Help Center' ? "_blank" : "_self"} href={href} className={`${style || ''} relative py-[7.32px] flex items-center gap-[14.64px] px-[14.64px] w-full hover:text-[#4285F4] hover:bg-[#E9F5FE] hover:font-semibold ${isActive && 'bg-[#E9F5FE] text-[#4285F4]'} rounded-[3.66px]`}>
        <div className='relative w-6 h-6 flex items-center justify-center'>
          {React.cloneElement(children, { isActive })}
          {(numberOfUnseenNotifications >= 1 && isCollapsed) && <div className='absolute bg-[#E04F64] left-[110%] top-1/2 -translate-y-1/2 p-[7px] text-white w-[18px] h-[19px] text-[11.89px] leading-[0px] font-normal flex items-center justify-center rounded-[3px]'>{numberOfUnseenNotifications}</div>}
        </div>
        {
          !isCollapsed &&
          <>
            <p className={`${isActive ? 'font-semibold text-[#4285F4]' : 'font-normal text-[#5D7285]'} text-[14.64px] tracking-[1%]`}>{text}</p>
            {(!isCollapsed && numberOfUnseenNotifications >= 1) && <div className='bg-[#E04F64] p-[7px] text-white w-[18px] h-[19px] text-[11.89px] font-normal flex items-center justify-center rounded-[3px] ml-auto leading-[0px]'>{numberOfUnseenNotifications}</div>}
          </>
        }
      </Link>
    )
  }

  const SidebarItemMobile = ({ href, text, children, numberOfUnseenNotifications }) => {
    const isActive = asPath.includes(href);

    return (
      <Link href={href} className={`py-[16.87px] flex flex-col items-center gap-2 px-[11.77px] w-full ${isActive && 'text-[#4285F4]'} rounded-[3.66px]`}>
        <div className='relative w-5 h-5 flex items-center justify-center'>
          {React.cloneElement(children, { isActive })}
          {numberOfUnseenNotifications !== 0 && <div className='bg-[#E04F64] rounded-[50%] absolute -bottom-1 -right-1 w-3 h-3'></div>}
        </div>
        <p className={`${isActive ? 'font-semibold text-[#4285F4]' : 'font-normal text-[#5D7285]'} text-[11px] tracking-[1%]`}>{text}</p>
      </Link>
    )
  }

  const logoutHandler = () => {
    setIsLoading(true);
    localStorage.removeItem('openlogin_store');
    localStorage.removeItem('user');
    localStorage.removeItem('signature');
    router.replace('/auth/join');
  };

  return (
    <Fragment>
      {isLoading &&
        createPortal(<Backdrop />, document.getElementById('backdrop-root'))}
      {isLoading &&
        createPortal(<Spinner />, document.getElementById('backdrop-root'))}
      <aside
        className='md:flex hidden relative border-e-2 bg-white px-[21.95px] py-[29.27px] items-center flex-col gap-[14.64px]'
        style={{ width: !isCollapsed ? '297.29px' : "98.2833px", height: '100vh', transition: "width 0.3s ease" }}
      >
       <a href={'/homepage/dashboard2'}>
          <Image
          src={logoNoChars}
          alt="Company's logo"
          width={isCollapsed ? 44.62 : 0}
          height={isCollapsed ? 51 : 0}
          className={`${isCollapsed ? 'opacity-100 mb-[29.27px] w-[44.62px] h-[51px]' : 'opacity-0 mb-0 w-0 h-0'}`}
          style={{ transition: "all 0.3s ease" }}
        />
        </a>
        <Image
          src={logo}
          alt="Company's logo"
          width={isCollapsed ? 0 : 147}
          height={isCollapsed ? 0 : 58}
          className={`${isCollapsed ? 'opacity-0 mb-0 w-0 h-0' : 'opacity-100 mt-[-14.64px] mb-[29.27px] w-[147px] h-[58px]'}`}
          style={{ transition: "all 0.3s ease" }}
        />
        <SidebarItem href={'/homepage/dashboard2'} text={'Dashboard'} children={<DashboardIcon />} />
        <SidebarItem href={'/homepage/airspace2'} text={'Airspaces'} children={<EarthIcon />} />
        <SidebarItem href={'/homepage/referral'} text={'Referral Program'} children={<GiftIcon />} />
        <div className='bg-[#00000012] w-full h-[1px]' />
        {!isCollapsed && <p className='font-normal tracking-[1%] text-[#5D7285] self-start px-[14.64px]'>MARKETPLACE</p>}
        <SidebarItem href={'/homepage/buy'} text={'Buy Airspace'} children={<MapIcon />} />
        <SidebarItem href={'/homepage/rent'} text={'Rent Airspace'} children={<DroneIcon />} />
        <SidebarItem href={'/homepage/portfolio'} text={'Portfolio'} children={<ShoppingBagsIcon />} numberOfUnseenNotifications={0} />
        <SidebarItem href={'/homepage/funds'} text={'Funds'} children={<WalletIcon />} />
        <div className='bg-[#00000012] w-full h-[1px]' />
        <SidebarItem href={'https://skytrade.tawk.help'} text={'Help Center'} children={<HelpQuestionIcon />} />
        <SidebarItem onClick={logoutHandler} text={'Logout'} children={<LogoutIcon />} />
        <SidebarItem onClick={() => setIsCollapsed(prev => !prev)} text={'Collapse'} children={isCollapsed ? <ArrowExpandIcon /> : <ArrowCompressIcon />} style={"mt-auto"} />
      </aside>
      <nav className='flex md:hidden fixed bottom-0 left-0 w-full z-50 bg-white'>
        <SidebarItemMobile href={'/homepage/dashboard2'} text={"Dashboard"} children={<DashboardIcon />} numberOfUnseenNotifications={0} />
        <SidebarItemMobile href={'/homepage/airspace2'} text={"Airspaces"} children={<EarthIcon />} numberOfUnseenNotifications={0} />
        <SidebarItemMobile href={'/homepage/marketplace'} text={"Marketplace"} children={<MapIcon />} numberOfUnseenNotifications={0} />
        <SidebarItemMobile href={'/homepage/portfolio'} text={"Portfolio"} children={<ShoppingBagsIcon />} numberOfUnseenNotifications={0} />
        <SidebarItemMobile href={'/homepage/referral'} text={"Referral"} children={<GiftIcon />} numberOfUnseenNotifications={0} />
      </nav>
    </Fragment >
  );
};

export default Sidebar;
