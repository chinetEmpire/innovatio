import crypto from "crypto";

const PAYSTACK_BASE = "https://api.paystack.co";

export type PaystackTransactionStatus =
  | "abandoned"
  | "failed"
  | "pending"
  | "processing"
  | "success";

type InitializeResponse = {
  status: boolean;
  message: string;
  data: { authorization_url: string; access_code: string; reference: string };
};

type VerifyResponse = {
  status: boolean;
  message: string;
  data: {
    status: PaystackTransactionStatus;
    reference: string;
    amount: number;
    currency: string;
    paid_at: string | null;
    channel?: string;
  };
};

function secretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("Missing PAYSTACK_SECRET_KEY env var");
  return key;
}

async function paystackFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${PAYSTACK_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${secretKey()}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
}

export async function initializeTransaction(params: {
  email: string;
  amountKobo: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
}): Promise<InitializeResponse["data"]> {
  const res = await paystackFetch("/transaction/initialize", {
    method: "POST",
    body: JSON.stringify({
      email: params.email,
      amount: params.amountKobo,
      reference: params.reference,
      currency: "NGN",
      callback_url: params.callbackUrl,
      metadata: params.metadata,
    }),
  });

  const body: InitializeResponse = await res.json();
  if (!res.ok || !body.status || !body.data?.authorization_url) {
    throw new Error(body.message || "Could not initialize payment with Paystack.");
  }
  return body.data;
}

export async function verifyTransaction(reference: string): Promise<VerifyResponse["data"]> {
  const res = await paystackFetch(`/transaction/verify/${encodeURIComponent(reference)}`);
  const body: VerifyResponse = await res.json();
  if (!res.ok || !body.status || !body.data) {
    throw new Error(body.message || "Could not verify payment with Paystack.");
  }
  return body.data;
}

export function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  if (!signature) return false;
  const expected = crypto.createHmac("sha512", secretKey()).update(rawBody).digest("hex");
  return expected === signature;
}
