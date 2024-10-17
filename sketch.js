let vertices = []; // Declaração do array para armazenar os vértices
let polygons = [];
let mouseMode = 'select'
let openButton = document.querySelector('#openButton')
let colorMode = 'unselect'
let colorButton = document.querySelector('#openButton')

function setup() {
  var cnv = createCanvas(500, 500);
  cnv.style('display', 'block');
}

function openA(){
  if (mouseMode == "create") {
    mouseMode = "select"
    document.getElementById("openButton").innerHTML = "Open";
    const polygonsItens = polygons.map((polygon) => `<li>Poligno${polygon.id}: ${JSON.stringify(polygon.vertices.map(({x,y}) => ({x,y})))}</li>`);

    document.getElementById('polygons').innerHTML = polygonsItens.join(' ')
  } else {
    mouseMode = "create"
    document.getElementById("openButton").innerHTML = "Close";
    console.log({
      polygons
    })
    polygons.push({
      id: polygons.length,
      vertices: [],
    })
  }

}

function colorEdge() {
  if (colorMode == "selectcolor") {
    colorMode = "unselect"; // Desativa o modo de colorir
    document.getElementById("colorButton").innerHTML = "Color Edge"; // Altera o texto do botão
  } else {
    colorMode = "selectcolor"; // Ativa o modo de colorir
    document.getElementById("colorButton").innerHTML = "Uncolor Edge"; // Altera o texto do botão
  }
}

function cleanList (){
   polygons = [];
   // Limpar o canvas
   clear();
   // Atualizar a lista de polígonos exibida na interface, se houver
   document.getElementById('polygons').innerHTML = '';
   
}

function draw() {
  background(220);

  for (const item of polygons) {
    for (let i = 0; i < item.vertices.length; i++) {
      ellipse(item.vertices[i].x, item.vertices[i].y, 10, 10); 
    }

    if (colorMode == "selectcolor") {
      stroke(255, 255, 0); // Define a cor do traçado como amarelo
    } else {
      stroke(0); // Se não estiver no modo de colorir, as linhas ficam pretas
    }
    strokeWeight(2); // Define a espessura das linhas

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

