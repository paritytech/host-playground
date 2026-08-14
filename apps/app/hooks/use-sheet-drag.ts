"use client";

import { useRef, useState, type PointerEvent, type RefObject } from "react";

/** Past this fraction of its own height, releasing the sheet dismisses it. */
const DISMISS_RATIO = 0.3;

interface SheetDrag {
  /** Current finger offset in px, 0 when idle. */
  offset: number;
  /** True while a drag is in flight, so transitions can be suspended. */
  dragging: boolean;
  /** Sheet height captured at drag start, for the scrim's fade. */
  height: number;
  handlers: {
    onPointerDown: (e: PointerEvent<HTMLDivElement>) => void;
    onPointerMove: (e: PointerEvent<HTMLDivElement>) => void;
    onPointerUp: () => void;
    onPointerCancel: () => void;
  };
}

/**
 * Drag-to-dismiss for a bottom sheet: the top follows the finger and the sheet
 * closes once pulled past a third of its height, else springs back.
 */
export function useSheetDrag(
  sheetRef: RefObject<HTMLDivElement | null>,
  onDismiss: () => void,
): SheetDrag {
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const drag = useRef({ startY: 0, height: 0, offset: 0, active: false });

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    drag.current = {
      startY: e.clientY,
      height: sheetRef.current?.offsetHeight ?? window.innerHeight,
      offset: 0,
      active: true,
    };
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    const next = Math.max(0, e.clientY - drag.current.startY);
    drag.current.offset = next;
    setOffset(next);
  };

  const onPointerUp = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    setDragging(false);
    const shouldDismiss =
      drag.current.offset > drag.current.height * DISMISS_RATIO;
    setOffset(0);
    if (shouldDismiss) onDismiss();
  };

  return {
    offset,
    dragging,
    height: drag.current.height,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
    },
  };
}
