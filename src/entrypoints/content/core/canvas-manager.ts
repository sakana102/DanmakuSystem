export class CanvasManager {
  private canvas: HTMLElement;

  constructor(canvas: HTMLElement) {
    this.canvas = canvas;
  }

  public update(canvas: HTMLElement) {
    this.canvas = canvas;
  }

  public append(element: HTMLElement): void {
    this.canvas.append(element);
  }

  public clear(): void {
    this.cancelAllAnimations();
    this.replaceChildren();
  }

  public replaceChildren(): void {
    this.canvas.replaceChildren();
  }

  public cancelAllAnimations(): void {
    this.canvas.getAnimations().forEach((animation) => animation.cancel());
  }

  public getElement(): HTMLElement {
    return this.canvas;
  }

  public getWidth(): number {
    return this.canvas.clientWidth;
  }

  public getHeight(): number {
    return this.canvas.clientHeight;
  }

  public measureItemHeight(): number {
    const div = document.createElement("div");
    div.textContent = "DanmakuSystem";
    div.className = "DanmakuSystem__check";
    this.canvas.append(div);
    const result = div.clientHeight;
    div.remove();
    return result;
  }

  public measureItemWidth(element: HTMLElement): number {
    const clone = element.cloneNode(true) as HTMLElement;
    clone.className = "DanmakuSystem__check";
    this.canvas.append(clone);
    const result = clone.clientWidth;
    clone.remove();
    return result;
  }

  public getItemPositionX(element: HTMLElement): number {
    const canvasRect = this.canvas.getBoundingClientRect();
    const itemRect = element.getBoundingClientRect();
    return itemRect.left - canvasRect.left;
  }
}
