import type { TestDefinition } from "@/lib/types";
import { success, theme } from "./shared";

export const themeTests: TestDefinition[] = [
  {
    id: "theme-subscribe",
    name: "Subscribe Theme",
    description: "Subscribes to host theme changes (light/dark)",
    api: "themeProvider.subscribeTheme(callback)",
    category: "theme",
    async run() {
      const themeProvider = await theme();

      return new Promise((resolve) => {
        const variants: string[] = [];
        const sub = themeProvider.subscribeTheme((update) => {
          variants.push(update.variant);
        });

        setTimeout(() => {
          sub.unsubscribe();
          resolve(
            success(`Received ${variants.length} theme updates`, variants),
          );
        }, 3000);
      });
    },
  },
];
