const AlertMessage = () => {
  return (
    <div
      className="absolute right-0 top-5 hidden bg-white px-[26px] py-[14px] text-[14px] text-[#0000FF] md:block"
      style={{
        borderLeft: "6px solid #0000FF",
        boxShadow: "0px 0px 40px 0px #0813391A",
      }}
    >
      <span className="font-bold">Refer now!</span> Score a one-time bonus. Act fast!
    </div>
  );
};

export default AlertMessage;
