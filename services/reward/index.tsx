import Service from "../Service";
import {
  CurrentLeaderboardSummaryI,
  LeaderboardPositionI,
  LeaderboardOverallSummaryI,
} from "./types";

const RewardService = () => {
  const { getRequest } = Service();

  const getUserRewardsInfo = async () => {
    try {
      const response = await getRequest({
        uri: `/private/reward/get-reward-info`,
      });
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  };

  const getCurrentLeaderBoardInfo = async (page: number, limit: number) => {
    try {
      const response = await getRequest({
        uri: `/private/reward/current-leaderboard-info?page=${page}&limit=${limit}`,
      });
      return response?.data as CurrentLeaderboardSummaryI;
    } catch (error) {
      console.error(error);
    }
  };

  const getUserOverallLeaderboardSummary = async () => {
    try {
      const response = await getRequest({
        uri: `/private/reward/overral-leaderboard-info`,
      });
      return response?.data as LeaderboardOverallSummaryI;
    } catch (error) {
      console.error(error);
    }
  };

  const getUserCurrentLeaderBoardPosition = async (currentLimit: number) => {
    try {
      const response = await getRequest({
        uri: `/private/reward/current-leaderboard-position?currentLimit=${currentLimit}`,
      });
      return response?.data as LeaderboardPositionI;
    } catch (error) {
      console.error(error);
    }
  };

  return {
    getUserRewardsInfo,
    getCurrentLeaderBoardInfo,
    getUserOverallLeaderboardSummary,
    getUserCurrentLeaderBoardPosition,
  };
};

export default RewardService;
