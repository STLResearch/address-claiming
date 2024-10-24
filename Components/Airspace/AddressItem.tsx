import { LocationPointIcon } from "../Icons";

export const AddressItem = ({
  placeName,
  onClick,
}: {
  placeName: string;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className="w-full text-left text-[#222222] p-4 border-b-[0.2px] border-[#DBDBDB]"
    >
      <div className="flex items-center">
        <div className="w-[10%] h-6 mr-3">
          <LocationPointIcon />
        </div>
        <div className="w-[90%] text-[14px]">{placeName}</div>
      </div>
    </div>
  );
};
