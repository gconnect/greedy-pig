const viem = require('viem')

const rollupServer = process.env.ROLLUP_HTTP_SERVER_URL

export const noticeHandler = async (data) => {
  const result = JSON.stringify(data)
  const hexresult = viem.stringToHex(result)

  return await fetch(rollupServer + '/notice', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ payload: hexresult })
  });
}

export const reportHandler = async (message) => {

  const result = JSON.stringify({
        error: String(message),
      });

      const hexresult = viem.stringToHex(result);

      await fetch(rollupServer + '/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          payload: hexresult,
        }),
      });
}