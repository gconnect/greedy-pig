
const viem = require('viem')
const { 
  games, 
  addParticipant, 
  addGame 
} = require('./games')

const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL
console.log('HTTP rollup_server url is ' + rollup_server)

const noticeHandler = async (data) => {
  const result = JSON.stringify(data)
  const hexresult = viem.stringToHex(result)

  return await fetch(rollup_server + '/notice', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ payload: hexresult })
  });
}

async function handle_advance(data) {
  console.log('Received advance request data ' + JSON.stringify(data));


  const payload = data.payload;
  let JSONpayload = {};


  const payloadStr = viem.hexToString(payload);
  JSONpayload = JSON.parse(JSON.parse(payloadStr));
  console.log(`received request ${JSON.stringify(JSONpayload)}`);
 

  let advance_req;

  if (JSONpayload.method === 'createGame') {
    if (JSONpayload.data == '' || null) {
      console.log('Result cannot be empty');
      const result = JSON.stringify({
        error: String('Message:' + JSONpayload.data),
      });

      const hexresult = viem.stringToHex(result);

      await fetch(rollup_server + '/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          payload: hexresult,
        }),
      });
    }

    console.log('creating game...');
    addGame(JSONpayload.data);
    advance_req = await noticeHandler(games);


  } else if (JSONpayload.method === 'addParticipant') {
    console.log('adding participant ...', JSONpayload.data);
    addParticipant(JSONpayload.data)
    advance_req = await noticeHandler(games)
  }

  const json = await advance_req?.json();
  
  console.log(`Received status ${advance_req?.status} with body ${JSON.stringify(json)}`)


  return 'accept';
}

async function handle_inspect(data) {
  console.log('Received inspect request data ' + JSON.stringify(data));
  return 'accept';
}

var handlers = {
  advance_state: handle_advance,
  inspect_state: handle_inspect,
};

var finish = { status: 'accept' };

(async () => {
  while (true) {
    const finish_req = await fetch(rollup_server + '/finish', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'accept' }),
    });

    console.log('Received finish status ' + finish_req.status);

    if (finish_req.status == 202) {
      console.log('No pending rollup request, trying again');
    } else {
      const rollup_req = await finish_req.json();
      var handler = handlers[rollup_req['request_type']];
      finish['status'] = await handler(rollup_req['data']);
    }
  }
})();
