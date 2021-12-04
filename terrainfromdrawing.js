var canvas = document.querySelector('.drawCanvas');
var shapeContainer = document.querySelector('#shapeContainer');
var exportButton = document.getElementById('export');
var heightInput = document.getElementById('heightValue');
var zInput = document.getElementById('zValue');
var objectNameInput = document.getElementById('objectName');

// Define tools

var undoButton = document.getElementById('undo');
var drawButton = document.getElementById('draw');
var moveButton = document.getElementById('move');
var eraseButton = document.getElementById('erase');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var ctx = canvas.getContext('2d');

var startingPos = { x: 0, y: 0 };
var endingPos = { x: 0, y: 0 };
var objectHeight;
var zOrigin;
var isMouseDown = false;
var objectCoordinate = [];
var objectName;

document.addEventListener('mousedown', setStartingPosition);
document.addEventListener('mouseup', setEndingPosition);
// document.addEventListener('mousemove', displayPath);


function handleMouseEvents(){
  
}

// new position from mouse event
function setStartingPosition(e) {
  startingPos.x = e.clientX;
  startingPos.y = e.clientY;
  isMouseDown = true;
}

function setEndingPosition(e) {
    endingPos.x = e.clientX;
    endingPos.y = e.clientY;
    isMouseDown = false;
    draw(e);
  }
  
function draw(e) {

  var width = endingPos.x - startingPos.x;
  var height = endingPos.y - startingPos.y;

  // ctx.lineWidth = 5;
  // ctx.strokeStyle = document.getElementById("colorpick").value; ;

  // ctx.strokeRect(startingPos.x,startingPos.y,width,height);

  var newShape = document.createElement("div");

  newShape.style.border = "5px solid black";
  newShape.style.position = "absolute";
  newShape.style.boxSizing = "border-box";


  if (width<0){
    newShape.style.left = endingPos.x + "px";
    width *= -1;
    console.log("width was negative and is now " + width);
    newShape.style.width = width + "px";
    var temp = startingPos.x;
    startingPos.x = endingPos.x;
    endingPos.x = temp;
    

  } else {
    console.log("width was positive and is now " + width);
    newShape.style.left = startingPos.x + "px";
    newShape.style.width = width + "px";
  }

  if (height<0){
    newShape.style.top = endingPos.y + "px";
    height *= -1;
    console.log("height was negative and is now " + height);
    newShape.style.height = height + "px";
    var temp = startingPos.y;
    startingPos.y = endingPos.y;
    endingPos.y = temp;

  } else {
    console.log("width was positive and is now " + width);
    newShape.style.top = startingPos.y + "px";
    newShape.style.height = height + "px";
  }



  shapeContainer.appendChild(newShape);

  objectHeight = heightInput.value;
  zOrigin = zInput.value;
  objectName = objectNameInput.value;
  objectCoordinate.push([startingPos.x, startingPos.y, endingPos.x, endingPos.y, objectHeight, zOrigin, objectName])
  
  console.log(objectCoordinate);
}

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

// Start file download.
exportButton.addEventListener("click", function(){

  // Create structure for OBJ file
  var fileText = [];
  var currentObjectCount = 0;
  // Get vertex coords for each rectangle
  objectCoordinate.forEach(element => {
    var directionX;
    var directionY;
    var xOperator;
    var yOperator;
    // starting pos
    var vertX1 = element[0];
    var vertY1 = element[1];

    // ending pos
    var vertX3 = element[2];
    var vertY3 = element[3];

    var vertX2 = vertX3;
    var vertY2 = vertY1;

    var vertX4 = vertX1;
    var vertY4 = vertY3;
    
    // object height
    var heightZ = element[4];

    // object Z origin
    var zStart = element[5];
    var offsetZ = parseInt(heightZ) + parseInt(zStart);

    // get name
    if(element[6] !== ""){
      fileText.push("o " + element[6]);
    }


    console.log("vertice 1 : " + vertX1 + "," + vertY1 + "vertice 2 : " + vertX2 + "," + vertY2 + "vertice 3 : " + vertX3 + "," + vertY3 + "vertice 4 : " + vertX4 + "," + vertY4);

    var vertex1 = "v " + vertX1 + " " + vertY1 + " " + zStart;
    var vertex2 = "v " + vertX2 + " " + vertY2 + " " + zStart;
    var vertex3 = "v " + vertX3 + " " + vertY3 + " " + zStart;
    var vertex4 = "v " + vertX4 + " " + vertY4 + " " + zStart;
    var vertex5 = "v " + vertX1 + " " + vertY1 + " " + offsetZ;
    var vertex6 = "v " + vertX2 + " " + vertY2 + " " + offsetZ;
    var vertex7 = "v " + vertX3 + " " + vertY3 + " " + offsetZ;
    var vertex8 = "v " + vertX4 + " " + vertY4 + " " + offsetZ;
    fileText.push(vertex1, vertex2, vertex3, vertex4, vertex5, vertex6, vertex7, vertex8);

    var faceOrder = 8 * currentObjectCount;
    var face1 = "f " + (1 + faceOrder) + " " + (5 + faceOrder) + " " + (6 + faceOrder) + " " + (2 + faceOrder);
    var face2 = "f " + (2 + faceOrder) + " " + (6 + faceOrder) + " " + (7 + faceOrder) + " " + (3 + faceOrder);
    var face3 = "f " + (3 + faceOrder) + " " + (7 + faceOrder) + " " + (8 + faceOrder) + " " + (4 + faceOrder);
    var face4 = "f " + (4 + faceOrder) + " " + (8 + faceOrder) + " " + (5 + faceOrder) + " " + (1 + faceOrder);
    var face5 = "f " + (1 + faceOrder) + " " + (2 + faceOrder) + " " + (3 + faceOrder) + " " + (4 + faceOrder);
    var face6 = "f " + (5 + faceOrder) + " " + (6 + faceOrder) + " " + (7 + faceOrder) + " " + (8 + faceOrder);
    fileText.push(face1, face2, face3, face4, face5, face6);

    currentObjectCount++;
    
    // function makeVertices(){

    // }

    // switch(vertX4>vertX1){
    //   case true:
    //     directionX = "right";
    //     xOperator = '+';
    //     var vertX2 = vertX1 + vertX4;
    //     var vertX3 = vertX1;
    //     break;
    //   case false:
    //     directionX = "left";
    //     xOperator = '-';
    //     var vertX2 = element[0];

    //     break;
    // }
    // switch(vertY4>vertY1){
    //   case true:
    //     directionY = "down";
    //     yOperator = '-';
    //     break;
    //   case false:
    //     directionY = "up";
    //     yOperator = '+';
    //     break;
    // }

    // console.log(element + " is pointing " + directionX + " and " + directionY)

  });
  download("export.obj",fileText.join('\r\n'))
})

