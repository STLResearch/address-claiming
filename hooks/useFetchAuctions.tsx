import MarketPlaceService from '@/services/MarketPlaceService';
import { useState, useEffect } from 'react';
// import axios from 'axios';

const useFetchAuctions = (initialPage: number = 1, limit: number = 10) => {
const {getNfts} = MarketPlaceService()
  const [auctions, setAuctions] = useState<any[]>([]);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);
  const [loading ,setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response  = await getNfts(
        page,
        limit,
      );
      const newData = response.data;
      setAuctions(prevData => (page === 1 ? newData : [...prevData, ...newData]));
      setHasMore(newData.length === limit);
    } catch (error) {
      console.error('Error fetching data', error);
    }
    finally{
      setLoading(false)
    }
  };
  useEffect(() => {

    fetchData();
  }, [page, limit]);
  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  return {loading,page,setAuctions, auctions, hasMore, loadMore };
};

export default useFetchAuctions;
