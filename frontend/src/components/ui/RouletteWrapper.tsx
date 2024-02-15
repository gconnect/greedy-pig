import { useRoulette } from "react-hook-roulette";


const RouletteWrapper = () => {


  const { roulette, onStart, onStop } = useRoulette({
  items: [
    { name: '1', bg: '#b26527', color: '#ffffff' },
    { name: '2', bg: '#ce9729', color: '#ffffff' },
    { name: '3', bg: '#e7c02b', color: '#ffffff' },
    { name: '4' },
    { name: '5' },
    { name: '6' },
  ],
  onSpinEnd: (res) => {
    setRollResult(Number(res))
  },
  options: {
    maxSpeed: 20,
    acceleration: 8,
    determineAngle: 90,
    style: {
      canvas: {
        bg: 'transparent',
      },
      arrow: {
        bg: '#000',
        size: 26,
      },
      label: {
        font: '28px Arial',
        align: 'right',
        baseline: 'middle',
        offset: 0.65,
        defaultColor: '#000',
      },
    },
  },
});

return (
  <div></div>
)

}

export default RouletteWrapper;