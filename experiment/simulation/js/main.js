window.Module = {
onRuntimeInitialized() {
document.getElementById("statusText").textContent="Ready";
document.getElementById("statusDot").style.background="#22c55e";
initApp();
}
};

function initApp(){

const imageInput=document.getElementById("imageInput");
const sobelSize=document.getElementById("sobelSize");
const lapSize=document.getElementById("lapSize");
const canny1=document.getElementById("canny1");
const canny2=document.getElementById("canny2");

const sobelVal=document.getElementById("sobelVal");
const lapVal=document.getElementById("lapVal");
const c1Val=document.getElementById("c1Val");
const c2Val=document.getElementById("c2Val");

const originalCanvas=document.getElementById("originalCanvas");
const sobelCanvas=document.getElementById("sobelCanvas");
const prewittCanvas=document.getElementById("prewittCanvas");
const lapCanvas=document.getElementById("lapCanvas");
const cannyCanvas=document.getElementById("cannyCanvas");

let gray=null;

function setProcessing(){
document.getElementById("statusText").textContent="Processing...";
document.getElementById("statusDot").style.background="#ef4444";
}
function setReady(){
document.getElementById("statusText").textContent="Ready";
document.getElementById("statusDot").style.background="#22c55e";
}

imageInput.addEventListener("change", e=>{
let img=new Image();
img.onload=()=>{
originalCanvas.width=img.width;
originalCanvas.height=img.height;
originalCanvas.getContext("2d").drawImage(img,0,0);
let mat=cv.imread(originalCanvas);
gray=new cv.Mat();
cv.cvtColor(mat,gray,cv.COLOR_RGBA2GRAY);
mat.delete();
process();
};
img.src=URL.createObjectURL(e.target.files[0]);
});

sobelSize.oninput=()=>{sobelVal.textContent=sobelSize.value;process();}
lapSize.oninput=()=>{lapVal.textContent=lapSize.value;process();}
canny1.oninput=()=>{c1Val.textContent=canny1.value;process();}
canny2.oninput=()=>{c2Val.textContent=canny2.value;process();}

function process(){
if(!gray) return;
setProcessing();

cv.imshow(originalCanvas,gray);

// Sobel
let sobelX=new cv.Mat();
let sobelY=new cv.Mat();
let sobelMag=new cv.Mat();
cv.Sobel(gray,sobelX,cv.CV_64F,1,0,parseInt(sobelSize.value));
cv.Sobel(gray,sobelY,cv.CV_64F,0,1,parseInt(sobelSize.value));
cv.magnitude(sobelX,sobelY,sobelMag);
sobelMag.convertTo(sobelMag,cv.CV_8U);
cv.imshow(sobelCanvas,sobelMag);

// Prewitt
let kernelX=cv.matFromArray(3,3,cv.CV_32F,[-1,0,1,-1,0,1,-1,0,1]);
let kernelY=cv.matFromArray(3,3,cv.CV_32F,[-1,-1,-1,0,0,0,1,1,1]);
let px=new cv.Mat();
let py=new cv.Mat();
let pMag=new cv.Mat();
cv.filter2D(gray,px,cv.CV_32F,kernelX);
cv.filter2D(gray,py,cv.CV_32F,kernelY);
cv.magnitude(px,py,pMag);
pMag.convertTo(pMag,cv.CV_8U);
cv.imshow(prewittCanvas,pMag);

// Laplacian
let lap=new cv.Mat();
cv.Laplacian(gray,lap,cv.CV_8U,parseInt(lapSize.value));
cv.imshow(lapCanvas,lap);

// Canny
let can=new cv.Mat();
cv.Canny(gray,can,parseInt(canny1.value),parseInt(canny2.value));
cv.imshow(cannyCanvas,can);

sobelX.delete(); sobelY.delete(); sobelMag.delete();
kernelX.delete(); kernelY.delete(); px.delete(); py.delete(); pMag.delete();
lap.delete(); can.delete();

setReady();
}

}
