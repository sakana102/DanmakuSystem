import { Platform } from "@/utils/types/platform";
import { Item } from "@/entrypoints/content/types/item";
import { SELECTORS } from "@/entrypoints/content/data/selectors";
import { CanvasManager } from "@/entrypoints/content/core/canvas-manager";

export class ItemParser {
  private platform: Platform;
  private canvas: CanvasManager;

  constructor(platform: Platform, canvas: CanvasManager) {
    this.platform = platform;
    this.canvas = canvas;
  }

  public async parse(material: HTMLElement): Promise<Item> {
    const display = window.getComputedStyle(material).display;
    const contents = material.querySelector<HTMLElement>(SELECTORS.chat.contents[this.platform]);
    const item: Item = {
      type: "flow",
      state: "pending",
      element: document.createElement("div"),
      width: 0,
      height: 0,
    };

    if (display === "none" || !contents || contents.hidden || material.hidden) {
      return item;
    }

    const nodes = await Promise.all(Array.from(contents.childNodes).map((node) => this.convertNode(node)));
    nodes.forEach((node) => node && item.element.append(node));

    item.element.style.height = `${this.canvas.measureItemHeight()}px`;
    item.element.className = "DanmakuSystem__item";
    item.width = this.canvas.measureItemWidth(item.element);
    item.height = this.canvas.measureItemHeight();

    return item;
  }

  private async convertNode(node: ChildNode): Promise<Node | null> {
    if (node.nodeType === Node.TEXT_NODE) {
      const span = document.createElement("span");
      span.textContent = node.textContent;
      return span;
    }

    if (!(node instanceof HTMLElement)) {
      return null;
    }

    if (node.matches(SELECTORS.chat.messages[this.platform])) {
      return node.cloneNode(true);
    }

    if (node.matches(SELECTORS.chat.emotes[this.platform])) {
      return await this.createImage(node as HTMLImageElement);
    }

    const image = node.querySelector<HTMLImageElement>(SELECTORS.chat.emotes[this.platform]);
    if (image) {
      return await this.createImage(image);
    }

    return null;
  }

  private async createImage(image: HTMLImageElement): Promise<HTMLImageElement> {
    const clone = await this.cloneImage(image);
    const itemHeight = this.canvas.measureItemHeight();
    const ratio = clone.naturalWidth / clone.naturalHeight;
    clone.style.width = `${itemHeight * ratio - 5}px`;
    clone.style.height = `${itemHeight - 5}px`;
    return clone;
  }

  private async cloneImage(image: HTMLImageElement): Promise<HTMLImageElement> {
    const clone = image.cloneNode(true) as HTMLImageElement;
    await new Promise<void>((resolve) => {
      clone.onload = () => resolve();
      clone.onerror = () => resolve();
      clone.src = image.src;
    });
    return clone;
  }
}
