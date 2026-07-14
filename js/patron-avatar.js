/**
 * Client helpers for patron profile photos (resize + API).
 */

const MAX_DIMENSION = 512;
const JPEG_QUALITY = 0.82;
const MAX_OUTPUT_BYTES = 320_000;

async function patronFetch(url, options = {}) {
  return fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      Accept: options.headers?.Accept || "application/json",
      ...(options.headers || {}),
    },
  });
}

export async function compressPatronAvatar(file) {
  if (!file || !file.type?.startsWith("image/")) {
    throw new Error("Choose a photo file (JPEG, PNG, or WebP).");
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not process that image.");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close?.();

  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (next) => (next ? resolve(next) : reject(new Error("Could not compress that image."))),
      "image/jpeg",
      JPEG_QUALITY,
    );
  });

  if (blob.size > MAX_OUTPUT_BYTES) {
    throw new Error("That photo is still too large. Try a smaller or simpler image.");
  }

  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Could not read that image."));
    reader.readAsDataURL(blob);
  });

  return { dataUrl, contentType: "image/jpeg", size: blob.size };
}

export async function uploadPatronAvatar(file) {
  const compressed = await compressPatronAvatar(file);
  const res = await patronFetch("/api/patron/avatar", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      dataUrl: compressed.dataUrl,
      contentType: compressed.contentType,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Could not upload your photo");
  return data.profile ?? null;
}

export async function deletePatronAvatar() {
  const res = await patronFetch("/api/patron/avatar", { method: "DELETE" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Could not remove your photo");
  return data.profile ?? null;
}

export async function fetchPatronAvatarObjectUrl() {
  const res = await patronFetch("/api/patron/avatar", {
    headers: { Accept: "*/*" },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Could not load your photo");
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}
