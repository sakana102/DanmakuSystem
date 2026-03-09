type MutationType = "added" | "removed" | "attributes";

type Handler = (element: HTMLElement) => void;

type Config = {
  type: MutationType;
  selector: string;
  handler: Handler;
};

export class DOMObserver {
  private observer: MutationObserver;
  private configs = new Set<Config>();

  constructor(target: HTMLElement = document.documentElement) {
    this.observer = new MutationObserver((records) => {
      this.process(records);
    });

    this.observer.observe(target, {
      childList: true,
      subtree: true,
      attributes: true,
    });
  }

  public on(type: MutationType, selector: string, handler: Handler): () => void {
    const config: Config = { type, selector, handler };
    this.configs.add(config);
    return () => this.configs.delete(config);
  }

  public off() {
    this.configs.clear();
    this.observer.disconnect();
  }

  private process(records: MutationRecord[]) {
    for (const record of records) {
      if (record.type === "childList") {
        this.handleNodeList("added", record.addedNodes);
        this.handleNodeList("removed", record.removedNodes);
      }

      if (record.type === "attributes") {
        this.handleNode("attributes", record.target);
      }
    }
  }

  private handleNodeList(type: MutationType, nodeList: NodeList) {
    nodeList.forEach((node) => {
      if (!(node instanceof HTMLElement)) return;

      this.handleNode(type, node);
      this.configs.forEach((config) => {
        if (config.type !== type) return;
        node.querySelectorAll<HTMLElement>(config.selector).forEach((e) => {
          config.handler(e);
        });
      });
    });
  }

  private handleNode(type: MutationType, node: Node) {
    if (!(node instanceof HTMLElement)) return;

    this.configs.forEach((config) => {
      if (config.type === type && node.matches(config.selector)) {
        config.handler(node);
      }
    });
  }
}
