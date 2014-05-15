var Monster = ObjectCore.extend({

	mesh:null,
	animation:null,
	scene:null,
	MESH_SCALE:10,
	tween:null,
	prevTime : Date.now(),
	// completeEvent :new Event('complete'),

	init : function () {
		var _this = this;

		_this.name = "monster";

		_this.loadModel("model/tyrant_js/morphtest1.js");

	},
	setScene : function (newScene) {
		var _this = this;
		_this.scene = newScene
		console.log("SCENE SET ",_this.scene)
	},

	getMesh : function () {
		var _this = this;
		return _this.mesh;
	},
	////////////////////////////////////
	// model loading
	loadModel : function (modelLocation) {
		var _this = this;
		console.log("LOAD MODEL "+modelLocation)

		//load the model
		var jsonLoader = new THREE.JSONLoader();

		jsonLoader.load( modelLocation, function ( geometry, materials ) {

			console.log("addModelToScene")
			console.log(materials)			

			// _this.mesh = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: 0x606060, morphTargets: true } ) );
			_this.mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial(materials ) );
			_this.mesh.scale.set(_this.MESH_SCALE, _this.MESH_SCALE, _this.MESH_SCALE);
			_this.mesh.control = _this;
			_this.mesh.position.set(0,0,-200);
			_this.scene.add( _this.mesh );

			_this.animation = new THREE.MorphAnimation( _this.mesh );
			_this.animation.play();


			_this.tweenMonster()
		});
	},

	tweenMonster : function  () {
		var _this = this;

		console.log("tweenTarget",_this.mesh);

		var position = _this.mesh.position;
		var target = new THREE.Vector3();
		_this.tween = new TWEEN.Tween(position).to(target, 2000);

		_this.tween.onUpdate(function(){
		    _this.mesh.position.x = position.x;
		    _this.mesh.position.y = position.y;
		});

		_this.tween.onComplete(function(){
			_this.scene.remove(_this.mesh);
			// _this.dispatchEvent(completeEvent)
		});

		_this.tween.start();
	},

	kill : function ( ) {
		var _this = this;

		_this.tween.stop();
		_this.scene.remove(_this.mesh)
	},

	update : function ( ) {
		var _this = this;

		if ( _this.animation ) {
			// console.log("animate")
			var time = Date.now();
			_this.animation.update( time - _this.prevTime );
			_this.prevTime = time;
		}
	}

	
})