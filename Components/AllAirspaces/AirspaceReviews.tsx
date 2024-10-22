import Image from "next/image";

const AirspaceReviews = (props) => {
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
          <h2 className="font-bold">Air Rights Title</h2>
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
        <button className="relative" onClick={props.viewAirspace}>
          <p className="font-bold ">Overview</p>
          {/* <div style={{height: "4px", width: "40px", bottom: "-10px", left: "20%"}} className="bg-blue absolute rounded-t-md"></div> */}
        </button>
        <button className="relative" onClick={props.viewAirspaceReview}>
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
        <button className="relative" onClick={props.aboutAirspace}>
          <p className="font-bold">About</p>
          {/* <div style={{height: "4px", width: "30px", bottom: "-10px", left: "18%"}} className="bg-blue absolute rounded-t-md"></div> */}
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
        <button
          onClick={props.onClick}
          className="mt-5 flex flex-row items-center gap-1 rounded px-2 py-1"
          style={{ border: "1px solid" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
          >
            <path
              d="M8.75033 13.2702H5.25033C2.08283 13.2702 0.729492 11.9169 0.729492 8.74935V5.24935C0.729492 2.08185 2.08283 0.728516 5.25033 0.728516H6.41699C6.65616 0.728516 6.85449 0.926849 6.85449 1.16602C6.85449 1.40518 6.65616 1.60352 6.41699 1.60352H5.25033C2.56116 1.60352 1.60449 2.56018 1.60449 5.24935V8.74935C1.60449 11.4385 2.56116 12.3952 5.25033 12.3952H8.75033C11.4395 12.3952 12.3962 11.4385 12.3962 8.74935V7.58268C12.3962 7.34352 12.5945 7.14518 12.8337 7.14518C13.0728 7.14518 13.2712 7.34352 13.2712 7.58268V8.74935C13.2712 11.9169 11.9178 13.2702 8.75033 13.2702Z"
              fill="#0653EA"
            />
            <path
              d="M4.95828 10.3193C4.60244 10.3193 4.27578 10.191 4.03661 9.95766C3.75078 9.67182 3.62828 9.25766 3.69244 8.82016L3.94328 7.06432C3.98994 6.72599 4.21161 6.28849 4.45078 6.04932L9.04744 1.45266C10.2083 0.291823 11.3866 0.291823 12.5474 1.45266C13.1833 2.08849 13.4691 2.73599 13.4108 3.38349C13.3583 3.90849 13.0783 4.42182 12.5474 4.94682L7.95078 9.54349C7.71161 9.78266 7.27411 10.0043 6.93578 10.051L5.17994 10.3018C5.10411 10.3193 5.02828 10.3193 4.95828 10.3193ZM9.66578 2.07099L5.06911 6.66766C4.95828 6.77849 4.82994 7.03516 4.80661 7.18682L4.55578 8.94266C4.53244 9.11182 4.56744 9.25182 4.65494 9.33932C4.74244 9.42682 4.88244 9.46182 5.05161 9.43849L6.80744 9.18766C6.95911 9.16432 7.22161 9.03599 7.32661 8.92516L11.9233 4.32849C12.3024 3.94932 12.5008 3.61099 12.5299 3.29599C12.5649 2.91682 12.3666 2.51432 11.9233 2.06516C10.9899 1.13182 10.3483 1.39432 9.66578 2.07099Z"
              fill="#0653EA"
            />
            <path
              d="M11.5794 5.73367C11.5386 5.73367 11.4977 5.72784 11.4627 5.71617C9.92857 5.28451 8.7094 4.06534 8.27774 2.53117C8.21357 2.29784 8.34774 2.05867 8.58107 1.98867C8.8144 1.92451 9.05357 2.05867 9.11774 2.29201C9.46774 3.53451 10.4536 4.52034 11.6961 4.87034C11.9294 4.93451 12.0636 5.17951 11.9994 5.41284C11.9469 5.61117 11.7719 5.73367 11.5794 5.73367Z"
              fill="#0653EA"
            />
          </svg>
          <p>Write a review</p>
        </button>
      </div>
      <div
        style={{ width: "100%", height: "40%" }}
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

export default AirspaceReviews;
