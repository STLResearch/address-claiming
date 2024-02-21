import React, { Fragment, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { createPortal } from 'react-dom';
import Spinner from './Spinner';
import Backdrop from './Backdrop';
import logo from '../public/images/logo.jpg';
import logoNoChars from '../public/images/logo-no-chars.png';
import {
  ArrowCompressIcon,
  ArrowExpandIcon,
  DashboardIcon,
  DroneIcon,
  EarthIcon,
  GiftIcon,
  HelpQuestionIcon,
  LogoutIcon,
  MapIcon,
  ShoppingBagsIcon,
  WalletIcon,
} from './Icons';
import { useAuth } from '@/hooks/useAuth';
import { Web3AuthNoModal } from '@web3auth/no-modal';

const Sidebar = () => {
  const router = useRouter();
  const { asPath } = router;
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { signOut } = useAuth();

  const SidebarItem = ({
    href,
    text,
    children,
    style,
    onClick,
    numberOfUnseenNotifications,
  }) => {
    const isActive = asPath.includes(href);

    if (onClick !== undefined) {
      return (
        <div
          onClick={onClick}
          className={`${style || ''} flex w-full cursor-pointer items-center gap-[14.64px] px-[14.64px] py-[7.32px] hover:bg-[#E9F5FE] hover:font-semibold hover:text-[#4285F4] ${isActive && 'bg-[#E9F5FE] text-[#4285F4]'} rounded-[3.66px]`}
        >
          <div className='flex h-6 w-6 items-center justify-center'>
            {React.cloneElement(children, { isActive })}
          </div>
          {!isCollapsed && (
            <p
              className={`${isActive ? 'font-semibold text-[#4285F4]' : 'font-normal text-[#5D7285]'} text-[14.64px] tracking-[1%]`}
            >
              {text}
            </p>
          )}
        </div>
      );
    }

    return (
      <Link
        target={text === 'Help Center' ? '_blank' : '_self'}
        href={href}
        className={`${style || ''} relative flex w-full items-center gap-[14.64px] px-[14.64px] py-[7.32px] hover:bg-[#E9F5FE] hover:font-semibold hover:text-[#4285F4] ${isActive && 'bg-[#E9F5FE] text-[#4285F4]'} rounded-[3.66px]`}
      >
        <div className='relative flex h-6 w-6 items-center justify-center'>
          {React.cloneElement(children, { isActive })}
          {numberOfUnseenNotifications >= 1 && isCollapsed && (
            <div className='absolute left-[110%] top-1/2 flex h-[19px] w-[18px] -translate-y-1/2 items-center justify-center rounded-[3px] bg-[#E04F64] p-[7px] text-[11.89px] font-normal leading-[0px] text-white'>
              {numberOfUnseenNotifications}
            </div>
          )}
        </div>
        {!isCollapsed && (
          <>
            <p
              className={`${isActive ? 'font-semibold text-[#4285F4]' : 'font-normal text-[#5D7285]'} text-[14.64px] tracking-[1%]`}
            >
              {text}
            </p>
            {!isCollapsed && numberOfUnseenNotifications >= 1 && (
              <div className='ml-auto flex h-[19px] w-[18px] items-center justify-center rounded-[3px] bg-[#E04F64] p-[7px] text-[11.89px] font-normal leading-[0px] text-white'>
                {numberOfUnseenNotifications}
              </div>
            )}
          </>
        )}
      </Link>
    );
  };

  const SidebarItemMobile = ({
    href,
    text,
    children,
    numberOfUnseenNotifications,
  }) => {
    const isActive = asPath.includes(href);

    return (
      <Link
        href={href}
        className={`flex w-full flex-col items-center gap-2 px-[11.77px] py-[16.87px] ${isActive && 'text-[#4285F4]'} rounded-[3.66px]`}
      >
        <div className='relative flex h-5 w-5 items-center justify-center'>
          {React.cloneElement(children, { isActive })}
          {numberOfUnseenNotifications !== 0 && (
            <div className='absolute -bottom-1 -right-1 h-3 w-3 rounded-[50%] bg-[#E04F64]'></div>
          )}
        </div>
        <p
          className={`${isActive ? 'font-semibold text-[#4285F4]' : 'font-normal text-[#5D7285]'} text-[11px] tracking-[1%]`}
        >
          {text}
        </p>
      </Link>
    );
  };

  const logoutHandler = async () => {
    setIsLoading(true);
    localStorage.clear();
    router.replace('/auth/join');
  };

  return (
    <Fragment>
      {isLoading &&
        createPortal(<Backdrop />, document.getElementById('backdrop-root'))}
      {isLoading &&
        createPortal(<Spinner />, document.getElementById('backdrop-root'))}
      <aside
        className='relative hidden flex-col items-center gap-[14.64px] border-e-2 bg-white px-[21.95px] py-[29.27px] md:flex'
        style={{
          width: !isCollapsed ? '297.29px' : '98.2833px',
          height: '100vh',
          transition: 'width 0.3s ease',
        }}
      >
       <a href={'/homepage/dashboard2'}>
          <Image
          src={logoNoChars}
          alt="Company's logo"
          width={isCollapsed ? 44.62 : 0}
          height={isCollapsed ? 51 : 0}
          className={`${isCollapsed ? 'mb-[29.27px] h-[51px] w-[44.62px] opacity-100' : 'mb-0 h-0 w-0 opacity-0'}`}
          style={{ transition: 'all 0.3s ease' }}
        />
        </a>
        <Image
          src={logo}
          alt="Company's logo"
          width={isCollapsed ? 0 : 147}
          height={isCollapsed ? 0 : 58}
          className={`${isCollapsed ? 'mb-0 h-0 w-0 opacity-0' : 'mb-[29.27px] mt-[-14.64px] h-[58px] w-[147px] opacity-100'}`}
          style={{ transition: 'all 0.3s ease' }}
        />
        <SidebarItem
          href={'/homepage/dashboard2'}
          text={'Dashboard'}
          children={<DashboardIcon />}
        />
        <SidebarItem
          href={'/homepage/airspace2'}
          text={'Airspaces'}
          children={<EarthIcon />}
        />
        <SidebarItem
          href={'/homepage/referral'}
          text={'Referral Program'}
          children={<GiftIcon />}
        />
        <div className='h-[1px] w-full bg-[#00000012]' />
        {!isCollapsed && (
          <p className='self-start px-[14.64px] font-normal tracking-[1%] text-[#5D7285]'>
            MARKETPLACE
          </p>
        )}
        <SidebarItem
          href={'/homepage/buy'}
          text={'Buy Airspace'}
          children={<MapIcon />}
        />
        <SidebarItem
          href={'/homepage/rent'}
          text={'Rent Airspace'}
          children={<DroneIcon />}
        />
        <SidebarItem
          href={'/homepage/portfolio'}
          text={'Portfolio'}
          children={<ShoppingBagsIcon />}
          numberOfUnseenNotifications={0}
        />
        <SidebarItem
          href={'/homepage/funds'}
          text={'Funds'}
          children={<WalletIcon />}
        />
        <div className='h-[1px] w-full bg-[#00000012]' />
        <SidebarItem
          href={'https://skytrade.tawk.help'}
          text={'Help Center'}
          children={<HelpQuestionIcon />}
        />
        <SidebarItem
          onClick={logoutHandler}
          text={'Logout'}
          children={<LogoutIcon />}
        />
        <SidebarItem
          onClick={() => setIsCollapsed((prev) => !prev)}
          text={'Collapse'}
          children={isCollapsed ? <ArrowExpandIcon /> : <ArrowCompressIcon />}
          style={'mt-auto'}
        />
      </aside>
      <nav className='fixed bottom-0 left-0 z-50 flex w-full bg-white md:hidden'>
        <SidebarItemMobile
          href={'/homepage/dashboard2'}
          text={'Dashboard'}
          children={<DashboardIcon />}
          numberOfUnseenNotifications={0}
        />
        <SidebarItemMobile
          href={'/homepage/airspace2'}
          text={'Airspaces'}
          children={<EarthIcon />}
          numberOfUnseenNotifications={0}
        />
        <SidebarItemMobile
          href={'/homepage/marketplace'}
          text={'Marketplace'}
          children={<MapIcon />}
          numberOfUnseenNotifications={0}
        />
        <SidebarItemMobile
          href={'/homepage/portfolio'}
          text={'Portfolio'}
          children={<ShoppingBagsIcon />}
          numberOfUnseenNotifications={0}
        />
        <SidebarItemMobile
          href={'/homepage/referral'}
          text={'Referral'}
          children={<GiftIcon />}
          numberOfUnseenNotifications={0}
        />
      </nav>
    </Fragment>
  );
};

export default Sidebar;
