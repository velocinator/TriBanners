/* global direction */

debug = true;
var mainCanvas = document.querySelector("#bannerCanvas");
var mainContext = mainCanvas.getContext("2d");

var canvasWidth = mainCanvas.width;
var canvasHeight = mainCanvas.height;

var angle = 0;

var requestAnimationFrame = window.requestAnimationFrame || 
                            window.mozRequestAnimationFrame || 
                            window.webkitRequestAnimationFrame || 
                            window.msRequestAnimationFrame;
var sprite = new Sprite('assets/animations/spritesheet.png', {
  frameW: 404,
  frameH: 537,
  projectedW: 150,
  projectedH: 200,
  postInitCallback: function() { // Runs when the sprite is ready.
    // Start animating.
    sprite.startLoop();
  }
});
function PollSubscribers(){
    var currDT = new Date();
    var currDTJ = currDT.toJSON();
    var JSONRequest = new XMLHttpRequest();
    JSONRequest.open('GET', 'https://api.twitch.tv/kraken/channels/velocinator/follows?offset=0&api_version=3', true);
    JSONRequest.onreadystatechange = function(){
        if (this.readyState === 4) {
            if (this.status >= 200 && this.status < 400) {
                // Success!
                var parse = JSON.parse(this.responseText);
                var string = JSON.stringify(this.responseText);
                if(localStorage.getItem('prevJSON')){
                    //console.log(localStorage.getItem('prevJSON'));
                    if(localStorage.getItem('prevJSON') !== string){
                        console.log("New Sub!");
                        OperateBanner("sub",0,parse.follows[0].user.display_name);
                        localStorage.setItem('prevJSON', string);
                    }else{
                        console.log("No new subs... let's try again.");
                    }
                }else{
                    //interesting... prevJSON's localStorage hasn't been set. time to set it!
                    localStorage.setItem('prevJSON', string);
                }
                } else {
                    // Error :(
                    }
                }
            };
            JSONRequest.send();
            JSONRequest = null;
}

function PollDonations(){
    
}
//the main function
function main(){
    setInterval(PollSubscribers, 1000);
}


//manages what banner to show/what sound to play
function OperateBanner(style,dickSize,homie){
    if(style === "sub"){
        drawYosh();
        //if it's a new subscriber...
        if(dickSize === 0){
        drawWelcomeSubText(homie);
        //if(!debug){
        var subAudio = document.createElement('audio');
        subAudio.setAttribute('src', 'assets/songs/subsong.ogg');
        subAudio.play();
        subAudio.addEventListener('ended', destroyCanvasElements);
        //}
    }else{
        //huh... the Dicksize is greater than 0... must be a resub!
        drawReSubText(homie, dickSize);
        var reSubAudio = document.createElement('audio');
        reSubAudio.setAttribute('src', 'assets/songs/resub.ogg');
        reSubAudio.play();
        reSubAudio.addEventListener('ended', destroyCanvasElements);
    }
}else if(style === "donate"){
    if(dickSize >= 4.20){
        drawYosh();
        drawDonationText(homie,dickSize);
        if(dickSize >= 10.00){
            var bigDonation = document.createElement('audio');
            bigDonation.setAttribute('src', 'assets/songs/bigdonate.ogg');
            bigDonation.play();
            bigDonation.addEventListener('ended', destroyCanvasElements);
        }else{
        var smallDonation = document.createElement('audio');
        smallDonation.setAttribute('src', 'assets/songs/donate.ogg');
        smallDonation.play();
        smallDonation.addEventListener('ended', destroyCanvasElements);
    }
    }else{
        console.log("You recieved a donation, but it's less than the minimum value of 4.20...");
    }
}else{
    if(debug !== 1){
    alert("YOU SOMEHOW BROKE IT!!! CONTACT VELOCINATOR");
    }
}
}

function drawYosh(){
    mainContext.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // color in the background
    mainContext.fillStyle = "#00ff00";
    mainContext.fillRect(0, 0, canvasWidth, canvasHeight);
     
    // draw the circle
    mainContext.beginPath();
     
    var radius = 86;
    mainContext.arc(100, 100, radius, 0, Math.PI * 2, false);
    mainContext.closePath();
     
    // color in the circle
    mainContext.fillStyle = "#006699";
    mainContext.fill();
    
    mainContext.font="20px Georgia";

    sprite.draw(mainContext, 35, 0);
}

function drawWelcomeSubText(homie){
    mainContext.font = '24pt Arial Black';
    mainContext.fillStyle = 'black';
    mainContext.fillText("Welcome New Sub", 200, 50);
    
    mainContext.font = '30pt Impact';
    mainContext.fillStyle = 'black';
    mainContext.fillText(homie, 300, 120);
}
function drawReSubText(homie,dickSize){
    mainContext.font = '13pt Arial Black';
    mainContext.fillStyle = 'black';
    mainContext.fillText("THANKS FOR SUBSCRIBING", 200, 50);
    if(dickSize >=10){
    mainContext.font = '43pt Arial Black';
}else{
    mainContext.font = '69pt Arial Black';
}
    mainContext.fillStyle = 'black';
    mainContext.fillText(dickSize, 200, 125);
    
    mainContext.font = '18pt Arial Black';
    mainContext.fillStyle = 'black';
    mainContext.fillText("MONTHS IN A ROW", 280, 120);
    
    mainContext.font = '30pt Impact';
    mainContext.fillStyle = 'black';
    mainContext.fillText(homie+"!", 300, 165);
}
function drawDonationText(homie,dickSize){
    mainContext.font = '18pt Arial Black';
    mainContext.fillStyle = 'black';
    mainContext.fillText("Donation Hype", 200, 50);
    
    mainContext.font = '18pt Arial Black';
    mainContext.fillStyle = 'black';
    mainContext.fillText("$" + dickSize.toFixed(2), 444, 50);
    
    mainContext.font = '30pt Impact';
    mainContext.fillStyle = 'black';
    mainContext.fillText(homie, 300, 120);
}
function HomieAnimate(time){
    
}
function destroyCanvasElements (){
    mainContext.clearRect(0,0, canvasWidth, canvasHeight);
}
main();