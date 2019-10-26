document.addEventListener("DOMContentLoaded", start);

function start(){
    const canvas = document.getElementById("renderCanvas");
    var gl = canvas.getContext("webgl2");

    if(!gl){
        console.log("failed gl");
    }

    var triangleVertices = [
        0.0, 0.5, 0.0,
        -0.5, -0.4, 0.0,
        0.5, -0.4, 0.0
    ];

    var vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    var triangleVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

    // rgb
    var triangleColors = [
        1.0, 0.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0
    ];

    var traingleVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, traingleVertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleColors), gl.STATIC_DRAW);
    
    var triangleVerticesAndColors = [
        0.0, 0.5, 0.0, 1.0, 0.0, 0.0, 1.0,
        -0.5, -0.4, 0.0, 0.0, 1.0, 0.0, 1.0,
        0.5, -0.4, 0.0, 0.0, 0.0, 1.0, 1.0
    ];

    var triangleVertexPositionAndColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionAndColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVerticesAndColors), gl.STATIC_DRAW);

    var vertexShader = getAndCompileShader(gl, "vertexShader");
    var fragmentShader = getAndCompileShader(gl, "fragmentShader");
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    var control = gl.getProgramParameter(shaderProgram, gl.LINK_STATUS);
    if(!control){
        console.error(gl.getProgramInfoLog(shaderProgram));
        return null;
    }
    
    var positionAttributeLocation = gl.getAttribLocation(shaderProgram, "a_position");
    gl.enableVertexAttribArray(positionAttributeLocation);
    // gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    // gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, 0, 0);

    var colorAttributeLocation = gl.getAttribLocation(shaderProgram, "a_color");
    gl.enableVertexAttribArray(colorAttributeLocation);
    // gl.bindBuffer(gl.ARRAY_BUFFER, traingleVertexColorBuffer);
    // gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, 0, 0);

    const FLOAT_SIZE = 4;
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionAndColorBuffer);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 7*FLOAT_SIZE, 0);
    gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, false, 7*FLOAT_SIZE, 3*FLOAT_SIZE);

    gl.useProgram(shaderProgram);

    requestAnimationFrame(runRenderLoop);

    function runRenderLoop(){
        gl.clearColor(0,0,0,1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.drawArrays(gl.TRIANGLES, 0, 3);

        requestAnimationFrame(runRenderLoop);
    }
}

function getAndCompileShader(gl, id){
    var type;
    if(id == "vertexShader")
        type = gl.VERTEX_SHADER;
    else if(id == "fragmentShader")
        type = gl.FRAGMENT_SHADER;
    else
        return null;

    var shader;
    var shaderElement = document.getElementById(id);
    console.log(shaderElement);
    var shaderText = shaderElement.text.trim();
    console.log(shaderText);

    shader = gl.createShader(type);
    gl.shaderSource(shader, shaderText);
    gl.compileShader(shader);

    var control = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if(!control){
        console.error(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}