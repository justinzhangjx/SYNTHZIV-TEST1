let audioStarted = false;

function mousePressed() {
  if (!audioStarted) {
    userStartAudio();
    audioStarted = true;
  }
}

// Existing code
var mode = 0;
let counter = 0;
let kickHits = [0];
let snareHits = [16, 32];
let clickedCount = 0;
let bassPitch = 1.0;
let leadPitch = 1.0;
let kickVolume = 0.5;
let snareVolume = 0.5;
let bassVolume = 0.5;
let leadVolume = 0.5;

let kick, snare, bass, lead;
const pianoMapping = {
  "C#": 1.0,
  "D#": 1.122,
  "E": 1.26,
  "F#": 1.335,
  "G#": 1.498,
  "A#": 1.68,
  "B": 1.888,
};

let bassSpectrum, leadSpectrum, kickSpectrum, snareSpectrum;
let bassFFT, leadFFT, kickFFT, snareFFT;
const spectrumLength = 64;
const visualizerWidth = 200;
const visualizerHeight = 100;
const visualizerMargin = 20;
const visualizerTopMargin = 20;

function preload() {
  kick = loadSound("kick.wav");
  snare = loadSound("snare.wav");
  bass = loadSound("bass.wav");
  lead = loadSound("lead.wav");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  splash = new Splash();

  let patternButton = createButton("Change Drum Pattern");
  patternButton.position(20, height - 150);
  patternButton.mousePressed(changePattern);

  createVolumeLabel("VOLUME SLIDERS", 20, height - 315);

  createVolumeSlider("Kick Volume", 100, height - 260, setKickVolume);
  createVolumeLabel("Kick", 20, height - 275);

  createVolumeSlider("Snare Volume", 100, height - 230, setSnareVolume);
  createVolumeLabel("Snare", 20, height - 245);

  createVolumeSlider("Bass Volume", 300, height - 260, setBassVolume);
  createVolumeLabel("Bass", 230, height - 275);

  createVolumeSlider("Lead Volume", 300, height - 230, setLeadVolume);
  createVolumeLabel("Lead", 230, height - 245);

  for (let note in pianoMapping) {
    createButton("Bass " + note)
      .position(20 + Object.keys(pianoMapping).indexOf(note) * 80, height - 80)
      .mousePressed(() => playBass(note));
  }

  for (let note in pianoMapping) {
    createButton("Lead " + note)
      .position(20 + Object.keys(pianoMapping).indexOf(note) * 80, height - 50)
      .mousePressed(() => playLead(note));
  }

  bassFFT = new p5.FFT();
  bassFFT.setInput(bass);

  leadFFT = new p5.FFT();
  leadFFT.setInput(lead);

  kickFFT = new p5.FFT();
  kickFFT.setInput(kick);

  snareFFT = new p5.FFT();
  snareFFT.setInput(snare);
}

function createVolumeSlider(label, x, y, callback) {
  let slider = createSlider(0, 1, 0.5, 0.01);
  slider.position(x, y);
  slider.style("width", "100px");
  slider.input(() => callback(slider.value()));
}

function createVolumeLabel(label, x, y) {
  createP(label).position(x, y);
}

function mouseClicked() {
  clickedCount++;
  if (clickedCount >= 3) clickedCount = 0;

  switch (clickedCount) {
    case 0:
      snareHits = [16, 32];
      break;
    case 1:
      snareHits = [40, 56];
      break;
    case 2:
      snareHits = [48, 64];
      break;
  }
}

function changePattern() {}

function setKickVolume(value) {
  kickVolume = value;
  kick.setVolume(kickVolume);
}

function setSnareVolume(value) {
  snareVolume = value;
  snare.setVolume(snareVolume);
}

function setBassVolume(value) {
  bassVolume = value;
  bass.setVolume(bassVolume);
}

function setLeadVolume(value) {
  leadVolume = value;
  lead.setVolume(leadVolume);
}

function changeBassPitch() {
  bassPitch = random(0.5, 2.0);
  bass.rate(bassPitch);
}

function changeLeadPitch() {
  leadPitch = random(0.5, 2.0);
  lead.rate(leadPitch);
}

function playBass(note) {
  const pitch = pianoMapping[note];
  bass.rate(pitch);
  bass.play();
  bass.setVolume(bassVolume);
}

function playLead(note) {
  const pitch = pianoMapping[note];
  lead.rate(pitch);
  lead.play();
  lead.setVolume(leadVolume);
}

function draw() {
  if (mouseIsPressed == true && splash.update() == true) {
    mode = 1;
  }
  if (mode == 1) {
    splash.hide();

    background(220);

    // Draw visualizers
    drawVisualizerBox("Bass", visualizerMargin, visualizerTopMargin);
    drawVisualizerBox(
      "Lead",
      visualizerMargin + visualizerWidth + visualizerMargin,
      visualizerTopMargin
    );
    drawVisualizerBox(
      "Kick",
      visualizerMargin,
      visualizerTopMargin + visualizerHeight + visualizerMargin
    );
    drawVisualizerBox(
      "Snare",
      visualizerMargin + visualizerWidth + visualizerMargin,
      visualizerTopMargin + visualizerHeight + visualizerMargin
    );

    drawVisualizer(bassFFT, visualizerMargin, visualizerTopMargin);
    drawVisualizer(
      leadFFT,
      visualizerMargin + visualizerWidth + visualizerMargin,
      visualizerTopMargin
    );
    drawVisualizer(
      kickFFT,
      visualizerMargin,
      visualizerTopMargin + visualizerHeight + visualizerMargin
    );
    drawVisualizer(
      snareFFT,
      visualizerMargin + visualizerWidth + visualizerMargin,
      visualizerTopMargin + visualizerHeight + visualizerMargin
    );

    if (counter % 16 == 0 || counter % 32 == 0) kick.play();

    if (
      counter == snareHits[0] ||
      counter == snareHits[1] ||
      counter == snareHits[2] ||
      counter == snareHits[3] ||
      counter == snareHits[4]
    )
      snare.play();

    if (counter % 8 == 0) bass.play();

    if (counter % 4 == 0) lead.play();

    counter++;

    if (counter >= 64) counter = 0;
    
    textSize(24);
    textAlign(RIGHT, BOTTOM);
    textStyle(BOLD);
    textFont('Arial Black');
    fill(0); // Set text color to black
    text("SYNTHZIV SAMPLER", width - 20, height - 20);

    
  }
}

function drawVisualizerBox(label, x, y) {
  noFill();
  stroke(0);
  rect(x, y, visualizerWidth, visualizerHeight);
  textAlign(CENTER, CENTER);
  fill(0);
  noStroke();
  text(
    label,
    x + visualizerWidth / 2,
    y + visualizerHeight + visualizerMargin / 2
  );
}

function drawVisualizer(fft, x, y) {
  let spectrum = fft.analyze();
  noFill();
  stroke(0);
  beginShape();
  for (let i = 0; i < spectrumLength; i++) {
    let amp = spectrum[i];
    let y1 = map(amp, 0, 255, visualizerHeight, 0);
    vertex(x + i * (visualizerWidth / spectrumLength), y + y1);
  }
  endShape();
}
