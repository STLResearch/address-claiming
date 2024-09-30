import Service from "./Service";

interface CurrentLeaderboardSummaryI {
  startDate: string; // ISO Date string
  endDate: string; // ISO Date string
  currentPeriodPoints: {
    email: string;
    totalPoints: number;
  }[];
  position: number | null; // Nullable number
}

interface LeaderboardSummaryI {
  periodStartDate: string; // ISO Date string
  periodEndDate: string; // ISO Date string
  totalPoints: number; // Number
}

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
        uri: `private/reward/overral-leaderboard-info`,
      });
      return response?.data as LeaderboardSummaryI;
    } catch (error) {
      console.error(error);
    }
  };

  return {
    getUserRewardsInfo,
    getCurrentLeaderBoardInfo,
    getUserOverallLeaderboardSummary,
  };
};

export default RewardService;
