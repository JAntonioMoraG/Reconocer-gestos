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
		indice_rotate=landmarks[8].x*100-landmarks[9].x*100;
        indice_medio_dist=landmarks[11].x*100 - landmarks[8].x*100;
        indice_angle=-1*(landmarks[8].y*100-landmarks[7].y*100); // >4 ok 
		anular_medio_dist=landmarks[12].x*100-landmarks[16].x*100;
		menique_anular_dist=landmarks[15].x*100-landmarks[20].x*100;
		pulgar_indice_dist=landmarks[4].x*100-landmarks[6].x*100;
		pulgar_nudillos_dist=landmarks[2].x*100-landmarks[5].x*100;
		indice_medio_8=landmarks[8].x*100-landmarks[12].x*100;
		mano_volteada=landmarks[8].y*100-landmarks[12].y*100;
		console.log(mano_volteada);
		if(mano_volteada<-6){
			mano_state="horizontal";
		}
		if(mano_volteada>-4){
			mano_state="vertical";
		}
		if(indice_medio_8>8){
			ocho_state="separados";
		}
		if(indice_medio_8<7){
			ocho_state="juntos";
		}
		if(pulgar_nudillos_dist>4){
			pulgar_nudillos_state="separados";
		}
		if(pulgar_nudillos_dist<4){
			pulgar_nudillos_state="juntos";
		}
		if(pulgar_indice_dist>10){
			pulgar_indice_state="separados";
		}
		if(pulgar_indice_dist<10){
			pulgar_indice_state="juntos";
		}
		if(menique_anular_dist>9){
			menique_anular_state="separados";
		}
		if(menique_anular_dist<4){
			menique_anular_state="juntos";
		}
		if(anular_medio_dist>8){
			anular_medio_dist_state="separados"
		}
		if(anular_medio_dist<8){
			anular_medio_dist_state="juntos"
		}
		if(indice_rotate>0){
			indice_rotate_state="reverso";
		}
		if(indice_rotate<0){
			indice_rotate_state="frente";
		}
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
		if (pulgar_state=="abajo" && indice_state=="arriba" && medio_state=="abajo" && anular_state=="abajo" && menique_state=="abajo" && indice_rotate_state=="reverso"){
            canvasCtx3.font = "bold 90px Arial";
            canvasCtx3.fillStyle = "green";
            canvasCtx3.fillText("1", 20, 100);
        }
        if (mano_volteada>0 && pulgar_state=="abajo" && indice_state=="arriba" && medio_state=="arriba" && anular_state=="abajo" && menique_state=="abajo" && indice_medio_dist_state=="abierto" && indice_angle_state=="ok"){
            canvasCtx3.font = "bold 90px Arial";
            canvasCtx3.fillStyle = "green";
            canvasCtx3.fillText("2", 20, 100);
        }
		if (pulgar_state=="abajo" && indice_state=="arriba" && medio_state=="arriba" && anular_state=="arriba" && menique_state=="abajo" && indice_medio_dist_state=="abierto" && indice_angle_state=="ok" && anular_medio_dist_state=="separados"){
            canvasCtx3.font = "bold 90px Arial";
            canvasCtx3.fillStyle = "green";
            canvasCtx3.fillText("3", 20, 100);
        }
		if (pulgar_state=="abajo" && indice_state=="arriba" && medio_state=="arriba" && anular_state=="arriba" && menique_state=="arriba" && indice_medio_dist_state=="abierto" && indice_angle_state=="ok" && anular_medio_dist_state=="separados" && menique_anular_state=="separados"){
            canvasCtx3.font = "bold 90px Arial";
            canvasCtx3.fillStyle = "green";
            canvasCtx3.fillText("4", 20, 100);
        }
		if (pulgar_state=="arriba" && indice_state=="arriba" && medio_state=="arriba" && anular_state=="arriba" && menique_state=="arriba" && indice_medio_dist_state=="abierto" && indice_angle_state=="ok" && anular_medio_dist_state=="separados" && menique_anular_state=="separados" && pulgar_indice_state=="separados"){
            canvasCtx3.font = "bold 90px Arial";
            canvasCtx3.fillStyle = "green";
            canvasCtx3.fillText("5", 20, 100);
        }
		if (pulgar_state=="arriba" && indice_state=="abajo" && medio_state=="abajo" && anular_state=="abajo" && menique_state=="abajo" && pulgar_nudillos_state=="separados" ){
            canvasCtx3.font = "bold 90px Arial";
            canvasCtx3.fillStyle = "green";
            canvasCtx3.fillText("6", 20, 100);
        }
		if (pulgar_state=="arriba" && indice_state=="arriba" && medio_state=="abajo" && anular_state=="abajo" && menique_state=="abajo"){
            canvasCtx3.font = "bold 90px Arial";
            canvasCtx3.fillStyle = "green";
            canvasCtx3.fillText("7", 20, 100);
        }
		if (pulgar_state=="arriba" && indice_state=="arriba" && medio_state=="arriba" && anular_state=="abajo" && menique_state=="abajo" && ocho_state=="separados" && mano_state=="horizontal"){
            canvasCtx3.font = "bold 90px Arial";
            canvasCtx3.fillStyle = "green";
            canvasCtx3.fillText("8", 20, 100);
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