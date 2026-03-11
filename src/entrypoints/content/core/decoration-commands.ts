import { Item } from "@/entrypoints/content/types/item";

enum DecorationCommands {
  up = "up", // 上中央表示
  down = "down", // 下中央表示
  white = "white", // ホワイト
  red = "red", // レッド
  pink = "pink", // ピンク
  orange = "orange", //　オレンジ
  yellow = "yellow", //　イエロー
  green = "green", //　グリーン
  cyan = "cyan", //　シアン
  blue = "blue", //　ブルー
  purple = "purple", //　パープル
  black = "black", //　ブラック
}

const commandHandlers: Record<DecorationCommands, (item: Item) => void> = {
  [DecorationCommands.up]: (item) => (item.type = "up"),
  [DecorationCommands.down]: (item) => (item.type = "down"),
  [DecorationCommands.white]: (item) => (item.element.style.color = "white"),
  [DecorationCommands.red]: (item) => (item.element.style.color = "red"),
  [DecorationCommands.pink]: (item) => (item.element.style.color = "pink"),
  [DecorationCommands.orange]: (item) => (item.element.style.color = "orange"),
  [DecorationCommands.yellow]: (item) => (item.element.style.color = "yellow"),
  [DecorationCommands.green]: (item) => (item.element.style.color = "green"),
  [DecorationCommands.cyan]: (item) => (item.element.style.color = "cyan"),
  [DecorationCommands.blue]: (item) => (item.element.style.color = "blue"),
  [DecorationCommands.purple]: (item) => (item.element.style.color = "purple"),
  [DecorationCommands.black]: (item) => (item.element.style.color = "black"),
};

export function applyDecorationCommands(item: Item) {
  const firstChild = item.element.firstChild;
  if (!firstChild || !firstChild.textContent || firstChild.nodeName != "SPAN") return;

  const CommandRegex = /^\[(.*?)\]/;
  const match = firstChild.textContent.match(CommandRegex);
  if (!match) return;

  const commands = parseDecorationCommands(match[1]);
  commands.forEach((command) => {
    if (commandHandlers[command]) {
      commandHandlers[command](item);
    }
  });
  firstChild.textContent = firstChild.textContent.replace(CommandRegex, "");
}

function parseDecorationCommands(commandText: string) {
  const parsed: DecorationCommands[] = [];
  const loweredCommands = commandText.toLowerCase();

  Object.values(DecorationCommands).forEach((cmd) => {
    if (loweredCommands.includes(cmd)) {
      parsed.push(cmd);
    }
  });

  return parsed;
}
