import { SETTINGS } from "@/utils/data/settings";

export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(function (details) {
    switch (details.reason) {
      case "install": {
        onInstall();
        break;
      }

      case "update": {
        break;
      }
    }
  });
});

function onInstall() {
  storage.setItem("local:Settings", SETTINGS);
}
