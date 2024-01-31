import { Roulette, useRoulette } from 'react-hook-roulette';

interface RouletteComponentProps {
  onStart: () => void;
}

const RouletteComponent: React.FC<RouletteComponentProps> = ({ onStart: startRoulette }) => {
	const items = [
		{ name: "label1" },
		{ name: "label2" },
		{ name: "label3" },
		{ name: "label4" },
		{ name: "label5" },
		{ name: "label6" },
	];
	const { roulette, onStart, onStop, result } = useRoulette({ items });

	return (
		<div>
			<Roulette roulette={roulette} />
			<button type="button" onClick={onStart}>Start</button>
			<button type="button" onClick={onStop}>Stop</button>
			{result && <p>Result: {result}</p>}
		</div>
	);
};

export default RouletteComponent