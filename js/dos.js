const video3 = document.getElementsByClassName('input_video3')[0];
const out3 = document.getElementsByClassName('output3')[0];
const controlsElement3 = document.getElementsByClassName('control3')[0];
const canvasCtx3 = out3.getContext('2d');
const fpsControl = new FPS();
const spinner = document.querySelector('.loading');
spinner.ontransitionend = () => {
  spinner.style.display = 'none';
};

function onResultsHands(results) {


  document.body.classList.add('loaded');
  fpsControl.tick();
  canvasCtx3.save();
  canvasCtx3.clearRect(0, 0, out3.width, out3.height);
  canvasCtx3.drawImage(
      results.image, 0, 0, out3.width, out3.height);
  if (results.multiHandLandmarks && results.multiHandedness) {
    for (let index = 0; index < results.multiHandLandmarks.length; index++) {
      const classification = results.multiHandedness[index];
      const isRightHand = classification.label === 'Right';
      const landmarks = results.multiHandLandmarks[index];
      if(isRightHand==false){
        canvasCtx3.font = "BOLD 45px Arial";
        canvasCtx3.fillStyle = "red";
        canvasCtx3.fillText("MANO INCORRECTA", 10, 100);
        break;
      }
      else{
        drawConnectors(
            canvasCtx3, landmarks, HAND_CONNECTIONS,
            {color: isRightHand ? '#00FF00' : '#FF0000'}),
        drawLandmarks(canvasCtx3, landmarks, {
          color: isRightHand ? '#00FF00' : '#FF0000',
          fillColor: isRightHand ? '#FF0000' : '#00FF00',
          radius: (x) => {
            return lerp(x.from.z, -0.15, .1, 5, .5);
          }
        });
       
        pulgar_dist=landmarks[4].x*100-landmarks[9].x*100;
        indice_dist=landmarks[8].y*100-landmarks[6].y*100;
        medio_dist=landmarks[12].y*100-landmarks[11].y*100;
        anular_dist=landmarks[16].y*100-landmarks[15].y*100;
        menique_dist=landmarks[20].y*100-landmarks[19].y*100;
        indice_medio_dist=landmarks[11].x*100 - landmarks[8].x*100;
        indice_angle=-1*(landmarks[8].y*100-landmarks[7].y*100); // >4 ok 
		console.log(indice_angle)
        if(indice_angle>3.20){
            indice_angle_state="ok";
        }
        else{
            indice_angle_state= "no";
        }
        if(indice_medio_dist<-5){
            indice_medio_dist_state="abierto";
        }
        else{
            indice_medio_dist_state="cerrado";
        }
        if(pulgar_dist>7.5){
            pulgar_state="arriba";    
        }
        else{
            pulgar_state="abajo";
        }
        if(indice_dist<0){
            indice_state="arriba";
        }
        else{
            indice_state="abajo";
        }
        if(medio_dist<0){
            medio_state="arriba";
        }
        else{
            medio_state="abajo";
        }
        if(anular_dist<0){
            anular_state="arriba";
        }
        else{
            anular_state="abajo";
        }
        if(menique_dist<0){
            menique_state="arriba"
        }
        else{
            menique_state="abajo"
        }
        if (pulgar_state=="abajo" && indice_state=="arriba" && medio_state=="arriba" && anular_state=="abajo" && menique_state=="abajo" && indice_medio_dist_state=="abierto" && indice_angle_state=="ok"){
            console.log("CORRECTO");
            canvasCtx3.font = "bold 60px Arial";
            canvasCtx3.fillStyle = "green";
            canvasCtx3.fillText("CORRECTO", 0, 50);
        }
        else{
            console.log("INCORRECTO")
            canvasCtx3.font = "BOLD 60px Arial";
            canvasCtx3.fillStyle = "red";
            canvasCtx3.fillText("INCORRECTO", 0, 50);
        }
    }
    }
  }
  canvasCtx3.restore();
}

const hands = new Hands({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.1/${file}`;
}});
hands.onResults(onResultsHands);

const camera = new Camera(video3, {
  onFrame: async () => {
    await hands.send({image: video3});
  },
  width: 150,
  height: 150
});
camera.start();

new ControlPanel(controlsElement3, {
      selfieMode: true,
      maxNumHands: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    })
    .add([
      new StaticText({title: 'MediaPipe Hands'}),
      fpsControl,
      new Toggle({title: 'Selfie Mode', field: 'selfieMode'}),
      new Slider(
          {title: 'Max Number of Hands', field: 'maxNumHands', range: [1, 4], step: 1}),
      new Slider({
        title: 'Min Detection Confidence',
        field: 'minDetectionConfidence',
        range: [0, 1],
        step: 0.01
      }),
      new Slider({
        title: 'Min Tracking Confidence',
        field: 'minTrackingConfidence',
        range: [0, 1],
        step: 0.01
      }),
    ])
    .on(options => {
      video3.classList.toggle('selfie', options.selfieMode);
      hands.setOptions(options);
    });
