import fs from "fs";
import path from "path";

const CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;
const LIFF_APP_ID = process.env.VITE_LINE_LIFF_ID || "2010068530-ddmtwm5t";
const LIFF_ENTRY_URL = process.env.LINE_LIFF_ENTRY_URL || `https://liff.line.me/${LIFF_APP_ID}`;
const SITE_URL = "https://www.phytologic.tw";
const RICH_MENU_IMAGE_PATH = path.join(process.cwd(), "public", "phytologic_richmenu_v4.png");

export const richMenuConfig = {
  size: {
    width: 2500,
    height: 1686,
  },
  selected: true,
  name: "PHYTOLOGIC Member Menu",
  chatBarText: "植本邏輯選單",
  areas: [
    {
      bounds: { x: 0, y: 0, width: 833, height: 843 },
      action: { type: "uri", label: "健康快篩", uri: `${SITE_URL}/assessment` },
    },
    {
      bounds: { x: 833, y: 0, width: 834, height: 843 },
      action: { type: "uri", label: "我的會員", uri: LIFF_ENTRY_URL },
    },
    {
      bounds: { x: 1667, y: 0, width: 833, height: 843 },
      action: { type: "postback", label: "我的報告", data: "action=my_report" },
    },
    {
      bounds: { x: 0, y: 843, width: 833, height: 843 },
      action: { type: "uri", label: "今日打卡", uri: `${LIFF_ENTRY_URL}?liff.state=/line/checkin` },
    },
    {
      bounds: { x: 833, y: 843, width: 834, height: 843 },
      action: { type: "uri", label: "訂購植萃", uri: SITE_URL },
    },
    {
      bounds: { x: 1667, y: 843, width: 833, height: 843 },
      action: { type: "uri", label: "聯絡我們", uri: SITE_URL },
    },
  ],
};

async function lineApi(path, options = {}) {
  if (!CHANNEL_ACCESS_TOKEN) throw new Error("Missing LINE_CHANNEL_ACCESS_TOKEN.");

  const response = await fetch(`https://api.line.me/v2/bot${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  const body = text ? JSON.parse(text) : {};
  if (!response.ok) throw new Error(`LINE API failed: ${response.status} ${text}`);
  return body;
}

async function lineDataApi(path, options = {}) {
  if (!CHANNEL_ACCESS_TOKEN) throw new Error("Missing LINE_CHANNEL_ACCESS_TOKEN.");

  const response = await fetch(`https://api-data.line.me/v2/bot${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  if (!response.ok) throw new Error(`LINE Data API failed: ${response.status} ${text}`);
  return text ? JSON.parse(text) : {};
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({
      richMenu: richMenuConfig,
      imagePath: "public/phytologic_richmenu_v4.png",
      trigger: {
        method: "POST",
        path: "/api/line-setup",
        note: "Creates the Rich Menu, uploads public/phytologic_richmenu_v4.png, then sets it as default.",
      },
    });
  }

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    if (!fs.existsSync(RICH_MENU_IMAGE_PATH)) {
      return res.status(400).json({
        success: false,
        error: "Missing public/phytologic_richmenu_v4.png",
        richMenu: richMenuConfig,
      });
    }

    const created = await lineApi("/richmenu", {
      method: "POST",
      body: JSON.stringify(richMenuConfig),
    });

    const image = fs.readFileSync(RICH_MENU_IMAGE_PATH);
    await lineDataApi(`/richmenu/${created.richMenuId}/content`, {
      method: "POST",
      headers: { "Content-Type": "image/png" },
      body: image,
    });

    await lineApi(`/user/all/richmenu/${created.richMenuId}`, {
      method: "POST",
    });

    return res.status(200).json({
      success: true,
      richMenuId: created.richMenuId,
      message: "Rich Menu 已上線",
    });
  } catch (error) {
    console.error("[line-setup] rich menu setup failed:", error);
    return res.status(500).json({ error: error.message, richMenu: richMenuConfig });
  }
}
