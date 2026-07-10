import { jsonResponse } from "./lib/cors.mjs";

const ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:";

function encodeQrData(data) {
  const bytes = new TextEncoder().encode(data);
  const bits = [];
  for (const byte of bytes) {
    for (let i = 7; i >= 0; i -= 1) bits.push((byte >> i) & 1);
  }
  return bits;
}

function renderQrMatrix(data) {
  const size = 21;
  const matrix = Array.from({ length: size }, () => Array(size).fill(false));

  const setFinder = (row, col) => {
    for (let r = 0; r < 7; r += 1) {
      for (let c = 0; c < 7; c += 1) {
        const edge = r === 0 || r === 6 || c === 0 || c === 6;
        const center = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        matrix[row + r][col + c] = edge || center;
      }
    }
  };

  setFinder(0, 0);
  setFinder(0, size - 7);
  setFinder(size - 7, 0);

  for (let i = 8; i < size - 8; i += 1) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  const bits = encodeQrData(data);
  let bitIndex = 0;
  let upward = true;
  for (let col = size - 1; col > 0; col -= 2) {
    if (col === 6) col -= 1;
    const cols = [col, col - 1];
    const rows = upward ? [...Array(size).keys()].reverse() : [...Array(size).keys()];
    for (const row of rows) {
      for (const c of cols) {
        if (matrix[row][c] !== false && matrix[row][c] !== true) {
          matrix[row][c] = Boolean(bits[bitIndex % bits.length]);
          bitIndex += 1;
        }
      }
    }
    upward = !upward;
  }

  return matrix;
}

function matrixToSvg(matrix, moduleSize = 4) {
  const size = matrix.length;
  const dim = size * moduleSize;
  let rects = "";
  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      if (matrix[row][col]) {
        rects += `<rect x="${col * moduleSize}" y="${row * moduleSize}" width="${moduleSize}" height="${moduleSize}" />`;
      }
    }
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${dim} ${dim}" width="${dim}" height="${dim}" role="img" aria-label="Ticket QR code">
  <rect width="100%" height="100%" fill="#ffffff"/>
  <g fill="#0f2d4d">${rects}</g>
</svg>`;
}

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return jsonResponse(204, {}, event, { methods: "GET, OPTIONS" });
  }
  if (event.httpMethod !== "GET") {
    return jsonResponse(405, { error: "Method not allowed" }, event, { methods: "GET, OPTIONS" });
  }

  const data = String(event.queryStringParameters?.data ?? "").trim().slice(0, 120);
  if (!data) {
    return jsonResponse(400, { error: "Missing data parameter" }, event, { methods: "GET, OPTIONS" });
  }

  const matrix = renderQrMatrix(data);
  const svg = matrixToSvg(matrix);
  const { headers, allowed, origin } = (await import("./lib/cors.mjs")).corsHeaders(event, {
    methods: "GET, OPTIONS",
  });
  if (!allowed && origin) {
    return { statusCode: 403, headers, body: JSON.stringify({ error: "Origin not allowed" }) };
  }

  return {
    statusCode: 200,
    headers: {
      ...headers,
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
    body: svg,
  };
}
