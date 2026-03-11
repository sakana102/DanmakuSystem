import { LaneType } from "@/entrypoints/content/types/lane";

export type ItemState = "pending" | "animating" | "finished";

export type Item = {
  type: LaneType;
  state: ItemState;
  element: HTMLElement;
  width: number;
  height: number;
};
