////////////
// CUSTOM //
////////////
	
var axes = new THREE.AxisHelper(100000);
scene.add(axes);

var gridXZ = new THREE.GridHelper(100, 1);
gridXZ.setColors( new THREE.Color(0x006600), new THREE.Color(0x006600) );
gridXZ.position.set( 100,0,100 );
scene.add(gridXZ);

var gridXY = new THREE.GridHelper(100, 1);
gridXY.position.set( 100,100,0 );
gridXY.rotation.x = Math.PI/2;
gridXY.setColors( new THREE.Color(0x000066), new THREE.Color(0x000066) );
scene.add(gridXY);

var gridYZ = new THREE.GridHelper(100, 1);
gridYZ.position.set( 0,100,100 );
gridYZ.rotation.z = Math.PI/2;
gridYZ.setColors( new THREE.Color(0x660000), new THREE.Color(0x660000) );
scene.add(gridYZ);