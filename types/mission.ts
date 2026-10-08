export type MissionStep = {
  title: string;
  description: string;
  duration: string;
  whyThisMission?: string;
};

export type OutdoorMission = {
  title: string;
  tagline: string;
  activity: string;
  duration: string;
  difficulty: "Easy" | "Moderate" | "Challenging";
  summary: string;
  preparation: string[];
  steps: MissionStep[];
  natureChallenge: string;
  phoneFreeTip: string;
  safetyTips: string[];
  whyThisMission: string;
};
