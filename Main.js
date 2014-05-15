////////////////////////////////////

var clickInfo = {};
clickInfo.userHasClicked = false;
var score = 0;
var riftCam;
var RIFT = true;
var monster;

var raycaster 
var enemyContainer;
var controls, crossHair;
var line;
var cameraContainer;
var debugLine;
var scene, camera, renderer;
var enemies = [];

function init() {

	initThree();

	if (RIFT) {
		riftCam = new THREE.OculusRiftEffect(renderer);
		camera.position.y = 10;
	} else {
		addMouseControls();
	}
	
	AddCrossHair();

	makeSky();

	enemyContainer = new THREE.Object3D();
	scene.add(enemyContainer);
	enemyContainer.y = 10;

	// for (x = 0; x < 10; x ++) {
	// 	var enemyCube = makeCubeBlue(10);
	// 	enemyCube.position.x = Math.sin(Math.random()*100)*30
	// 	enemyCube.position.y = Math.sin(Math.random()*100)*30
	// 	enemyCube.position.z = Math.sin(Math.random()*100)*30
	// 	enemyCube.name = "ENEMY"
	// 	enemyContainer.add(enemyCube);
	// }

	var zeroPoint = makeCubeGreen(.1);
	enemyContainer.add(zeroPoint);

	raycaster = new THREE.Raycaster();
	raycaster.name = "raycaster";

	var light = new THREE.AmbientLight( 0xffffff, 10 );
	scene.add( light );

	addStats(document.body);

	// loadModel("model/steve3d/steve.js")
	// loadModel("model/tyrant_js/morphtest1.js")
	// loadModel("model/horse/horse.js")
	
	var land = new LandScape();
	land.setScene(scene)
	land.init();

	spawnMonster();

	render();
}

function spawnMonster() {
	monster = new Monster();
	monster.setScene(enemyContainer);
	monster.init();
}

function makeCubeBlue(size) {
	var geometry = new THREE.BoxGeometry(size,size,size);
	var material = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
	var cube = new THREE.Mesh( geometry, material );
	cube.name = "cubeBlue";

	return cube;
}

function makeCubeGreen(size) {
	var geometry = new THREE.BoxGeometry(size,size,size);
	var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	var cube = new THREE.Mesh( geometry, material );
	cube.name = "cubeGreen";

	return cube;
}

function makeSky() {
	var imagePrefix = "img/skyNew/";
	// var directions  = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
	var imageSuffix = ".png";

	// var imagePrefix = "img/skyNew/";
	var directions  = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
	// var imageSuffix = ".jpg";


	var skyGeometry = new THREE.CubeGeometry( 5000, 5000, 5000 );	
	skyGeometry.name = "skyGEP";

	var materialArray = [];
	for (var i = 0; i < 6; i++)
		materialArray.push( new THREE.MeshBasicMaterial({
			map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
			side: THREE.BackSide
		}));
	var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
	var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
	skyBox.name = "sky";
	scene.add( skyBox );
}

