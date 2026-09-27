import { z } from "zod";

const requestSchema = z.object({
  sellerId: z.string().min(1),
  buyerPhone: z.string().min(7),
  orderId: z.string().min(1),
  status: z.enum(["paid", "packed", "handed-off"]),
  courseTitle: z.string().min(1)
});

export type MarketplaceUpdate = z.infer<typeof requestSchema>;

const signatures = new Map([["seller-101", "课程集市"]]);
const templates = new Map([
  ["seller-101", "订单 {orderId} 的课程《{courseTitle}》已{status}。"]
]);

export function validateUpdate(input: unknown): MarketplaceUpdate {
  return requestSchema.parse(input);
}

export function renderApprovedSms(input: MarketplaceUpdate): { to: string; content: string } {
  const body = templates.get(input.sellerId);
  const signature = signatures.get(input.sellerId);
  if (!body || !signature) throw new Error("No approved seller SMS assets");
  const statusText = { paid: "付款", packed: "打包", "handed-off": "交接" }[input.status];
  return {
    to: input.buyerPhone,
    content: `${body.replace("{orderId}", input.orderId).replace("{courseTitle}", input.courseTitle).replace("{status}", statusText)}【${signature}】`
  };
}

export function createBatchRequest(input: MarketplaceUpdate) {
  const sms = renderApprovedSms(input);
  return { messages: [sms] };
}
