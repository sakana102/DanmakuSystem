import { Platform } from "@/utils/types/platform";
import { SELECTORS } from "@/entrypoints/content/data/selectors";
import { DOMObserver } from "@/entrypoints/content/utils/dom-observer";
import { getPlatform } from "@/entrypoints/content/utils/get-platform";
import { StorageManager } from "@/entrypoints/content/utils/storage-manager";
import { DanmakuSystem } from "@/entrypoints/content/app/danmaku-system";

const CANVAS_ID = "DanmakuSystem__canvas";
const CSS_ID = "DanmakuSystem__css";

export default defineContentScript({
  matches: [
    "*://*.youtube.com/*",
    "*://*.twitch.tv/*",
    "*://*.openrec.tv/*",
    "*://*.kick.com/*",
    "*://*.twitcasting.tv/*",
  ],
  allFrames: true,
  runAt: "document_idle",

  main(ctx) {
    const platform = getPlatform();
    if (!platform) return;

    const root = getRoot(platform);
    const player = root.querySelector<HTMLElement>(SELECTORS.video.player[platform]);

    if (player) {
      boot(platform, player);
    } else {
      const observer = new DOMObserver();
      const dispose = observer.on("added", SELECTORS.video.player[platform], (player) => {
        boot(platform, player);
        dispose();
      });
    }

    ctx.addEventListener(window, "wxt:locationchange", () => {
      clearCanvas(root);
    });
  },
});

function getRoot(platform: Platform) {
  switch (platform) {
    case "youtube":
      return window.parent.document.documentElement;

    default:
      return document.documentElement;
  }
}

function mountCanvas(player: HTMLElement) {
  const canvas = document.createElement("div");
  canvas.id = CANVAS_ID;
  player.append(canvas);
  return canvas;
}

function clearCanvas(root: HTMLElement) {
  const canvas = root.querySelector<HTMLElement>(`#${CANVAS_ID}`);
  while (canvas?.firstChild) {
    canvas.firstChild.remove();
  }
}

async function setupCSS() {
  const inline = await import("./css/index.css?inline");
  const style = document.createElement("style");
  style.id = CSS_ID;
  style.textContent = inline.default;
  window.parent.document.head.append(style);
}

async function boot(platform: Platform, player: HTMLElement) {
  const canvas = mountCanvas(player);
  const storage = new StorageManager("Settings");
  const settings = await storage.get();
  const system = new DanmakuSystem(platform, canvas, storage, settings);

  setupCSS();
  system.start();

  const chatObserver = new DOMObserver();
  chatObserver.on("added", SELECTORS.chat.cell[platform], (cell) => {
    system.add(cell);
  });

  const playerObserver = new DOMObserver();
  playerObserver.on("added", SELECTORS.video.player[platform], (player) => {
    system.update(mountCanvas(player));
  });

  return () => {
    system.stop();
    chatObserver.off();
    playerObserver.off();
  };
}