var countTarget = 140;
var currentCount = 0;
function render() {
	currentCount++;

	if (currentCount == countTarget) {
		currentCount = 0;
		// monster = new Monster();
		spawnMonster();
	} 

	stats.update();
	if (!RIFT) controls.update();
	requestAnimationFrame(render);

	monster.update();
	TWEEN.update();

	if (clickInfo.userHasClicked) {
		clickInfo.userHasClicked = false;

		if (RIFT) {
			//get direction, apply camera rotation to vector to get directions
			var cameraRotation = camera.rotation;
		    var rayCastDirection = new THREE.Vector3( 0, 0, -1 );
		    rayCastDirection.applyEuler(cameraRotation);

			rayCastDirection.normalize();

			var worldCameraPos = camera.position;

			// console.log("cX:"+c.x + " cY:"+c.y + " cZ:"+c.z);
			// console.log("rX:"+rayCastDirection.x + " rY:"+rayCastDirection.y + " rZ:"+rayCastDirection.z);
			// console.log("crX:"+cameraRotation.x + " crY:"+cameraRotation.y + " crZ:"+cameraRotation.z);
			
			crossHair.position = rayCastDirection;
			
			// drawDebugLine(worldCameraPos, rayCastDirection);
			
		} else {
			//////////////////////////////////////////////////////
			//////////////////////////////////////////////////////
			// cacluate the direction the user is looking
		 	// console.log("TARGET x:"+crossHair.position.x+" y:"+crossHair.position.y+" z:"+crossHair.position.z);
		 	var tempVec1 = new THREE.Vector3();
		 	tempVec1.copy(crossHair.position);
		  	var worldTargetPos = controls.camera().localToWorld(tempVec1);
			// console.log("worldTargetPos x:"+worldTargetPos.x+" y:"+worldTargetPos.y+" z:"+worldTargetPos.z);

		 	// console.log("CAMERA x:"+controls.camera().position.x+" y:"+controls.camera().position.y+" z:"+controls.camera().position.z);
		 	var tempVec2 = new THREE.Vector3();
		 	tempVec2.copy(controls.camera().position);
		  	var worldCameraPos = controls.camera().localToWorld(tempVec2);
			// console.log("worldCameraPos x:"+worldCameraPos.x+" y:"+worldCameraPos.y+" z:"+worldCameraPos.z);

			//get direction vector
			var rayCastDirection = new THREE.Vector3();
		 	rayCastDirection.copy(worldTargetPos);
			rayCastDirection.sub(worldCameraPos);
			//normalize
		    rayCastDirection.normalize()
		}
	    //debug line
	    // drawDebugLine(worldCameraPos, rayCastDirection);

		//update raycast
	    raycaster.set(worldCameraPos, rayCastDirection);

	    // Ask the raycaster for intersects with all objects in the scene:dw
	    // (The second arguments means "recursive")
	    var intersects = raycaster.intersectObject(enemyContainer, true);

		// console.log("INTERSECTIONs "+intersects.length);
		for (x = 0; x < intersects.length; x++){
			intersects[x].object.control.kill();
			score += 10;
	    }
	}

	$( "#front" ).html( "SCORE "+score )
	
	if (RIFT) riftCam.render(scene, camera); 
	else renderer.render(scene, camera);
}

function addStats(displayContainer) {
	// STATS
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '0px';
	stats.domElement.style.zIndex = 100;
	displayContainer.appendChild( stats.domElement );
}

function drawDebugLine(start, end) {
	// console.log("start x:"+start.x+" y:"+start.y+" z:"+start.z);
	// console.log("end x:"+end.x+" y:"+end.y+" z:"+end.z);

	var startCube = makeCubeGreen(.1);
	startCube.position = start;
	scene.add(startCube);
	var endCibe = makeCubeBlue(.1);
	endCibe.position = end;
	scene.add(endCibe);
	
	end.add(start)

	var material = new THREE.LineBasicMaterial({
	    color: 0xff0000
	});

	var geometry = new THREE.Geometry();
    geometry.vertices.push(start);
    geometry.vertices.push(end);

	debugLine = new THREE.Line(geometry, material);
	scene.add(debugLine);
}

document.body.addEventListener('click', function (evt) {
	// The user has clicked; let's note this event
	// and the click's coordinates so that we can
	// react to it in the render loop
	clickInfo.userHasClicked = true;
	clickInfo.x = evt.clientX;
	clickInfo.y = evt.clientY;
}, false);

document.body.addEventListener('keydown', function (evt) {
	// console.log("onkeydown");
	clickInfo.userHasClicked = true;
}, false);

function initThree() {
	//THREE JS //////////////
	scene = new THREE.Scene();
	// new THree.orth
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 20000 );
	camera.name = "camera";

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor(0x00ff00, .5);
	document.body.appendChild( renderer.domElement );
}

function addMouseControls() {
	controls = new THREE.PointerLockControls( camera );
	controls.name = "controls";
	scene.add( controls.getObject() );
	controls.enabled = true;
}

