/* eslint-disable no-undef */

export async function handler(event) {
  const { name } = event.queryStringParameters;

  const res = await fetch(
    `https://developer-lostark.game.onstove.com/armories/characters/${name}/profiles`,
    {
      headers: {
        Authorization: `Bearer ${process.env.LOSTARK_KEY}`,
        accept: "application/json",
      },
    }
  );

  const data = await res.json();

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
}
