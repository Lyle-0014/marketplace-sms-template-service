import assert from "node:assert/strict";
import { createBatchRequest, validateUpdate } from "./sms_templates.js";

const update = validateUpdate({ sellerId: "seller-101", buyerPhone: "13800138000", orderId: "O-7", status: "handed-off", courseTitle: "函数式编程" });
const request = createBatchRequest(update);
assert.deepEqual(request, { messages: [{ to: "13800138000", content: "订单 O-7 的课程《函数式编程》已交接。【课程集市】" }] });
assert.throws(() => validateUpdate({ sellerId: "seller-101", buyerPhone: "", orderId: "O-7", status: "handed-off", courseTitle: "x" }));
console.log("template decision test passed");
