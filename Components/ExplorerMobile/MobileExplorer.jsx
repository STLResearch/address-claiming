import MobileSearchInput from "./MobileSearchInput";
import { ArrowLeftIcon } from "../Icons";
const MobileExplorer = ({
    address,
    setAddress,
    addresses,
    showOptions,
    handleSelectAddress,
    flyToAddress,
    onGoBack,
  }) => {
    return (
      <div className="z-[40] flex items-center gap-[15px] bg-white px-[21px] py-[19px]">
        <div
          onClick={onGoBack}
          className="flex h-6 w-6 items-center justify-center"
        >
          <ArrowLeftIcon />
        </div>
        <MobileSearchInput address={address} setAddress={setAddress} addresses={addresses} showOptions={showOptions} handleSelectAddress={handleSelectAddress} flyToAddress={flyToAddress}/>
      </div>
    );
  };
  export default MobileExplorer;