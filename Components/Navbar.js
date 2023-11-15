import Image from 'next/image';
import { useRouter } from 'next/router';

const Navbar = (props) => {
  const router = useRouter();

  return (
    <header onClick={props.onClose} className='bg-white p-0'>
      <nav
        className={`my-0 flex w-full flex-row ${
          props.children ? 'justify-between' : 'justify-end'
        } items-center`}
      >
        {props.children}
        <div
          className={`me-5 flex flex-row items-center justify-center ${
            !props.children && 'mt-7'
          } cursor-pointer`}
        >
          <Image
            src='/images/user-icon.png'
            alt='icon'
            className='ms-6'
            width={30}
            height={30}
          />
          <div
            onClick={() => router.push('/homepage/settings')}
            className='me-5 ms-2'
          >
            <p className='font-base font-medium'>{props.name}</p>
            {props.categoryId === 0 && (
              <div
                className={`me-1.5 flex flex-row items-center justify-center gap-1 p-2 font-semibold ${
                  props.status === 2
                    ? 'bg-bleach-green'
                    : props.status === 1
                    ? 'bg-light-yellow'
                    : 'bg-bleach-red'
                }`}
                style={{ width: '80px', height: '12px', borderRadius: '3px' }}
              >
                <p
                  className={`text-center text-xxs ${
                    props.status === 2
                      ? 'text-light-green'
                      : props.status === 1
                      ? 'text-dark-yellow'
                      : 'text-light-red-100'
                  }`}
                >
                  {props.status === 0
                    ? 'Not Attempted'
                    : props.status === 1
                    ? 'Pending'
                    : props.status === 2
                    ? 'Approved'
                    : 'Rejected'}
                </p>
              </div>
            )}
            {props.categoryId === 1 && (
              <div
                className={`me-1.5 flex flex-row items-center justify-center gap-1 p-2 font-semibold ${
                  props.status === 2 ? 'bg-bleach-green' : 'bg-light-yellow'
                }`}
                style={{ width: '70px', height: '12px', borderRadius: '3px' }}
              >
                <p
                  className={`text-center text-xxs ${
                    props.status === 2 ? 'text-light-green' : 'text-dark-yellow'
                  }`}
                >
                  {props.status !== 2 ? 'Pending' : 'Approved'}
                </p>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
