import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { UserIcon } from './Icons';

const PageHeader = ({ pageTitle }) => {
  const { user } = useAuth();

  return (
    <div className='relative flex w-full flex-col'>
      <div
        className='flex items-center justify-between bg-white py-[25.5px] text-[#222222] md:pb-[23px] md:pl-[39.71px] md:pr-[41px] md:pt-[32px]'
        style={{ boxShadow: '0px 2px 12px 0px #00000014' }}
      >
        <p className='mx-auto text-xl font-normal md:m-0 md:text-2xl md:font-medium'>
          {pageTitle}
        </p>
        <Link
          href={'/homepage/account'}
          className='absolute left-[19px] items-center gap-[14px] md:relative md:flex'
        >
          <div className='h-6 w-6'>
            <UserIcon />
          </div>
          <p className='hidden md:block'>{user?.name}</p>
        </Link>
      </div>
    </div>
  );
};

export default PageHeader;
