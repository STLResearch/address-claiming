
import { useState } from "react";

interface User {
  id: string;
  balance?: number;
}

const usersData: User[] = [
    { id: "#1 c664hucnh..", balance: 500 },
    { id: "#2 urji8H4..", balance: 200 },
    { id: "#3 ftg8hi..", balance: 150 },
    { id: "#4 Vjguè83d..", balance: 500 },
    { id: "#5 jf7uvdnh..", balance: 500 },
    { id: "#6 j9gEt5j..", balance: 500 },
  ];
  
const PER_PAGE = 6;

const UserBalanceTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(usersData.length / PER_PAGE);
  const paginatedUsers = usersData.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="md:flex w-full md:p-4 p-2 ">
      <div className="md:w-2/3 bg-white rounded-3xl md:p-4 w-full p-2">
      <h1  className="md:my-4 my-6 text-[20px]">Current Period Challenge Leaderboard</h1>
      <table className="min-w-full border-b-2 rounded-md">
        <thead>
            <tr> 
            <th className="border-b px-4 py-4 text-left">User ID</th>
            <th className="border-b px-4 py-4 text-right">Balance</th> {/* Align header to the right */}
            </tr>
        </thead>
        <tbody>
          {paginatedUsers.map((user, index) => {
            const [userNumber, userId] = user.id.split(' ');
            return (
              <tr key={index}>
                <td className="border-b px-4 py-4">
                  <span className="text-[#5D7285] text-base font-bold mr-2">{userNumber}</span>{' '}
                  <span className="text-[#87878D] text-base">{userId}</span>
                </td>
                <td className="border-b px-4 py-4 text-[#87878D] text-right">{user.balance}</td>
              </tr>
            );
          })}
        </tbody>

     </table>

     <div className="md:w-[401px] flex justify-between items-center my-4">
        <div className="mt-4">
          <button className="px-4 py-2 text-blue-500">
            View my position
          </button>
        </div>
         <div className="flex items-center justify-center mt-4 space-x-2">
          {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1;
            return (
              <button
                key={index}
                onClick={() => goToPage(pageNumber)}
                className={`w-8 h-8 flex items-center justify-center border rounded-full ${
                  currentPage === pageNumber
                    ? "bg-[#5D7285] text-white"
                    : "hover:bg-[#5D7285]"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}

          
          {currentPage < totalPages && (
            <button
              onClick={() => goToPage(currentPage + 1)}
              className="px-4 py-2 hover:bg-brown-200"
            >
              Next
            </button>
          )}
          </div>
          
        </div>
      </div>

      <div className="md:w-1/3 md:ml-8 md:p-4 p-2 mt-8">
      
      <h2 className="text-xl font-medium mb-2">Your Earnings</h2>
        <p className="text-base text-[#87878D]">
          Explore your achievements with our Lifetime Earnings section,
          showcasing your journey from the beginning. See how your efforts have
          paid off over time, reflecting your dedication and success in reaching
          milestones. Track your progress and celebrate your accomplishments as
          you continue to grow with us.
        </p>
        <div>
        <div className="text-[#4285F4] text-base mt-8">
          Lifetime Earnings
        </div>
        <div className="text-[#4285F4] text-2xl mt-6 ">
          5,435 SKY Points
        </div>
        </div>
          <div className="bg-[#D9D9D9] h-0.5 w-full my-5"></div>
        <div className="flex justify-between items-center my-6">
            <h1 className="text-[15px] text-[#87878D]">Q3 2024 Earnings</h1>
            <h1 className="text-[15px] text-[#87878D]">535</h1>

        </div>
      </div>
    </div>
  );
};

export default UserBalanceTable;
