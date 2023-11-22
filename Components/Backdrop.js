const Backdrop = (props) => {
  return (
    <div
      style={{ backgroundColor: 'rgba(37, 37, 48, 0.45)' }}
      className='fixed left-0 top-0 z-20 h-screen w-screen bg-slate-400'
      onClick={props.onClick}
    ></div>
  );
};

export default Backdrop;
