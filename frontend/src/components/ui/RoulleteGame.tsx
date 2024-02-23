
import Roulette from '@/components/ui/Roulette'

export default function RoulleteGame() {


   const handleSpinResult = (value: number) => {
    console.log('Result of the spinn:', value);
    // Do something with the spin result
  };


  return (
    <div>


      <Roulette onSpinResult={handleSpinResult} />
    </div>
  )
}
