import { ArrowRightIcon } from "@/Components/Icons";
import { BalanceLoader } from "@/Components/Wrapped";
import useAuth from "@/hooks/useAuth";
import { useMobile } from "@/hooks/useMobile";
import { Web3authContext } from "@/providers/web3AuthProvider";
import RewardService from "@/services/reward";
import { CurrentPeriodPointsI, LeaderboardPeriodSummaryI } from "@/services/reward/types";
import { useRouter } from "next/navigation";
import { FC, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const LIMIT = 10;

interface PropsI {
  point: string | null;
  isLoadingSkyBalance: boolean;
}

const LeaderboardTable: FC<PropsI> = ({ point, isLoadingSkyBalance }) => {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userCurrentPosition, setUserCurrentPosition] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPeriodPoints, setCurrentPeriodPoints] = useState<CurrentPeriodPointsI[]>([]);
  const [overallSummary, setOverallSummary] = useState<LeaderboardPeriodSummaryI[]>([]);

  const { getCurrentLeaderBoardInfo, getUserOverallLeaderboardSummary, getUserCurrentLeaderBoardPosition } =
    RewardService();

  const { user } = useAuth();
  const { web3auth } = useContext(Web3authContext);

  useEffect(() => {
    (async () => {
      try {
        if (web3auth && web3auth?.status !== "connected") return;

        setIsLoading(true);
        const data = await getCurrentLeaderBoardInfo(currentPage, LIMIT);
        if (data) {
          setCurrentPeriodPoints(data.currentPeriodPoints);
        }
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    })();
  }, [web3auth?.status, currentPage]);

  useEffect(() => {
    (async () => {
      try {
        if (web3auth && web3auth?.status !== "connected") return;

        setIsLoading(true);
        const data = await getUserOverallLeaderboardSummary();
        if (data) {
          setOverallSummary(data.periodSummaries);
          setTotalCount(data.totalCount);
        }
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    })();
  }, [web3auth?.status]);

  const totalPages = Math.ceil(totalCount / LIMIT);

  const handleGetUserCurrentLeaderBoardPosition = async () => {
    setIsLoading(true);

    const data = await getUserCurrentLeaderBoardPosition(LIMIT);
    if (data) {
      if (data.page === null) {
        toast.error("No points earned in this current period");
      } else {
        setCurrentPage(data.page);
        router.push(`/points#${userCurrentPosition}`);
        setUserCurrentPosition(data.position);
      }
    }

    setIsLoading(false);
  };

  const getPosition = (index: number) => {
    return index + 1 + LIMIT * (currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPeriodPoints?.length < LIMIT - 1) return;
    setCurrentPage((prevPageNumber) => prevPageNumber + 1);
  };

  const handlePrevPage = (page: number) => {
    setCurrentPage(page);
  };
  const { isMobile } = useMobile();

  return (
    <div className="w-full p-2 md:flex md:p-4">
      <div className="w-full rounded-3xl bg-white p-2 md:w-2/3 md:p-4">
        <h1 className="my-6 text-[20px] md:my-4">Current Period Challenge Leaderboard</h1>
        <table className="min-w-full rounded-md border-b-2">
          <thead>
            <tr>
              <th className="border-b px-4 py-4 text-left">User ID</th>
              <th className="border-b px-4 py-4 text-right">Balance</th>
            </tr>
          </thead>
          <tbody>
            {!isLoading &&
              currentPeriodPoints.map(({ blockchainAddress, totalPoints }, index) => (
                <tr key={index} id={`${getPosition(index)}`}>
                  <td className="border-b px-4 py-4">
                    <span
                      className={`${getPosition(index) === userCurrentPosition ? "text-blue" : "text-slate-blue"} mr-2 text-base font-bold`}
                    >
                      {`# ${getPosition(index)}`}
                    </span>{" "}
                    <span
                      className={`${getPosition(index) === userCurrentPosition ? "text-blue" : "text-[#87878D]"} text-base`}
                    >
                      {isMobile ?
                        `${blockchainAddress.slice(0, 3)}...${blockchainAddress.slice(-2)}`
                      : blockchainAddress}
                    </span>
                  </td>
                  <td
                    className={`${getPosition(index) === userCurrentPosition ? "text-blue" : "text-[#87878D]"} border-b px-4 py-4 text-right`}
                  >
                    {totalPoints}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {isLoading && <p className="mt-8 text-center">Loading...</p>}

        {!isLoading && currentPeriodPoints.length === 0 && <p className="mt-8 text-center">No record found</p>}

        {!isLoading && (
          <div className="my-4 w-full items-center justify-between px-4 md:flex">
            <div className="mt-4 md:w-[25%]">
              <button
                disabled={isLoading}
                onClick={handleGetUserCurrentLeaderBoardPosition}
                className="py-2 text-blue-500"
              >
                View my position
              </button>
            </div>
            <div className="mt-4 flex items-center md:w-[60%] md:justify-center md:gap-2">
              {[...Array(totalPages)].map((_, index) => {
                return (
                  <button
                    key={index}
                    onClick={() => handlePrevPage(index + 1)}
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-sm md:h-8 md:w-8 md:text-xl ${
                      currentPage === index + 1 ? "bg-slate-blue text-white" : "text-slate-blue"
                    } transition-all duration-300`}
                  >
                    {index + 1}
                  </button>
                );
              })}
              {currentPage < totalPages && !(currentPeriodPoints?.length < LIMIT - 1) && (
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleNextPage}
                    className="ml-2 flex h-8 w-8 items-center justify-center rounded-full text-slate-blue transition-all duration-300"
                  >
                    Next
                  </button>
                  <div>
                    <ArrowRightIcon />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 p-2 md:ml-8 md:w-1/3 md:p-4">
        <h2 className="mb-2 text-xl font-medium">Your Earnings</h2>
        <p className="text-base text-[#87878D]">
          Explore your achievements with our Lifetime Earnings section, showcasing your journey from the beginning. See
          how your efforts have paid off over time, reflecting your dedication and success in reaching milestones. Track
          your progress and celebrate your accomplishments as you continue to grow with us.
        </p>
        <div>
          <div className="mt-8 text-base text-[#4285F4]">Lifetime Earnings</div>
          {isLoadingSkyBalance ?
            <div className="flex items-center justify-start md:h-14">
              <BalanceLoader />
            </div>
          : <div className="mt-6 text-2xl text-[#4285F4]">{point} SKY Points</div>}
        </div>
        <div className="my-5 h-0.5 w-full bg-[#D9D9D9]"></div>

        {overallSummary.map((summary, index) => (
          <div key={index} className="my-6 flex items-center justify-between">
            <h1 className="text-[15px] text-[#87878D]">Period {index + 1} Earnings</h1>
            <h1 className="text-[15px] text-[#87878D]">{summary.totalPoints}</h1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderboardTable;
