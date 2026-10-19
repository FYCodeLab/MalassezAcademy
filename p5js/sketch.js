// MalassezAcademy — original p5.js prototype by Frank Yates.
// Playable at https://editor.p5js.org/frank.yates/full/OV6pjS93o
// Archived in the repo 2026-10-19. Required assets: MALASSEZ5.jpg, MAL5.gif, danger.ttf

let cellules = [];
let boutonGenerer, boutonVerifier, boutonShowResults;
let champInput;
let imagePrincipal, gifAnimation;
let tempsDebut;
let etat = 'animation';
let customFont;

let globalFont;
let globalTextSize = 16;
let keyboardFont = 'Arial';
let keyboardTextSize = 20;

let largeurRectangle = 360;
let hauteurRectangle = 460;
let rectX = 120;
let rectY = 30;

let boutonGenererX = 545;
let boutonGenererY = 20;
let positionVerticaleBase = 100;
let espacementVertical = 50;
let champInputX = 545;
let champInputY = positionVerticaleBase;
let boutonVerifierX = champInputX;
let boutonVerifierY = champInputY + espacementVertical;
let boutonShowResultsX = champInputX;
let boutonShowResultsY = boutonVerifierY + espacementVertical;

let numericKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '<'];
let keySize = 40;
let keyStartX = 800;
let keyStartY = 100;
let keySpacing = 10;

let resultColorRevealed = false;
let resultX, resultY;
let nbCellulesReel;

function preload() {
  imagePrincipal = loadImage('MALASSEZ5.jpg');
  gifAnimation = loadImage('MAL5.gif');
  customFont = loadFont('danger.ttf');
}

function setup() {
  createCanvas(1000, 600);
  globalFont = customFont;
  textFont(globalFont);
  textSize(globalTextSize);

  boutonGenerer = createButton('Renew Cells');
  boutonGenerer.style('background-color', 'red');
  boutonGenerer.style('color', 'white');
  boutonGenerer.style('width', '120px');
  boutonGenerer.style('height', '50px');

  champInput = createInput('');
  champInput.style('width', '110px');
  champInput.style('font-size', `${globalTextSize}px`);

  boutonVerifier = createButton('Check your count');
  boutonVerifier.style('background-color', 'blue');
  boutonVerifier.style('color', 'white');
  boutonVerifier.style('width', '120px');

  boutonShowResults = createButton('Real Results');
  boutonShowResults.style('background-color', 'green');
  boutonShowResults.style('color', 'white');
  boutonShowResults.style('width', '120px');
  boutonShowResults.hide();

  boutonGenerer.position(boutonGenererX, boutonGenererY);
  champInput.position(champInputX, champInputY);
  boutonVerifier.position(boutonVerifierX, boutonVerifierY);
  boutonShowResults.position(boutonShowResultsX, boutonShowResultsY);

  boutonGenerer.mousePressed(demarrerAnimation);
  boutonVerifier.mousePressed(verifierResultat);
  boutonShowResults.mousePressed(showResults);

  noLoop();
}

function draw() {
  if (etat === 'animation') {
    afficherAnimation();
  } else if (etat === 'principal') {
    afficherProgrammePrincipal();
    dessinerClavierNumerique();

    if (resultColorRevealed) {
      drawResultText();
    }
  }

  // Only show labels when not in animation
  if (etat !== 'animation') {
    fill(0);
    textAlign(CENTER, CENTER);
    textFont(globalFont);
    textSize(12);
    textStyle(NORMAL);
    text("Your count :", champInputX + 55, champInputY - 15);
    text("cells/mL", champInputX + 55, champInputY + 35);
  }
}

function demarrerAnimation() {
  background(255);
  boutonGenerer.hide();
  champInput.hide();
  boutonVerifier.hide();
  boutonShowResults.hide();
  champInput.value('');
  cellules = [];
  resultColorRevealed = false;
  etat = 'animation';
  tempsDebut = millis();
  loop();
}

