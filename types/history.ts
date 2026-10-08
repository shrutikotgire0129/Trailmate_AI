import { OutdoorMission } from "./mission";

export type MissionHistoryItem = {
  id: string;
  mission: OutdoorMission;
  completedAt: string;
  phoneFreeMinutes: number;
};