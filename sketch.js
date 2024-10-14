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
      ellipse(item.vertices[i].x, item.vertices[i].y, 10, 10); 
    }
  
    // Desenhar o polígono se houver mais de 1 vértice
    if (item.vertices.length > 1) {
      beginShape();
      for (let i = 0; i < item.vertices.length; i++) {
        vertex(item.vertices[i].x, item.vertices[i].y); // Conectar os vértices

      }
  
      endShape(CLOSE); // Fechar o polígono
    }

  }
  
 
}

function mousePressed() {
  if(mouseMode == "create" && mouseX >= 0 && mouseX <= 500 && mouseY >= 0 && mouseY <= 500) {
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

