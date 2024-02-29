const Backdrop = (props) => {
  return (
    <div
      style={{ backgroundColor: 'rgba(37, 37, 48, 0.45)', zIndex: `${props.zIndex && props.zIndex}` }}
      className='fixed left-0 top-0 z-50 h-screen w-screen bg-slate-400 '
      onClick={props.onClick}
    ></div>
  );
};

export default Backdrop;
