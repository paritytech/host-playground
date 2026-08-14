import { getPaymentManager } from "@parity/product-sdk/host";
import type { TestDefinition } from "@/lib/types";
import { error, success } from "./shared";

export const paymentTests: TestDefinition[] = [
  {
    id: "payment-balance-subscribe",
    name: "Subscribe Balance",
    description: "Subscribes to payment balance updates",
    api: "paymentManager.subscribeBalance(callback)",
    category: "payments",
    async run() {
      const paymentManager = await getPaymentManager();
      if (!paymentManager)
        return error(
          "getPaymentManager returned null - not inside a host container",
        );

      return new Promise((resolve) => {
        const balances: unknown[] = [];
        const sub = paymentManager.subscribeBalance((balance) => {
          balances.push(balance);
        });

        setTimeout(() => {
          sub.unsubscribe();
          resolve(
            success(`Received ${balances.length} balance updates`, balances),
          );
        }, 3000);
      });
    },
  },
];
