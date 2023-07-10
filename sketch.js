//RECORDING AND PLAYBACK TOOL

//Global Variables
let mic, rec, soundFile;
let scene = 0;
let fft;
let lineHue;
let osc, env;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  //create new oscillator
  osc = new p5.Oscillator('sine');
  osc.amp(0.4); //set amplitude
  
  //set mic input to recieve incoming audio
  mic = new p5.AudioIn();
  mic.start(); //start mic
  
  // create recorder
  rec = new p5.SoundRecorder();
  // connect mic to the recorder
  rec.setInput(mic);

  // create sound file for recording playback 
  soundFile = new p5.SoundFile();

  //create FFT signal
  fft = new p5.FFT();
  //set input of FFT signal to sound file
  fft.setInput(soundFile);
  

  //set colour mode to Hue, Saturation, Brightness
  //360 represents the colour wheel
  colorMode(HSB, 360, 100, 100, 100);
}


function mousePressed() {
  
  // .enabled boolean makes sure user enabled the mic 
  if (scene === 0 && mic.enabled) {
    
    osc.freq(440); //set osc freq
    //create new env for osc
    env = new p5.Env();
    env.setADSR(0.01, 0.3, 0.1, 0.3); //attack, decay, sustain, release
    osc.start();
    env.play(osc); 
    
    //record to soundFile for playback
    rec.record(soundFile);
    scene++;
  } else if (scene === 1) {
    // stop recorder, and send the result to soundFile
    rec.stop(); 
    osc.freq(880); //set new osc freq
    env.play(osc);
    scene++;
  } else if (scene === 2) {
    soundFile.play(); // play the result!
    saveSound(soundFile, 'mySound.wav'); // save file
    scene++;
  } else if (scene === 3) {
    soundFile.stop(); //stop playing
    scene = 0; //reset 
  }
}

function draw() {
  background(0, 15); //create fade background
  //get amolitude level of mic
  let amp = mic.getLevel();
  //get waveform from fft signal
  let waveform = fft.waveform();
  
  //create new class for all graphics
  let graphics = new GraphicsClass(amp, waveform);
  
  if (scene === 0) {
    textSize(16);
    text('click to record', 30, 40);
    fill(200);
    graphics.noInput(); //neutral graphics state
  } else if (scene === 1) {
    textSize(16);
    text('recording. click to stop', 30, 60);
    fill(200);
    graphics.ampRec(); //recording graphics measure amplitude
  } else if (scene === 2) {
    textSize(16);
    text('recording stopped. click to save and play', 30, 80);
   graphics.noInput(); //neutral graphics state
    fill(200);
  } else if (scene === 3) {
    textSize(16);
    text('playing back. click to stop and reset', 30, 60);
    fill(200);
    graphics.fftPlayback(); //playback graphics use fft
 } 
}

  

  

 class GraphicsClass {
   constructor (a, w) { //amplitude, waveform
     this.a = a;
     this.w = w;
   }
   
   ampRec() { //recording state graphics
     
     translate(width / 2, height / 2); //from the middle of the screen
     rotate(frameCount * 0.01); //rotate at a slow speed
     //iterate through i for duration of fft waveform length
     for (this.i = 0; this.i < this.w.length; this.i++) {
       push(); //start new drawing state
       rotate(radians(this.i)); //rotate by radians angle i
       this.maxDist = map(this.i, 0, this.w.length, 10, width / 2); //map maximum distance using i from 0, waveform length, to 10, width/2 
       //y axis for line
       this.y = map(this.a, -1, 1, 0, this.maxDist); //map using amplitude from -1, 1 to 0, maximum distance
       
       //draw rotating white line
       if(this.a < 0.5) { //if amplitude less than 0.5
         lineHue = map(this.a, 0, 1, 100, 15); //hue mapped from green to orange
       } if (this.a >= 0.5) { //if amplitude greater than 0.5
         lineHue = map(this.a, 0, 1, 15, 0); //hue mapped from orange to red
       }
 
       strokeWeight(4);
       stroke(lineHue, 100, 100, 10); //hue, saturation, brightness, alpha
       line(0, 0, 0, this.y); //from centre to y axis
       noStroke();
       //Hue, Saturation, Brightness
       fill(0, 0, 0); //black
       ellipse(0, this.y, 2, 2); //following y axis with line
       pop(); //reestore original state
     }
   }
   
    fftPlayback() {
      //similar to amprec()
      
      translate(width / 2, height / 2);
      rotate(frameCount * 0.01);
      
      for (this.i = 0; this.i < this.w.length; this.i++) {
        push();
        rotate(radians(this.i));
        this.maxDist = map(this.i, 0, this.w.length, 10, width / 2);
        this.y = map(this.w[this.i], -1, 1, 0, this.maxDist); //map y axis to waveform at position i
       
       stroke(0, 0, 100, 10);
       line(0, 0, 0, this.y);

       //map waveform at pos i to hue variables between 0 and 360
       this.hue = map(this.w[this.i], -1, 1, 0, 360);
       noStroke();
      //Hue, Saturation, Brightness
       fill(int(this.hue), 100, 100); //changing gue for new colours
       ellipse(0, this.y, 2, 2);
       pop();
   }
 } 
   
   noInput() {
     //similar to amprec()
     
      translate(width / 2, height / 2);
      rotate(frameCount * 0.01);
      
      for (this.i = 0; this.i < this.w.length; this.i++) {
        push();
        rotate(radians(this.i));
        this.maxDist = map(this.i, 0, this.w.length, 10, width / 2);
        this.y = map(this.w[this.i], -1, 1, 0, this.maxDist);
       
       stroke(0, 0, 100, 10); //no change in stroke colour
       line(0, 0, 0, this.y);

       noStroke();
      //Hue, Saturation, Brightness
       fill(0, 0, 100); //white
       ellipse(0, this.y, 2, 2);
       pop();
    }
  }
}
  




  
