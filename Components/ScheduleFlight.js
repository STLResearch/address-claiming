import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

import Sidebar from '@/Components/Sidebar';
import Navbar from '@/Components/Navbar';
import map from '../../../../public/images/map-bg.png';
import Spinner from '@/Components/Spinner';

import { useAuth } from '@/hooks/useAuth';

const ScheduleFlight = () => {
  const router = useRouter();

  const [user, setUser] = useState();
  const [token, setToken] = useState('');

  const { user: selectorUser } = useAuth();

  useEffect(() => {
    const fetchedToken = JSON.parse(localStorage.getItem('openlogin_store'));

    if (fetchedToken.sessionId.length !== 64) {
      router.push('/auth/join');
      return;
    }

    setToken(fetchedToken.sessionId);
    setUser(selectorUser);
  }, []);

  if (!user || !token) {
    return <Spinner />;
  }

  return (
    <div className='flex w-screen flex-row'>
      <Sidebar />
      <div
        style={{ width: 'calc(100vw - 257px)', height: '100vh' }}
        className='overflow-y-auto'
      >
        <Navbar name={user.name} />
        <div style={{ height: 'calc(100vh - 91px)' }}>
          <Image
            src={map}
            alt='a map'
            style={{ height: '50%' }}
            className='w-full max-w-6xl object-cover'
          />
          <div
            style={{ height: '50%' }}
            className='relative mx-auto w-full max-w-6xl'
          >
            <div
              style={{ borderRadius: '135px 135px 0px 0px' }}
              className='absolute bottom-9 z-10 h-full w-full bg-dark-blue pt-2 text-center text-white'
            >
              <p>Schedule Flight</p>
            </div>
            <div
              style={{ height: '98%', borderRadius: '60px 60px 0px 0px' }}
              className='absolute bottom-0 z-20 w-full overflow-y-auto bg-white'
            >
              <form className='z-20 mx-auto w-10/12'>
                <div className='relative flex flex-row items-end gap-2'>
                  <div
                    className='mb-2.5 mt-5'
                    style={{ width: '50%', maxWidth: '483px' }}
                  >
                    <label htmlFor='address' className='text-dark-brown'>
                      Address
                    </label>{' '}
                    <br />
                    <input
                      type='text'
                      style={{
                        height: '37px',
                        width: '100%',
                        maxWidth: '483px',
                        border: '0.35px solid #0653EA',
                      }}
                      className='rounded ps-5 placeholder:text-dark-brown'
                      placeholder='Pick Up'
                      name='address'
                      id='address'
                    />
                  </div>
                  <div className='mb-2.5 mt-5 flex flex-row'>
                    <div style={{ width: '130px' }}>Distance</div>
                    <div style={{ width: '130px' }} className='ps-2'>
                      ETA
                    </div>
                  </div>
                </div>
                <div>
                  <div className='mb-2.5 flex flex-row items-center gap-2'>
                    <input
                      type='text'
                      style={{
                        height: '37px',
                        width: '50%',
                        maxWidth: '483px',
                        border: '0.35px solid #0653EA',
                      }}
                      className='rounded ps-5 placeholder:text-dark-brown'
                      placeholder='Add Stop'
                      name='address'
                      id='address'
                    />
                    <input
                      type='text'
                      style={{
                        height: '37px',
                        width: '15%',
                        maxWidth: '130px',
                        border: '0.35px solid #0653EA',
                      }}
                      disabled
                      className='rounded ps-5 placeholder:text-dark-brown disabled:bg-sky-blue'
                      defaultValue='0.00 km'
                      name='address'
                      id='address'
                    />
                    <input
                      type='text'
                      style={{
                        height: '37px',
                        width: '15%',
                        maxWidth: '130px',
                        border: '0.35px solid #0653EA',
                      }}
                      disabled
                      className='rounded ps-5 placeholder:text-dark-brown disabled:bg-sky-blue'
                      defaultValue='0 mins'
                      name='address'
                      id='address'
                    />
                    <button className='cursor-pointer'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='22'
                        height='22'
                        viewBox='0 0 22 22'
                        fill='none'
                      >
                        <path
                          d='M11 21C16.5 21 21 16.5 21 11C21 5.5 16.5 1 11 1C5.5 1 1 5.5 1 11C1 16.5 5.5 21 11 21Z'
                          stroke='#6F6D80'
                          strokeWidth='1.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                        <path
                          d='M8.16992 13.8299L13.8299 8.16992'
                          stroke='#6F6D80'
                          strokeWidth='1.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                        <path
                          d='M13.8299 13.8299L8.16992 8.16992'
                          stroke='#6F6D80'
                          strokeWidth='1.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                    </button>
                  </div>
                  <div className='flex flex-row items-center gap-2'>
                    <input
                      type='text'
                      style={{
                        height: '37px',
                        width: '50%',
                        maxWidth: '483px',
                        border: '0.35px solid #0653EA',
                      }}
                      className='rounded ps-5 placeholder:text-dark-brown'
                      placeholder='Add Stop'
                      name='address'
                      id='address'
                    />
                    <input
                      type='text'
                      style={{
                        height: '37px',
                        width: '15%',
                        maxWidth: '130px',
                        border: '0.35px solid #0653EA',
                      }}
                      disabled
                      className='rounded ps-5 placeholder:text-dark-brown disabled:bg-sky-blue'
                      defaultValue='0.00 km'
                      name='address'
                      id='address'
                    />
                    <input
                      type='text'
                      style={{
                        height: '37px',
                        width: '15%',
                        maxWidth: '130px',
                        border: '0.35px solid #0653EA',
                      }}
                      disabled
                      className='rounded ps-5 placeholder:text-dark-brown disabled:bg-sky-blue'
                      defaultValue='0 mins'
                      name='address'
                      id='address'
                    />
                    <button
                      className='rounded-md bg-dark-blue text-sml text-white transition-all duration-500 ease-in-out hover:bg-blue-600'
                      style={{ width: '10%', height: '40px' }}
                    >
                      Add Stop
                    </button>
                  </div>
                </div>
                <div style={{ width: '354px' }} className='mx-auto mt-12'>
                  <p className='ms-4 font-semibold text-dark-brown'>Overview</p>
                  <hr className='bg-dark-blue' />
                  <div className='mx-auto w-10/12'>
                    <div className='mb-2.5 mt-5 flex flex-row items-center justify-between gap-5'>
                      <label htmlFor='distance' className='text-dark-brown'>
                        Total Distance
                      </label>
                      <input
                        type='text'
                        defaultValue='0.00 km'
                        name='distance'
                        id='distance'
                        style={{
                          height: '37px',
                          width: '133px',
                          border: '0.35px solid #0653EA',
                        }}
                        disabled
                        className='rounded ps-5 placeholder:text-dark-brown disabled:bg-sky-blue'
                      />
                    </div>
                    <div className='mb-2.5 mt-5 flex flex-row items-center justify-between gap-5'>
                      <label
                        htmlFor='arrival time'
                        className='ps-0 text-dark-brown'
                      >
                        ETA
                      </label>
                      <input
                        type='text'
                        defaultValue='0 mins'
                        name='arrival time'
                        id='arrival time'
                        style={{
                          height: '37px',
                          width: '133px',
                          border: '0.35px solid #0653EA',
                        }}
                        disabled
                        className='rounded ps-5 placeholder:text-dark-brown disabled:bg-sky-blue'
                      />
                    </div>
                    <div className='mb-2.5 mt-5 flex flex-row items-center justify-between gap-5'>
                      <label htmlFor='cost' className='text-dark-brown'>
                        Cost
                      </label>
                      <input
                        type='text'
                        defaultValue='$ 0.00'
                        name='cost'
                        id='cost'
                        style={{
                          height: '37px',
                          width: '133px',
                          border: '0.35px solid #0653EA',
                        }}
                        disabled
                        className='rounded ps-5 placeholder:text-dark-brown disabled:bg-sky-blue'
                      />
                    </div>
                  </div>
                  <div className='mb-8 mt-5 flex flex-row justify-center'>
                    <button
                      className='mx-auto rounded-md bg-dark-blue text-sml text-white transition-all duration-500 ease-in-out hover:bg-blue-600'
                      style={{ width: '310px', height: '40px' }}
                    >
                      Schedule
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleFlight;
