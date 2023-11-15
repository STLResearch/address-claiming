import Image from 'next/image';
import { useRouter } from 'next/router';
import { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';
import swal from 'sweetalert';
import Script from 'next/script';

import Backdrop from '@/Components/Backdrop';
import Spinner from '@/Components/Spinner';
import { Fragment } from 'react';
import logo from '../../../../public/images/logo.jpg';

import { useAuth } from '@/hooks/useAuth';

const IndividualSignup = () => {
  const newsletterRef = useRef();
  const nameRef = useRef();
  const phoneNumberRef = useRef();
  const router = useRouter();

  const [nameValid, setNameValid] = useState(true);
  const [phoneNumberValid, setPhoneNumberValid] = useState(true);
  const [newsletter, setNewsletter] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoad, setPageLoad] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!category.categoryId) {
        router.replace('/auth/join');
        return;
      }
    }

    setPageLoad(false);
  }, []);

  const category = useSelector((state) => state.value.category);

  const { temporaryToken, signIn } = useAuth();

  const newsletterHandler = () => {
    setNewsletter((prev) => !prev);
  };

  const returnHandler = (e) => {
    e.preventDefault();
    router.push('/auth/join');
  };

  const formSubmitHandler = (e) => {
    e.preventDefault();

    const name = nameRef.current.value;
    const phoneNumber = phoneNumberRef.current.value;

    if (!name) {
      setNameValid(false);
      swal({
        title: 'oops!',
        text: 'Kindly complete all required fields',
        timer: 2000,
      });
      return;
    }

    if (!phoneNumber || isNaN(+phoneNumber) || phoneNumber.charAt(0) !== '+') {
      setPhoneNumberValid(false);
      swal({
        title: 'Oops!',
        text: "Invalid phone number. Ensure to include country code starting with '+' (e.g +12124567890).",
      });
      return;
    }

    const userInfo = {
      ...category,
      categoryId: +category.categoryId,
      name,
      phoneNumber: phoneNumber,
      newsletter,
    };

    setIsLoading(true);

    fetch(`/api/proxy?${Date.now()}`, {
      method: 'POST',
      body: JSON.stringify(userInfo),
      headers: {
        'Content-Type': 'application/json',
        uri: '/public/users/create',
        proxy_to_method: 'POST',
      },
    })
      .then((res) => {
        if (!res.ok || res.statusCode === 500) {
          return res.json().then((errorData) => {
            swal({
              title: 'Sorry!',
              text: `${errorData.errorMessage}`,
            });
            throw new Error(errorData.errorMessage);
          });
        }

        return res.json().then((response) => {
          if (response.statusCode === 500) {
            throw new Error('something went wrong');
          }

          swal({
            title: 'Submitted',
            text: 'User registered successfully. You will now be signed in',
            icon: 'success',
            button: 'Ok',
          }).then(() => {
            signIn({
              token: temporaryToken,
              user: response,
            });

            nameRef.current.value = '';
            phoneNumberRef.current.value = '';
            router.replace('/homepage/dashboard');
          });
        });
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  if (pageLoad) {
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

      {isLoading &&
        createPortal(<Backdrop />, document.getElementById('backdrop-root'))}
      {isLoading &&
        createPortal(<Spinner />, document.getElementById('backdrop-root'))}
      <form
        onSubmit={formSubmitHandler}
        className='px-auto relative mx-auto bg-white font-sans'
        style={{ width: '680px', height: '697px', padding: '93px 142px' }}
      >
        <button
          onClick={returnHandler}
          className='absolute left-8 top-8 flex flex-row items-center gap-2'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='14'
            height='8'
            viewBox='0 0 14 8'
            fill='none'
          >
            <path
              d='M0.999999 4L4.33333 7M0.999999 4L4.33333 1M0.999999 4L13 4'
              stroke='#252530'
              strokeWidth='1.4'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
          <p>Back</p>
        </button>
        {/* {error && <p className="text-sm mx-auto text-red-600">{error}</p>} */}
        <Image src={logo} alt="Company's logo" width={172} height={61} />
        <p
          className=' w-64 text-2xl font-medium text-dark'
          style={{ marginTop: '28px' }}
        >
          Individual Sign Up
        </p>
        <div className='relative mt-3.5'>
          <label className='text-sm font-normal text-light-brown'>
            Name <span className='text-red-600'>*</span>
          </label>{' '}
          <br />
          <input
            type='text'
            ref={nameRef}
            onChange={() => setNameValid(true)}
            className='rounded-md bg-light-grey font-sans placeholder:font-medium placeholder:text-light-brown focus:outline-blue-200'
            placeholder='Name'
            style={{
              width: '396px',
              height: '43px',
              paddingLeft: '14px',
              border: '0.5px solid rgba(0, 0, 0, 0.50)',
            }}
          />
          {!nameValid && (
            <p className='absolute right-0 top-1 text-sm text-red-600'>
              name cannot be empty
            </p>
          )}
        </div>

        <div
          className='relative my-3.5'
          style={{ width: '396px', height: '43px' }}
        >
          <label
            className='text-sm font-normal'
            style={{ color: 'rgba(0, 0, 0, 0.50)' }}
          >
            Phone Number<span className='text-red-600'>*</span>
          </label>{' '}
          <br />
          <input
            ref={phoneNumberRef}
            onChange={() => setPhoneNumberValid(true)}
            type='text'
            min='0'
            placeholder='+12124567890'
            className='rounded-md bg-light-grey font-sans placeholder:font-medium placeholder:text-light-brown focus:outline-blue-200'
            style={{
              width: '396px',
              height: '43px',
              border: '0.5px solid rgba(0, 0, 0, 0.50)',
              paddingLeft: '14px',
            }}
          />
          {!phoneNumberValid && (
            <p className='absolute right-0 top-1 text-sm text-red-600'>
              invalid phone number
            </p>
          )}
        </div>

        <div className='mt-12 flex flex-row items-center'>
          <input
            type='checkbox'
            onChange={newsletterHandler}
            checked={newsletter}
            ref={newsletterRef}
            className='me-1 cursor-pointer rounded-md bg-light-grey'
          />
          <label
            onClick={newsletterHandler}
            className='cursor-pointer text-sm font-normal text-light-brown'
          >
            Send me news letters and keep me updated on daily news
          </label>
        </div>

        <div
          className='mt-3.5 text-sm'
          style={{ color: 'rgba(0, 0, 0, 0.50)', fontWeight: '400' }}
        >
          By clicking Create Account, you acknowledge you have read and agreed
          to our{' '}
          <a
            href='https://sky.trade/terms.pdf'
            target='_blank'
            style={{ color: '#0653EA', textDecoration: 'underline' }}
          >
            Terms of Use
          </a>{' '}
          and{' '}
          <a
            href='https://sky.trade/privacy.pdf'
            target='_blank'
            style={{ color: '#0653EA', textDecoration: 'underline' }}
          >
            Privacy Policy
          </a>
          .
        </div>
        <button
          className='mt-4 rounded-md bg-dark-blue text-white  transition-all duration-500 ease-in-out hover:bg-blue-600'
          style={{ width: '396px', height: '46px' }}
        >
          Create Account
        </button>
      </form>
    </Fragment>
  );
};

export default IndividualSignup;
