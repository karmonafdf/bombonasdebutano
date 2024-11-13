let font;
let tSizeTitle = 150;  // Tamaño del título
let tSizeText = 25;    // Tamaño del texto largo (ajustado para que no se salga de la pantalla)
let tposXTitle = 75;   // Posición horizontal del título
let tposYTitle = 150;  // Posición vertical del título
let tposXText = 75;    // Posición horizontal del texto largo
let tposYText = 400;   // Posición vertical del texto largo
let pointCount = 0.5;  // Cantidad de partículas
let speed = 10;
let comebackSpeed = 10;
let dia = 60;          // Diámetro de interacción
let randomPos = false; // Posición inicial
let pointsDirection = "up"; // Dirección desde donde vienen las partículas
let interactionDirection = -0.3; // Entre 1 y -1

let titlePoints = [];
let textPoints = [];
let paragraphs = [
  "Ruido: es un sonido no deseado y molesto. Es aquel, producido por la mezcla de ondas sonoras de distintas frecuencias y distintas amplitudes.",
  "El sonido es producido por una serie de variaciones de presión, en forma de vibraciones, que se propagan a través de los sólidos, los líquidos y los gases. Estas ondas vibratorias llegan a nuestro oído y son interpretadas como un sonido.",
  "Sonido: cualquier variación de presión que puede detectar el oído humano.",
  "Un sonido es un fenómeno físico que consiste en la alteración mecánica de las partículas de un medio elástico, producida por un elemento en vibración, que es capaz de provocar una sensación auditiva.",
  "Las vibraciones se transmiten en el medio, generalmente el aire, en forma de ondas sonoras, se introducen por el pabellón del oído haciendo vibrar la membrana del tímpano, de ahí pasa al oído medio, oído interno y excita las terminales del nervio acústico que transporta al cerebro los impulsos neuronales que finalmente generan la sensación sonora.",
  "La vibración de las moléculas de aire provoca una variación de la presión atmosférica, es decir, el paso de una onda sonora produce una onda de presión que se propaga por el aire.",
  "Un sonido se caracteriza por su “nivel”, que está asociado a la cantidad de energía empleada para generarlo (se mide en dB) y por su frecuencia, la cual indica cuán rápido vibra el aire. Cuanto más rápido es la vibración, mayor es la frecuencia (se mide en Hertz)."
];

function preload() {
  font = loadFont("AvenirNextLTPro-Demi.otf");
}

function setup() {
  createCanvas(1000, 1000);
  textFont(font);

  // Generar los puntos para el título "El Ruido"
  let titlePointsArray = font.textToPoints("El Ruido", tposXTitle, tposYTitle, tSizeTitle, {
    sampleFactor: pointCount
  });

  // Generar las partículas para el título
  for (let i = 0; i < titlePointsArray.length; i++) {
    let pt = titlePointsArray[i];
    let titlePoint = new Interact(
      pt.x,
      pt.y,
      speed,
      dia,
      randomPos,
      comebackSpeed,
      pointsDirection,
      interactionDirection
    );
    titlePoints.push(titlePoint);
  }

  // Generar las partículas para cada párrafo
  let currentY = tposYText;
  for (let i = 0; i < paragraphs.length; i++) {
    let text = paragraphs[i];
    let pointsArray = font.textToPoints(text, tposXText, currentY, tSizeText, {
      sampleFactor: pointCount
    });

    // Crear partículas para cada punto en el párrafo
    for (let j = 0; j < pointsArray.length; j++) {
      let pt = pointsArray[j];
      let textPoint = new Interact(
        pt.x,
        pt.y,
        speed,
        dia,
        randomPos,
        comebackSpeed,
        pointsDirection,
        interactionDirection
      );
      textPoints.push(textPoint);
    }

    // Aumentar la posición vertical para el siguiente párrafo
    currentY += tSizeText * 2.5; // Ajusta este valor para controlar el espaciado entre párrafos
  }
}

function draw() {
  background(255, 0, 0);  // Fondo rojo

  // Actualizar y mostrar las partículas del título "El Ruido"
  for (let i = 0; i < titlePoints.length; i++) {
    let v = titlePoints[i];
    v.update();
    v.show();
    v.behaviors();
  }

  // Actualizar y mostrar las partículas del texto largo
  for (let i = 0; i < textPoints.length; i++) {
    let v = textPoints[i];
    v.update();
    v.show();
    v.behaviors();
  }
}

function Interact(x, y, m, d, t, s, di, p) {
  if (t) {
    this.home = createVector(random(width), random(height));
  } else {
    this.home = createVector(x, y);
  }
  this.pos = this.home.copy();
  this.target = createVector(x, y);

  if (di == "general") {
    this.vel = createVector();
  } else if (di == "up") {
    this.vel = createVector(y, x);
  } else if (di == "down") {
    this.vel = createVector(0, y);
  } else if (di == "left") {
    this.vel = createVector(-x, 0);
  } else if (di == "right") {
    this.vel = createVector(x, 0);
  }

  this.acc = createVector();
  this.r = 8;
  this.maxSpeed = m;
  this.maxforce = 1;
  this.dia = d;
  this.come = s;
  this.dir = p;
}

Interact.prototype.behaviors = function () {
  let arrive = this.arrive(this.target);
  let mouse = createVector(mouseX, mouseY);
  let flee = this.flee(mouse);

  this.applyForce(arrive);
  this.applyForce(flee);
}

Interact.prototype.applyForce = function (f) {
  this.acc.add(f);
}

Interact.prototype.arrive = function (target) {
  let desired = p5.Vector.sub(target, this.pos);
  let d = desired.mag();
  let speed = this.maxSpeed;
  if (d < this.come) {
    speed = map(d, 0, this.come, 0, this.maxSpeed);
  }
  desired.setMag(speed);
  let steer = p5.Vector.sub(desired, this.vel);
  return steer;
}

Interact.prototype.flee = function (target) {
  let desired = p5.Vector.sub(target, this.pos);
  let d = desired.mag();

  if (d < this.dia) {
    desired.setMag(this.maxSpeed);
    desired.mult(this.dir);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    return steer;
  } else {
    return createVector(0, 0);
  }
}

Interact.prototype.update = function () {
  this.pos.add(this.vel);
  this.vel.add(this.acc);
  this.acc.mult(0);
}

Interact.prototype.show = function () {
  stroke(0, 255, 0);  // Color verde para las partículas
  strokeWeight(3);
  point(this.pos.x, this.pos.y);
}
