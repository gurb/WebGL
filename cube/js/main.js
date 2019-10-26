document.addEventListener("DOMContentLoaded", start);

function start(){
    const canvas = document.getElementById("renderCanvas");
    var gl = canvas.getContext("webgl2");

    if(!gl){
        console.log("failed gl");
    }

    var vertices = [
        -0.5, -0.5, -0.5,
        0.5, -0.5, -0.5,
        0.5, 0.5, -0.5,
        0.5, 0.5, -0.5,
        -0.5, 0.5, -0.5,
        -0.5, -0.5, -0.5,

        -0.5, -0.5, 0.5,
        0.5, -0.5, 0.5,
        0.5, 0.5, 0.5,
        0.5, 0.5, 0.5,
        -0.5, 0.5, 0.5,
        -0.5, -0.5, 0.5,

        -0.5, 0.5, 0.5,
        -0.5, 0.5, -0.5,
        -0.5, -0.5, -0.5,
        -0.5, -0.5, -0.5,
        -0.5, -0.5, 0.5,
        -0.5, 0.5, 0.5,

        0.5, 0.5, 0.5,
        0.5, 0.5, -0.5,
        0.5, -0.5, -0.5,
        0.5, -0.5, -0.5,
        0.5, -0.5, 0.5,
        0.5, 0.5, 0.5,

        -0.5, -0.5, -0.5,
        0.5, -0.5, -0.5,
        0.5, -0.5, 0.5,
        0.5, -0.5, 0.5,
        -0.5, -0.5, 0.5,
        -0.5, -0.5, -0.5,

        -0.5, 0.5, -0.5,
        0.5, 0.5, -0.5,
        0.5, 0.5, 0.5,
        0.5, 0.5, 0.5,
        -0.5, 0.5, 0.5,
        -0.5, 0.5, -0.5,
    ];

    var vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var colors = [];
    var faceColors = [
        [1.0, 0.0, 0.0, 1.0],   // Front face
        [0.0, 1.0, 0.0, 1.0],   // back face
        [0.0, 0.0, 1.0, 1.0],   // Top face
        [1.0, 1.0, 0.0, 1.0],   // Bottom face
        [1.0, 0.0, 1.0, 1.0],   // Right face
        [0.0, 1.0, 1.0, 1.0],   // left face
    ];

    faceColors.forEach(function(color){
        for(var i=0; i<faceColors.length; i++){
            colors = colors.concat(color);
        }
    });


    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    
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
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    var colorAttributeLocation = gl.getAttribLocation(shaderProgram, "a_color");
    gl.enableVertexAttribArray(colorAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);


    gl.useProgram(shaderProgram);

    requestAnimationFrame(runRenderLoop);

    function runRenderLoop(){
        gl.clearColor(0,0,0,1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.drawArrays(gl.TRIANGLES, 0, 36);

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