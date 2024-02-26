import { FC, useEffect, useRef, useState } from 'react';
import Button from '@/components/shared/Button';
import toast from 'react-hot-toast';
import { addInput } from '@/lib/cartesi';
import { dappAddress } from '@/lib/utils';
import { useRollups } from '@/hooks/useRollups';
import { useConnectWallet } from '@web3-onboard/react';
import ConfirmModal from './ConfirmModal';


interface RouletteProps {
  gameId: string
  onSpinResult: (value: number) => void
  players: string[]
  notices: any
}

const Roulette: FC<RouletteProps> = ({ 
  gameId,
  onSpinResult,
  players,
  notices
}) => {

  const [{ wallet }] = useConnectWallet()
  const rollups = useRollups(dappAddress)
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
  const [startAngle, setStartAngle] = useState<number>(0)

  const options = [1, 2, 3, 4, 5, 6];
  // let startAngle = 0;
  const arc = Math.PI / (options.length / 2);
  let spinTimeout: NodeJS.Timeout | null = null;
  let spinTime = 0;
  let spinTimeTotal = 0;
  let ctx: CanvasRenderingContext2D | null = null;

  const byte2Hex = (n: number): string => {
    const nybHexString = '0123456789ABCDEF';
    return String(nybHexString.substr((n >> 4) & 0x0f, 1)) + nybHexString.substr(n & 0x0f, 1);
  };

  const RGB2Color = (r: number, g: number, b: number): string => {
    return '#' + byte2Hex(r) + byte2Hex(g) + byte2Hex(b);
  };

  const getColor = (item: number, maxitem: number): string => {
    const phase = 0;
    const center = 128;
    const width = 127;
    const frequency = Math.PI * 2 / maxitem;

    let red = Math.sin(frequency * item + 2 + phase) * width + center;
    let green = Math.sin(frequency * item + 0 + phase) * width + center;
    let blue = Math.sin(frequency * item + 4 + phase) * width + center;

    return RGB2Color(red, green, blue);
  };

  const drawRouletteWheel = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const outsideRadius = 200;
      const textRadius = 160;
      const insideRadius = 125;

      ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;

        ctx.font = 'bold 36px Helvetica, Arial';

        for (let i = 0; i < options.length; i++) {
          const angle = startAngle + i * arc;
          ctx.fillStyle = getColor(i, options.length);

          ctx.beginPath();
          ctx.arc(250, 250, outsideRadius, angle, angle + arc, false);
          ctx.arc(250, 250, insideRadius, angle + arc, angle, true);
          ctx.stroke();
          ctx.fill();

          ctx.save();
          ctx.shadowOffsetX = -1;
          ctx.shadowOffsetY = -1;
          ctx.shadowBlur = 0;
          ctx.shadowColor = 'rgb(220,220,220)';
          ctx.fillStyle = 'black';
          ctx.translate(250 + Math.cos(angle + arc / 2) * textRadius,
            250 + Math.sin(angle + arc / 2) * textRadius);
          ctx.rotate(angle + arc / 2 + Math.PI / 2);
          const text = options[i];
          ctx.fillText(text.toString(), -ctx.measureText(text.toString()).width / 2, 0);
          ctx.restore();
        }

        // Arrow
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.moveTo(250 - 4, 250 - (outsideRadius + 5));
        ctx.lineTo(250 + 4, 250 - (outsideRadius + 5));
        ctx.lineTo(250 + 4, 250 - (outsideRadius - 5));
        ctx.lineTo(250 + 9, 250 - (outsideRadius - 5));
        ctx.lineTo(250 + 0, 250 - (outsideRadius - 13));
        ctx.lineTo(250 - 9, 250 - (outsideRadius - 5));
        ctx.lineTo(250 - 4, 250 - (outsideRadius - 5));
        ctx.lineTo(250 - 4, 250 - (outsideRadius + 5));
        ctx.fill();
      }
    }
  };

  const handleResponse = (response: string) => {
    playGame(response)
  }

  const playGame = async (response: string) => {

    const playerAddress = wallet?.accounts[0].address
    if (!playerAddress) return toast.error('Player not connected')

    if (players.length >= 2) {

       const playerAddress = wallet?.accounts[0].address
  

      try {

        const jsonPayload = JSON.stringify({
        method: 'playGame',
        data: { gameId, playerAddress, response } // line 132
      })

        const tx = await addInput(JSON.stringify(jsonPayload), dappAddress, rollups)
        setModalIsOpen(false)
        console.log('txxx ', tx)
        const result = await tx.wait(1)
        console.log(result)


      } catch (error) {
        console.error('Error during game:', error)
      }

    // startAngle = Math.random() * 10 + 10; // 10 to 19.999
    // spinTime = 0;
    // spinTimeTotal = Math.random() * 3 + 4 * 1000;  // 4000 to 7999
    // rotateWheel()

    } else {
      toast.error('Not enough players to play')
    }
  };

  const spinHandler = async () => {
    // startAngle = Math.random() * 10 + 10; // 10 to 19.999
    // startAngle = 15 // 10 to 19.999

    spinTime = 0;
    spinTimeTotal = Math.random() * 3 + 4 * 1000;  // 4000 to 7999
    rotateWheel()
  }

  const rotateWheel = () => {
    spinTime += 30;
    if (spinTime >= spinTimeTotal || !ctx) {
      stopRotateWheel();
      return;
    }
    const spinAngle = startAngle - easeOut(spinTime, 0, startAngle, spinTimeTotal);
    // startAngle += (spinAngle * Math.PI / 180);
    setStartAngle(startAngle + (spinAngle * Math.PI / 180))
    // startAngle += (spinAngle * Math.PI / 180);
    drawRouletteWheel();
    spinTimeout = setTimeout(rotateWheel, 30);
  };

  const stopRotateWheel = () => {
    if (spinTimeout) clearTimeout(spinTimeout);
    if (!ctx) return;
    const degrees = startAngle * 180 / Math.PI + 90;
    const arcd = arc * 180 / Math.PI;
    const index = Math.floor((360 - degrees % 360) / arcd);
    ctx.save();
    ctx.font = 'bold 90px Helvetica, Arial';
    ctx.fillStyle = 'blue'
    const text = options[index]
    onSpinResult(text)
    ctx.fillText(text.toString(), 250 - ctx.measureText(text.toString()).width / 2, 250 + 10);
    ctx.restore();
  };

  const easeOut = (t: number, b: number, c: number, d: number) => {
    const ts = (t /= d) * t;
    const tc = ts * t;
    return b + c * (tc + -3 * ts + 3 * t);
  };

  useEffect(() => {
    drawRouletteWheel();
    return () => {
      if (spinTimeout) clearTimeout(spinTimeout);
    };
  })

  useEffect(() => {
    rollups?.inputContract.on(
      'InputAdded',
      (dappAddress, inboxInputIndex, sender, input) => {
        spinHandler()
      }
    )
  }, [rollups])

  useEffect(() => {
  if (notices && notices.length > 0) {
    const game = JSON.parse(notices[notices.length - 1].payload).find((game: any) => game.id === gameId);
    if (game) {
      debugger
      setStartAngle(game.rollOutcome);
    }
  }
}, [notices, gameId]);


  return (
    <div>
      <Button type="button"  id="spin" onClick={() => setModalIsOpen(true)}>Play Game</Button>
      <canvas id="canvas" width="500" height="500" ref={canvasRef}></canvas>
      <ConfirmModal onSubmit={handleResponse} showModal={modalIsOpen} />
    </div>
  );
};

export default Roulette;
