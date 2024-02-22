const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');

// Define canvas dimensions
canvas.width = 300;
canvas.height = 300;

// Define number of sections and colors
const sections = 6;
const colors = ['#f00', '#0f0', '#00f', '#ff0', '#0ff', '#f0f'];

// Function to draw the wheel
function drawWheel(angle) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw circle background
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2 - 20, 0, 2 * Math.PI);
  ctx.fillStyle = '#eee';
  ctx.fill();
  ctx.stroke();

  // Draw numbers
  const angleStep = Math.PI * 2 / sections;
  for (let i = 0; i < sections; i++) {
    const text = i + 1;
    const x = Math.cos(angle + angleStep * i) * (canvas.width / 2 - 30);
    const y = Math.sin(angle + angleStep * i) * (canvas.width / 2 - 30);
    ctx.font = '20px Arial';
    ctx.fillStyle = colors[i];
    ctx.textAlign = 'center';
    ctx.fillText(text, canvas.width / 2 + x, canvas.height / 2 + y);
  }
}

// Function to draw the pointer
function drawPointer() {
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, canvas.height / 2 - canvas.width / 2 + 5);
  ctx.lineTo(canvas.width / 2 + 10, canvas.height / 2 - canvas.width / 2 + 25);
  ctx.lineTo(canvas.width / 2 - 10, canvas.height / 2 - canvas.width / 2 + 25);
  ctx.closePath();
  ctx.fillStyle = '#000';
  ctx.fill();
}

// Variables for spinning animation
let spinAngle = 0;
let spinning = false;
let targetAngle = 0; // Initial target angle
let winningNumber = 1; // Initial winning number

function spinWheel() {
  if (!spinning) return;

  // Update spinAngle for spinning effect
  spinAngle += Math.PI / 90; // Adjust the speed of spinning here

  // Check if spinAngle exceeds target angle
  if (spinAngle >= targetAngle) {
    spinning = false;
    alert(`Winning number: ${winningNumber}`);
    return;
  }

  drawWheel(spinAngle);
  drawPointer();
  requestAnimationFrame(spinWheel);
}

// Start spinning on button click
function startSpin() {
  winningNumber = Math.floor(Math.random() * sections) + 1; // Random winning number
  targetAngle = Math.PI * 4 + Math.PI * 2 * (winningNumber - 1); // Calculate target angle
  spinAngle = 0; // Reset spinAngle
  spinning = true;
  spinWheel();
}

drawWheel(0); // Initial draw
