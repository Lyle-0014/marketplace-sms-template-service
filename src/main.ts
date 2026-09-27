import { infrai } from "./infrai.js";
import { createBatchRequest, validateUpdate } from "./sms_templates.js";

const raw = {
  sellerId: process.env.SELLER_ID ?? "seller-101",
  buyerPhone: process.env.BUYER_PHONE ?? "13800138000",
  orderId: process.env.ORDER_ID ?? "ORDER-2048",
  status: "handed-off",
  courseTitle: process.env.COURSE_TITLE ?? "TypeScript 入门"
};

const update = validateUpdate(raw);
const payload = createBatchRequest(update);
if (process.env.DEMO_ONLY === "1") {
  console.log(JSON.stringify({ decision: "approved", payload }, null, 2));
} else {
  const result = await infrai.sms.batch.send(payload, `order-${update.orderId}`);
  console.log(JSON.stringify({ decision: "approved", result }, null, 2));
}
