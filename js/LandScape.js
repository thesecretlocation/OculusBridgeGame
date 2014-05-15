var LandScape = ObjectCore.extend({

	mesh:null,
	animation:null,
	scene:null,
	MESH_SCALE:1,
	tween:null,
	dead:false,
	prevTime : Date.now(),
	// completeEvent :new Event('complete'),

	init : function () {
		var _this = this;

		_this.name = "monster";

		_this.loadModel("model/orinthalianJS/orinthalian_v02.js");

	},
	setScene : function (newScene) {
		var _this = this;
		_this.scene = newScene
		// console.log("SCENE SET ",_this.scene)
	},

	getMesh : function () {
		var _this = this;
		return _this.mesh;
	},

	////////////////////////////////////
	// model loading
	loadModel : function (modelLocation) {
		var _this = this;
		// console.log("LOAD MODEL "+modelLocation)

		//load the model
		var jsonLoader = new THREE.JSONLoader();

		jsonLoader.load( modelLocation, function ( geometry, materials ) {

			// console.log("addModelToScene")
			// console.log(materials)			

			// _this.mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: 0x606060, morphTargets: true } ) );
			// materials[ 0 ].morphTargets = true;
			// materials[ 0 ].morphNormals = true;
			_this.mesh = new THREE.MorphAnimMesh( geometry, new THREE.MeshFaceMaterial(materials ) );
			_this.mesh.scale.set(_this.MESH_SCALE, _this.MESH_SCALE, _this.MESH_SCALE);
			_this.mesh.control = _this;

			_this.scene.add( _this.mesh );

			_this.animation = new THREE.MorphAnimation( _this.mesh );
			// _this.animation.loo
			_this.animation.play();

			// if (Math.random() < .5) _this.mesh.position.set(0,0,-200);
			// else _this.mesh.position.set(-200,0,0);
			if (Math.random() < .25) _this.mesh.position.set(0,0,200);
			else if (Math.random() < .5) _this.mesh.position.set(0,0,-200);
			else if (Math.random() < .75) _this.mesh.position.set(-200,0,0);
			else _this.mesh.position.set(200,0,0);

			_this.mesh.lookAt(new THREE.Vector3())

			//_this.tweenLandScape()
		});
	},

	update : function ( ) {
		var _this = this;

	}

	
})