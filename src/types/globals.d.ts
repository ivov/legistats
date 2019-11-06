declare type legislatorBaseData = {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  type: string;
  partyId: number;
  regionId: number;
  affirmativeVotes: number;
  negativeVotes: number;
  abstentions: number;
  absences: number;
  urlId: number;
};

declare type allLegislatorsBaseData = Array<legislatorBaseData>;

declare type legislatorDerivedData = {
  photoUrl: string;
  party: string;
  region: string;
  translatedType: string;
  regionFlagPath: string;
  deputies: number;
  population: number;
  partyColleagues: Array<string>;
  votes: votes;
  votings: votings;
};

declare type votes = Array<{ votingId: number; voteType: string }>;

declare type votings = Array<{
  id: number;
  title: string;
  votedAt: string;
  voteType: string;
}>;

declare type PieChartData = Array<{ name: string; value: number }>;

declare namespace NodeJS {
  export interface ProcessEnv {
    REACT_APP_DEV_CONNSTRING: string;
  }
}

declare module "*.json" {
  const value: any;
  export default value;
}
