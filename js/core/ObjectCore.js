/*////////////////////////////////////////////////////////////////////////////////
// OBJECTCORE CLASS
// - Do not edit this class
// - Objects that extend this Class need to be instantiated
////////////////////////////////////////////////////////////////////////////////*/

var ObjectCore = CoreClass.extend({
	displayObj:null, // set as the displayable object appended to this item
	
	// this fires automaticallly
	init: function () {
		// add object to display list
		Global.objArr.push(this);
	},
	
	// show the object
	show:function(){
		this.displayObj.show();
	},
	
	// hide the object
	hide:function(){
		this.displayObj.hide();
	},
	
	changeResolution:function(){
		// to be overwritten
	}
});