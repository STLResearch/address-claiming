  
 export const Button= ({ label, type, onClick }:{label:any,type?:any,onClick?:any}) => {
    return (
       <button
        onClick={onClick}
        className={`border border-primary text-primary bg-blue-400 hover:text-white hover:bg-primary w-full px-4 py-2 rounded-[10px] transition ease-in-out duration-300 active:scale-x-95 min-w-[6rem]`}
      > 
      
        {label}
      </button>
    );
  };