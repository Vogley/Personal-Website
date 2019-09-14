window.onload = function() {
  
  var file = document.getElementById("thefile");
  var audio = document.getElementById("audio");

  file.onchange = function() {
    var files = this.files;
    audio.src = URL.createObjectURL(files[0]);
    audio.load();
    audio.play();
    var context = new AudioContext();
    var src = context.createMediaElementSource(audio);
    var analyser = context.createAnalyser();
  
    var canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext("2d");
  
    src.connect(analyser);
    analyser.connect(context.destination);
  
    analyser.fftSize = 256*2;
  
    var bufferLength = analyser.frequencyBinCount;
  
    var dataArray = new Uint8Array(bufferLength);
  
    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;
  
    var barWidth = (WIDTH / bufferLength) * 1.2;
    var barHeight;
    var x = 0;
  
    function renderFrame() {
      requestAnimationFrame(renderFrame);
  
      x = 0;
  
      analyser.getByteFrequencyData(dataArray);
  

      /* Drawing Visualizer */
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
  
      for (var i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];
          
        var r = barHeight + (25 * (i/bufferLength));
        var g = 250 * (i/bufferLength);
        var b = 50;
  
        ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
        ctx.fillRect(x, 0, barWidth, barHeight);
  
        x += barWidth + 1;
      }
    }
  
    audio.play();
    renderFrame();
  };
};



var micOn = false;
var sample;
function micInput(){
  /* Change Color */
  var micBtn = document.getElementById("microphone");
  if(micOn){
    micBtn.style.backgroundColor = "#FFFFFF";
    micOn = !micOn;
  }
  else{
    micBtn.style.backgroundColor = "#7d7d7d";
    micOn = !micOn;

  

    // Start off by initializing a new context.
    var context = new (window.AudioContext || window.webkitAudioContext)();

    if (!context.createGain)
      context.createGain = context.createGainNode;
    if (!context.createDelay)
      context.createDelay = context.createDelayNode;
    if (!context.createScriptProcessor)
      context.createScriptProcessor = context.createJavaScriptNode;


    // shim layer with setTimeout fallback
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame    || 
        window.oRequestAnimationFrame      || 
        window.msRequestAnimationFrame     || 
        function( callback ){
        window.setTimeout(callback, 1000 / 60);
      };
    })();
    
    /* Setup Microphone Class */
    navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
    
    function MicrophoneSample() {
      this.WIDTH = window.innerWidth;
      this.HEIGHT = window.innerHeight;
      this.getMicrophoneInput();
      this.canvas = document.querySelector('canvas');
    }

    /* Audio Input */
    MicrophoneSample.prototype.getMicrophoneInput = function() {
      // TODO(smus): Remove this ugliness.
      var isLocalhost = window.location.hostname == 'localhost' || window.location.hostname == '127.0.0.1';
      /*if (window.location.protocol != 'https:' && !isLocalhost) {
        alert('HTTPS is required for microphone access, and this site has no SSL cert yet. Sorry!');
      }*/
      navigator.getUserMedia({ audio: true }, this.onStream.bind(this), this.onStreamError.bind(this));
    }

      /* Stream Audio */
    MicrophoneSample.prototype.onStream = function(stream) {
      var input = context.createMediaStreamSource(stream);
      var filter = context.createBiquadFilter();
      filter.frequency.value = 20000.0;
      filter.type = filter.NOTCH;
      filter.Q = 10.0;
      var analyser = context.createAnalyser();
      analyser.fftSize = 256*8;
      // Connect graph.
      input.connect(filter);
      filter.connect(analyser);
      this.analyser = analyser;
      // Setup a timer to visualize some stuff.
      requestAnimFrame(this.visualize.bind(this));
    }

    MicrophoneSample.prototype.onStreamError = function(e) {
      console.error('Error getting microphone', e);
    }

    /********* Visualization  Attempt #1 *********/
    MicrophoneSample.prototype.visualize = function() {
      this.canvas.width = this.WIDTH;
      this.canvas.height = this.HEIGHT;
      var ctx = this.canvas.getContext('2d');

      var bufferLength = this.analyser.frequencyBinCount;
      var dataArray = new Uint8Array(bufferLength);
      this.analyser.getByteFrequencyData(dataArray);
      x = 0;

      /* Drawing Visualizer */
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);
      var barWidth = (this.WIDTH / bufferLength) * 1.2;
      var barHeight;
    
      for (var i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];
            
        var r = barHeight + (25 * (i/bufferLength));
        var g = 250 * (i/bufferLength);
        var b = 50;
    
        ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
        ctx.fillRect(x, 0, barWidth, barHeight);
    
        x += barWidth + 1;
      }
      if(micOn)
        requestAnimFrame(this.visualize.bind(this));
      else {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);
      }

    }


    /********* Visualization  Attempt #2 *********
    MicrophoneSample.prototype.visualize = function() {
      this.canvas.width = this.WIDTH;
      this.canvas.height = this.HEIGHT;
      var ctx = this.canvas.getContext('2d');

      var bufferLength = this.analyser.frequencyBinCount;
      var dataArray = new Uint8Array(bufferLength);
      this.analyser.getByteFrequencyData(dataArray);

      /* Drawing Visualizer *
      var barWidth = this.WIDTH -10;
      var maxVal = 0;
    
      for (var i = 0; i < 256; i++) {
        if(dataArray[i] > dataArray[maxVal])
          maxVal = i;
      }

      console.log(maxVal);


      var r = dataArray[maxVal] + 25 * ((maxVal%26)/25);
      var g = 250 * ((maxVal%26)/25);
      var b = 50;
    
    
      ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
      ctx.fillRect(5, 0, barWidth, dataArray[maxVal]);


      requestAnimFrame(this.visualize.bind(this));
    }*/



    sample = new MicrophoneSample();
  }
}
