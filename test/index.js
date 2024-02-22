function spinRoulette(speed = 5, duration = 5000) {
  var image = document.getElementById('roulette');
  var pointer = document.getElementById('pointer');
  var pointerAngle = 0; // Initialize the pointer angle

  // Calculate the pointer's fixed angle (assuming pointer is initially at 0 degrees)
  var pointerTransform = getComputedStyle(pointer).transform;
  var pointerMatrix = new WebKitCSSMatrix(pointerTransform); // For WebKit browsers
  pointerAngle = Math.atan2(pointerMatrix.m21, pointerMatrix.m11) * (180 / Math.PI);

  // Generate a random number between 1 and 6
  var stopAtSegment = Math.floor(Math.random() * 6) + 1;

  // Calculate the final angle to rotate to
  var finalAngle = 360 * (speed * duration / 1000) + (stopAtSegment - 1) * 60;

  // Apply CSS animation to rotate the image
  image.style.transition = `transform ${duration / 1000}s ease-out`;
  image.style.transform = `rotate(${finalAngle}deg)`;

  // After the animation completes, determine the segment where the image stopped
  setTimeout(function() {
    // Calculate the final angle where the image stopped
    var finalTransform = getComputedStyle(image).transform;
    var finalMatrix = new WebKitCSSMatrix(finalTransform); // For WebKit browsers
    var finalImageAngle = Math.atan2(finalMatrix.m21, finalMatrix.m11) * (180 / Math.PI);

    // Adjust the final angle to be positive and within 360 degrees
    finalImageAngle = (finalImageAngle < 0) ? 360 + finalImageAngle : finalImageAngle;

    // Calculate the difference in angles between the pointer and the image
    var angleDifference = (finalImageAngle - pointerAngle + 360) % 360;

    // Calculate the segment where the image stopped based on the angle difference
    var resultNumber = Math.ceil(angleDifference / 60);

    alert(`The roulette stopped at: ${resultNumber}`);
  }, duration);
}



// function spinRoulette(speed = 5, duration = 5000) {
//   var image = document.getElementById('roulette');
//   var pointer = document.getElementById('pointer');
//   var stopAtSegment = Math.floor(Math.random() * 6) + 1;
//   var finalAngle = 360 * (speed * duration / 1000) + (stopAtSegment - 1) * 60;

//   image.style.transition = `transform ${duration / 1000}s ease-out`;
//   image.style.transform = `rotate(${finalAngle}deg)`;
//   pointer.style.transform = `rotate(${finalAngle + 90}deg)`; // Offset pointer by 90 degrees

//   setTimeout(function() {
//     var resultNumber = stopAtSegment;
//     alert(`The roulette stopped at: ${resultNumber}`);
//   }, duration);
// }




// function spinRoulette(speed = 5, duration = 5000) {
//   // Get a reference to the image element
//   var image = document.getElementById('roulette');

//   // Generate a random number between 1 and 6
//   var stopAtSegment = Math.floor(Math.random() * 6) + 1;

//   // Calculate the final angle to rotate to
//   var finalAngle = 360 * (speed * duration / 1000) + (stopAtSegment - 1) * 60; // 60 degrees per segment

//   // Apply CSS animation to rotate the image
//   image.style.transition = `transform ${duration / 1000}s ease-out`;
//   image.style.transform = `rotate(${finalAngle}deg)`;

//   // After the animation completes, determine the segment where the image stopped
//   setTimeout(function() {
//     var resultNumber = stopAtSegment;
//     alert(`The roulette stopped at: ${resultNumber}`);
//   }, duration);
// }




// function spinRoulette() {
//     // Get a reference to the image element
//     var image = document.getElementById('roulette');

//     // Generate a random number of spins between 5 and 15
//     var spins = Math.floor(Math.random() * 11) + 5;

//     // Calculate the angle increment for each spin
//     var angleIncrement = 360 / 6; // Assuming 6 segments

//     // Randomly choose a segment to stop at
//     var stopAtSegment = Math.floor(Math.random() * 6) + 1; // Random number between 1 and 6

//     // Calculate the final angle to rotate to
//     var finalAngle = spins * 360 + (stopAtSegment - 1) * angleIncrement;

//     // Apply CSS animation to rotate the image
//     image.style.transition = 'transform 5s ease-out'; // Adjust the duration as needed
//     image.style.transform = 'rotate(' + finalAngle + 'deg)';

//     // After the animation completes, determine the segment where the image stopped
//     setTimeout(function() {
//         var resultNumber = stopAtSegment;
//         alert('The roulette stopped at: ' + resultNumber);
//     }, 5000); // Adjust the timeout based on the animation duration
// }