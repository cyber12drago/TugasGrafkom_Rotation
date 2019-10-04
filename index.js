(function(global) {

  var canvas, gl, program, shaders=[];
  var scaleX=0;
  var adder=0.0097;
  var theta= Math.PI * 0.0097;


  glUtils.SL.init({ callback:function() { main(); } });

  function main() {
    // Register Callbacks
    window.addEventListener('resize', resizer);

    // Get canvas element and check if WebGL enabled
    canvas = document.getElementById("glcanvas");
    gl = glUtils.checkWebGL(canvas);

    // Initialize the shaders and program
    var vertexShader = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex);
    var fragmentShader = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment);
    var vertexShader2 = glUtils.getShader(gl, gl.VERTEX_SHADER, glUtils.SL.Shaders.v2.vertex);
    var fragmentShader2 = glUtils.getShader(gl, gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v2.fragment);

    shaders.push(glUtils.createProgram(gl, vertexShader, fragmentShader));
    shaders.push(glUtils.createProgram(gl, vertexShader2, fragmentShader2));

    resizer();
  }
  
  // draw!
  function draw() {
   

    // Specify the color for clearing <canvas>
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    var lineVertices = new Float32Array([
      // x, y,      r, g, b
      -0.7, -0.5,   0.0,0.0,1.0,
      -0.7, +0.5,   0.0,0.0,1.0,
      -0.5, +0.0,   0.0,0.0,1.0,  
      -0.3, +0.5,   0.0,0.0,1.0,
      -0.3,-0.5,    0.0,0.0,1.0,
      -0.33,-0.5,   0.0,0.0,1.0,
      -0.33,+0.3,   0.0,0.0,1.0,
      -0.5, -0.15,  0.0,0.0,1.0,
      -0.67,+0.3,   0.0,0.0,1.0,
      -0.67,-0.5,   0.0,0.0,1.0,  
      -0.7,-0.5,    0.0,0.0,1.0
    ]);
    var trianglesVertices = new Float32Array([
      -0.5, -0.8,   0.0,0.0,1.0,
      -0.5, +0.5,   0.0,0.0,1.0,
      -0.45, +0.5,  0.0,0.0,1.0,
      -0.45, +0.5,  0.0,0.0,1.0,
      -0.5, -0.8,   0.0,0.0,1.0,
      -0.45,-0.8,   0.0,0.0,1.0,

      -0.45, +0.5,  0.0,0.0,1.0,
      -0.45, +0.35, 0.0,0.0,1.0,
      -0.2, -0.1,   0.0,0.0,1.0,
      -0.45, +0.35, 0.0,0.0,1.0,
      -0.2,-0.1,    0.0,0.0,1.0,
      -0.2,-0.15,   0.0,0.0,1.0,

     +0.05, +0.5,   0.0,0.0,1.0,
      +0.05, +0.35, 0.0,0.0,1.0,
      -0.2, -0.15,  0.0,0.0,1.0 ,
      -0.2, -0.15,  0.0,0.0,1.0 ,
      -0.2, -0.1,   0.0,0.0,1.0 ,
      +0.05, +0.5,  0.0,0.0,1.0 ,

      +0.05, +0.5,  0.0,0.0,1.0,
      +0.1, +0.5,   0.0,0.0,1.0 ,
      +0.05, -0.8,  0.0,0.0,1.0 ,
      +0.05, -0.8,  0.0,0.0,1.0 ,
      +0.1, +0.5,   0.0,0.0,1.0 ,
      +0.1, -0.8,   0.0,0.0,1.0 ,
    ]);

    function render(){
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      drawA(gl.LINE_LOOP, lineVertices, 0, shaders[0]);
      drawA(gl.TRIANGLES, trianglesVertices, 1, shaders[1]);
      requestAnimationFrame(render)    
    }
    render();
  }

  function drawA(type, vertices, mode, program) {
    var n = initBuffers(mode, vertices, program);
    if (n < 0) {
      console.log('Failed to set the positions of the vertices');
      return;
    }
    gl.drawArrays(type, 0, n);
  }

  function initBuffers(mode, vertices, program) {
    
    // The number of vertices
    var n = vertices.length / 5;
    // var n = 5;

    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return -1;
    }

    var vPosition = gl.getAttribLocation(program, 'vPosition');
    var vColor = gl.getAttribLocation(program, 'vColor');
    // Bind the buffer object to target
    // target: ARRAY_BUFFER, ELEMENT_ARRAY_BUFFER
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Write date into the buffer object
    // target, size
    // usage: STATIC_DRAW, STREAM_DRAW, DYNAMIC_DRAW
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);


    gl.vertexAttribPointer(
      vPosition,  // variabel yang memegang posisi attribute di shader
      2,          // jumlah elemen per atribut
      gl.FLOAT,   // tipe data atribut
      gl.FALSE, 
      5 * Float32Array.BYTES_PER_ELEMENT, // ukuran byte tiap vertex 
      0                                   // offset dari posisi elemen di array
    );
    gl.vertexAttribPointer(
      vColor,
      3,
      gl.FLOAT,
      gl.FALSE,
      5 * Float32Array.BYTES_PER_ELEMENT,
      2 * Float32Array.BYTES_PER_ELEMENT
    );

    gl.enableVertexAttribArray(vPosition);
    gl.enableVertexAttribArray(vColor);
    gl.useProgram(program);
    // Assign the buffer object to aPosition variable
    // https://www.khronos.org/opengles/sdk/docs/man/xhtml/glVertexAttribPointer.xml
   
    if(mode){
      var scaleLocation = gl.getUniformLocation(program, 'scaleX');
      gl.uniform1f(scaleLocation, scaleX);
      if(scaleX > 1){
        adder = -0.0097
      }
      else if(scaleX < -1){
        adder = 0.0097
      }
      scaleX += adder;
    }
    else {
      var thetaLocation = gl.getUniformLocation(program, 'theta');
      gl.uniform1f(thetaLocation, theta);
      theta += Math.PI * 0.0097;
    }
    return n;
  }

  function resizer() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    draw();
  }

})(window || this);
