import {
  getChatManager,
  getHostLocalStorage,
  toHex,
} from "@parity/product-sdk/host";
import {
  Button,
  Column,
  Spacer,
  Text,
  matchChatCustomRenderers,
  registerChatMessageRenderer,
} from "@parity/product-sdk-react-renderer";
import { Status, Struct, u32 } from "@parity/truapi/scale";

console.log("[coin-flip worker] starting");

const ROOM_ID = "host-playground-room";
const ROOM_NAME = "Host Playground";
const MESSAGE_TYPE = "coin-flip-result";
const TRIGGER = "!flip";
const STORAGE_KEY = "host-playground.coin-flip-count";

const FlipPayload = Struct({
  result: Status("Heads", "Tails"),
  flipCount: u32,
});

const chatManager = await getChatManager().catch((error) => {
  console.error(
    "[coin-flip worker] chat initialization failed",
    error instanceof Error ? error.stack : String(error),
  );
  return null;
});

if (!chatManager) {
  console.warn("[coin-flip worker] chat manager unavailable — host not paired?");
} else {
  const storagePromise = getHostLocalStorage().catch((error) => {
    console.warn(
      "[coin-flip worker] local storage unavailable",
      error instanceof Error ? error.stack : String(error),
    );
    return null;
  });

  const postFlip = async () => {
    await chatManager.sendMessage(ROOM_ID, {
      tag: "Text",
      value: { text: "Flipping the coin!" },
    });

    await new Promise((resolve) => setTimeout(resolve, 400));

    const storage = await storagePromise;
    const storedCount = await storage
      ?.readJSON(STORAGE_KEY)
      .catch(() => undefined);
    const flipCount =
      typeof storedCount === "number" && Number.isSafeInteger(storedCount)
        ? storedCount + 1
        : 1;
    await storage?.writeJSON(STORAGE_KEY, flipCount).catch(() => undefined);

    const result = Math.random() < 0.5 ? "Heads" : "Tails";
    await chatManager.sendMessage(ROOM_ID, {
      tag: "Custom",
      value: {
        messageType: MESSAGE_TYPE,
        payload: toHex(FlipPayload.enc({ result, flipCount })),
      },
    });
  };

  chatManager.onCustomMessageRenderingRequest(
    matchChatCustomRenderers({
      [MESSAGE_TYPE]: registerChatMessageRenderer(
        FlipPayload.dec,
        ({ payload }) => (
          <Column
            padding={16}
            fillMaxWidth
            horizontalAlignment="Center"
            verticalArrangement="Center"
            background={{
              color: "BgSurfaceContainer",
              shape: { tag: "Rounded", value: { radius: 16 } },
            }}
          >
            <Text color="FgSecondary" style="BodySmallRegular">
              Flip #{payload.flipCount}
            </Text>
            <Spacer height={12} />
            <Text color="FgPrimary" style="HeadlineLarge">
              {payload.result === "Heads" ? "🪙 Heads" : "🪙 Tails"}
            </Text>
            <Spacer height={12} />
            <Button
              text="Flip again"
              variant="Secondary"
              onClick={() => void postFlip()}
            />
          </Column>
        ),
      ),
    }),
  );

  chatManager.subscribeAction((action) => {
    if (action.roomId !== ROOM_ID) return;
    if (action.payload.tag !== "MessagePosted") return;
    if (action.payload.value.tag !== "Text") return;
    if (action.payload.value.value.text.trim() !== TRIGGER) return;

    void postFlip().catch((error) => {
      console.error("[coin-flip worker] flip failed", error);
    });
  });

  const roomStatus = await chatManager.registerRoom({
    roomId: ROOM_ID,
    name: ROOM_NAME,
    icon: "",
  });

  if (roomStatus === "New") {
    await chatManager.sendMessage(ROOM_ID, {
      tag: "Text",
      value: {
        text: `Coin flip is online. Send "${TRIGGER}" to flip a coin.`,
      },
    });
  }

  console.log("[coin-flip worker] ready");
}
