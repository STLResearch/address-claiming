import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Chart from "chart.js/auto";

import Navbar from "@/Components/Navbar";
import Sidebar from "@/Components/Sidebar";

const Dashboard = () => {
    useEffect(() => {
        const ctx = document.getElementById('chart').getContext('2d');

        if (ctx) {
            const existingChart = Chart.getChart(ctx);
      
            if (existingChart) {
              existingChart.destroy();
            }
        }
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['August 21', 'August 22', 'August 23', 
                        'August 24', 'August 25', 'August 26',
                      ],
            datasets: [{
              label: 'Payment Overview',
              data: [2, 4, 2, 
                      4, 8, 12,  
                      ],
            //   backgroundColor: 'rgb(255, 211, 11)',
              color: "black",
              barThickness: 10,
              borderRadius: 10
            }]
          },
          options: {
            scales: {
              x: {
                // display: false 
              },
              y: {
                // display: false 
              }
            },
            plugins: {
              tooltip: {
                backgroundColor: 'black', 
                bodyColor: 'white',
                yAlign: 'bottom',
                titleFont: {
                    size: 14,
                },
                titleColor: "white",
                bodyFont: {
                    color: 'red'
                },
                displayColors: false,
                // padding: 10,
                boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.5)',
                style: {
                    textAlign: 'center'
                }
              },
              legend: {
                // display: false, 
              },
              label: {
                display: false
              },
              title: {
                display: false,
                text: "August 10"
              }
            }
          }
        });
    }, [])



    return <div className="flex flex-row mx-auto" style={{maxWidth: "1440px"}}>
        {/* <Sidebar /> */}


        <div className="bg-white relative border-e-2" style={{width: "257px", height: "100vh"}}>
            <Image src="/images/logo.png" alt="Company's logo" width={164} height={58} className="mt-4 ms-12 my-12" />
            <div className="flex flex-col gap-5 ms-10">
                <Link href="/homepage/dashboard" className="flex flex-row gap-2 hover:gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M8.92955 4.46984C7.65833 4.32776 6.34242 4.32776 5.0712 4.46984C4.76231 4.50436 4.51872 4.74895 4.48397 5.04601C4.33217 6.34395 4.33217 7.65516 4.48397 8.9531C4.51872 9.25016 4.76231 9.49475 5.0712 9.52927C6.34242 9.67135 7.65833 9.67135 8.92955 9.52927C9.23844 9.49475 9.48203 9.25016 9.51678 8.9531C9.66858 7.65516 9.66858 6.34395 9.51678 5.04601C9.48203 4.74895 9.23844 4.50436 8.92955 4.46984ZM4.90459 2.97912C6.28654 2.82467 7.71421 2.82467 9.09616 2.97912C10.087 3.08986 10.8894 3.86985 11.0066 4.87176C11.172 6.28547 11.172 7.71364 11.0066 9.12735C10.8894 10.1293 10.087 10.9093 9.09616 11.02C7.71421 11.1744 6.28654 11.1744 4.90459 11.02C3.91375 10.9093 3.11131 10.1293 2.99413 9.12735C2.82878 7.71364 2.82878 6.28547 2.99413 4.87176C3.11131 3.86985 3.91375 3.08986 4.90459 2.97912Z" fill="#252530"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M8.92955 14.4698C7.65833 14.3278 6.34242 14.3278 5.0712 14.4698C4.76231 14.5044 4.51872 14.749 4.48397 15.046C4.33217 16.344 4.33217 17.6552 4.48397 18.9531C4.51872 19.2502 4.76231 19.4948 5.0712 19.5293C6.34242 19.6714 7.65833 19.6714 8.92955 19.5293C9.23844 19.4948 9.48203 19.2502 9.51678 18.9531C9.66858 17.6552 9.66858 16.344 9.51678 15.046C9.48203 14.749 9.23844 14.5044 8.92955 14.4698ZM4.90459 12.9791C6.28654 12.8247 7.71421 12.8247 9.09616 12.9791C10.087 13.0899 10.8894 13.8698 11.0066 14.8718C11.172 16.2855 11.172 17.7136 11.0066 19.1274C10.8894 20.1293 10.087 20.9093 9.09616 21.02C7.71421 21.1744 6.28654 21.1744 4.90459 21.02C3.91375 20.9093 3.11131 20.1293 2.99413 19.1274C2.82878 17.7136 2.82878 16.2855 2.99413 14.8718C3.11131 13.8699 3.91375 13.0899 4.90459 12.9791Z" fill="#252530"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M18.9295 4.46984C17.6583 4.32776 16.3424 4.32776 15.0712 4.46984C14.7623 4.50436 14.5187 4.74895 14.484 5.04601C14.3322 6.34395 14.3322 7.65516 14.484 8.9531C14.5187 9.25016 14.7623 9.49475 15.0712 9.52927C16.3424 9.67135 17.6583 9.67135 18.9295 9.52927C19.2384 9.49475 19.482 9.25016 19.5168 8.9531C19.6686 7.65516 19.6686 6.34395 19.5168 5.04601C19.482 4.74895 19.2384 4.50436 18.9295 4.46984ZM14.9046 2.97912C16.2865 2.82467 17.7142 2.82467 19.0962 2.97912C20.087 3.08986 20.8894 3.86985 21.0066 4.87176C21.172 6.28547 21.172 7.71364 21.0066 9.12735C20.8894 10.1293 20.087 10.9093 19.0962 11.02C17.7142 11.1744 16.2865 11.1744 14.9046 11.02C13.9138 10.9093 13.1113 10.1293 12.9941 9.12735C12.8288 7.71364 12.8288 6.28547 12.9941 4.87176C13.1113 3.86985 13.9138 3.08986 14.9046 2.97912Z" fill="#252530"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M18.9295 14.4698C17.6583 14.3278 16.3424 14.3278 15.0712 14.4698C14.7623 14.5044 14.5187 14.749 14.484 15.046C14.3322 16.344 14.3322 17.6552 14.484 18.9531C14.5187 19.2502 14.7623 19.4948 15.0712 19.5293C16.3424 19.6714 17.6583 19.6714 18.9295 19.5293C19.2384 19.4948 19.482 19.2502 19.5168 18.9531C19.6686 17.6552 19.6686 16.344 19.5168 15.046C19.482 14.749 19.2384 14.5044 18.9295 14.4698ZM14.9046 12.9791C16.2865 12.8247 17.7142 12.8247 19.0962 12.9791C20.087 13.0899 20.8894 13.8698 21.0066 14.8718C21.172 16.2855 21.172 17.7136 21.0066 19.1274C20.8894 20.1293 20.087 20.9093 19.0962 21.02C17.7142 21.1744 16.2865 21.1744 14.9046 21.02C13.9138 20.9093 13.1113 20.1293 12.9941 19.1274C12.8288 17.7136 12.8288 16.2855 12.9941 14.8718C13.1113 13.8699 13.9138 13.0899 14.9046 12.9791Z" fill="#252530"/>
                    </svg>
                    <span>Dashboard</span>
                </Link>
                <Link href="/homepage/airspace" className="flex flex-row gap-2 hover:gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M13.5579 5.53472C12.6873 4.69936 11.3128 4.69936 10.4422 5.53472L5.8158 9.97405C5.70245 10.0828 5.6262 10.2245 5.59787 10.379C5.04373 13.4009 5.00283 16.4945 5.47687 19.53L5.58939 20.2505H8.56585V14.0391C8.56585 13.6249 8.90164 13.2891 9.31585 13.2891H14.6843C15.0985 13.2891 15.4343 13.6249 15.4343 14.0391V20.2505H18.4107L18.5232 19.53C18.9973 16.4945 18.9564 13.4009 18.4023 10.379C18.3739 10.2245 18.2977 10.0828 18.1843 9.97406L13.5579 5.53472ZM9.40369 4.4524C10.8546 3.06014 13.1455 3.06014 14.5964 4.4524L19.2229 8.89174C19.5634 9.21853 19.7925 9.64422 19.8777 10.1085C20.4622 13.2961 20.5053 16.5594 20.0053 19.7614L19.8245 20.9189C19.7498 21.3976 19.3375 21.7505 18.853 21.7505H14.6843C14.2701 21.7505 13.9343 21.4147 13.9343 21.0005V14.7891H10.0659V21.0005C10.0659 21.4147 9.73007 21.7505 9.31585 21.7505H5.14712C4.66264 21.7505 4.25035 21.3976 4.1756 20.9189L3.99484 19.7614C3.49479 16.5594 3.53794 13.2961 4.12247 10.1085C4.2076 9.64422 4.43668 9.21853 4.77725 8.89173L9.40369 4.4524Z" fill="#252530"/>
                    </svg>
                    <span>Airspace</span>
                </Link>
                <Link href="/homepage/uavs" className="flex flex-row gap-2 hover:gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M8 9.50028C7.30964 9.50028 6.75 10.0599 6.75 10.7503C6.75 11.4406 7.30964 12.0003 8 12.0003C8.69036 12.0003 9.25 11.4406 9.25 10.7503C9.25 10.0599 8.69036 9.50028 8 9.50028Z" fill="#252530"/>
                        <path d="M12 9.50028C11.3096 9.50028 10.75 10.0599 10.75 10.7503C10.75 11.4406 11.3096 12.0003 12 12.0003C12.6904 12.0003 13.25 11.4406 13.25 10.7503C13.25 10.0599 12.6904 9.50028 12 9.50028Z" fill="#252530"/>
                        <path d="M14.75 10.7503C14.75 10.0599 15.3096 9.50028 16 9.50028C16.6904 9.50028 17.25 10.0599 17.25 10.7503C17.25 11.4406 16.6904 12.0003 16 12.0003C15.3096 12.0003 14.75 11.4406 14.75 10.7503Z" fill="#252530"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M16.1007 4.59307C13.4065 4.36331 10.6983 4.34998 8.00194 4.5532L7.80871 4.56776C5.23741 4.76156 3.25 6.90439 3.25 9.48299V18.0003C3.25 18.2642 3.38867 18.5086 3.61515 18.644C3.84163 18.7794 4.12261 18.7858 4.35504 18.6609L8.26583 16.5592C8.44774 16.4615 8.65104 16.4103 8.85756 16.4103H17.834C18.9661 16.4103 19.9362 15.6009 20.1392 14.4871C20.5505 12.2299 20.5829 9.91994 20.2353 7.65203L20.1329 6.98371C19.9464 5.76696 18.951 4.83614 17.7245 4.73155L16.1007 4.59307ZM8.11468 6.04896C10.731 5.85176 13.359 5.8647 15.9733 6.08765L17.597 6.22612C18.1334 6.27186 18.5686 6.6789 18.6502 7.21097L18.7526 7.8793C19.075 9.98259 19.0449 12.1249 18.6635 14.2183C18.5904 14.619 18.2413 14.9103 17.834 14.9103H8.85756C8.40322 14.9103 7.95596 15.0229 7.55575 15.2379L4.75 16.7458V9.48299C4.75 7.68909 6.13262 6.19834 7.92144 6.06352L8.11468 6.04896Z" fill="#252530"/>
                    </svg>
                    <span>UAVs</span>
                </Link>
                <Link href="/homepage/wallet" className="flex flex-row gap-2 hover:gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M15.4995 12.0006C15.4995 11.1722 16.171 10.5006 16.9995 10.5006C17.8279 10.5006 18.4995 11.1722 18.4995 12.0006C18.4995 12.829 17.8279 13.5006 16.9995 13.5006C16.171 13.5006 15.4995 12.829 15.4995 12.0006Z" fill="#252530"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M20.4408 6.67463C19.783 5.12897 18.3296 4.01784 16.6001 3.83584L15.9483 3.76725C12.6559 3.42079 9.3352 3.44364 6.04796 3.83536L5.61602 3.88683C3.94722 4.08569 2.62497 5.3895 2.40269 7.05534C1.96473 10.3377 1.96473 13.6636 2.40269 16.9459C2.62497 18.6117 3.94722 19.9156 5.61602 20.1144L6.04796 20.1659C9.3352 20.5576 12.6559 20.5805 15.9483 20.234L16.6001 20.1654C18.3296 19.9834 19.783 18.8723 20.4408 17.3266C21.4801 17.0172 22.2732 16.1162 22.4034 15.003C22.6367 13.0082 22.6367 10.993 22.4034 8.99825C22.2732 7.88503 21.4801 6.98405 20.4408 6.67463ZM15.7913 5.25901C12.6102 4.92426 9.40163 4.94634 6.22545 5.32482L5.79351 5.37629C4.80469 5.49412 4.02122 6.26667 3.88952 7.25373C3.46912 10.4044 3.46912 13.5969 3.88952 16.7475C4.02122 17.7346 4.8047 18.5071 5.79351 18.625L6.22545 18.6764C9.40164 19.0549 12.6102 19.077 15.7913 18.7422L16.4431 18.6736C17.2937 18.5841 18.0463 18.1649 18.5678 17.5426C17.0596 17.6305 15.5314 17.5912 14.0412 17.4247C12.7718 17.2828 11.7453 16.2833 11.5955 15.003C11.3622 13.0082 11.3622 10.993 11.5955 8.99825C11.7453 7.71799 12.7718 6.71845 14.0412 6.57658C15.5314 6.41003 17.0596 6.37073 18.5678 6.45867C18.0463 5.83636 17.2937 5.41711 16.4431 5.32761L15.7913 5.25901ZM19.2768 8.01532C19.2774 8.01916 19.278 8.023 19.2786 8.02684L19.2847 8.06572L19.4833 8.03487C19.5861 8.04505 19.6887 8.05585 19.7911 8.0673C20.3785 8.13295 20.8463 8.59709 20.9136 9.1725C21.1334 11.0515 21.1334 12.9497 20.9136 14.8287C20.8463 15.4042 20.3785 15.8683 19.7911 15.9339C19.6887 15.9454 19.5861 15.9562 19.4833 15.9664L19.2847 15.9355L19.2786 15.9744C19.278 15.9782 19.2774 15.9821 19.2768 15.9859C17.5982 16.1378 15.8766 16.1205 14.2078 15.9339C13.6204 15.8683 13.1527 15.4042 13.0854 14.8287C12.8656 12.9497 12.8656 11.0515 13.0854 9.1725C13.1527 8.59709 13.6204 8.13295 14.2078 8.0673C15.8766 7.88078 17.5982 7.86346 19.2768 8.01532Z" fill="#252530"/>
                    </svg>
                    <span>Wallet</span>
                </Link>
                <Link href="/homepage/settings" className="flex flex-row gap-2 hover:gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12.0003 3.07848L9.78746 5.36798C9.55194 5.61167 9.22755 5.74928 8.88865 5.74928H5.75026V8.88767C5.75026 9.22658 5.61265 9.55096 5.36896 9.78648L3.07946 11.9993L5.36896 14.2121C5.61265 14.4476 5.75026 14.772 5.75026 15.1109V18.2493H8.88865C9.22755 18.2493 9.55193 18.3869 9.78746 18.6306L12.0003 20.9201L14.2131 18.6306C14.4486 18.3869 14.773 18.2493 15.1119 18.2493H18.2503V15.1109C18.2503 14.772 18.3879 14.4476 18.6316 14.2121L20.9211 11.9993L18.6316 9.78649C18.3879 9.55096 18.2503 9.22658 18.2503 8.88768V5.74928H15.1119C14.773 5.74928 14.4486 5.61167 14.2131 5.36798L12.0003 3.07848ZM11.1014 1.85005C11.5928 1.34165 12.4077 1.34165 12.8991 1.85005L15.2179 4.24928H18.5003C19.1906 4.24928 19.7503 4.80893 19.7503 5.49928V8.78162L22.1495 11.1005C22.6579 11.5918 22.6579 12.4067 22.1495 12.8981L19.7503 15.2169V18.4993C19.7503 19.1896 19.1906 19.7493 18.5003 19.7493H15.2179L12.8991 22.1485C12.4077 22.6569 11.5928 22.6569 11.1014 22.1485L8.78259 19.7493H5.50026C4.8099 19.7493 4.25026 19.1896 4.25026 18.4993V15.217L1.85103 12.8981C1.34263 12.4067 1.34263 11.5918 1.85103 11.1005L4.25026 8.78162V5.49928C4.25026 4.80893 4.80991 4.24928 5.50026 4.24928H8.78259L11.1014 1.85005Z" fill="#252530"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M7.25026 11.9993C7.25026 9.37593 9.37691 7.24928 12.0003 7.24928C14.6236 7.24928 16.7503 9.37593 16.7503 11.9993C16.7503 14.6226 14.6236 16.7493 12.0003 16.7493C9.37691 16.7493 7.25026 14.6226 7.25026 11.9993ZM12.0003 8.74928C10.2053 8.74928 8.75026 10.2044 8.75026 11.9993C8.75026 13.7942 10.2053 15.2493 12.0003 15.2493C13.7952 15.2493 15.2503 13.7942 15.2503 11.9993C15.2503 10.2044 13.7952 8.74928 12.0003 8.74928Z" fill="#252530"/>
                    </svg>
                    <span>Settings</span>
                </Link>
            </div>
            <button className="absolute bottom-20 ms-10 flex flex-row gap-2 hover:gap-3 hover:text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 18.25C11.5858 18.25 11.25 18.5858 11.25 19C11.25 19.4142 11.5858 19.75 12 19.75H18C18.9665 19.75 19.75 18.9665 19.75 18V6C19.75 5.0335 18.9665 4.25 18 4.25H12C11.5858 4.25 11.25 4.58579 11.25 5C11.25 5.41421 11.5858 5.75 12 5.75L18 5.75C18.1381 5.75 18.25 5.86193 18.25 6L18.25 18C18.25 18.1381 18.1381 18.25 18 18.25H12Z" fill="#252530"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M14.5031 14.3652C15.1934 14.3652 15.7531 13.8056 15.7531 13.1152V10.8747C15.7531 10.1843 15.1934 9.6247 14.5031 9.6247L9.89048 9.6247C9.88396 9.55128 9.87713 9.47787 9.87 9.40448L9.81597 8.8486C9.73354 8.00049 8.83294 7.49258 8.06451 7.86084C6.43029 8.64403 4.95085 9.71578 3.69736 11.0245L3.59816 11.1281C3.13395 11.6128 3.13395 12.3771 3.59815 12.8618L3.69736 12.9654C4.95085 14.2741 6.43029 15.3459 8.06451 16.1291C8.83293 16.4973 9.73354 15.9894 9.81597 15.1413L9.87 14.5854C9.87713 14.512 9.88396 14.4386 9.89048 14.3652H14.5031ZM9.19511 12.8652C8.92874 12.8652 8.69326 13.0045 8.56008 13.216C8.49523 13.319 8.45464 13.4391 8.44656 13.5685C8.42842 13.8594 8.40524 14.15 8.37703 14.4403L8.36135 14.6017C7.3253 14.0677 6.36316 13.4028 5.49838 12.6239C5.27402 12.4218 5.05622 12.2121 4.84538 11.995C5.86892 10.9409 7.05651 10.0607 8.36135 9.38824L8.37703 9.54959C8.40524 9.83987 8.42842 10.1305 8.44656 10.4214C8.47122 10.8167 8.79902 11.1247 9.19511 11.1247H14.2531V12.8652H9.19511Z" fill="#252530"/>
                </svg>
                <span>Log Out</span>
            </button>
        </div>



        
        <div style={{width: "1183px", height: "100vh", overflowY: "scroll"}}>
            <header style={{width: "1183px", height: "91px"}} className="bg-white p-0">
                <nav className="container mx-auto my-0 flex flex-row justify-between items-center">
                    <div className="relative">
                        <svg xmlns="http://www.w3.org/2000/svg" className="absolute bottom-11 right-2" width="17" height="17" viewBox="0 0 17 17" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd" d="M10.7118 11.7481C8.12238 13.822 4.33202 13.6588 1.93164 11.2584C-0.643879 8.6829 -0.643879 4.50716 1.93164 1.93164C4.50716 -0.64388 8.68289 -0.643879 11.2584 1.93164C13.6588 4.33202 13.822 8.12238 11.7481 10.7118L16.7854 15.7491C17.0715 16.0352 17.0715 16.4992 16.7854 16.7854C16.4992 17.0715 16.0352 17.0715 15.7491 16.7854L10.7118 11.7481ZM2.96795 10.2221C0.964766 8.21893 0.964766 4.97113 2.96795 2.96795C4.97113 0.964767 8.21892 0.964767 10.2221 2.96795C12.2238 4.96966 12.2253 8.21416 10.2265 10.2177C10.225 10.2192 10.2236 10.2206 10.2221 10.2221C10.2206 10.2236 10.2192 10.225 10.2177 10.2265C8.21416 12.2253 4.96966 12.2238 2.96795 10.2221Z" fill="#252530" fillOpacity="0.55"/>
                        </svg>
                        <input type="text" className="rounded-md my-7 ms-5" style={{width: "433px", height: "47px", border: "1px solid rgba(37, 37, 48, 0.55)"}} />
                    </div>
                    <div className="flex flex-row justify-center items-center me-5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" style={{background: "#EFEFF9", borderRadius: "50%", padding: '1px 5px'}} viewBox="0 0 16 20" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd" d="M8.58319 1C8.58319 0.447715 8.13548 0 7.58319 0C7.03091 0 6.58319 0.447715 6.58319 1V1.75H6.02577C3.8007 1.75 1.9591 3.48001 1.82021 5.70074L1.5992 9.2342C1.51494 10.5814 1.06266 11.8797 0.291595 12.9876C-0.405087 13.9886 0.215133 15.3712 1.42606 15.5165L4.83319 15.9254V17C4.83319 18.5188 6.06441 19.75 7.58319 19.75C9.10197 19.75 10.3332 18.5188 10.3332 17V15.9254L13.7403 15.5165C14.9512 15.3712 15.5715 13.9886 14.8748 12.9876C14.1037 11.8797 13.6514 10.5814 13.5672 9.2342L13.3462 5.70074C13.2073 3.48001 11.3657 1.75 9.1406 1.75H8.58319V1ZM6.02577 3.25C4.59277 3.25 3.40673 4.36417 3.31728 5.79438L3.09628 9.32784C2.99488 10.949 2.45063 12.5112 1.52278 13.8444C1.47243 13.9168 1.51725 14.0167 1.60478 14.0272L5.34244 14.4757C6.83093 14.6543 8.33544 14.6543 9.82393 14.4757L13.5616 14.0272C13.6491 14.0167 13.6939 13.9168 13.6436 13.8444C12.7157 12.5112 12.1715 10.949 12.0701 9.32784L11.8491 5.79438C11.7596 4.36417 10.5736 3.25 9.1406 3.25H6.02577ZM7.58319 18.25C6.89283 18.25 6.33319 17.6904 6.33319 17V16.25H8.83319V17C8.83319 17.6904 8.27355 18.25 7.58319 18.25Z" fill="#252530" fillOpacity="0.55"/>
                        </svg>
                        <Image src="/images/Ellipse.png" alt="icon" className="ms-6" width={55} height={55} />
                        <div className="me-5 ms-2">
                            <p className="font-base font-medium">John Doe</p>
                            <div className="flex flex-row items-center">
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="10" viewBox="0 0 11 10" fill="none">
                                        <path d="M5.95691 0.261597C5.75333 -0.0871984 5.24667 -0.0871997 5.04309 0.261597L3.60935 2.718C3.50878 2.89031 3.33495 3.00789 3.13682 3.03764L0.449897 3.44109C-0.0013905 3.50885 -0.15969 4.07531 0.191767 4.36479L2.19341 6.01343C2.3787 6.16604 2.46582 6.40676 2.42081 6.64175L1.89721 9.37536C1.81444 9.80749 2.27075 10.1432 2.66227 9.93829L5.19235 8.61389C5.38492 8.51309 5.61508 8.51309 5.80765 8.61389L8.33773 9.93829C8.72925 10.1432 9.18556 9.80749 9.10279 9.37536L8.57919 6.64175C8.53418 6.40676 8.6213 6.16604 8.80659 6.01343L10.8082 4.36479C11.1597 4.07532 11.0014 3.50886 10.5501 3.44109L7.86318 3.03764C7.66505 3.00789 7.49122 2.89031 7.39065 2.718L5.95691 0.261597Z" fill="#FFD037"/>
                                    </svg>
                                </div>
                                <p className="text-sm"><span className="font-bold">4.8</span> Rating</p>
                            </div>
                        </div>
                    </div>
                </nav>  
            </header>
            <div className="flex flex-row">
                <div className="">
                    <div className="flex flex-row gap-5">
                        <div className="ms-5 my-5 p-5" style={{width: "262px", height: "169px", borderRadius: "10px", background: "#fff"}}>
                            <div className="flex flex-row justify-between items-center">
                                <div style={{width: "35px", height: "36px", background: "#BED9C7", borderRadius: "4px"}} className="flex flex-row justify-center items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="17" viewBox="0 0 21 17" fill="none">
                                        <path d="M13.4252 8.47717C13.4252 7.64875 14.0968 6.97717 14.9252 6.97717C15.7537 6.97717 16.4252 7.64875 16.4252 8.47717C16.4252 9.3056 15.7537 9.97717 14.9252 9.97717C14.0968 9.97717 13.4252 9.3056 13.4252 8.47717Z" fill="#1A572E"/>
                                        <path fillRule="evenodd" clipRule="evenodd" d="M18.3666 3.15119C17.7088 1.60553 16.2554 0.494403 14.5259 0.312405L13.874 0.243809C10.5817 -0.102644 7.26098 -0.0797977 3.97374 0.311922L3.5418 0.363394C1.873 0.562254 0.550751 1.86606 0.328475 3.5319C-0.109491 6.81421 -0.109492 10.1402 0.328475 13.4225C0.550751 15.0883 1.873 16.3921 3.5418 16.591L3.97374 16.6425C7.26098 17.0342 10.5817 17.057 13.874 16.7106L14.5259 16.642C16.2554 16.46 17.7088 15.3488 18.3666 13.8032C19.4058 13.4938 20.199 12.5928 20.3292 11.4796C20.5625 9.48477 20.5625 7.4696 20.3292 5.47481C20.199 4.36159 19.4058 3.46062 18.3666 3.15119ZM13.7171 1.73557C10.536 1.40082 7.32741 1.4229 4.15123 1.80138L3.71929 1.85286C2.73048 1.97069 1.947 2.74323 1.8153 3.73029C1.3949 6.88093 1.3949 10.0734 1.8153 13.2241C1.947 14.2111 2.73048 14.9837 3.71929 15.1015L4.15123 15.153C7.32742 15.5315 10.536 15.5535 13.7171 15.2188L14.3689 15.1502C15.2195 15.0607 15.972 14.6415 16.4936 14.0191C14.9854 14.1071 13.4572 14.0678 11.967 13.9012C10.6976 13.7594 9.67103 12.7598 9.52129 11.4796C9.28799 9.48477 9.28799 7.4696 9.52129 5.47481C9.67103 4.19455 10.6976 3.19501 11.967 3.05314C13.4572 2.88659 14.9854 2.84729 16.4936 2.93524C15.972 2.31292 15.2195 1.89367 14.3689 1.80417L13.7171 1.73557ZM17.2026 4.49188C17.2032 4.49572 17.2038 4.49956 17.2044 4.5034L17.2105 4.54229L17.4091 4.51144C17.5119 4.52161 17.6145 4.53242 17.7169 4.54386C18.3043 4.60951 18.7721 5.07366 18.8394 5.64907C19.0591 7.52807 19.0591 9.4263 18.8394 11.3053C18.7721 11.8807 18.3043 12.3449 17.7169 12.4105C17.6145 12.422 17.5119 12.4328 17.4091 12.4429L17.2105 12.4121L17.2044 12.451C17.2038 12.4548 17.2032 12.4587 17.2026 12.4625C15.524 12.6143 13.8024 12.597 12.1336 12.4105C11.5462 12.3449 11.0784 11.8807 11.0111 11.3053C10.7914 9.4263 10.7914 7.52807 11.0111 5.64907C11.0784 5.07366 11.5462 4.60951 12.1336 4.54386C13.8024 4.35735 15.524 4.34002 17.2026 4.49188Z" fill="#1A572E"/>
                                    </svg>
                                </div>
                                <div className="flex flex-row ">
                                    <p className="font-bold">.</p>
                                    <p className="font-bold">.</p>
                                    <p className="font-bold">.</p>
                                </div>
                            </div>
                            <div className="mt-10">
                                <p>Balance</p>
                                <h3>$4,000.85</h3>
                            </div>
                        </div>
                        <div className="my-5 p-5" style={{width: "262px", height: "169px", borderRadius: "10px", background: "#fff"}}>
                            <div className="flex flex-row justify-between items-center">
                                <div style={{width: "35px", height: "36px", background: "#AAC0EA", borderRadius: "4px"}} className="flex flex-row justify-center items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M13.5579 5.53472C12.6873 4.69936 11.3128 4.69936 10.4422 5.53472L5.8158 9.97405C5.70245 10.0828 5.6262 10.2245 5.59787 10.379C5.04373 13.4009 5.00283 16.4945 5.47687 19.53L5.58939 20.2505H8.56585V14.0391C8.56585 13.6249 8.90164 13.2891 9.31585 13.2891H14.6843C15.0985 13.2891 15.4343 13.6249 15.4343 14.0391V20.2505H18.4107L18.5232 19.53C18.9973 16.4945 18.9564 13.4009 18.4023 10.379C18.3739 10.2245 18.2977 10.0828 18.1843 9.97406L13.5579 5.53472ZM9.40369 4.4524C10.8546 3.06014 13.1455 3.06014 14.5964 4.4524L19.2229 8.89174C19.5634 9.21853 19.7925 9.64422 19.8777 10.1085C20.4622 13.2961 20.5053 16.5594 20.0053 19.7614L19.8245 20.9189C19.7498 21.3976 19.3375 21.7505 18.853 21.7505H14.6843C14.2701 21.7505 13.9343 21.4147 13.9343 21.0005V14.7891H10.0659V21.0005C10.0659 21.4147 9.73007 21.7505 9.31585 21.7505H5.14712C4.66264 21.7505 4.25035 21.3976 4.1756 20.9189L3.99484 19.7614C3.49479 16.5594 3.53794 13.2961 4.12247 10.1085C4.2076 9.64422 4.43668 9.21853 4.77725 8.89173L9.40369 4.4524Z" fill="#0653EA"/>
                                    </svg>
                                </div>
                                <div className="flex flex-row ">
                                    <p className="font-bold">.</p>
                                    <p className="font-bold">.</p>
                                    <p className="font-bold">.</p>
                                </div>
                            </div>
                            <div className="mt-10">
                                <p>My Airspace</p>
                                <h3>5</h3>
                            </div>
                        </div>
                        <div className="my-5 p-5" style={{width: "262px", height: "169px", borderRadius: "10px", background: "#fff"}}>
                            <div className="flex flex-row justify-between items-center">
                                <div style={{width: "35px", height: "36px", background: "#FFF4D1", borderRadius: "4px"}} className="flex flex-row justify-center items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <g clipPath="url(#clip0_462_9841)">
                                        <path d="M20.5002 18.9993H3.50022C2.95022 18.9993 2.50022 19.4493 2.50022 19.9993C2.50022 20.5493 2.95022 20.9993 3.50022 20.9993H20.5002C21.0502 20.9993 21.5002 20.5493 21.5002 19.9993C21.5002 19.4493 21.0502 18.9993 20.5002 18.9993ZM22.0702 9.6393C21.8502 8.8393 21.0302 8.3693 20.2302 8.5793L14.9202 9.9993L8.46022 3.9793C8.19022 3.7193 7.80022 3.6293 7.44022 3.7293C6.76022 3.9193 6.44022 4.6993 6.79022 5.3093L10.2302 11.2693L5.26022 12.5993L3.69022 11.3593C3.44022 11.1693 3.12022 11.0993 2.81022 11.1793L2.48022 11.2693C2.16022 11.3493 2.01022 11.7193 2.18022 11.9993L4.06022 15.2493C4.29022 15.6393 4.75022 15.8293 5.18022 15.7193L21.0002 11.4793C21.8002 11.2593 22.2802 10.4393 22.0702 9.6393Z" fill="#C8A32A"/>
                                        </g>
                                        <defs>
                                        <clipPath id="clip0_462_9841">
                                        <rect width="24" height="24" fill="white"/>
                                        </clipPath>
                                        </defs>
                                    </svg>
                                </div>
                                <div className="flex flex-row ">
                                    <p className="font-bold">.</p>
                                    <p className="font-bold">.</p>
                                    <p className="font-bold">.</p>
                                </div>
                            </div>
                            <div className="mt-10">
                                <p>UAVs</p>
                                <h3>5</h3>
                            </div>
                        </div>            
                    </div>
                    <div className="bg-white mx-5 pt-10 px-5" style={{width: "826px", height: "553px", borderRadius: "10px"}}>
                        <canvas id="chart"></canvas>
                    </div>
                    
                </div>
                <div>
                    <div className="bg-white my-5 me-2" style={{width: "292px", height: "298px", borderRadius: "10px",}}>
                        
                    </div>
                    <div className="bg-white my-5 me-2 py-5 px-4" style={{width: "292px", height: "424px", borderRadius: "10px"}}>
                            <h2 className="font-bold text-xl mb-3">News Feed</h2>
                        <div className="flex flex-row justify-between mb-5 items-center">
                            <p className="font-semibold" style={{color: "#722ACF"}}>4 Jul</p>
                            <hr style={{width: "150px"}}></hr>
                            <div className="flex flex-row ">
                                <p className="font-bold">.</p>
                                <p className="font-bold">.</p>
                                <p className="font-bold">.</p>
                            </div>
                        </div>
                        <div className="flex flex-row items-center mb-3">
                            <p>9:00am</p>
                            <div className="border-l-4 border-black ps-2 ms-2">
                                <h3>Title</h3>
                                <p className="text-sm">Lorem ipsum dolor sit amet, adipiscing elit, sed doeiusmod temporut.</p>
                            </div>
                        </div>
                        <div className="flex flex-row items-center mb-3">
                            <p>9:00am</p>
                            <div className="border-l-4 border-black ps-2 ms-2">
                                <h3>Title</h3>
                                <p className="text-sm">Lorem ipsum dolor sit amet, adipiscing elit, sed doeiusmod temporut.</p>
                            </div>
                        </div>
                        <div className="flex flex-row items-center mb-3">
                            <p>9:00am</p>
                            <div className="border-l-4 border-black ps-2 ms-2">
                                <h3>Title</h3>
                                <p className="text-sm">Lorem ipsum dolor sit amet, adipiscing elit, sed doeiusmod temporut.</p>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
            <div className="flex flex-row mt-10 justify-between items-center">
                <p className="ms-5">&copy; Skytrades 2023</p>
                <div className="flex flex-row -me-24 items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="11" viewBox="0 0 14 11" fill="none">
                        <path d="M12.6 0H1.4C0.63 0 0 0.61875 0 1.375V9.625C0 10.3813 0.63 11 1.4 11H12.6C13.37 11 14 10.3813 14 9.625V1.375C14 0.61875 13.37 0 12.6 0ZM12.32 2.92188L7.742 5.73375C7.287 6.01562 6.713 6.01562 6.258 5.73375L1.68 2.92188C1.505 2.81188 1.4 2.62625 1.4 2.42688C1.4 1.96625 1.911 1.69125 2.31 1.93187L7 4.8125L11.69 1.93187C12.089 1.69125 12.6 1.96625 12.6 2.42688C12.6 2.62625 12.495 2.81188 12.32 2.92188Z" fill="black" fillOpacity="0.5"/>
                    </svg>
                    <p>help@skytrades.com</p>
                </div>
            </div>
        </div>
    </div>
    
}

export default Dashboard;