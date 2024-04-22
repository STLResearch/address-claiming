export const handleSelectAddress = (
  placeName: string,
  setAddress: React.Dispatch<React.SetStateAction<string>>,
  setFlyToAddress: React.Dispatch<React.SetStateAction<string>>,
  setShowOptions: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setAddress(placeName);
  setFlyToAddress(placeName);
  setShowOptions(false);
};
