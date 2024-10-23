let vertices = [];
let polygons = [];
let mouseMode = "select";
let openButton = document.querySelector("#openButton");
let colorMode = "unselect";
let colorButton = document.querySelector("#openButton");

function setup() {
  var cnv = createCanvas(500, 400);
  cnv.style("display", "block");
  cnv.parent("sketch-holder");
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
    });
  }
}

function colorEdge() {
  if (colorMode == "selectcolor") {
    colorMode = "unselect";
    document.getElementById("colorEdge").innerHTML = "Color Edge";
  } else {
    colorMode = "selectcolor";
    document.getElementById("colorEdge").innerHTML = "Uncolor Edge";
  }
}

function removepoli() {
  if (selectedPolygon) {
    // Encontra o índice do polígono selecionado no array de polígonos
    const index = polygons.indexOf(selectedPolygon);
    // garante que index não é -1
    if (index > -1) {
      polygons.splice(index, 1);
    }
    selectedPolygon = null;
    updatePolygonList();
  }
}

function updatePolygonList() {
  const polygonsItens = polygons.map(
    (polygon) =>
      `<li>Polígono ${polygon.id} - Cor: ${JSON.stringify(polygon.color)} - Vértices: ${JSON.stringify(polygon.vertices.map(({ x, y }) => ({ x, y })))} </li>`,
  );

  document.getElementById("polygons").innerHTML = polygonsItens.join(" ");
}

function cleanList() {
  polygons = [];

  clear();

  document.getElementById("polygons").innerHTML = "";
}

function draw() {
  background(220);

  for (const item of polygons) {
    fillPolygon(item);

    if (colorMode == "selectcolor") {
      stroke(255, 255, 0); // Linhas amarelas no modo de seleção
    }
    strokeWeight(2);

    // Desenha as linhas do polígono
    for (let i = 0; i < item.vertices.length; i++) {
      let v1 = item.vertices[i];
      let v2 = item.vertices[(i + 1) % item.vertices.length]; // Conecta o último vértice ao primeiro

      line(v1.x, v1.y, v2.x, v2.y); // Traça a linha entre dois vértices
    }
  }
}

function colorSelected() {
  const colorPicker = document.getElementById("colorPicker");

  if (selectedPolygon) {
    // Atualiza a cor do polígono selecionado com a cor escolhida
    selectedPolygon.color = hexToRgb(colorPicker.value);

    selectedPolygon = false;
    console.log(
      `Cor do polígono ${selectedPolygon.id} alterada para: ${colorPicker.value}`,
    );
  } else {
    console.log("Nenhum polígono selecionado.");
  }
}

function hexToRgb(hex) {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function pointInPolygon(point, polygon) {
  const { x, y } = point;
  let crossings = 0;

  if (mouseX >= 0 && mouseX <= 500 && mouseY >= 0 && mouseY <= 400) {
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
}

function recalculateIntersections(polygon) {
  polygon.intersections = [];

  // Loop pelos vértices do polígono para calcular as interseções
  for (let vertice = 0; vertice < polygon.vertices.length; vertice++) {
    let { x: x1, y: y1 } = polygon.vertices[vertice];
    let { x: x2, y: y2 } =
      polygon.vertices[(vertice + 1) % polygon.vertices.length];

    if (y1 !== y2) {
      if (y1 > y2) {
        // Se y1 for maior que y2, inverte os pontos
        [x1, y1, x2, y2] = [x2, y2, x1, y1];
      }

      let tx = (x2 - x1) / (y2 - y1); // Taxa de variação de x em função de y

      // Calcula as interseções para cada linha y entre y1 e y2
      while (y1 <= y2) {
        if (!polygon.intersections[y1]) {
          polygon.intersections[y1] = [];
        }

        polygon.intersections[y1].push(x1);
        x1 += tx; // Atualiza x de acordo com a taxa
        y1++; // Incrementa o valor de y
      }
    }
  }
}

function fillPolygon(polygon) {
  // Preenche o polígono usando as interseções calculadas anteriormente
  for (let y in polygon.intersections) {
    let xs = polygon.intersections[y];
    xs.sort((a, b) => a - b);

    for (let i = 0; i < xs.length; i += 2) {
      let xStart = xs[i];
      let xEnd = xs[i + 1];

      for (let x = xStart; x <= xEnd; x++) {
        point(x, y); // Desenha o ponto (pixel)
        stroke(
          ...(selectedPolygon && selectedPolygon.id == polygon.id
            ? [0, 0, 240]
            : polygon.color),
        );
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
    mouseY <= 400
  ) {
    // Quando o usuário clicar, adicionar um novo vértice
    let novoVertice = createVector(mouseX, mouseY);
    polygons[polygons.length - 1].vertices.push(novoVertice);
    recalculateIntersections(polygons[polygons.length - 1]);
  }

  // Verificação do ponto no polígono
  if (
    mouseMode == "select" &&
    polygons.length > 0 &&
    mouseX >= 0 &&
    mouseX <= 500 &&
    mouseY >= 0 &&
    mouseY <= 400
  ) {
    selectedPolygon = null;
    let ponto = { x: mouseX, y: mouseY }; // Ponto onde clicou

    const invertedList = polygons;
    // inverte o array de poligonos
    for (const polygon of invertedList.reverse()) {
      if (pointInPolygon(ponto, polygon.vertices)) {
        console.log("Ponto dentro do polígono!");
        selectedPolygon = polygon; // Armazena o polígono selecionado
        return;
      } else {
        console.log("Ponto fora do polígono!", polygon.id);
      }
    }
  }
}
