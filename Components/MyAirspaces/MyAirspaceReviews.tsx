import Image from "next/image";

const MyAirspaceReviews = (props) => {
  return (
    <div
      className="absolute top-5 rounded-md bg-white px-1 py-5"
      style={{ width: "339px", height: "90%", left: "380px" }}
    >
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-4">
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M11.0303 8.53033C11.3232 8.23744 11.3232 7.76256 11.0303 7.46967C10.7374 7.17678 10.2626 7.17678 9.96967 7.46967L5.96967 11.4697C5.82322 11.6161 5.75 11.8081 5.75 12C5.75 12.1017 5.77024 12.1987 5.80691 12.2871C5.84351 12.3755 5.89776 12.4584 5.96967 12.5303L9.96967 16.5303C10.2626 16.8232 10.7374 16.8232 11.0303 16.5303C11.3232 16.2374 11.3232 15.7626 11.0303 15.4697L8.31066 12.75H18C18.4142 12.75 18.75 12.4142 18.75 12C18.75 11.5858 18.4142 11.25 18 11.25H8.31066L11.0303 8.53033Z"
                fill="#252530"
              />
            </svg>
          </button>
          <h2 className="font-bold">AirSpace Title</h2>
        </div>
        <button onClick={props.closeDetails}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="34"
            height="34"
            viewBox="0 0 34 34"
            fill="none"
          >
            <path
              d="M12.7578 12.7285L21.2431 21.2138"
              stroke="#252530"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12.7569 21.2138L21.2422 12.7285"
              stroke="#252530"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <div className="mt-8 flex flex-row items-center justify-center gap-7 pb-2.5">
        <button className="relative" onClick={props.viewMyAirspace}>
          <p className="font-bold">Overview</p>
          {/* <div style={{height: "4px", width: "40px", bottom: "-10px", left: "20%"}} className="bg-dark-blue absolute rounded-t-md"></div> */}
        </button>
        <button className="relative" onClick={props.myAirspaceReview}>
          <p className="font-bold text-dark-blue">Reviews</p>
          <div
            style={{
              height: "4px",
              width: "35px",
              bottom: "-10px",
              left: "20%",
            }}
            className="absolute rounded-t-md bg-dark-blue"
          ></div>
        </button>
        <button className="relative" onClick={props.aboutMyAirspace}>
          <p className="font-bold">About</p>
          {/* <div style={{height: "4px", width: "30px", bottom: "-10px", left: "18%"}} className="bg-dark-blue absolute rounded-t-md"></div> */}
        </button>
      </div>
      <div
        className="-mx-1 flex flex-col items-center justify-center py-5 text-sm"
        style={{
          borderTop: "0.01px solid blue",
          borderBottom: "0.01px solid blue",
        }}
      >
        <p className="text-5xl font-medium">4.5</p>
        <div className="flex flex-row items-center">
          <Image
            src="/images/Star.png"
            alt="star icon"
            width={14}
            height={14}
          />
          <Image
            src="/images/Star.png"
            alt="star icon"
            width={14}
            height={14}
          />
          <Image
            src="/images/Star.png"
            alt="star icon"
            width={14}
            height={14}
          />
          <Image
            src="/images/Star.png"
            alt="star icon"
            width={14}
            height={14}
          />
          <Image
            src="/images/Star-half.png"
            alt="star icon"
            width={12}
            height={12}
          />
        </div>
        <p>6 reviews</p>
      </div>
      <div
        style={{ width: "100%", height: "50%" }}
        className="overflow-y-auto bg-white pt-6"
      >
        <div
          style={{ width: "299px" }}
          className="mx-auto rounded bg-light-blue p-2.5"
        >
          <p>
            “Lorem ipsum dolor sit amet, consectetur adipiscing et, sed do
            eiusmod tempor incididunt ut Duis aute irure dolor in reprehe nderit
            in voluptate velit esse cillum do lore eu fugiat nulla pariatu
            labore t enim ad minima ve niam, quis nostrum exercitationem”
          </p>
          <div className="mt-2 flex flex-row justify-end">
            <p className="">21st August 2023</p>
          </div>
        </div>
        <div className="me-5 mt-2.5 flex flex-row items-center justify-start">
          <Image
            src="/images/Ellipse.png"
            alt="icon"
            className="ms-6"
            width={40}
            height={40}
          />
          <div className="me-5 ms-2">
            <p className="font-base text-sm font-bold text-light-brown">
              John Doe
            </p>
            <div className="flex flex-row items-center text-sm text-light-brown">
              <p>4.5</p>
              <div className="flex flex-row items-center">
                <Image
                  src="/images/Star.png"
                  alt="star icon"
                  width={12}
                  height={12}
                />
                <Image
                  src="/images/Star.png"
                  alt="star icon"
                  width={12}
                  height={12}
                />
                <Image
                  src="/images/Star.png"
                  alt="star icon"
                  width={12}
                  height={12}
                />
                <Image
                  src="/images/Star.png"
                  alt="star icon"
                  width={12}
                  height={12}
                />
                <Image
                  src="/images/Star-half.png"
                  alt="star icon"
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
  );
};

export default MyAirspaceReviews;