function AddCrossHair() {
	//CREATE CUBE FOR CROSS HAIR
	var geometry = new THREE.BoxGeometry(.1,.1,.1);
	var material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
	var cube = new THREE.Mesh( geometry, material );
	cube.name = "cubeRed";
	
	crossHair = new THREE.Object3D();
	crossHair.name = "crossHair";
	crossHair.add(cube);
	crossHair.position.z = -10;
	

	if (RIFT) {
		scene.add(crossHair)

	} else {
		controls.camera().add( crossHair );
	}
}
////////////////////////////////////////////////////////////////////////////////////
function makeTextSprite( message, parameters ) {
	if ( parameters === undefined ) parameters = {};
	
	var fontface = parameters.hasOwnProperty("fontface") ? 
		parameters["fontface"] : "Arial";
	
	var fontsize = parameters.hasOwnProperty("fontsize") ? 
		parameters["fontsize"] : 18;
	
	var borderThickness = parameters.hasOwnProperty("borderThickness") ? 
		parameters["borderThickness"] : 4;
	
	var borderColor = parameters.hasOwnProperty("borderColor") ?
		parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };
	
	var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
		parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };

	// var spriteAlignment = THREE.spriteAlignment.lef;
		
	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');
	context.font = "Bold " + fontsize + "px " + fontface;
    
	// get size data (height depends only on font size)
	var metrics = context.measureText( message );
	var textWidth = metrics.width;
	
	// background color
	context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
								  + backgroundColor.b + "," + backgroundColor.a + ")";
	// border color
	context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
								  + borderColor.b + "," + borderColor.a + ")";

	context.lineWidth = borderThickness;
	// roundRect(context, borderThickness/2, borderThickness/2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
	// 1.4 is extra height factor for text below baseline: g,j,p,q.
	
	// text color
	context.fillStyle = "rgba(0, 0, 0, 1.0)";

	context.fillText( message, borderThickness, fontsize + borderThickness);
	
	// canvas contents will be used for a texture
	var texture = new THREE.Texture(canvas) 
	texture.needsUpdate = true;

	var spriteMaterial = new THREE.SpriteMaterial( 
		{ map: texture, useScreenCoordinates: false } );
	var sprite = new THREE.Sprite( spriteMaterial );
	sprite.scale.set(100,50,1.0);
	return sprite;	
}

init();
////////////////////////////////////////////////////////////////////////////////////
//// OCULUS INIT //////////////////////////////////////////
var bridge = new OculusBridge({
    "debug" : true,
    "onOrientationUpdate" : bridgeOrientationUpdated,
    // "onConfigUpdate"      : bridgeConfigUpdated,
    "onConnect" : function() { 
        // console.log("we are connected!");
    },
    "onDisconnect" : function() {
        // console.log("good bye Oculus.");
    },
    "onConfigUpdate" : function(config) {
        // console.log("Field of view: " + config.FOV);
    }
});

function bridgeOrientationUpdated(quatValues) {
	// console.log("bridgeOrientationUpdated");

    var bodyAxis = new THREE.Vector3(0, 1, 0);

    // make a quaternion for the the body angle rotated about the Y axis
    var bodyQuat = new THREE.Quaternion();
    bodyQuat.setFromAxisAngle(bodyAxis, 0);

    // make a quaternion for the current orientation of the Rift
    var riftQuat = new THREE.Quaternion(quatValues.x, quatValues.y, quatValues.z, quatValues.w);

    // multiply the body rotation by the Rift rotation.
    bodyQuat.multiply(riftQuat);

    // Make a vector pointing along the Z axis and rotate it 
    // according to the combined look+body angle.
    var xzVector = new THREE.Vector3(0, 0, 1);
    xzVector.applyQuaternion(bodyQuat);

    // Compute the X/Z angle based on the combined look/body angle.
    viewAngle = Math.atan2(xzVector.z, xzVector.x) + Math.PI;

    // Update the camera so it matches the current view orientation
    camera.quaternion.copy(bodyQuat);
}

if (RIFT) bridge.connect();
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

