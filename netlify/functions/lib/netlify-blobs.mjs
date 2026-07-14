import { connectLambda, getStore } from "@netlify/blobs";

export function isNetlifyRuntime() {
  return Boolean(process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME);
}

/** Wire up Blobs from the Lambda event when running in Netlify Functions. */
export function bindBlobs(event) {
  if (event?.blobs) {
    connectLambda(event);
  }
}

export function blobStore(name) {
  // Avoid `consistency: "strong"` — it requires uncachedEdgeURL and breaks hold reads.
  return getStore({ name });
}

export async function persistJson(store, key, value, options) {
  await store.setJSON(key, value, options);
  if (isNetlifyRuntime()) {
    const saved = await store.get(key, { type: "json" });
    if (!saved) {
      throw new Error("Checkout session could not be saved. Please try again.");
    }
  }
}
