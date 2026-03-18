import { Platform } from "@/utils/types/platform";
import { Settings } from "@/utils/types/settings";
import { Item } from "@/entrypoints/content/types/item";
import { LaneType } from "@/entrypoints/content/types/lane";
import { CanvasManager } from "@/entrypoints/content/core/canvas-manager";

export class ItemAnimator {
  private platform: Platform;
  private canvas: CanvasManager;
  private settings: Settings;

  constructor(platform: Platform, canvas: CanvasManager, settings: Settings) {
    this.platform = platform;
    this.canvas = canvas;
    this.settings = settings;
  }

  public update(settings: Settings) {
    this.settings = settings;
  }

  public async animate(
    type: LaneType,
    item: Item,
    laneLength: number,
    laneIndex: number,
    onFinish: () => void,
  ): Promise<void> {
    this.canvas.append(item.element);

    if (type === "flow") {
      item.element.style.top = `${item.height * laneIndex}px`;
      item.element.style.left = `${this.canvas.getWidth()}px`;
      await this.animateFlow(item);
    }

    if (type === "up") {
      item.element.style.top = `${item.height * laneIndex}px`;
      item.element.style.left = `${(this.canvas.getWidth() - item.width) / 2}px`;
      await this.animateFixed(item);
    }

    if (type === "down") {
      item.element.style.top = `${item.height * (laneLength - 1 - laneIndex)}px`;
      item.element.style.left = `${(this.canvas.getWidth() - item.width) / 2}px`;
      await this.animateFixed(item);
    }

    onFinish();
    item.element.remove();
  }

  private async animateFlow(item: Item): Promise<void> {
    const animation = item.element.animate(
      [
        { transform: `translate3d(0, 0, 0)` },
        { transform: `translate3d(${-(this.canvas.getWidth() + item.width)}px, 0, 0)` },
      ],
      {
        duration: this.settings.displayTime[this.platform] * 1000,
        easing: "linear",
      },
    );

    await animation.finished;
    item.state = "finished";
  }

  private async animateFixed(item: Item): Promise<void> {
    const animation = item.element.animate([{ opacity: 1 }, { opacity: 1 }], {
      duration: this.settings.displayTime[this.platform] * 1000,
    });

    await animation.finished;
    item.state = "finished";
  }
}
