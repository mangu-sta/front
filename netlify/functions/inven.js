import fetch from "node-fetch";
import * as cheerio from "cheerio";

export async function handler(event) {
  const { q } = event.queryStringParameters || {};
  if (!q) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "검색어가 필요합니다." }),
    };
  }

  try {
    const encoded = encodeURIComponent(q);
    const url = `https://www.inven.co.kr/board/lostark/5355?query=list&p=1&sterm=&name=subjectcontent&keyword=${encoded}`;

    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122 Safari/537.36",
      },
    });

    const html = await res.text();
    const $ = cheerio.load(html);
    const results = [];

    $("div.board-list table tbody tr").each((_, el) => {
      const titleEl = $(el).find("td.tit a");
      const title = titleEl.text().trim();
      const link = titleEl.attr("href")
        ? new URL(titleEl.attr("href"), "https://www.inven.co.kr").toString()
        : "#";

      const writer = $(el).find("td.user").text().trim() || "-";
      const date = $(el).find("td.date").text().trim() || "-";

      if (title) results.push({ title, link, writer, date });
    });

    return {
      statusCode: 200,
      body: JSON.stringify(results),
    };
  } catch (err) {
    console.error("❌ Inven 크롤링 실패:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "크롤링 실패: " + err.message }),
    };
  }
}
