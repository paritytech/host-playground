import { getChatManager } from "@parity/product-sdk/host";

console.log("[echo-bot worker] starting");

const ROOM_ID = "host-playground-room";
const ROOM_NAME = "Host Playground";
const BOT_ID = "demo-echo-bot";
const BOT_NAME = "Echo Bot";
const TRIGGER = "!echo";

const chatManager = await getChatManager();
if (!chatManager) {
  console.warn("[echo-bot worker] chat manager unavailable — host not paired?");
} else {
  chatManager
    .registerBot({ botId: BOT_ID, name: BOT_NAME, icon: "" })
    .then(() => console.log("[echo-bot worker] bot registered"))
    .catch((e) => console.error("[echo-bot worker] registerBot failed", e));

  chatManager
    .registerRoom({ roomId: ROOM_ID, name: ROOM_NAME, icon: "" })
    .then((status) => {
      console.log("[echo-bot worker] registerRoom status:", status);
      if (status === "New") {
        return chatManager.sendMessage(ROOM_ID, {
          tag: "Text",
          value: `Echo bot is online! Send "${TRIGGER} <message>" to get a reply.`,
        });
      }
    })
    .catch((e) => console.error("[echo-bot worker] registerRoom failed", e));

  chatManager.subscribeAction(async (action) => {
    console.log("[echo-bot worker] action received:", action.payload.tag, action.roomId);
    if (action.payload.tag !== "MessagePosted") return;
    if (action.roomId !== ROOM_ID) return;
    if (action.payload.value.tag !== "Text") return;
    const text = action.payload.value.value;
    if (!text.startsWith(TRIGGER)) return;
    const body = text.slice(TRIGGER.length).trim();
    console.log("[echo-bot worker] echoing:", body);
    await chatManager.sendMessage(ROOM_ID, {
      tag: "Text",
      value: body.length > 0 ? `Echo: ${body}` : "Usage: !echo <message>",
    });
  });
}
