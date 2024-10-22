let vertices = []; // Declaração do array para armazenar os vértices
let polygons = [];
let mouseMode = "select";
let openButton = document.querySelector("#openButton");
let colorMode = "unselect";
let colorButton = document.querySelector("#openButton");

function setup() {
  var cnv = createCanvas(500, 500);
  cnv.style("display", "block");
}

function openA() {
  if (mouseMode == "create") {
    mouseMode = "select";
    document.getElementById("openButton").innerHTML = "Open";
    const polygonsItens = polygons.map(
      (polygon) =>
        `<li>Poligono ${polygon.id} - ${JSON.stringify(polygon.color)} : ${JSON.stringify(polygon.vertices.map(({ x, y }) => ({ x, y })))}</li>`,
    );

    document.getElementById("polygons").innerHTML = polygonsItens.join(" ");
  } else {
    mouseMode = "create";
    document.getElementById("openButton").innerHTML = "Close";
    console.log({
      polygons,
    });
    polygons.push({
      id: polygons.length,
      vertices: [],
      color: [0, 0, 0],
      selected: false,
    });
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

function cleanList() {
  polygons = [];
  // Limpar o canvas
  clear();
  // Atualizar a lista de polígonos exibida na interface, se houver
  document.getElementById("polygons").innerHTML = "";
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
    fillPolygon(item);
  }
}

function pointInPolygon(point, polygon) {
  const { x, y } = point;
  let crossings = 0;

  console.log(`Verificando o ponto (${x}, ${y}) contra o polígono:`);

  for (let i = 0; i < polygon.length; i++) {
    const v1 = polygon[i];
    const v2 = polygon[(i + 1) % polygon.length];

    console.log(
      `Verificando aresta entre (${v1.x}, ${v1.y}) e (${v2.x}, ${v2.y})`,
    );

    // Verifica se o ponto está entre as coordenadas y dos dois vértices
    if ((v1.y <= y && v2.y > y) || (v2.y <= y && v1.y > y)) {
      console.log(`O ponto está entre as coordenadas Y dos vértices.`);

      // Calcula a taxa incremental de X (TX)
      const TX = (v2.x - v1.x) / (v2.y - v1.y);
      let xIntersection = v1.x + TX * (y - v1.y);

      console.log(`Interseção incremental calculada: ${xIntersection}`);

      // Se a interseção está à direita do ponto, conta como cruzamento
      if (x < xIntersection) {
        console.log(
          `A interseção está à direita do ponto. Contando como cruzamento.`,
        );
        crossings++;
      } else {
        console.log(`A interseção está à esquerda do ponto. Ignorando.`);
      }
    } else {
      console.log(`O ponto não está entre as coordenadas Y dos vértices.`);
    }
  }

  console.log(`Total de cruzamentos: ${crossings}`);
  const inside = crossings % 2 === 1;
  console.log(`O ponto está dentro do polígono? ${inside}`);

  return inside;
}

function fillPolygon(polygon) {
  if (polygon.vertices.length < 2) {
    return;
  }
  // Obtenha o valor y mínimo e máximo dos vértices do polígono
  let minY = Math.min(...polygon.vertices.map((v) => v.y));
  let maxY = Math.max(...polygon.vertices.map((v) => v.y));

  // Para cada linha de varredura (scanline)
  for (let y = minY; y <= maxY; y++) {
    let intersections = [];

    // Encontre todas as interseções da scanline com as arestas do polígono
    for (let i = 0; i < polygon.vertices.length; i++) {
      let v1 = polygon.vertices[i];
      let v2 = polygon.vertices[(i + 1) % polygon.vertices.length];

      // Verifique se a scanline cruza a aresta
      if ((v1.y <= y && v2.y > y) || (v2.y <= y && v1.y > y)) {
        // Calcule o ponto de interseção da scanline com a aresta
        let TX = (v2.x - v1.x) / (v2.y - v1.y);
        let xIntersection = v1.x + TX * (y - v1.y);
        intersections.push(xIntersection);
      }
    }

    // Ordene as interseções por coordenada X
    intersections.sort((a, b) => a - b);

    // Preencha entre pares de interseções
    for (let i = 0; i < intersections.length; i += 2) {
      let xStart = intersections[i];
      let xEnd = intersections[i + 1];

      // Desenhe a linha horizontal entre xStart e xEnd
      for (let x = xStart; x <= xEnd; x++) {
        point(x, y); // Aqui você desenha os pontos (pixels) entre as interseções
        stroke(...(polygon.selected ? [0, 0, 240] : polygon.color));
      }
    }
  }
}

let selectedPolygon = null; // Adiciona uma variável para armazenar o polígono selecionado

function mousePressed() {
  if (
    mouseMode == "create" &&
    mouseX >= 0 &&
    mouseX <= 500 &&
    mouseY >= 0 &&
    mouseY <= 500
  ) {
    // Quando o usuário clicar, adicionar um novo vértice
    let novoVertice = createVector(mouseX, mouseY);
    polygons[polygons.length - 1].vertices.push(novoVertice);
  }

  // Verificação do ponto no polígono
  if (mouseMode == "select" && polygons.length > 0) {
    let ponto = { x: mouseX, y: mouseY }; // Ponto onde clicou

    polygons.forEach((item) => (item.selected = false));

    const invertedList = polygons;
    // inverte o array de poligonos
    for (const polygon of invertedList.reverse()) {
      if (pointInPolygon(ponto, polygon.vertices)) {
        console.log("Ponto dentro do polígono!");
        polygon.selected = true;
        return;
      } else {
        console.log("Ponto fora do polígono!", polygon.id);
      }
    }
  }
}

function keyPressed() {
  // Pressionar a tecla 'C' limpa o polígono e reinicia os vértices
  if (key === "C" || key === "c") {
    vertices = [];
  }
}
