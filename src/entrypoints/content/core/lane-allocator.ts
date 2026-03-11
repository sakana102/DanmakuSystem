import { Platform } from "@/utils/types/platform";
import { Settings } from "@/utils/types/settings";
import { Item } from "@/entrypoints/content/types/item";
import { Lane, Lanes, LaneType } from "@/entrypoints/content/types/lane";
import { CanvasManager } from "./canvas-manager";

export class LaneAllocator {
  private platform: Platform;
  private canvas: CanvasManager;
  private settings: Settings;
  private lanes: Lanes;

  constructor(platform: Platform, canvas: CanvasManager, settings: Settings) {
    this.platform = platform;
    this.canvas = canvas;
    this.settings = settings;
    this.lanes = [];
    this.update(settings);
  }

  public update(settings: Settings) {
    this.settings = settings;
    this.reset();
  }

  public reset() {
    const displayRange = this.settings.displayRange[this.platform];
    const laneLength = Math.floor(this.canvas.getHeight() / this.canvas.measureItemHeight()) * (displayRange / 100);
    console.log(displayRange, laneLength);
    this.lanes = Array.from({ length: laneLength }, () => []);
  }

  public add(type: LaneType, item: Item) {
    if (type === "flow") {
      this.addFlow(item);
    } else {
      this.addFixed(item);
    }
  }

  public remove(item: Item, index: number) {
    const lane = this.lanes[index];
    if (lane) {
      this.lanes[index] = lane.filter((i) => i !== item);
    }
  }

  private addFlow(item: Item) {
    const emptyLane = this.findEmptyLane();
    if (emptyLane) {
      emptyLane.push(item);
      return;
    }

    const nonCollidingLane = this.findNonCollidingLane(item);
    if (nonCollidingLane) {
      nonCollidingLane.push(item);
      return;
    }

    const nearestToGoalLane = this.findNearestToGoalLane();
    nearestToGoalLane.push(item);
    return;
  }

  private addFixed(item: Item) {
    const emptyLane = this.findEmptyLane();
    if (emptyLane) {
      emptyLane.push(item);
      return;
    }

    const sparseLane = this.findSparseLane();
    sparseLane.push(item);
    return;
  }

  private findEmptyLane(): Lane | undefined {
    for (let i = 0; i < this.lanes.length; i++) {
      const lane = this.lanes[i];
      const lastItem = lane[lane.length - 1];

      if (lastItem === undefined) {
        return lane;
      }
    }

    return undefined;
  }

  private findNonCollidingLane(item: Item): Lane | undefined {
    for (let i = 0; i < this.lanes.length; i++) {
      const lane = this.lanes[i];
      const lastItem = lane[lane.length - 1];
      const willNotCollide = this.willNotCollide(item, lastItem);

      if (lastItem === undefined || willNotCollide === true) {
        return lane;
      }
    }

    return undefined;
  }

  private findNearestToGoalLane(): Lane {
    let index = 0;

    for (let i = 1; i < this.lanes.length; i++) {
      const currentLastItem = this.lanes[i][this.lanes[i].length - 1];
      const minLastItem = this.lanes[index][this.lanes[index].length - 1];

      if (!currentLastItem || !minLastItem) continue;

      const currentPositionX = this.canvas.getItemPositionX(currentLastItem.element) + currentLastItem.width;
      const minPositionX = this.canvas.getItemPositionX(minLastItem.element) + minLastItem.width;

      if (currentPositionX <= minPositionX) {
        index = i;
      }
    }

    return this.lanes[index];
  }

  private findSparseLane(): Lane {
    let index = 0;

    for (let i = 0; i < this.lanes.length; i++) {
      if (this.lanes[i].length < this.lanes[index].length) {
        index = i;
      }
    }

    return this.lanes[index];
  }

  public getLanesLength() {
    return this.lanes.length;
  }

  public getTotalItemCount(): number {
    return this.lanes.reduce((acc, lane) => acc + lane.length, 0);
  }

  public getPendingItems(): { item: Item; laneIndex: number }[] {
    const result: { item: Item; laneIndex: number }[] = [];

    this.lanes.forEach((lane, index) => {
      lane.forEach((item) => {
        if (item.state === "pending") {
          result.push({ item: item, laneIndex: index });
        }
      });
    });

    return result;
  }

  private willNotCollide(newItem: Item, compareItem: Item): boolean {
    const displayTime = this.settings.displayTime[this.platform];
    const canvasWidth = this.canvas.getWidth();
    const newItemTravelDistance = canvasWidth + newItem.width;
    const compareItemTravelDistance = canvasWidth + compareItem.width;

    const newItemSpeed = newItemTravelDistance / displayTime;
    const compareItemSpeed = compareItemTravelDistance / displayTime;

    const compareItemPositionX = this.canvas.getItemPositionX(compareItem.element) + compareItem.width;
    const compareItemTraveled = compareItemTravelDistance - compareItemPositionX;
    const compareItemElapsedTime = compareItemTraveled / compareItemSpeed;
    const compareItemIsAppeared = compareItemTraveled >= compareItem.width;
    const compareItemTimeToAppear = compareItem.width / compareItemSpeed;

    if (!compareItemIsAppeared) return false;
    if (newItemSpeed <= compareItemSpeed) return true;

    const catchUpTime =
      (compareItemSpeed * (compareItemElapsedTime - compareItemTimeToAppear)) / (newItemSpeed - compareItemSpeed);

    return catchUpTime >= displayTime - compareItemElapsedTime;
  }
}
