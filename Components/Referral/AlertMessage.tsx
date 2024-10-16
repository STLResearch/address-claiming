const AlertMessage = () => {
  return (
    <div
      className="absolute hidden md:block top-5 right-0 text-[14px] py-[14px] px-[26px] bg-white text-[#0000FF]"
      style={{
        borderLeft: "6px solid #0000FF",
        boxShadow: "0px 0px 40px 0px #0813391A",
      }}
    >
      <span className="font-bold">Refer now!</span> Score a one-time bonus. Act
      fast!
    </div>
  );
};

export default AlertMessage;
