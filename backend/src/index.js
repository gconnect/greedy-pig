
const viem = require('viem')
const { 
  noticeHandler,
  reportHandler
 } = require('./utils/helpers')
const { 
  games, 
  addParticipant, 
  addGame, 
  updateParticipant,
  gamePlay
} = require('./games')

const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL
console.log('HTTP rollup_server url is ' + rollup_server)


async function handle_advance(data) {
  console.log('Received advance request data ' + JSON.stringify(data));


  const payload = data.payload;
  let JSONpayload = {};


  const payloadStr = viem.hexToString(payload);
  JSONpayload = JSON.parse(JSON.parse(payloadStr));
  console.log(`received request ${JSON.stringify(JSONpayload)}`);
 

  let advance_req;

  try {

    if (JSONpayload.method === 'createGame') {
      if (JSONpayload.data == '' || null) {
        console.log('Result cannot be empty');
        await reportHandler(message)
      }
  
      console.log('creating game...');
      addGame(JSONpayload.data);
      advance_req = await noticeHandler(games);
  
  
    } else if (JSONpayload.method === 'addParticipant') {

      console.log('adding participant ...', JSONpayload.data);
      addParticipant(JSONpayload.data)
      console.log('added participant ...', games);
      advance_req = await noticeHandler(games)

    } else if (JSONpayload.method === 'updateParticipant') {
      
      console.log('updating participant ...', JSONpayload.data)
      updateParticipant(JSONpayload.data)
      advance_req = await noticeHandler(games)
      console.log(games)

    } else if (JSONpayload.method === 'playGame') {
      
      console.log('game play ...', JSONpayload.data)
      gamePlay(JSONpayload.data)
      advance_req = await noticeHandler(games)
      console.log(games)
    
    } else {
      console.log('invalid request');
      const message = `method undefined: ${JSONpayload.method}`
      await reportHandler(message)
    }
  } catch (error) {
    await reportHandler(error)
    return 'reject'
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
