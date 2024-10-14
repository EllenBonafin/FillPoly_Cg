let vertices = []; // Declaração do array para armazenar os vértices
let polygons = [{
  id: 0,
  vertices: [{x: 100, y: 100}, {x: 200, y:100}, {x: 150, y: 200}]
}];
let mouseMode = 'select'

function setup() {
  var cnv = createCanvas(500, 500);
  cnv.style('display', 'block');
}

function openA(){

  if (mouseMode == "create") {
    mouseMode = "select"
  } else {
    mouseMode = "create"
    console.log({
      id: polygons.length,
      vertices: [],
    })
    polygons.push({
      id: polygons.length,
      vertices: [],
    })
  }

}

function draw() {
  background(220);

  for (const item of polygons) {
    for (let i = 0; i < item.vertices.length; i++) {
      let v1 = item.vertices[i];
      let v2 = item.vertices[(i + 1) % item.vertices.length]; // Conecta o último vértice ao primeiro
      line(v1.x, v1.y, v2.x, v2.y); // Traça a linha entre os dois vértices
    }
  }

  }

function mousePressed() {
  if(mouseMode == "create" && mouseX >= 0 && mouseX <= 500 && mouseY >= 0 && mouseY <= 500) { //intervalo que ajusta o mouse dentro do canva
  // Quando o usuário clicar, adicionar um novo vértice
    let novoVertice = createVector(mouseX, mouseY);
    polygons[polygons.length-1].vertices.push(novoVertice);
  }

}

function keyPressed() {
  // Pressionar a tecla 'C' limpa o polígono e reinicia os vértices
  if (key === 'C' || key === 'c') {
    vertices = [];
  }
}

