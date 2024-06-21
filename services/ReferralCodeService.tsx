import Service from "./Service"

const ReferralCodeService = () => {
  const { getRequest, patchRequest } = Service();

  const getReferralByCode = async (referralCode: string) => {
    try {
      const response = await getRequest({
        uri: `/public/referral-code/${referralCode}`,
        isPublic: true,
        suppressErrorReporting: true
      })
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  }

  const sendReferral = async (receiverEmail: string) => {
    try {
      const response = await getRequest({
        uri: `/referral-code/send-referral/${receiverEmail}`
      })
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  }

  const getReferralCodeById = async (id: string | number) => {
    try {
      const response = await getRequest({
        uri: `/referral-code/referral-code/${id}`
      })
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  }

  const updateReferral = async ({ postData }: { postData: any }) => {
    try {
      const response = await patchRequest({
        uri:  `/referral-code`,
        postData,
      })
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  }


  return { 
    getReferralByCode,
    getReferralCodeById,
    updateReferral,
    sendReferral
  };
};

export default ReferralCodeService;