function afficherAnimation() {
  background(255);
  let tempsEcoule = millis() - tempsDebut;

  if (tempsEcoule < 2800) {
    afficherImage(gifAnimation, 255);
  } else {
    etat = 'principal';
    if (cellules.length === 0) {
      genererCellules();
    }

    boutonGenerer.show();
    champInput.show();
    boutonVerifier.show();
    boutonShowResults.show();
  }
}

function afficherProgrammePrincipal() {
  background(255);
  image(imagePrincipal, 0, 0, 600 * 0.9, (600 / (imagePrincipal.width / imagePrincipal.height)) * 0.9);

  for (let i = 0; i < cellules.length; i++) {
    let c = cellules[i];
    dessinerCellule(c.x, c.y, c.w, c.h);
  }
  noLoop();
}

function genererCellules() {
  cellules = [];
  let nbCellules = int(random(50, 300));
  for (let i = 0; i < nbCellules; i++) {
    let x = random(rectX, rectX + largeurRectangle);
    let y = random(rectY, rectY + hauteurRectangle);
    let w = random(6, 12);
    let h = w + random(-3, 3);
    cellules.push({ x: x, y: y, w: w, h: h });
  }
  nbCellulesReel = cellules.length * 1000;
  redraw();
}

function verifierResultat() {
  fill(255);
  noStroke();
  rect(500, 0, 500, 600);

  dessinerClavierNumerique();

  let saisieUtilisateur = int(champInput.value());
  let difference = abs(saisieUtilisateur - nbCellulesReel);
  let scorePourcentage = max(0, (1 - (difference / nbCellulesReel)) * 100).toFixed(1);

  textFont(globalFont);
  textSize(globalTextSize);
  textAlign(CENTER, CENTER);

  let x = champInputX + 85;
  let y = boutonVerifierY + espacementVertical;

  resultX = x;
  resultY = y + 80;

  fill(0);
  text("Your count is :", x, y + 80);
  fill(255, 0, 0);
  text(`${saisieUtilisateur} cells/mL.`, x, y + 120);
  fill(255, 0, 0);
  textSize(30);
  text(`Score: ${scorePourcentage}%`, x, y + 180);

  resultColorRevealed = false;
}

function showResults() {
  resultColorRevealed = true;
  redraw();
}

function dessinerCellule(x, y, w, h) {
  fill(0);
  noStroke();
  ellipse(x, y, w, h);
}

function afficherImage(img, opacite) {
  let rapportAspect = img.width / img.height;
  let nouvelleLargeur = img.width * 0.8;
  let nouvelleHauteur = img.height * 0.8;
  let x = (1000 - nouvelleLargeur) / 2;
  let y = (600 - nouvelleHauteur) / 2;
  tint(255, opacite);
  image(img, x, y, nouvelleLargeur, nouvelleHauteur);
  noTint();
}

function dessinerClavierNumerique() {
  fill(0, 0, 255);
  stroke(0);
  textFont(keyboardFont);
  textSize(keyboardTextSize);
  textStyle(BOLD);

  for (let i = 0; i < numericKeys.length; i++) {
    let x = keyStartX + (i % 3) * (keySize + keySpacing);
    let y = keyStartY + floor(i / 3) * (keySize + keySpacing);
    rect(x, y, keySize, keySize);
    fill(255);
    textAlign(CENTER, CENTER);
    text(numericKeys[i], x + keySize / 2, y + keySize / 2);
    fill(0, 0, 255);
  }
}

function drawResultText() {
  fill(0, 200, 0); //green
  text(`${nbCellulesReel} cells/mL`, resultX, resultY);
}

function mousePressed() {
  if (etat === 'principal') {
    for (let i = 0; i < numericKeys.length; i++) {
      let x = keyStartX + (i % 3) * (keySize + keySpacing);
      let y = keyStartY + floor(i / 3) * (keySize + keySpacing);
      if (mouseX > x && mouseX < x + keySize && mouseY > y && mouseY < y + keySize) {
        if (numericKeys[i] === '<') {
          champInput.value(champInput.value().slice(0, -1));
        } else {
          champInput.value(champInput.value() + numericKeys[i]);
        }
        break;
      }
    }
  }
}
