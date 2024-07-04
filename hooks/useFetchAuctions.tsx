import MarketPlaceService from '@/services/MarketPlaceService';
import { AuctionDataI } from '@/types';
import { useState, useEffect } from 'react';

const useFetchAuctions = (initialPage: number = 1, limit: number = 10) => {
  const { getNfts } = MarketPlaceService();
  const [auctions, setAuctions] = useState<AuctionDataI[]>([]);
  const [page, setPage] = useState<number>(initialPage);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getNfts(page, limit);
      const newData = response.data;
      setAuctions(prevData => (page === 1 ? newData : [...prevData, ...newData]));
      setHasMore(newData.length === limit);
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page]);


  return { loading, page, auctions, hasMore, setPage };
};

export default useFetchAuctions;
