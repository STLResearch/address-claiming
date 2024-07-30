import Service from "./Service"

const RewardService = () => {
  const { getRequest } = Service();

  const getUserRewardsInfo = async ()=>{
    try {
      const response = await getRequest({
        uri: `/private/reward/get-reward-info`,
      })
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  }

  return { 
    getUserRewardsInfo,
  };
};

export default RewardService;