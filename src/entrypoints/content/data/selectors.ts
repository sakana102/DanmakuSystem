import { Selectors } from "@/entrypoints/content/types/selectors";

export const SELECTORS: Selectors = {
  video: {
    canvas: {
      youtube: `#movie_player`,
      twitch: `[data-a-target="video-player"] > .video-player__container`,
      kick: `#injected-embedded-channel-player-video > div`,
      openrec: `.video-player-wrapper`,
      twicas: `.tw-player`,
    },
  },

  chat: {
    cell: {
      youtube: `yt-live-chat-text-message-renderer, yt-live-chat-paid-message-renderer`,
      twitch: `[data-a-target="chat-line-message"], .video-chat__message-list-wrapper li`,
      kick: `#chatroom-messages > div.no-scrollbar > div[data-index]`,
      openrec: `.sc-69ljpb-1`,
      twicas: `.tw-comment-item`,
    },

    contents: {
      youtube: `#message`,
      twitch: `[data-a-target="chat-line-message-body"], .video-chat__message > span[class=""]`,
      kick: `.font-normal`,
      openrec: `.sc-bmdkpm-0`,
      twicas: `.tw-comment-item-comment`,
    },

    messages: {
      youtube: `#message`,
      twitch: `.text-fragment`,
      kick: `.font-normal`,
      openrec: `.chat-content`,
      twicas: `.tw-comment-item-comment > span`,
    },

    emotes: {
      youtube: `.emoji`,
      twitch: `img[class*="chat-line__message--emote"]`,
      kick: `[data-emote-id][data-emote-name] img`,
      openrec: `.sc-1ey02g1-7`,
      twicas: `___null___`,
    },
  },
};
