const AboutMyAirspace = (props) => {
  return (
    <div
      className="absolute top-5 rounded-md bg-white px-1 py-5"
      style={{ width: "339px", height: "90%", left: "380px" }}
    >
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-4">
          <button>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M11.0303 8.53033C11.3232 8.23744 11.3232 7.76256 11.0303 7.46967C10.7374 7.17678 10.2626 7.17678 9.96967 7.46967L5.96967 11.4697C5.82322 11.6161 5.75 11.8081 5.75 12C5.75 12.1017 5.77024 12.1987 5.80691 12.2871C5.84351 12.3755 5.89776 12.4584 5.96967 12.5303L9.96967 16.5303C10.2626 16.8232 10.7374 16.8232 11.0303 16.5303C11.3232 16.2374 11.3232 15.7626 11.0303 15.4697L8.31066 12.75H18C18.4142 12.75 18.75 12.4142 18.75 12C18.75 11.5858 18.4142 11.25 18 11.25H8.31066L11.0303 8.53033Z"
                fill="#252530"
              />
            </svg>
          </button>
          <h2 className="font-bold">AirSpace Title</h2>
        </div>
        <button onClick={props.closeDetails}>
          <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">
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
        </button>
        {/* <button className="relative" onClick={props.myAirspaceReview}>
                <p className="font-bold">Reviews</p>
            </button> */}
        <button className="relative" onClick={props.aboutMyAirspace}>
          <p className="font-bold text-dark-blue">About</p>
          <div
            style={{
              height: "4px",
              width: "30px",
              bottom: "-10px",
              left: "7%",
            }}
            className="absolute rounded-t-md bg-dark-blue"
          ></div>
        </button>
      </div>

      <div className="overflow-y-auto py-5" style={{ width: "100%", height: "80%" }}>
        <div style={{ width: "299px", border: "1px solid blue" }} className="mx-auto rounded p-2.5">
          <h3 className="text-brown text-sm font-bold">Lodging party details</h3>
          <p className="text-xs" style={{ fontSize: "11px", color: "rgba(63, 61, 86, 0.75)" }}>
            <span className="font-bold">Resident Name: </span>Jorge Constantino Colindres Castillo
          </p>
          <p className="text-xs" style={{ fontSize: "11px", color: "rgba(63, 61, 86, 0.75)" }}>
            <span className="font-bold">Relationship to Title: </span>Legal Rep. of/Rep. Legal de Owners/Propietarios
          </p>
          <p className="text-xs" style={{ fontSize: "11px", color: "rgba(63, 61, 86, 0.75)" }}>
            <span className="font-bold">(e) Resident Identification: </span>
            90000000000035
          </p>
          <p className="text-xs" style={{ fontSize: "11px", color: "rgba(63, 61, 86, 0.75)" }}>
            <span className="font-bold">(e) Resident Email Address: </span>
            jorge.colindres@spi- inertia.com
          </p>
        </div>
        <div style={{ width: "299px", border: "1px solid blue" }} className="mx-auto mt-2.5 rounded p-2.5">
          <h3 className="text-brown text-sm font-bold">
            Common address location of parcel subject to title instrument(s)
          </h3>
          <p className="text-xs" style={{ fontSize: "11px", color: "rgba(63, 61, 86, 0.75)" }}>
            Terreno con un edificio y/o otras infraestructuras en Crawfish Rock, Roatan, Islas de Bahia, Honduras. Land
            with a building and/or other infrastructure located in Crawfish Rock, Roatan, Islas de Bahia, Honduras. La
            parcela también se conoce como Lote 4053. The parcel is also known as Lot 4053.
          </p>
        </div>
        <div style={{ width: "299px", border: "1px solid blue" }} className="mx-auto mt-2.5 rounded p-2.5">
          <h3 className="text-brown text-sm font-bold">Information concerning parcel subject to title instrument(s)</h3>
          <p className="text-xs" style={{ fontSize: "11px", color: "rgba(63, 61, 86, 0.75)" }}>
            <span className="font-bold">Property Institute Matriculation No: </span>
            0000601348-00000
          </p>
          <p className="text-xs" style={{ fontSize: "11px", color: "rgba(63, 61, 86, 0.75)" }}>
            <span className="font-bold">ZEDE Property Registry Number: </span>
            34101000000010.52
          </p>
          <p className="text-xs" style={{ fontSize: "11px", color: "rgba(63, 61, 86, 0.75)" }}>
            <span className="font-bold">Lodgement Registry Number: </span>100
          </p>
        </div>
        <div style={{ width: "299px", border: "1px solid blue" }} className="mx-auto mt-2.5 rounded p-2.5">
          <h3 className="text-brown text-sm font-bold">
            Nature of estate, property interest, covenant, condition, or restriction registered by title instrument(s)
          </h3>
          <p className="text-xs" style={{ fontSize: "11px", color: "rgba(63, 61, 86, 0.75)" }}>
            Dominio Pleno/Fee Simple Absolute
          </p>
        </div>
        <div style={{ width: "299px", border: "1px solid blue" }} className="mx-auto mt-2.5 rounded p-2.5">
          <h3 className="text-brown text-sm font-bold">Parties to title instrument(s)</h3>
          <p className="text-xs" style={{ fontSize: "11px", color: "rgba(63, 61, 86, 0.75)" }}>
            <span className="font-bold">Resident Name: </span>Inversiones SJ, S.A. de C.V.
          </p>
          <p className="text-xs" style={{ fontSize: "11px", color: "rgba(63, 61, 86, 0.75)" }}>
            <span className="font-bold">Relationship to Title: </span>
            Owner/Propietario
          </p>
          <p className="text-xs" style={{ fontSize: "11px", color: "rgba(63, 61, 86, 0.75)" }}>
            <span className="font-bold">(e) Resident Identification: </span>
            84146469786550
          </p>
          <p className="text-xs" style={{ fontSize: "11px", color: "rgba(63, 61, 86, 0.75)" }}>
            <span className="font-bold">(e) Resident Email Address: </span>
            jorge.colindres@spi- inertia.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutMyAirspace;
