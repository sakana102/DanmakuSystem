import { Platform } from "@/utils/types/platform";
import { CanvasManager } from "../core/canvas-manager";
import { Settings } from "@/utils/types/settings";
import { LaneAllocator } from "../core/lane-allocator";
import { LaneType } from "../types/types";
import { ItemAnimator } from "../core/item-animator";
import { ItemParser } from "../core/item-parser";
import { StorageManager } from "../utils/storage-manager";
import { applyDecorationCommands } from "../core/decoration-commands";

export class DanmakuSystem {
  private platform: Platform;
  private canvas: CanvasManager;
  private storage: StorageManager;
  private settings: Settings;
  private eventDisposers: Array<() => void>;
  private itemParser: ItemParser;
  private itemAnimator: ItemAnimator;
  private laneAllocators: Record<LaneType, LaneAllocator>;

  constructor(platform: Platform, canvas: HTMLElement, storage: StorageManager, settings: Settings) {
    this.platform = platform;
    this.canvas = new CanvasManager(canvas);
    this.storage = storage;
    this.settings = settings;
    this.eventDisposers = [];

    this.itemParser = new ItemParser(this.platform, this.canvas);
    this.itemAnimator = new ItemAnimator(this.platform, this.canvas, this.settings);
    this.laneAllocators = {
      flow: new LaneAllocator(this.platform, this.canvas, this.settings),
      up: new LaneAllocator(this.platform, this.canvas, this.settings),
      down: new LaneAllocator(this.platform, this.canvas, this.settings),
    };
    this.update(canvas);
  }

  public async update(canvas: HTMLElement) {
    this.canvas.update(canvas);
    this.settings = await this.storage.get();

    this.itemAnimator.update(this.settings);
    Object.values(this.laneAllocators).forEach((laneAllocator) => {
      laneAllocator.update(this.settings);
    });
  }

  public start() {
    const unwatch = this.storage.watch(() => this.update(this.canvas.getElement()));
    this.eventDisposers.push(unwatch);

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(() => this.update(this.canvas.getElement()));
    });
    resizeObserver.observe(this.canvas.getElement());
    this.eventDisposers.push(() => resizeObserver.disconnect());
  }

  public stop() {
    this.eventDisposers.forEach((dispose) => dispose());
    this.eventDisposers = [];

    this.canvas.cancelAllAnimations();
    this.canvas.clear();

    this.update(this.canvas.getElement());
  }

  public async add(material: HTMLElement) {
    if (!this.settings.enable[this.platform]) return;

    const totalItemCount = Object.values(this.laneAllocators).reduce((acc, a) => acc + a.getTotalItemCount(), 0);
    const displayLimit = this.settings.displayLimit[this.platform];
    if (displayLimit > 0 && totalItemCount >= displayLimit) return;

    const item = await this.itemParser.parse(material);
    if (!item.element.hasChildNodes()) return;

    if (this.settings.decoration[this.platform]) {
      applyDecorationCommands(item);
    }

    this.laneAllocators[item.type].add(item.type, item);
    console.log(this.laneAllocators);
    this.animate(item.type);
  }

  private animate(type: LaneType) {
    const pendingItems = this.laneAllocators[type].getPendingItems();
    const laneLength = this.laneAllocators[type].getLanesLength();

    pendingItems.forEach(({ item, laneIndex }) => {
      item.state = "animating";
      this.itemAnimator.animate(type, item, laneLength, laneIndex, () => {
        this.laneAllocators[type].remove(item, laneIndex);
      });
    });
  }
}
