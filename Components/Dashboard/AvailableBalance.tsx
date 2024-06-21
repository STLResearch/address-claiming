import { FC } from "react";

import { BalanceLoader } from "@/Components/Wrapped";
import Item from "@/Components/Dashboard/Item";
import { WalletIcon } from "../Shared/Icons";
import { useAppSelector } from "@/redux/store";

const AvailableBalance: FC = () => {
  const { userUSDWalletBalance } = useAppSelector((state) => {
    const { userUSDWalletBalance } = state.userReducer;
    return { userUSDWalletBalance };
  });

  return (
    <Item
      title={"Available Balance"}
      icon={<WalletIcon isActive />}
      linkText={"View funds"}
      href={"/funds"}
      style="h-fit"
    >
      {userUSDWalletBalance.isLoading ? (
        <BalanceLoader />
      ) : (
        <div className="flex items-center justify-between">
          <p className="absolute bottom-[12px] left-[26px] text-3xl text-[#4285F4] font-medium">
            ${userUSDWalletBalance.amount}
          </p>
        </div>
      )}
    </Item>
  );
};

export default AvailableBalance;
