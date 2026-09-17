import type { TestDefinition } from "@/lib/types";
import { success, locale } from "./shared";

export const localeTests: TestDefinition[] = [
  {
    id: "locale-subscribe",
    name: "Subscribe Locale",
    description: "Subscribes to host locale changes (BCP 47 language tag)",
    api: "localeProvider.subscribeLocale(callback)",
    category: "locale",
    async run() {
      const localeProvider = await locale();

      return new Promise((resolve) => {
        const tags: string[] = [];
        const sub = localeProvider.subscribeLocale((update) => {
          tags.push(update.languageTag);
        });

        setTimeout(() => {
          sub.unsubscribe();
          resolve(success(`Received ${tags.length} locale updates`, tags));
        }, 3000);
      });
    },
  },
];
