import Image from 'next/image';
import { useRouter } from 'next/router';
import { createPortal } from 'react-dom';
import { Fragment, useState, useEffect } from 'react';

import { useSelector } from 'react-redux';

import Sidebar from '@/Components/Sidebar';
import Navbar from '@/Components/Navbar';
import Backdrop from '@/Components/Backdrop';
import EditUavModal from '@/Components/Modals/EditUavModal';
import Spinner from '@/Components/Spinner';
import User from '../../../../models/User';

const UavProfile = () => {
  const router = useRouter();
  const [flightHistory, setFlightHistory] = useState(true);
  const [reviews, setReviews] = useState(false);
  const [showEditUavModal, setShowEditUavModal] = useState(false);
  const [user, setUser] = useState();
  const [token, setToken] = useState('');

  const selectorUser = useSelector((state) => state.value.user);

  useEffect(() => {
    const fetchedToken = JSON.parse(localStorage.getItem('openlogin_store'));

    if (fetchedToken.sessionId.length !== 64) {
      router.push('/auth/join');
      return;
    }

    setToken(fetchedToken.sessionId);
    setUser(selectorUser);
  }, []);

  const flightHistoryHandler = () => {
    setFlightHistory(true);
    setReviews(false);
  };

  const returnToUavHandler = () => {
    router.push('/homepage/uavs');
  };

  const reviewsHandler = () => {
    setFlightHistory(false);
    setReviews(true);
  };

  const showModalHandler = () => {
    setShowEditUavModal(true);
  };

  const backdropCloseHandler = () => {
    setShowEditUavModal(false);
  };

  const closeModalHandler = (e) => {
    e.preventDefault();
    setShowEditUavModal(false);
  };

  const ScheduleFlight = (id) => {
    router.push(`/homepage/uavs/${id}/scheduleflight`);
  };

  if (!user || !token) {
    return <Spinner />;
  }

  return (
    <Fragment>
      {showEditUavModal &&
        createPortal(
          <Backdrop onClick={backdropCloseHandler} />,
          document.getElementById('backdrop-root')
        )}
      {showEditUavModal &&
        createPortal(
          <EditUavModal onClose={closeModalHandler} />,
          document.getElementById('modal-root')
        )}
      <div className='mx-auto flex flex-row'>
        <Sidebar />
        <div
          style={{ width: 'calc(100vw - 257px)', height: '100vh' }}
          className=' overflow-y-auto bg-white'
        >
          <Navbar name={user.name} />
          <div
            className='mx-auto bg-white px-10 py-16'
            style={{
              maxWidth: '1183px',
              height: '1526px',
              borderTop: '2px solid #F0F0FA',
            }}
          >
            <div className='mb-6 flex flex-row items-center gap-2'>
              <button onClick={returnToUavHandler}>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                >
                  <path
                    d='M11.0303 8.53033C11.3232 8.23744 11.3232 7.76256 11.0303 7.46967C10.7374 7.17678 10.2626 7.17678 9.96967 7.46967L5.96967 11.4697C5.82322 11.6161 5.75 11.8081 5.75 12C5.75 12.1017 5.77024 12.1987 5.80691 12.2871C5.84351 12.3755 5.89776 12.4584 5.96967 12.5303L9.96967 16.5303C10.2626 16.8232 10.7374 16.8232 11.0303 16.5303C11.3232 16.2374 11.3232 15.7626 11.0303 15.4697L8.31066 12.75H18C18.4142 12.75 18.75 12.4142 18.75 12C18.75 11.5858 18.4142 11.25 18 11.25H8.31066L11.0303 8.53033Z'
                    fill='#252530'
                  />
                </svg>
              </button>
              <div className='flex flex-row  gap-1'>
                <p className='font-semibold'>UAV Nickname</p>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='6'
                  height='6'
                  viewBox='0 0 6 6'
                  fill='none'
                >
                  <circle cx='3' cy='3' r='3' fill='#1A572E' />
                </svg>
              </div>
            </div>
            <div className='flex flex-row items-end gap-20'>
              <Image
                src='/images/uav.png'
                className='w-1/2'
                alt='a picture of UAV'
                width={525}
                height={350}
              />
              <div className='w-1/2'>
                <p className='mb-1.5 text-light-dark'>
                  <span className='font-semibold'>UAV Nickname:</span> Air Drone{' '}
                </p>
                <p className='mb-1.5 text-light-dark'>
                  <span className='font-semibold'>Device Type:</span> Domestic
                  Made
                </p>
                <p className='mb-1.5 text-light-dark'>
                  <span className='font-semibold'>UAV Model:</span> CX0007TY
                </p>
                <p className='mb-1.5 text-light-dark'>
                  <span className='font-semibold'>UAV Manufacturer:</span> DJI
                </p>
                <p className='mb-1.5 text-light-dark'>
                  <span className='font-semibold'>Serial Number:</span>{' '}
                  S475635RDT54
                </p>
                <p className='mb-1.5 text-light-dark'>
                  <span className='font-semibold'>Range:</span> 27 Km
                </p>
                <p className='text-light-dark'>
                  <span className='font-semibold'>Battery Range:</span> 45 Mins
                </p>
                <div className='mt-10 flex flex-row items-center justify-between'>
                  <button
                    onClick={ScheduleFlight.bind(null, '1899')}
                    className='rounded-md bg-dark-blue text-white transition-all duration-500 ease-in-out hover:bg-blue-600'
                    style={{ width: '157px', height: '40px' }}
                  >
                    Schedule Flight
                  </button>
                  <div className='flex flex-row gap-2.5'>
                    <button
                      onClick={showModalHandler}
                      className='flex flex-row items-center justify-center gap-1 rounded-md bg-bleach-blue text-dark-blue transition-all duration-500 ease-in-out hover:bg-blue-300'
                      style={{ width: '90px', height: '40px' }}
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='14'
                        height='14'
                        viewBox='0 0 14 14'
                        fill='none'
                      >
                        <path
                          d='M8.75033 13.2702H5.25033C2.08283 13.2702 0.729492 11.9169 0.729492 8.74935V5.24935C0.729492 2.08185 2.08283 0.728516 5.25033 0.728516H6.41699C6.65616 0.728516 6.85449 0.926849 6.85449 1.16602C6.85449 1.40518 6.65616 1.60352 6.41699 1.60352H5.25033C2.56116 1.60352 1.60449 2.56018 1.60449 5.24935V8.74935C1.60449 11.4385 2.56116 12.3952 5.25033 12.3952H8.75033C11.4395 12.3952 12.3962 11.4385 12.3962 8.74935V7.58268C12.3962 7.34352 12.5945 7.14518 12.8337 7.14518C13.0728 7.14518 13.2712 7.34352 13.2712 7.58268V8.74935C13.2712 11.9169 11.9178 13.2702 8.75033 13.2702Z'
                          fill='#0653EA'
                        />
                        <path
                          d='M4.95828 10.3193C4.60244 10.3193 4.27578 10.191 4.03661 9.95766C3.75078 9.67182 3.62828 9.25766 3.69244 8.82016L3.94328 7.06432C3.98994 6.72599 4.21161 6.28849 4.45078 6.04932L9.04744 1.45266C10.2083 0.291823 11.3866 0.291823 12.5474 1.45266C13.1833 2.08849 13.4691 2.73599 13.4108 3.38349C13.3583 3.90849 13.0783 4.42182 12.5474 4.94682L7.95078 9.54349C7.71161 9.78266 7.27411 10.0043 6.93578 10.051L5.17994 10.3018C5.10411 10.3193 5.02828 10.3193 4.95828 10.3193ZM9.66578 2.07099L5.06911 6.66766C4.95828 6.77849 4.82994 7.03516 4.80661 7.18682L4.55578 8.94266C4.53244 9.11182 4.56744 9.25182 4.65494 9.33932C4.74244 9.42682 4.88244 9.46182 5.05161 9.43849L6.80744 9.18766C6.95911 9.16432 7.22161 9.03599 7.32661 8.92516L11.9233 4.32849C12.3024 3.94932 12.5008 3.61099 12.5299 3.29599C12.5649 2.91682 12.3666 2.51432 11.9233 2.06516C10.9899 1.13182 10.3483 1.39432 9.66578 2.07099Z'
                          fill='#0653EA'
                        />
                        <path
                          d='M11.5794 5.73367C11.5386 5.73367 11.4977 5.72784 11.4627 5.71617C9.92857 5.28451 8.7094 4.06534 8.27774 2.53117C8.21357 2.29784 8.34774 2.05867 8.58107 1.98867C8.8144 1.92451 9.05357 2.05867 9.11774 2.29201C9.46774 3.53451 10.4536 4.52034 11.6961 4.87034C11.9294 4.93451 12.0636 5.17951 11.9994 5.41284C11.9469 5.61117 11.7719 5.73367 11.5794 5.73367Z'
                          fill='#0653EA'
                        />
                      </svg>
                      <p>Edit</p>
                    </button>
                    <button
                      className='flex flex-row items-center justify-center rounded-md bg-bleach-red text-light-red-100 transition-all duration-500 ease-in-out hover:bg-red-200'
                      style={{ width: '90px', height: '40px' }}
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='17'
                        height='17'
                        viewBox='0 0 17 17'
                        fill='none'
                      >
                        <path
                          d='M7.08317 1.59375C6.78977 1.59375 6.55192 1.8316 6.55192 2.125V2.65625H3.5415C3.2481 2.65625 3.01025 2.8941 3.01025 3.1875C3.01025 3.4809 3.2481 3.71875 3.5415 3.71875H13.4582C13.7516 3.71875 13.9894 3.4809 13.9894 3.1875C13.9894 2.8941 13.7516 2.65625 13.4582 2.65625H10.4478V2.125C10.4478 1.8316 10.2099 1.59375 9.9165 1.59375H7.08317Z'
                          fill='#C80000'
                        />
                        <path
                          d='M7.08317 7.54375C7.37657 7.54375 7.61442 7.78159 7.61442 8.075L7.61442 13.0333C7.61442 13.3267 7.37657 13.5646 7.08317 13.5646C6.78977 13.5646 6.55192 13.3267 6.55192 13.0333L6.55192 8.075C6.55192 7.78159 6.78977 7.54375 7.08317 7.54375Z'
                          fill='#C80000'
                        />
                        <path
                          d='M10.4478 8.075C10.4478 7.78159 10.2099 7.54375 9.9165 7.54375C9.6231 7.54375 9.38525 7.78159 9.38525 8.075V13.0333C9.38525 13.3267 9.6231 13.5646 9.9165 13.5646C10.2099 13.5646 10.4478 13.3267 10.4478 13.0333V8.075Z'
                          fill='#C80000'
                        />
                        <path
                          fillRule='evenodd'
                          clipRule='evenodd'
                          d='M4.24376 5.608C4.27366 5.33896 4.50107 5.13542 4.77176 5.13542H12.2279C12.4986 5.13542 12.726 5.33896 12.7559 5.608L12.8977 6.88395C13.1547 9.19689 13.1547 11.5312 12.8977 13.8441L12.8837 13.9697C12.7817 14.8878 12.0702 15.6199 11.1553 15.748C9.39359 15.9946 7.60608 15.9946 5.84435 15.748C4.92951 15.6199 4.21796 14.8878 4.11595 13.9697L4.10199 13.8441C3.845 11.5312 3.845 9.19689 4.10199 6.88395L4.24376 5.608ZM5.24726 6.19792L5.15799 7.00129C4.90966 9.23624 4.90966 11.4918 5.15799 13.7268L5.17195 13.8524C5.22033 14.2878 5.55779 14.635 5.99166 14.6958C7.65566 14.9287 9.34401 14.9287 11.008 14.6958C11.4419 14.635 11.7793 14.2878 11.8277 13.8524L11.8417 13.7268C12.09 11.4918 12.09 9.23624 11.8417 7.00129L11.7524 6.19792H5.24726Z'
                          fill='#C80000'
                        />
                      </svg>
                      <p className='mt-1'>Delete</p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className='mt-16'>
              <div
                className='mt-5 flex flex-row items-center justify-center gap-7 pb-2.5'
                style={{ borderBottom: '2px solid #0653EA' }}
              >
                <button className='relative' onClick={flightHistoryHandler}>
                  <p
                    className={`font-bold ${
                      flightHistory ? 'text-dark-blue' : 'text-dark-brown'
                    } hover:text-dark-blue`}
                  >
                    Flight History
                  </p>
                  {flightHistory && (
                    <div
                      style={{
                        height: '4px',
                        width: '40px',
                        bottom: '-10px',
                        left: '25%',
                      }}
                      className='absolute rounded-t-md bg-dark-blue'
                    ></div>
                  )}
                </button>
                <button className='relative' onClick={reviewsHandler}>
                  <p
                    className={`font-bold ${
                      reviews ? 'text-dark-blue' : 'text-dark-brown'
                    } hover:text-dark-blue`}
                  >
                    Reviews
                  </p>
                  {reviews && (
                    <div
                      style={{
                        height: '4px',
                        width: '40px',
                        bottom: '-10px',
                        left: '20%',
                      }}
                      className='absolute rounded-t-md bg-dark-blue'
                    ></div>
                  )}
                </button>
                {/* <button className="relative">
                                <p className="font-bold text-dark-brown">Reviews</p>
                                <div style={{height: "4px", width: "35px", bottom: "-10px", left: "20%"}} className="bg-blue-700 absolute rounded-t-md"></div>
                            </button> */}
              </div>
              {reviews && (
                <div>
                  <div className='-mx-1 flex flex-col items-center justify-center py-10 text-sm'>
                    <p className='text-5xl font-medium'>4.5</p>
                    <div className='mb-3 flex flex-row items-center'>
                      <Image
                        src='/images/Star.png'
                        alt='star icon'
                        width={14}
                        height={14}
                      />
                      <Image
                        src='/images/Star.png'
                        alt='star icon'
                        width={14}
                        height={14}
                      />
                      <Image
                        src='/images/Star.png'
                        alt='star icon'
                        width={14}
                        height={14}
                      />
                      <Image
                        src='/images/Star.png'
                        alt='star icon'
                        width={14}
                        height={14}
                      />
                      <Image
                        src='/images/Star-half.png'
                        alt='star icon'
                        width={12}
                        height={12}
                      />
                    </div>
                    <p className='font-semibold text-dark-brown'>6 reviews</p>
                  </div>
                  <div className='overflow-y-auto'>
                    <div
                      style={{ width: '695px' }}
                      className='mx-auto overflow-y-auto bg-white pt-6'
                    >
                      <div className='mx-auto rounded bg-light-blue p-2.5'>
                        <p>
                          “Lorem ipsum dolor sit amet, consectetur adipiscing
                          et, sed do eiusmod tempor incididunt ut Duis aute
                          irure dolor in reprehe nderit in voluptate velit esse
                          cillum do lore eu fugiat nulla pariatu labore t enim
                          ad minima ve niam, quis nostrum exercitationem”
                        </p>
                        <div className='mt-2 flex flex-row justify-end'>
                          <p className=''>21st August 2023</p>
                        </div>
                      </div>
                      <div className='me-5 mt-2.5 flex flex-row items-center justify-start'>
                        <Image
                          src='/images/Ellipse.png'
                          alt='icon'
                          className=''
                          width={40}
                          height={40}
                        />
                        <div className='me-5 ms-2'>
                          <p className='font-base text-sm font-bold text-light-brown'>
                            John Doe
                          </p>
                          <div className='flex flex-row items-center text-sm text-light-brown'>
                            <p>4.5</p>
                            <div className='flex flex-row items-center'>
                              <Image
                                src='/images/Star.png'
                                alt='star icon'
                                width={12}
                                height={12}
                              />
                              <Image
                                src='/images/Star.png'
                                alt='star icon'
                                width={12}
                                height={12}
                              />
                              <Image
                                src='/images/Star.png'
                                alt='star icon'
                                width={12}
                                height={12}
                              />
                              <Image
                                src='/images/Star.png'
                                alt='star icon'
                                width={12}
                                height={12}
                              />
                              <Image
                                src='/images/Star-half.png'
                                alt='star icon'
                                width={12}
                                height={12}
                              />
                            </div>
                            <p>(6)</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {flightHistory && (
                <div
                  className='mx-auto flex flex-col items-center overflow-y-auto overflow-x-hidden'
                  style={{ height: '900px' }}
                >
                  <div
                    className='mx-auto mt-7 pb-5'
                    style={{
                      borderBottom: '0.1px solid rgba(74, 74, 241, 0.2)',
                    }}
                  >
                    <div className='flex flex-row justify-between'>
                      <p>09/08/2023, 09:06</p>
                      <div className='relative'>
                        <p className='flex flex-row items-center'>$ 50.00</p>
                        <div className='flex flex-row items-center'>
                          <Image
                            src='/images/Star.png'
                            alt='star icon'
                            width={12}
                            height={12}
                          />
                          <Image
                            src='/images/Star.png'
                            alt='star icon'
                            width={12}
                            height={12}
                          />
                          <Image
                            src='/images/Star.png'
                            alt='star icon'
                            width={12}
                            height={12}
                          />
                          <Image
                            src='/images/Star.png'
                            alt='star icon'
                            width={12}
                            height={12}
                          />
                          <Image
                            src='/images/Star-half.png'
                            alt='star icon'
                            width={12}
                            height={12}
                          />
                        </div>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='absolute -right-5 bottom-1 top-0'
                          width='24'
                          height='24'
                          viewBox='0 0 24 24'
                          fill='none'
                        >
                          <path
                            fillRule='evenodd'
                            clipRule='evenodd'
                            d='M8.96967 7.46967C9.26256 7.17678 9.73744 7.17678 10.0303 7.46967L14.0303 11.4697C14.3232 11.7626 14.3232 12.2374 14.0303 12.5303L10.0303 16.5303C9.73744 16.8232 9.26256 16.8232 8.96967 16.5303C8.67678 16.2374 8.67678 15.7626 8.96967 15.4697L12.4393 12L8.96967 8.53033C8.67678 8.23744 8.67678 7.76256 8.96967 7.46967Z'
                            fill='#3F3D56'
                          />
                        </svg>
                      </div>
                    </div>
                    <div className='' style={{ width: '', height: '311px' }}>
                      <Image
                        src='/images/map-bg.png'
                        className='mt-11'
                        alt='map image'
                        width={900}
                        height={311}
                        style={{ height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  </div>
                  <div
                    className='mx-auto mt-7 pb-5'
                    style={{
                      borderBottom: '0.1px solid rgba(74, 74, 241, 0.2)',
                    }}
                  >
                    <div className='flex flex-row justify-between'>
                      <p>09/08/2023, 09:06</p>
                      <div className='relative'>
                        <p className='flex flex-row items-center'>$ 50.00</p>
                        <div className='flex flex-row items-center'>
                          <Image
                            src='/images/Star.png'
                            alt='star icon'
                            width={12}
                            height={12}
                          />
                          <Image
                            src='/images/Star.png'
                            alt='star icon'
                            width={12}
                            height={12}
                          />
                          <Image
                            src='/images/Star.png'
                            alt='star icon'
                            width={12}
                            height={12}
                          />
                          <Image
                            src='/images/Star.png'
                            alt='star icon'
                            width={12}
                            height={12}
                          />
                          <Image
                            src='/images/Star-half.png'
                            alt='star icon'
                            width={12}
                            height={12}
                          />
                        </div>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='absolute -right-5 bottom-1 top-0'
                          width='24'
                          height='24'
                          viewBox='0 0 24 24'
                          fill='none'
                        >
                          <path
                            fillRule='evenodd'
                            clipRule='evenodd'
                            d='M8.96967 7.46967C9.26256 7.17678 9.73744 7.17678 10.0303 7.46967L14.0303 11.4697C14.3232 11.7626 14.3232 12.2374 14.0303 12.5303L10.0303 16.5303C9.73744 16.8232 9.26256 16.8232 8.96967 16.5303C8.67678 16.2374 8.67678 15.7626 8.96967 15.4697L12.4393 12L8.96967 8.53033C8.67678 8.23744 8.67678 7.76256 8.96967 7.46967Z'
                            fill='#3F3D56'
                          />
                        </svg>
                      </div>
                    </div>
                    <div className='' style={{ width: '', height: '311px' }}>
                      <Image
                        src='/images/map-bg.png'
                        className='mt-11'
                        alt='map image'
                        width={900}
                        height={311}
                        style={{ height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  </div>
                  <div
                    className='mx-auto mt-7 pb-5'
                    style={{
                      borderBottom: '0.1px solid rgba(74, 74, 241, 0.2)',
                    }}
                  >
                    <div className='flex flex-row justify-between'>
                      <p>09/08/2023, 09:06</p>
                      <div className='relative'>
                        <p className='flex flex-row items-center'>$ 50.00</p>
                        <div className='flex flex-row items-center'>
                          <Image
                            src='/images/Star.png'
                            alt='star icon'
                            width={12}
                            height={12}
                          />
                          <Image
                            src='/images/Star.png'
                            alt='star icon'
                            width={12}
                            height={12}
                          />
                          <Image
                            src='/images/Star.png'
                            alt='star icon'
                            width={12}
                            height={12}
                          />
                          <Image
                            src='/images/Star.png'
                            alt='star icon'
                            width={12}
                            height={12}
                          />
                          <Image
                            src='/images/Star-half.png'
                            alt='star icon'
                            width={12}
                            height={12}
                          />
                        </div>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='absolute -right-5 bottom-1 top-0'
                          width='24'
                          height='24'
                          viewBox='0 0 24 24'
                          fill='none'
                        >
                          <path
                            fillRule='evenodd'
                            clipRule='evenodd'
                            d='M8.96967 7.46967C9.26256 7.17678 9.73744 7.17678 10.0303 7.46967L14.0303 11.4697C14.3232 11.7626 14.3232 12.2374 14.0303 12.5303L10.0303 16.5303C9.73744 16.8232 9.26256 16.8232 8.96967 16.5303C8.67678 16.2374 8.67678 15.7626 8.96967 15.4697L12.4393 12L8.96967 8.53033C8.67678 8.23744 8.67678 7.76256 8.96967 7.46967Z'
                            fill='#3F3D56'
                          />
                        </svg>
                      </div>
                    </div>
                    <div className='' style={{ width: '', height: '311px' }}>
                      <Image
                        src='/images/map-bg.png'
                        className='mt-11'
                        alt='map image'
                        width={900}
                        height={311}
                        style={{ height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default UavProfile;
