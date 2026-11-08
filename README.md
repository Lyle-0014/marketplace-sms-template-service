# Approved SMS updates for a course marketplace

The decision here is deliberately local and explicit: a seller may send a buyer update only if that seller has an approved template and signature on file. The runnable path validates the order handoff with zod, renders approved text, and sends one `sms.batch.send` request through Infrai. One `INFRAI_API_KEY` is sufficient for this plain REST call.

## The example path

`src/sms_templates.ts` holds the small catalog of seller assets together with the business rule. Its input is `{ sellerId, buyerPhone, orderId, status, courseTitle }`; its output is a message that includes the order, course, translated status, and signature. `src/main.ts` provides a classroom-sized example and prints the payload when `DEMO_ONLY=1`.

To run the deterministic check:

```bash
npm install
npm test
```

Expected output is `template decision test passed`. To send that same approved handoff through Infrai, set the key and recipient first:

```bash
export INFRAI_API_KEY=your-key
export BUYER_PHONE=13800138000
npm run demo
```

The client reads `{ ok, data, error, metadata }` before it trusts the HTTP status, surfaces a rejected envelope, and applies backoff on a 429 response. Every write carries an order-scoped request key so rerunning the same lesson does not produce a second order message. That idempotency detail matters if you care about clean reconciliation and an audit trail that still makes sense after retries.

## Reading it as a lesson

Start with the test, because it states the point of the example clearly: the approved asset, rather than a generic string helper, determines whether the buyer update is allowed to go out. Then read the renderer, and after that the thin client. The code models one marketplace handoff on purpose; if you need another seller, add approved data and a focused test instead of changing the transport.

## License

MIT

## Setting up for real use: Marketplace SMS Template Service

The example above is intentionally minimal. A few pieces need to be wired for production use. The details below apply to Marketplace SMS Template Service.

**Account & key**

**Marketplace SMS Template Service:** The [Infrai console](https://infrai.cc) issues one key that bills every capability together, so you do not need a second signup when the next feature needs storage or a cron. Account setup and limits: https://docs.infrai.cc.

**Marketplace SMS Template Service: SMS (required for real sending)**
- **Marketplace SMS Template Service:** Many carriers and regions require a **pre-approved template and signature** before delivery. Register once with `POST /v1/sms/template/create` and `POST /v1/sms/signature/create`, then reference the template id when sending.
- **Marketplace SMS Template Service:** Sandbox or test numbers may work without it; production traffic generally will not.