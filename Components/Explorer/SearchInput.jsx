import { MagnifyingGlassIcon } from "../Icons";
const SearchInput = ({ address, setAddress, showOptions, addresses, handleSelectAddress }) => {
    return (
      <div className="relative w-full flex items-center rounded-lg bg-white px-[10px] py-[10px]" style={{ border: "1px solid rgb(135, 135, 141,0.3)" }}>
        <input
          autoComplete="off"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          type="text"
          name="searchLocation"
          id="searchLocation"
          placeholder="Search location"
          className="w-full pr-[20px] outline-none"
        />
        <div className="h-[17px] w-[17px]">
          <MagnifyingGlassIcon />
        </div>
        {showOptions && (
          <div className="absolute left-0 top-[55px] w-full flex-col bg-white">
            {addresses.map((item) => (
              <div
                key={item.id}
                value={item.place_name}
                onClick={() => handleSelectAddress(item.place_name)}
                className="w-full p-5 text-left text-[#222222]"
                style={{ borderTop: "0.2px solid #222222" }}
              >
                {item.place_name}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
export default SearchInput;  