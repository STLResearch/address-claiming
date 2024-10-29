import { Web3authContext } from "@/providers/web3authProvider";
import { setIsTriggerRefresh } from "@/redux/slices/userSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import MarketplaceService from "@/services/MarketplaceService";
import { AuctionDataI } from "@/types";
import { useState, useEffect, useContext } from "react";

const useFetchAuctions = (initialPage: number = 1, limit: number = 10, searchParam = "") => {
  const { isTriggerRefresh, priceRange, activeFilters } = useAppSelector((state) => {
    const { isTriggerRefresh, priceRange, activeFilters } = state.userReducer;
    return { isTriggerRefresh, priceRange, activeFilters };
  });
  const dispatch = useAppDispatch();
  const { getAuctions, searchAuctions } = MarketplaceService();
  const [auctions, setAuctions] = useState<AuctionDataI[] | null>(null);
  const [page, setPage] = useState<number>(initialPage);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const { web3auth } = useContext(Web3authContext);

  const fetchData = async () => {
    try {
      setLoading(true);
      let response;
      if (
        (searchParam === "" || searchParam === undefined || searchParam === null) &&
        priceRange[0] === 0 &&
        priceRange[1] === 0
      ) {
        response = await getAuctions(page, limit);
      } else {
        response = await searchAuctions(searchParam, page, limit);
      }

      const newData = response;

      setAuctions((prevData) => (page === 1 ? newData : [...(prevData || []), ...newData]));
      setHasMore(newData?.length === limit);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
      dispatch(setIsTriggerRefresh(false));
    }
  };

  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, [web3auth?.status, page, isTriggerRefresh, searchParam, activeFilters]);

  return { loading, page, auctions, hasMore, setPage };
};

export default useFetchAuctions;
