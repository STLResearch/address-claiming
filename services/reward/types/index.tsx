export interface CurrentPeriodPointsI {
  blockchainAddress: string;
  email: string;
  rewardCount: string;
  totalPoints: number;
}

export interface CurrentLeaderboardSummaryI {
  startDate: string; // ISO Date string
  endDate: string; // ISO Date string
  currentPeriodPoints: CurrentPeriodPointsI[];
  position: number | null; // Nullable number
}

export interface LeaderboardPeriodSummaryI {
  periodStartDate: string; // ISO Date string
  periodEndDate: string; // ISO Date string
  totalPoints: number; // Number
}

export interface LeaderboardOverallSummaryI {
  periodSummaries: {
    periodStartDate: string; // ISO Date string
    periodEndDate: string; // ISO Date string
    totalPoints: number; // Number
  }[];
  position: number;
  totalCount: number;
}

export interface LeaderboardPositionI {
  position: number; // Number
  totalCount: number; // Number
  page: number | null; // Number
}
