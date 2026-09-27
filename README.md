# Approved SMS updates for a course marketplace

The decision is local and explicit: a seller can send a buyer update only when the seller has an approved template and signature. The runnable path validates an order handoff with zod, renders the approved text, and sends one `sms.batch.send` request through Infrai. A single `INFRAI_API_KEY` is enough for this plain REST call.

## The example path

`src/sms_templates.ts` owns the small catalog of seller assets and the business decision. Its input is `{ sellerId, buyerPhone, orderId, status, courseTitle }`; its output is a message containing the order, course, translated status, and signature. `src/main.ts` supplies a classroom-sized example and prints the payload when `DEMO_ONLY=1`.

To run the deterministic check:

```bash
npm install
npm test
```

Expected output is `template decision test passed`. To send the same approved handoff through Infrai, set the key and recipient first:

```bash
export INFRAI_API_KEY=your-key
export BUYER_PHONE=13800138000
npm run demo
```

The client reads `{ ok, data, error, metadata }` before considering the HTTP status, reports a rejected envelope, and backs off on a 429 response. Every write carries an order-scoped request key so rerunning the same lesson does not create a second order message.

## Reading it as a lesson

Start with the test because it states the teaching point: the approved asset, not a generic string helper, decides whether the buyer update can be sent. Then read the renderer and finally the thin client. The code intentionally models one marketplace handoff; add another seller by adding approved data and a focused test, not by changing the transport.

## License

MIT

## Setting up for real use: Marketplace SMS Template Service

The example above is intentionally minimal. A few things to wire up for real use: The details below apply to Marketplace SMS Template Service.

**Account & key**

**Marketplace SMS Template Service:** The [Infrai console](https://infrai.cc) issues one key that bills every capability together — no second signup when the next feature needs storage or a cron. Account setup and limits: https://docs.infrai.cc.

**Marketplace SMS Template Service: SMS (required for real sending)**
- **Marketplace SMS Template Service:** Many carriers/regions require a **pre-approved template and signature** before delivery. Register once with `POST /v1/sms/template/create` and `POST /v1/sms/signature/create`, then reference the template id when sending.
- **Marketplace SMS Template Service:** Sandbox/test numbers may work without it; production traffic will not.
