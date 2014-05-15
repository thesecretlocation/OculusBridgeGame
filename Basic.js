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

	//THREE JS //////////////
	scene = new THREE.Scene();
	
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 20000 );
	camera.name = "camera";
	camera.position.y = 1

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setClearColor(0xff0000, 1);
	document.body.appendChild( renderer.domElement );


	var geometry = new THREE.BoxGeometry(1,1,1);
	var material = new THREE.MeshBasicMaterial( { color: 0x0000ff });
	var cube = new THREE.Mesh( geometry, material );
	cube.name = "cubeBlue";
	// cube.position.z = -10;
	scene.add(cube)


	var light = new THREE.AmbientLight( 0xffffff, 10 );
	scene.add( light );
	
	loadModel("model/steve3d/steve.js")

	render();
}

var mesh;
function loadModel(modelLocation) {
	//load the model
	var jsonLoader = new THREE.JSONLoader();

	jsonLoader.load( modelLocation, function ( geometry, materials ) {

		mesh = new THREE.MorphAnimMesh( geometry, new THREE.MeshFaceMaterial(materials ) );
		mesh.scale.set(1, 1, 1);
		mesh.position.z = -3;	

		scene.add( mesh );
	});
}


function makeSky() {
	var imagePrefix = "img/skyNew/";
	var directions  = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
	var imageSuffix = ".png";

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


function render() {
	// controls.update();
	requestAnimationFrame(render);
	renderer.render(scene, camera);

	mesh.rotation.y += .1;
	// mesh.rotation.x += .04;
	// mesh.rotation.z += .04;
}

function addStats(displayContainer) {
	// STATS
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '0px';
	stats.domElement.style.zIndex = 100;
	displayContainer.appendChild( stats.domElement );
}

function addMouseControls() {
	controls = new THREE.PointerLockControls( camera );
	controls.name = "controls";
	scene.add( controls.getObject() );
	controls.enabled = true;
}

init();
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////

