import { useEffect, useState, useRef, Fragment } from 'react';
import { useRouter } from 'next/router';
import { Web3Auth } from '@web3auth/modal';

import Script from 'next/script';

import Navbar from '@/Components/Navbar';
import Sidebar from '@/Components/Sidebar';
import swal from 'sweetalert';
import Spinner from '@/Components/Spinner';

import { useAuth } from '@/hooks/useAuth';
import { useSignature } from '@/hooks/useSignature';

const Settings = () => {
  const router = useRouter();

  const { signatureObject } = useSignature();

  const [nameValid, setNameValid] = useState(true);
  const [phoneValid, setPhoneValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [user, setUser] = useState('');
  const [token, setToken] = useState('');

  const [properties, setProperties] = useState({
    registered: 0,
    nonRegistered: 0,
  });

  const nameRef = useRef();
  const phoneRef = useRef();
  const referralCodeRef = useRef();

  const { user: userLoggedIn, updateProfile } = useAuth();

  const updateDataHandler = async (e) => {
    e.preventDefault();

    const {
      name: userName,
      phoneNumber: userPhoneNumber,
      ownedReferralCode: { code: userCodeId },
    } = user;

    const name = nameRef.current.value;
    const phoneNumber = phoneRef.current.value;
    const referralCode = referralCodeRef?.current?.value ?? userCodeId;

    if (
      name === userName &&
      phoneNumber === userPhoneNumber &&
      referralCode === userCodeId
    ) {
      swal({
        title: 'Oops!',
        text: 'You need to change at least one field to update your account',
        timer: 3000,
      });
      return;
    }

    if (!name) {
      setNameValid(false);
      swal({
        title: 'Oops!',
        text: 'Name cannot be empty',
        timer: 2000,
      });
      return;
    }

    if (!phoneNumber || phoneNumber.charAt(0) !== '+') {
      setPhoneValid(false);
      swal({
        title: 'Oops!',
        text: 'Invalid phone number. Ensure to include country code starting with +',
        timer: 3000,
      });
      return;
    }

    if (!user.ownedReferralCode.codeChanged && userCodeId !== referralCode) {
      const modalResponse = await swal({
        title: 'Attention!',
        text: 'You can only change your referral code once; this action is immutable and irreversible.',
        buttons: {
          cancel: 'Cancel',
          confirm: 'Continue',
        },
      });

      if (!modalResponse) {
        setIsLoading(false);
        referralCodeRef.current.value = user.ownedReferralCode.code;
        nameRef.current.value = user.name;
        phoneRef.current.value = user.phoneNumber;
        return;
      }
    }

    setIsLoading(true);

    try {
      const { sign, sign_nonce, sign_issue_at, sign_address } =
        await signatureObject(user.blockchainAddress);

      const res = await fetch(`/api/proxy?${Date.now()}`, {
        method: 'PATCH',
        body: JSON.stringify({
          userId: user.id,
          name,
          phoneNumber,
          ...(!user.ownedReferralCode.codeChanged &&
            userCodeId !== referralCode && { referralCode }),
        }),
        headers: {
          'Content-Type': 'application/json',
          uri: '/private/users/update',
          sign,
          time: sign_issue_at,
          nonce: sign_nonce,
          address: sign_address,
        },
      });

      if (!res.ok || res.statusCode === 500) {
        const errorData = await res.json();
        throw new Error(errorData.errorMessage);
      }

      const userJsonResponse = await res.json();

      if (userJsonResponse.statusCode === 500) {
        throw new Error('something went wrong');
      }

      setIsLoading(false);

      swal({
        title: 'Submitted',
        text: 'Record Successfully Updated.',
        icon: 'success',
        button: 'Ok',
      }).then(() => {
        //
        const updatedUser = {
          ...user,
          name,
          phoneNumber,
          ...(userCodeId !== referralCode && {
            ownedReferralCode: {
              id: user.ownedReferralCode.id,
              code: referralCode,
              codeChanged: true,
            },
          }),
        };

        updateProfile(updatedUser);

        // router.push('/homepage/dashboard');
      });
    } catch (err) {
      console.log(err);
      const error = err.toString().split(':');
      setIsLoading(false);
      swal({
        title: 'Oops!',
        text: `${error[1]}`,
      });

      referralCodeRef.current.value = user.ownedReferralCode.code;
      nameRef.current.value = user.name;
      phoneRef.current.value = user.phoneNumber;
    }
  };

  useEffect(() => {
    if (userLoggedIn) {
      console.log({ userLoggedIn });

      const authUser = async () => {
        const chainConfig = {
          chainNamespace: 'solana',
          chainId: '0x1', // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
          rpcTarget: process.env.NEXT_PUBLIC_RPC_TARGET,
          displayName: 'Solana Mainnet',
          blockExplorer: 'https://explorer.solana.com',
          ticker: 'SOL',
          tickerName: 'Solana',
        };

        const web3auth = new Web3Auth({
          clientId: process.env.NEXT_PUBLIC_CLIENT_ID,

          web3AuthNetwork: process.env.NEXT_PUBLIC_AUTH_NETWORK,
          chainConfig: chainConfig,
        });

        await web3auth.initModal();

        // await web3auth.connect();

        let userInfo;

        try {
          userInfo = await web3auth.getUserInfo();
        } catch (err) {
          localStorage.removeItem('openlogin_store');
          swal({
            title: 'oops!',
            text: 'Something went wrong. Kindly try again',
          }).then(() => router.push('/auth/join'));
          return;
        }

        const fetchedToken = JSON.parse(
          localStorage.getItem('openlogin_store')
        );

        if (!userLoggedIn) {
          localStorage.removeItem('openlogin_store');
          router.push('/auth/join');
          return;
        }

        setToken(fetchedToken.sessionId);
        setUser(userLoggedIn);
      };

      authUser();
    }
  }, [userLoggedIn]);

  if (!user || !token) {
    return <Spinner />;
  }

  return (
    <Fragment>
      <Script src='https://www.googletagmanager.com/gtag/js?id=G-C0J4J56QW5' />
      <Script id='google-analytics'>
        {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
        
                gtag('config', 'G-C0J4J56QW5');
            `}
      </Script>

      <div className='mx-auto flex flex-row'>
        <Sidebar user={user} />
        <div
          style={{ width: 'calc(100vw - 257px)', height: '100vh' }}
          className='overflow-y-auto overflow-x-hidden'
        >
          <Navbar
            name={user.name}
            categoryId={user.categoryId}
            // status={user.KYCStatusId}
          />
          <form
            className='mx-auto bg-white px-10 pb-2 pt-16'
            style={{
              width: 'calc(100vw-257px)',
              borderTop: '2px solid #F0F0FA',
            }}
          >
            <div>
              <h3 className='text-2xl font-medium'>My Profile</h3>
              <p>Update your account settings</p>
            </div>

            {/* KYC LOGIC - DO NOT REMOVE */}

            {/* {user.categoryId === 0 && user.KYCStatusId === 0 && (
              <div
                className='mt-10 flex flex-row items-center justify-between rounded-md border-2 border-light-blue px-6 py-5'
                style={{ width: '', height: '124px' }}
              >
                <div>
                  <h3 className='text-2xl font-medium'>
                    Your Account is not verified.
                  </h3>
                  <p>
                    You can begin the KYC process when you try to claim a
                    property.
                  </p>
                </div>
                <div>
                  <p className='rounded-md bg-bleach-red px-1 py-2 text-center text-light-red-100 transition-all duration-500 ease-in-out'>
                    Not Attempted
                  </p>
                </div>
              </div>
            )} */}

            {/* {user.categoryId === 0 && user.KYCStatusId === 3 && (
              <div
                className='mt-10 flex flex-row items-center justify-between rounded-md border-2 border-light-blue px-6 py-5'
                style={{ width: '', height: '124px' }}
              >
                <div>
                  <h3 className='text-2xl font-medium'>
                    Your Account is not verified
                  </h3>
                  <p>Sorry. You didn't pass the KYC check</p>
                </div>
                <div>
                  <p className='rounded-md bg-bleach-red px-2 py-1 text-center text-light-red-100 transition-all duration-500 ease-in-out'>
                    Rejected
                  </p>
                </div>
              </div>
            )}

            {user.KYCStatusId === 2 && (
              <div
                className='mt-10 flex flex-row items-center justify-between rounded-md border-2 border-light-blue px-6 py-5'
                style={{ width: '', height: '124px' }}
              >
                <div>
                  <h3 className='text-2xl font-medium'>
                    Your Account is verified
                  </h3>
                  <p>This Account is verified</p>
                </div>
                <p className='rounded-md bg-bleach-green px-2 py-1 text-center text-light-green'>
                  Approved
                </p>
              </div>
            )}

            {user.categoryId === 0 && user.KYCStatusId === 1 && (
              <div
                className='mt-10 flex flex-row items-center justify-between rounded-md border-2 border-light-blue px-6 py-5'
                style={{ width: '', height: '124px' }}
              >
                <div>
                  <h3 className='text-2xl font-medium'>
                    Your Account is pending verification
                  </h3>
                  <p>This Account is under review</p>
                </div>
                <p className='rounded-md bg-light-yellow px-2 py-1 text-center font-semibold text-dark-yellow'>
                  Pending
                </p>
              </div>
            )}

            {user.categoryId === 1 && user.KYCStatusId !== 2 && (
              <div
                className='mt-10 flex flex-row items-center justify-between rounded-md border-2 border-light-blue px-6 py-5'
                style={{ width: '', height: '124px' }}
              >
                <div>
                  <h3 className='text-2xl font-medium'>
                    Your Account is pending verification
                  </h3>
                  <p>This Account is under review</p>
                </div>
                <p className='rounded-md bg-light-yellow px-2 py-1 text-center font-semibold text-dark-yellow'>
                  Pending
                </p>
              </div>
            )} */}

            {/* KYC LOGIC - DO NOT REMOVE */}

            <div
              className='mt-10 flex h-auto w-auto flex-col justify-center rounded-md border-2 border-light-blue px-6 py-5'
              // style={{ width: '', height: '397px' }}
            >
              <div className='mb-5'>
                <h3 className='text-2xl font-medium'>Personal Information</h3>
                <p>Update your personal information</p>
              </div>

              <div
                className='relative mb-10'
                style={{ maxWidth: '660px', height: '37px' }}
              >
                <label className='text-bleach-brown' htmlFor='first name'>
                  Name
                </label>{' '}
                <br />
                <input
                  type='text'
                  ref={nameRef}
                  onChange={() => setNameValid(true)}
                  name='name'
                  defaultValue={user.name}
                  id='name'
                  className='rounded-md border-2 border-light-blue ps-3 placeholder:font-medium placeholder:text-dark-brown focus:outline-blue-200'
                  style={{ width: '660px', height: '37px' }}
                />
                {!nameValid && (
                  <p className='absolute right-0 top-1 text-sm text-red-600'>
                    name cannot be empty
                  </p>
                )}
              </div>

              <div className='mt-6 flex gap-5'>
                <div
                  className='relative'
                  style={{ width: '320px', height: '37px' }}
                >
                  <p className='text-bleach-brown'>Email</p>
                  <p className='text-black'>{user.email}</p>
                </div>

                <div className='relative'>
                  <label className='text-bleach-brown' htmlFor='number'>
                    Phone Number
                  </label>{' '}
                  <br />
                  <input
                    type='text'
                    onChange={() => setPhoneValid(true)}
                    ref={phoneRef}
                    name='number'
                    defaultValue={user.phoneNumber}
                    id='number'
                    className='rounded-md border-2 border-light-blue ps-3 placeholder:font-medium placeholder:text-dark-brown focus:outline-blue-200'
                    style={{ width: '320px', height: '37px' }}
                  />
                  {!phoneValid && (
                    <p className='absolute right-0 top-1 text-xs text-red-600'>
                      invalid phone number
                    </p>
                  )}
                </div>
              </div>

              <div className='mt-6 flex gap-5'>
                <div className='mt-6 flex gap-5'>
                  <div
                    className='relative'
                    style={{ width: '320px', height: '37px' }}
                  >
                    <p className='text-bleach-brown'>Type of Account</p>
                    <p className='text-black'>
                      {user.categoryId === 0 ? 'Individual' : 'Corporate'}
                    </p>
                  </div>
                </div>

                <div className='mt-6 flex gap-5'>
                  <div
                    className='relative flex flex-col'
                    style={{ width: '320px', height: '37px' }}
                  >
                    <div>
                      <p className='text-bleach-brown'>Referral Code</p>

                      <div className='flex gap-5'>
                        {user.ownedReferralCode.codeChanged ? (
                          <p className='text-black'>
                            {user.ownedReferralCode.code}
                          </p>
                        ) : (
                          <input
                            type='text'
                            onChange={() => {}}
                            ref={referralCodeRef}
                            name='referral-code'
                            defaultValue={user.ownedReferralCode.code}
                            id='referral-code'
                            className='rounded-md border-2 border-light-blue ps-3 placeholder:font-medium placeholder:text-dark-brown focus:outline-blue-200'
                            style={{ width: '320px', height: '37px' }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className='text-bleach-brown'>
                      Users Referred: {user.ownedReferralCode?.usedBy.length}
                    </p>
                    <p className='text-bleach-brown'>
                      Registered properties referred :{' '}
                      {user.ownedReferralCode.registeredPropertiesCount}
                    </p>
                    <p className='text-bleach-brown'>
                      Unregistered properties referred:{' '}
                      {user.ownedReferralCode.unregisteredPropertiesCount}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className='mt-8 flex flex-row items-center justify-center gap-5'>
              <button
                onClick={updateDataHandler}
                disabled={isLoading}
                className={`rounded-md bg-dark-blue text-white transition-all duration-500 ease-in-out hover:bg-blue-600 ${
                  !isLoading ? 'cursor-pointer' : 'cursor-wait'
                }`}
                style={{ width: '120px', height: '40px' }}
              >
                {isLoading ? 'saving...' : 'Save'}
              </button>
            </div>

            <div className='mt-10 flex flex-row items-center justify-between text-sm'>
              <p>&copy; Skytrade 2023</p>
              <div className='flex flex-row items-center gap-1'>
                <a
                  className='flex flex-row items-center gap-1'
                  href='mailto:help@sky.trade'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='14'
                    height='11'
                    viewBox='0 0 14 11'
                    fill='none'
                  >
                    <path
                      d='M12.6 0H1.4C0.63 0 0 0.61875 0 1.375V9.625C0 10.3813 0.63 11 1.4 11H12.6C13.37 11 14 10.3813 14 9.625V1.375C14 0.61875 13.37 0 12.6 0ZM12.32 2.92188L7.742 5.73375C7.287 6.01562 6.713 6.01562 6.258 5.73375L1.68 2.92188C1.505 2.81188 1.4 2.62625 1.4 2.42688C1.4 1.96625 1.911 1.69125 2.31 1.93187L7 4.8125L11.69 1.93187C12.089 1.69125 12.6 1.96625 12.6 2.42688C12.6 2.62625 12.495 2.81188 12.32 2.92188Z'
                      fill='black'
                      fillOpacity='0.5'
                    />
                  </svg>
                  <span>help@sky.trade</span>
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default Settings;
