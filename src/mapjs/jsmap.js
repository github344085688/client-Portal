import $ from 'jquery';
import _ from 'lodash';
import store from '../store/store';

var google = window.google;
var jsmap = null;
console.log(google);
if (google) {
	var DEFAULT_CENTER = {lat: 39.896252, lng: -102.099611};
	var DEFAULT_ZOOM = 4;
	
	var SUITABLE_ZOOM = 17;	//适合使用的zoom大小
	var LINE_ADSORB_PIXEL = 20;  //道路吸附像素距离

	//内部计算时追加到data里的字段，应全部以'_'开头，避免冲突，返回给业务层之前应该删掉
	var INNER_PROPERTIES = ["_uuid", "_inEdit", "_ghostLabel", "_label", "_merge", "_infoWindow", "_dragStartLatlng", "_polyType",
		"_originPosition", "_originPath", "_moveStartPath", "_editDisable", "_editDeceive", "_style", "_isNew", "_markers", "_icons",
		"_copyNo", "_group", "_highlight", "_highlightStyle", "_inMap", "_partPolygons", "_html", "_htmlFlag", "_justifyPath", "_interval"];

	//颜色方案
	var COLOR_SCHEME = {
		ALIGN : {strokeColor: "#FF6666", strokeWeight: 1, strokeOpacity: 1, zIndex: 3},	//align polyline
		COORSYS : {strokeColor: "#3093E8", strokeWeight: 1, strokeOpacity: 1, zIndex: 2},	//coord sys polyline
		GHOST_POLYGON : {strokeColor: "#337AB7", strokeWeight: 1, strokeOpacity: 0.2, fillColor: "#FFFFFF", fillOpacity: 0.5, zIndex: 4},	//ghost polygon
		VIEW_PORT : {strokeColor: "#FF0000", strokeWeight: 2, strokeOpacity: 0.6, fillColor: "#FF0000", fillOpacity: 0.3},	//鼠标选择视口
		HIGHLIGHT : {strokeColor: "#FF2222", strokeOpacity: 1, fillColor: "#FF4444", fillOpacity: 0.6},	//polygon 高亮
		RUBBER_LINE : {strokeColor: '#FF6D6D', strokeOpacity: 1, strokeWeight: 2, clickable: false},	//橡皮筋polyline效果
		POLYGON_EDIT : {strokeColor : "#FF4444"},	//编辑状态下的polygon
		POLYLINE_EDIT : {strokeColor : "#FBA5A5"},	//编辑状态下的polyline
		STROKE_MOUSEOVER : "#FFFFFF",				//边框--mouseover
		LABEL_DEFAULT : "#000000",					//label默认颜色
		LABEL_MOUSEOVER :"#A129E6", 				//label--mouseover
		POLYGON_MARKER : {path : google.maps.SymbolPath.CIRCLE, /*rotation : 5,*/ scale : 10, strokeColor : "#000000", strokeOpacity: 1, strokeWeight : 1, fillColor : "#CDDC39", fillOpacity : 0.8},	//polygon角标
		ROUTE_PLAYER :{		//route player线路颜色
			PREVIEW : {"strokeColor" : "#00CE7A", "strokeWeight" : 3, "strokeOpacity" : 0.8},	//预计线路
			OVER : {"strokeColor" : "#0058D0", "strokeWeight" : 3, "strokeOpacity" : 0.8},		//已经过线路
			MARKER : {}	//marker
		}
	};

	//编辑状态
	var EDIT_STATUS = {
		editable : false,
		union : false,
		copy : false,
		remove : false,
		cut : false,
		mark : false,
		justify : false,
		format : false,
		rotate : false,
		line : false
	};
	
	var OPTIONS = {
			forceExitEdit : true,	//true：主动退出编辑状态并触发退出事件； false：触发退出事件但不退出编辑状态，需要外部主动调用退出
			forceRemove : true//true : 主动移除对象并触发移除事件；false ： 触发移除事件但不移除对象，需要外部主动调用移除
	};

	var MAP;	//Map对象实例， init的时候指定
	
	/**
	 * 坐标系工具，用于经纬度和坐标的转换。
	 * 由外部传入。
	 * 应包含以下两个方法：
	 *  coorsys 
	 * 	pointToLatlngArray(x, y), return [lng,lat]
	 * 	latlngToPoint(lng, lat), return [x,y]
	 */
	var COORSYS_UTIL = {
			//获取坐标系轴偏离正北方向的角度，向东偏离为+，范围[-180, 180)
			//forX : boolean, 是否获取x轴方向， 默认y轴
			getCoorHeading : function(forX){
				var heading = 0;
				var coor = COORSYS_UTIL.coorsys;
				if(!_.isEmpty(coor)){
					var o = strToLatlng(coor.pointOrigin);
					var x = strToLatlng(coor.pointX);
					var y = strToLatlng(coor.pointY);
					heading = google.maps.geometry.spherical.computeHeading(o, forX ? x : y);
				}
				return heading;
			},
			pointToLatlng : function(x, y){
				var a = COORSYS_UTIL.pointToLatlngArray(x, y);
				return new google.maps.LatLng(a[1], a[0]);
			},
			getCoorSysLines : function(){
				var lines;
				var coor = COORSYS_UTIL.coorsys;
				if(!_.isEmpty(coor)){
					var o = strToLatlng(coor.pointOrigin);
					var x = strToLatlng(coor.pointX);
					var y = strToLatlng(coor.pointY);
					
					var heading = google.maps.geometry.spherical.computeHeading(o, x);
					var distance = google.maps.geometry.spherical.computeDistanceBetween(o, x);
					var _x = google.maps.geometry.spherical.computeOffset(o, distance * 1.2, heading);
					var _xo = google.maps.geometry.spherical.computeOffsetOrigin(x, distance * 1.2, heading);
					
					heading = google.maps.geometry.spherical.computeHeading(o, y);
					distance = google.maps.geometry.spherical.computeDistanceBetween(o, y);
					var _y = google.maps.geometry.spherical.computeOffset(o, distance * 1.2, heading);
					var _yo = google.maps.geometry.spherical.computeOffsetOrigin(y, distance * 1.2, heading);
					
					var X = new google.maps.Polyline({
						path: [_xo, _x],
						zIndex : COLOR_SCHEME.COORSYS.zIndex,
						strokeColor: COLOR_SCHEME.COORSYS.strokeColor,
						strokeWeight: COLOR_SCHEME.COORSYS.strokeWeight,
						strokeOpacity: COLOR_SCHEME.COORSYS.strokeOpacity
					});
					X.setOptions({
						icons: [{
							icon: {path: google.maps.SymbolPath.FORWARD_OPEN_ARROW}, offset: '100%'
						}, {
							icon: {path: "M -4,-3 l 8,-4 m -8,0 l 8,4"}, offset: '100%'
						}, {
							icon: {path: "M 2,2 m 0,1 l 0,1 l 1,1 l 4,0 l 1,-1 l 0,-1 l -1,-1 l -4,0 l -1,1"}, offset: '14%'
						}]
					});
					var Y = new google.maps.Polyline({
						path: [_yo, _y],
						zIndex : COLOR_SCHEME.COORSYS.zIndex,
						strokeColor: COLOR_SCHEME.COORSYS.strokeColor,
						strokeWeight: COLOR_SCHEME.COORSYS.strokeWeight,
						strokeOpacity: COLOR_SCHEME.COORSYS.strokeOpacity
					});
					Y.setOptions({
						icons: [{
							icon: {path: google.maps.SymbolPath.FORWARD_OPEN_ARROW}, offset: '100%'
						}, {
							icon: {path: "M 0,-3 l 0,-5 l -2,-3 m 2,3 l 2,-3"}, offset: '100%'
						}]
					});
					lines = [X, Y];
				}
				return lines;
			}
	};

	//清除业务层数据中的内置字段,返回clone的对象
	function cleanData(data){
		if(!data){
			return {};
		}
		data = _.clone(data);
		for(var i=0; i<INNER_PROPERTIES.length; i++){
			var key = INNER_PROPERTIES[i];
			delete data[key];
		}
		return data;
	}
	/**
	 *
	 */
	function createMap(el, simple_map){
		var options = {
			center : new google.maps.LatLng(DEFAULT_CENTER.lat, DEFAULT_CENTER.lng),
			zoom : DEFAULT_ZOOM,
			disableDoubleClickZoom : true,
			minZoom : 2
		};
		if(simple_map){
			$.extend(options, {
				scrollwheel: true,
				mapTypeControl: false,
				overviewMapControl: false,
				panControl: false,
				rotateControl: false,
				scaleControl: false,
				streetViewControl: false,
				zoomControl: false
			});
		}else{
			$.extend(options, {
				panControl : false,
				mapTypeControlOptions : {
					position : google.maps.ControlPosition.TOP_RIGHT,
					style : google.maps.MapTypeControlStyle.DEFAULT/*,
					mapTypeIds : [google.maps.MapTypeId.SATELLITE, 
					              google.maps.MapTypeId.HYBRID, 
					              google.maps.MapTypeId.ROADMAP, 
					              google.maps.MapTypeId.TERRAIN]*/
				},
				panControlOptions : {
					position : google.maps.ControlPosition.LEFT_TOP
				},
				streetViewControlOptions : {
					position : google.maps.ControlPosition.RIGHT_BOTTOM
				},
				zoomControlOptions : {
					position : google.maps.ControlPosition.RIGHT_BOTTOM,
					style : google.maps.ZoomControlStyle.SMALL
				}
			});
		}
		var g_map = new google.maps.Map(el, options);
		/*google.maps.event.addListenerOnce(g_map, 'idle', function() {

		 });*/
		return g_map;
	}
	//============ Polyline ============
	function createPolyline(path, style, options) {
		options = options || {};
		var zIndex = (options.zIndexUp || 0) + 1;
		var opt = $.extend({
			path: path,
			zIndex: zIndex,
			map: MAP.map
		}, style);
		var line =  new google.maps.Polyline(opt);
		line.putData({
			_uuid : randomInt(),
			_style : style,
			_polyType : 'polyline'
		});
		google.maps.event.addListener(line, "mouseover", function(event){
			//鼠标效果
			this.setOptions({
				strokeColor : COLOR_SCHEME.STROKE_MOUSEOVER
			});

			if(this.data._html){
				MAP.ghostInfoWindow.setContent(this.data._html);
				MAP.ghostInfoWindow.setPosition(event.latLng);
				MAP.ghostInfoWindow.open(this.getMap());
			}
		});
		google.maps.event.addListener(line, "mouseout", function(){
			//鼠标效果
			var _style = this.data._style;
			if(EDIT_STATUS.editable && this.data._inEdit){
				_style = COLOR_SCHEME.POLYLINE_EDIT;
			}
			this.setOptions(_style);

			if(this.data._html){
				MAP.ghostInfoWindow.close();
			}
		});
		google.maps.event.addListener(line, "click", function(e){
			if(EDIT_STATUS.line){
				MAP.edit.line("click");
				return;
			}
			if(EDIT_STATUS.remove){
				MAP.edit.remove(this.data);
				return;
			}
		});
		google.maps.event.addListener(line, "rightclick", function(e){
			if(EDIT_STATUS.line){
				MAP.edit.line("rightclick");
				return;
			}
		});
		return line;
	}
	google.maps.Polyline.prototype.putData = function(data) {
		this.data = $.extend({}, this.data, data);
	};
	google.maps.Polyline.prototype.getBounds = function() {
		var path = this.getPath().getArray();
		var bounds = new google.maps.LatLngBounds();
		for (var i = 0; i < path.length; i++) {
			bounds.extend(path[i]);
		}
		return bounds;
	};
	google.maps.Polyline.prototype.getCenter = function() {
		return this.getBounds().getCenter();
	};
	/**
	 * 设置为编辑状态
	 * editable : boolean, 进入/退出编辑状态，不指定则自动判断;
	 * doCallback : boolean, 是否触发回调函数，默认true
	 * forceExit : 强制退出编辑状态， OPTIONS.forceExitEdit为false时，可以用forceExit强制
	 */
	google.maps.Polyline.prototype.setEdit = function(editable, doCallback, forceExit){
		if(EDIT_STATUS.editable && !this.data._editDisable){
			if(editable === undefined){
				editable = !this.getDraggable();
			}
			var editDeceive = this.data._editDeceive;	//编辑状态欺骗，进入编辑状态时，会产生编辑样式效果、回调，但不能被编辑（drag, edit）
			forceExit = forceExit || OPTIONS.forceExitEdit;
			
			var _editable = editable || !forceExit; //退出编辑状态时要检查forceExitEdit
			this.setDraggable(_editable && !editDeceive);
			this.setEditable(false);
			this.data._inEdit = _editable;	//标记polygon编辑状态
			var style = _editable ? COLOR_SCHEME.POLYLINE_EDIT : this.data._style;
			this.setOptions(style);
			doCallback = (doCallback === undefined) || doCallback;
			if(doCallback){
				var event = editable ? "editPolylineStart" : "editPolylineEnd";
				MAP.edit.doCallback(event, this.data);	//回调函数
			}
		}
	};
	/**
	 * 获取polyline内的点阵
	 * space : 点间隔，单位：m
	 */
	google.maps.Polyline.prototype.getSplashes = function(space){
		var path = this.getPath().getArray();
		var ps = [];
		if(!space || path.length < 2){
			return ps;
		}
		for(var i = 1; i < path.length; i++){
			var from = path[i-1],
				end = path[i];
			var heading = google.maps.geometry.spherical.computeHeading(from, end),
				len = google.maps.geometry.spherical.computeDistanceBetween(from, end);
			var count = len % space / 2;
			while(count > 0 && count < len){
				var p = google.maps.geometry.spherical.computeOffset(from, count, heading);
				ps.push(p);
				count += space;
			}
		}
		return ps;
	};
	
	//============ Polygon ============

	/**
	 * options :
	 * 包含边框和填充样式，
	 */
	function createPolygon(paths, style, options) {
		options = options || {};
		var zIndex = (options.zIndexUp || 0) + 1;
		var opt = $.extend({
			paths: paths,
			zIndex: zIndex,
			map: MAP.map
		}, style);
		style.zIndex = zIndex;
		var polygon = new google.maps.Polygon(opt);
		polygon.putData({
			_uuid : randomInt(),
			_originPath : paths,	//polygon.getPath().getArray(),
			_editDisable : options.editDisable || false,
			_style : style,
			_polyType : 'polygon',
			points : pathToPointStr(polygon.getPath().getArray())
		});
		google.maps.event.addListener(polygon, "mouseover", function(e){
			if (polygon.data && polygon.data.type === "BASE") return;

			if(EDIT_STATUS.editable && EDIT_STATUS.cut){
				var el = $(MAP.el).find("#edit-cut-option");
				var xrow = parseInt(el.find("#x-rows").val()) || 1,
					yrow = parseInt(el.find("#y-rows").val()) || 1,
					xgap = parseFloat(el.find("#x-gap").val()) || 0,
					ygap = parseFloat(el.find("#y-gap").val()) || 0,
					margin = parseFloat(el.find("#margin").val()) || 0;
				MAP.edit.cut(this, xrow, yrow, xgap, ygap, margin);
			}
			if(EDIT_STATUS.editable && EDIT_STATUS.format){
				MAP.edit.format(this, true);
			}
			if(EDIT_STATUS.editable && EDIT_STATUS.rotate){
				MAP.edit.rotate(this, e, true);
			}
			if(EDIT_STATUS.editable && EDIT_STATUS.justify){
				MAP.edit.justify(this, true);
			}
			if(!EDIT_STATUS.editable){
				MAP.edit.doCallback("polygonMouseover", this.data);
			}
			
			//鼠标效果
			this.setOptions({
				strokeColor : COLOR_SCHEME.STROKE_MOUSEOVER
			});
			if(this.data._label){
				var label = this.data._label;
				label.setStyle({color: COLOR_SCHEME.LABEL_MOUSEOVER});
				label.setVisible(true);
			}else if(this.data._ghostLabel && this.data.name){
				var label = this.data._ghostLabel;
				label.setLabel(this.data.name.toUpperCase());
				label.setPosition(polygon.getCenter());
				label.setStyle({color : COLOR_SCHEME.LABEL_MOUSEOVER});
				label.setMap(this.getMap());
			}
			if(this.data._html){
				MAP.ghostInfoWindow.setContent(this.data._html);
				MAP.ghostInfoWindow.setPosition(this.getCenter());
				MAP.ghostInfoWindow.open(this.getMap());
			}
		});
		google.maps.event.addListener(polygon, "mouseout", function(e){
			if(EDIT_STATUS.editable && (EDIT_STATUS.cut || EDIT_STATUS.justify || EDIT_STATUS.format || EDIT_STATUS.rotate)){
				MAP.ghostPolygon.setMap(null);
				EDIT_STATUS.copy = false;
			}
			if(!EDIT_STATUS.editable){
				MAP.edit.doCallback("polygonMouseout", this.data);
			}
			
			var _style = this.data._style;
			if(EDIT_STATUS.editable && this.data._inEdit){
				_style = COLOR_SCHEME.POLYGON_EDIT;
			}
			if(this.data._highlight){
				_style = this.data._highlightStyle || COLOR_SCHEME.HIGHLIGHT;
			}
			this.setOptions(_style);
			if(this.data._label){
				var label = this.data._label;
				label.setStyle({color: COLOR_SCHEME.LABEL_DEFAULT});
				label.autoDisplay();
			}else if(this.data._ghostLabel){
				this.data._ghostLabel.setMap(null);
			}
			if(this.data._html){
				MAP.ghostInfoWindow.close();
			}
		});
		//编辑
		google.maps.event.addListener(polygon, "click", function(e){
			/*
			//test
			var curr = MAP.currentPosition;
			new google.maps.Marker({
				position: curr,
				map: MAP.map
			});
			console.log(latlngToStr(curr));
			//test end
			*/
			if(!EDIT_STATUS.editable){
				MAP.edit.doCallback("polygonClick", this.data);
				return;
			}
			if(EDIT_STATUS.remove){
				MAP.edit.remove(this.data);
				return;
			}
			if(EDIT_STATUS.cut){
				MAP.edit.cut();
				return;
			}
			if(EDIT_STATUS.mark){
				MAP.edit.mark();
				return;
			}
			if(EDIT_STATUS.format){
				MAP.edit.format(this);
				return;
			}
			if(EDIT_STATUS.rotate){
				MAP.edit.rotate(this);
				return;
			}
			if(EDIT_STATUS.justify){
				MAP.edit.justify(this);
				return;
			}
			if(EDIT_STATUS.line){
				MAP.edit.line("click");
				return;
			}
			this.setEdit();
		});
		google.maps.event.addListener(polygon, "rightclick", function(e){
			if(EDIT_STATUS.remove){	//删除状态时屏蔽编辑
				$(MAP.el).find("#edit-remove").trigger("click");
				return;
			}
			if(EDIT_STATUS.cut){	//cut状态时屏蔽编辑
				//MAP.ghostPolygon.setMap(null);
				$(MAP.el).find("#edit-cut").trigger("click");
				return;
			}
			if(EDIT_STATUS.mark){	//mark状态时屏蔽编辑
				$(MAP.el).find("#edit-mark").trigger("click");
				return;
			}
			if(EDIT_STATUS.line){
				MAP.edit.line("rightclick");
				return;
			}
			/*if(EDIT_STATUS.editable){
				MAP.edit.doCallback("editPolygonRightclick", this.data);
			}*/
			if(this.getDraggable()){
				this.setEditable(!this.getEditable());
				this.moveTo(this.getPath().getArray());	//确保改变形状后退出编辑状态时，latlng和points字段更新
			}
		});
		google.maps.event.addListener(polygon, "dragstart", function(e){
			this.data._dragStartLatlng = e.latLng;
			this.data._moveStartPath = this.getPath().getArray();
			if(EDIT_STATUS.union){
				MAP.edit.unionMoveStart();
			}
		});
		google.maps.event.addListener(polygon, "drag", function(e){
			var label = this.data._label || this.data._ghostLabel;
			if(label){
				label.setPosition(this.getBounds().getCenter());
			}
			if(EDIT_STATUS.union){
				MAP.edit.unionMove(this, e);
			}
		});
		google.maps.event.addListener(polygon, "dragend", function(e){
			var path = this.getPath().getArray();
			this.data.latlng = pathToStr(path);
			this.data.points = pathToPointStr(path);
			
			if(EDIT_STATUS.union){
				MAP.edit.unionMoveEnd();
			}
		});
		google.maps.event.addListener(polygon, 'mousemove', function (e) {
			if(EDIT_STATUS.editable && EDIT_STATUS.rotate){
				MAP.edit.rotate(this, e, true);
			}
		});
		return polygon;
	}
	google.maps.Polygon.prototype.putData = function(data) {
		this.data = $.extend({}, this.data, data);
	};
	/*
	 * 设置对象的infoWindow内容
	 * html : html string, 不传入html时，如果对象已有的htmlFlag == flag, 则删除对象的html
	 */
	google.maps.Polygon.prototype.setHtml = function(html, flag) {
		flag = flag || "default";
		if(html){
			this.data._html = html;
			this.data._htmlFlag = flag;
		}else{
			if(this.data._htmlFlag == flag){
				delete this.data._html;
				delete this.data._htmlFlag;
			}
		}
	};
	google.maps.Polygon.prototype.getBounds = function() {
		var paths = this.getPaths().getArray();
		var bounds = new google.maps.LatLngBounds();
		for (var i = 0; i < paths.length; i++) {
			var path = paths[i].getArray();
			for (var j = 0; j < path.length; j++) {
				bounds.extend(path[j]);
			}
		}
		return bounds;
	};
	google.maps.Polygon.prototype.getCenter = function() {
		return this.getBounds().getCenter();
	};
	//显示/隐藏角标记
	google.maps.Polygon.prototype.cornerMarkers = function(show) {
		var _this = this;
		this.data._markers = this.data._markers || [];
		if(show){
			var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			var path = this.getPath().getArray();
			_.forEach(path, function(p, i){
				var m = createMarker(p);
				m.setOptions({
					label : chars.charAt(i),
					icon : COLOR_SCHEME.POLYGON_MARKER
				});
				_this.data._markers.push(m);
			});
		}else{
			_.forEach(this.data._markers, function(marker){
				marker.setMap(null);
				return true;
			});
		}
	};
	/**
	 * 设置为编辑状态
	 * editable : boolean, 进入/退出编辑状态，不指定则自动判断;
	 * doCallback : boolean, 是否触发回调函数，默认true
	 * forceExit : 强制退出编辑状态， OPTIONS.forceExitEdit为false时，可以用forceExit强制
	 */
	google.maps.Polygon.prototype.setEdit = function(editable, doCallback, forceExit) {
		if(EDIT_STATUS.editable && !this.data._editDisable){
			if(editable === undefined){
				editable = !this.getDraggable();
			}
			
			forceExit = forceExit || OPTIONS.forceExitEdit;
			
			var _editable = editable || !forceExit; //退出编辑状态时要检查forceExitEdit
			this.setDraggable(_editable);
			this.setEditable(false);
			this.data._inEdit = _editable;	//标记polygon编辑状态
			var style = _editable ? COLOR_SCHEME.POLYGON_EDIT : this.data._style;
			this.setOptions(style);
			doCallback = (doCallback === undefined) || doCallback;
			if(doCallback){
				var event = editable ? "editPolygonStart" : "editPolygonEnd";
				MAP.edit.doCallback(event, this.data);	//回调函数
			}
		}
	};
	//该方法移动对象位置，并修改data.latlng值
	google.maps.Polygon.prototype.move = function(distance, heading){
		var paths;
		if(this.data._moveStartPath){
			paths = pathMove(this.data._moveStartPath, distance, heading);
		}else{
			paths = this.getPaths().getArray();
			for(var i=0; i<paths.length; i++){
				paths[i] = pathMove(paths[i].getArray(), distance, heading);
			}
			if(paths.length == 1){
				paths = paths[0];
			}
		}
		this.moveTo(paths);
	};
	//该方法移动对象位置，并修改data.latlng值。 to可为path路径或center位置
	//polygon移动的最终实现方法
	google.maps.Polygon.prototype.moveTo = function(to){
		if(to instanceof google.maps.LatLng){
			var center = this.getCenter();
			var distance = google.maps.geometry.spherical.computeDistanceBetween(center, to);
			var heading = google.maps.geometry.spherical.computeHeading(center, to);
			this.move(distance, heading);
			return;
		}else if(to instanceof Array){
			if(to[0] instanceof Array){
				this.setPaths(to);
				to = to[0];		//防止后面pathToStr报错
			}else{
				this.setPath(to);
			}
		}else{
			return;
		}
		this.data.latlng = pathToStr(to);
		this.data.points = pathToPointStr(to);
		var label = this.data._label;
		if(label){
			label.setPosition(this.getCenter());
		}
	};
	/**
	 * on : hightlight状态， true: 打开，false: 取消
	 */
	google.maps.Polygon.prototype.highlight = function(on, style){
		style = style || COLOR_SCHEME.HIGHLIGHT;
		if(on){
			this.data._highlight = true;
			this.data._highlightStyle = style;
			this.setOptions(style);
		}else{
			this.data._highlight = false;
			this.setOptions(this.data._style);
		}
	};
	/**
	 * Polygon分段颜色
	 * parts : Array. len --> 占用长度, 范围0-100, 默认值50, polygon总长度定为100, 所有颜色占用的长度总和不能大于100, 超出100部分无效;
	 * 				  color --> 填充颜色， 默认
	 * 		[
	 * 			{len : 10, color : '#FF0000'},
	 * 			{len : 10, color : '#00FF00'}
	 * 		]
	 * 		parts参数不存在时显示已有的分段颜色
	 * 	
	 * 注: 暂不支持move功能，主体移动时，parts不跟随移动;
	 * 	   暂不支持编辑状态下操作。
	 */
	google.maps.Polygon.prototype.partColors = function(parts){
		var _this = this;
		if(EDIT_STATUS.editable)
			return;
		if(!parts && this.data._partPolygons){
			_.forEach(this.data._partPolygons, function(polygon){
				polygon.setMap(_this.getMap());
			});
			return;
		}
		if(!parts || parts.length == 0)
			return;
		this.clearPartColors(true);
		
		var lenTotal = 0;
		var preCut = [];
		var colors = [];
		_.forEach(parts, function(part){
			var len = parseInt(part.len);
			if(!len || len < 1 || len + lenTotal > 100)
				len = 100 - lenTotal;
			var color = part.color;
			if(!color)
				return true;
			preCut.push(len);
			colors.push(color);
			lenTotal += len;
			if(lenTotal >= 100)
				return false;	//结束循环
		});
		//计算分割结果
		var paths = cutPolygon(this.getPath().getArray(), preCut);
		var polygons = [];
		_.forEach(paths, function(path, i){
			var polygon = new google.maps.Polygon({
				map : _this.getMap(),
				paths : path,
				fillColor : colors[i],
				fillOpacity : 1,
				strokeOpacity : 0,
				strokeWeight : _this.data._style.strokeWeight || 1,
				zIndex : _this.data._style.zIndex + 1
			});
			//触发主体polygon事件
			var events = ["mouseover", "mouseout", "click", "rightclick"];
			_.forEach(events, function(event){
				var _event = event;
				google.maps.event.addListener(polygon, event, function(e){
					google.maps.event.trigger(_this, _event, e);
				});
			});
			polygons.push(polygon);
		});
		if(polygons.length > 0){
			this.data._partPolygons = polygons;
		}
	};
	/**
	 * 清除分段颜色
	 */
	google.maps.Polygon.prototype.clearPartColors = function(remove){
		var polygons = this.data._partPolygons;
		if(polygons){
			_.forEach(polygons, function(polygon){
				polygon.setMap(null);
			});
			if(remove){
				delete this.data._partPolygons;
			}
		}
	};
	/**
	 * 获取polygon内的点阵
	 * space : 点间隔，单位：m
	 */
	google.maps.Polygon.prototype.getSplashes = function(space){
		var _this = this;
		var points = [], base = [];
		var center = this.getCenter();
		var bounds = this.getBounds();
		base.push(center);
		base = _.concat(base, frontPoints(center, space, 0, true));
		base = _.concat(base, frontPoints(center, space, -180, true));
		
		points.push(center);
		points.push(frontPoints(center, space, 0));
		points.push(frontPoints(center, space, -180));
		_.forEach(base, function(p){
			points.push(frontPoints(p, space, 90));
			points.push(frontPoints(p, space, -90));
		});
		points = _.flatten(points);
		return points;
		
		function frontPoints(from, disStep, heading, isBase){
			var inBounds = true;
			var count = 1;
			var ps = [];
			while(inBounds){
				var dis = disStep * (count++);
				var p = google.maps.geometry.spherical.computeOffset(from, dis, heading);
				inBounds = bounds.contains(p);
				var inside = google.maps.geometry.poly.containsLocation(p, _this);
				if(inside || (isBase && inBounds)){
					ps.push(p);
				}
			}
			return ps;
		}
	};
	
	//============== Sector ==========
	function createSector(pathOption, strokeColor, strokeWeight, strokeOpacity, fillColor, fillOpacity) {
		var paths = computeSectorPath(pathOption); //计算扇形的轨迹。
		return new google.maps.Polygon({
			paths: paths,
			strokeColor: strokeColor,
			strokeWeight: strokeWeight,
			strokeOpacity: strokeOpacity,
			fillColor: fillColor,
			fillOpacity: fillOpacity,
			map: MAP.map
		});
	}
	/**
	 * style : strokeColor, strokeWeight, strokeOpacity, fillColor, fillOpacity
	 */
	function createRectangle(bounds, style) {
		var opt = $.extend({
			bounds: bounds,
			map: MAP.map
		}, style);
		return new google.maps.Rectangle(opt);
	}
	/**
	 * 创建新的marker
	 */
	function createMarker(position, icons) {
		icons = icons || [false, false];
		var opt = {
			position: position,
			map: MAP.map
		};
		if(icons[0]){
			opt.icon = icons[0];
			if(opt.icon.url && _.endsWith(opt.icon.url.toUpperCase(), ".GIF")){
				opt.optimized = false;
			}
		}
		var marker = new google.maps.Marker(opt);
		marker.putData({
			_icons : icons,
			_uuid : randomInt(),
			_originPosition : position,
			_polyType : 'marker'
		});
		google.maps.event.addListener(marker, "mouseover", function() {
			this.setZIndex(this.getZIndex() + 1);
			this.setOpacity(0.7);
			if(this.data._infoWindow){
				this.data._infoWindow.open(this.getMap(), this);
			}
			if(this.data._label){
				var label = this.data._label;
				label.setStyle({color: COLOR_SCHEME.LABEL_MOUSEOVER});
			}
			if(this.data._html){
				MAP.ghostInfoWindow.setContent(this.data._html);
				MAP.ghostInfoWindow.open(this.getMap(), this);
			}
		});
		google.maps.event.addListener(marker, "click", function() {
			store.commit('showMapViewOrder', this.data.orderNo);
		});
		google.maps.event.addListener(marker, "mouseout", function() {
			this.setZIndex(this.getZIndex() - 1);
			this.setOpacity(1);
			if(this.data._infoWindow){
				this.data._infoWindow.close();
			}
			if(this.data._label){
				var label = this.data._label;
				label.setStyle({color: COLOR_SCHEME.LABEL_DEFAULT});
			}if(this.data._html){
				MAP.ghostInfoWindow.close();
			}
		});
		google.maps.event.addListener(marker, "dblclick", function() {
			var mergeMarkers = this.data._merge || [];
			//多点合并时展开
			if(mergeMarkers.length>0){
				var bounds = new google.maps.LatLngBounds();
				bounds.extend(this.getPosition());
				for(var i=0; i<mergeMarkers.length; i++){
					var m = mergeMarkers[i];
					bounds.extend(m.getPosition());
				}
				MAP.fitBounds(bounds);
				return;
			}
			
			//非编辑状态
			if(!EDIT_STATUS.editable){
				MAP.edit.doCallback("markerDblclick", this.data);
				return;
			}
		});
		google.maps.event.addListener(marker, "click", function() {
			//手持设备
			if(MAP.isMobile){
				if(this.data._html){
					MAP.ghostInfoWindow.setContent(this.data._html);
					MAP.ghostInfoWindow.open(this.getMap(), this);
				}
			}
			
			if(!EDIT_STATUS.editable){
				MAP.edit.doCallback("markerClick", this.data);
				return;
			}
			if(EDIT_STATUS.remove){
				MAP.edit.remove(this.data);
				return;
			}
			if(EDIT_STATUS.cut || EDIT_STATUS.mark){
				return;
			}
			this.setEdit();
		});
		google.maps.event.addListener(marker, "dragend", function() {
			var position = this.getPosition();
			this.data.latlng = latlngToStr(position);
			this.data.point = latlngToPointStr(position);
			if(this.data._label){
				this.data._label.setPosition(position);
			}
		});
		google.maps.event.addListener(marker, "drag", function() {
			if(this.data._label){
				var position = this.getPosition();
				this.data._label.setPosition(position);
			}
		});
		return marker;
	}
	/*
	 * 设置对象的infoWindow内容
	 * html : html string, 不传入html时，如果对象已有的htmlFlag == flag, 则删除对象的html
	 */
	google.maps.Marker.prototype.setHtml = function(html, flag) {
		flag = flag || "default";
		if(html){
			this.data._html = html;
			this.data._htmlFlag = flag;
		}else{
			if(this.data._htmlFlag == flag){
				delete this.data._html;
				delete this.data._htmlFlag;
			}
		}
	};
	google.maps.Marker.prototype.getBounds = function() {
		var bounds = new google.maps.LatLngBounds();
		bounds.extend(this.getPosition());
		return bounds;
	};
	google.maps.Marker.prototype.putData = function(data) {
		this.data = $.extend({}, this.data, data);
	};
	google.maps.Marker.prototype.moveTo = function(position) {
		if(!position){
			return;
		}
		this.setPosition(position);
		this.setIcons();
		this.data.latlng = latlngToStr(position);
		this.data.point = latlngToPointStr(position);
	};
	google.maps.Marker.prototype.setIcons = function(icons) {
		if(icons){
			this.data._icons = icons;
		}
		var icon = this.data._icons[this.data._inEdit ? 1 : 0];
		if(icon){
			this.setIcon(icon);
		}
		if(this.data._label){
			var offset = icon.anchor ? icon.anchor.y : 0;
			this.data._label.setPosition(this.getPosition(), offset);
		}
	};
	/**
	 * 设置为编辑状态
	 * editable : boolean, 进入/退出编辑状态，不指定则自动判断;
	 * doCallback : boolean, 是否触发回调函数，默认true
	 * forceExit : 强制退出编辑状态， OPTIONS.forceExitEdit为false时，可以用forceExit强制
	 */
	google.maps.Marker.prototype.setEdit = function(editable, doCallback, forceExit) {
		if(EDIT_STATUS.editable && !this.data._editDisable){
			if(editable === undefined){
				editable = !this.getDraggable();
			}
			
			forceExit = forceExit || OPTIONS.forceExitEdit;
			
			var _editable = editable || !forceExit; //退出编辑状态时要检查forceExitEdit
			this.setDraggable(_editable);
			this.data._inEdit = _editable;	//标记marker编辑状态
			this.setIcons();
			
			doCallback = (doCallback === undefined) || doCallback;
			if(doCallback){
				var event = editable ? "editMarkerStart" : "editMarkerEnd";
				MAP.edit.doCallback(event, this.data);	//回调函数
			}
		}
	};
	/**
	 * marker动画
	 * path: required, 动画路径, [latlng, ...]
	 * speed: optional, 速度, 单位 米/秒
	 */
	google.maps.Marker.prototype.animate = function(path, speed){
		if(!path || path.length < 2) return;
		if(this._interval){
			clearInterval(this._interval);
			this._interval = null;
		}
		var _this = this;
		speed = speed || 1;
		var timeInterval = 250,	//ms
			step = speed * timeInterval / 1000,	//m
			len = google.maps.geometry.spherical.computeLength(path),	//m
			num = len / step;
		var points = cutPath(path, num),
			i = 0;
		this._interval = setInterval(function(){
			_this.moveTo(points[i++]);
			if(i >= points.length){
				clearInterval(_this._interval);
				_this._interval = null;
			}
		}, timeInterval);
	};

	//========================== Util===========================
	var SEPARATOR = {
			LINE_REG : / *; */,
			POINT_REG : / +/,
			VALUE_REG : / *, */,
			
			LINE : ';',
			POINT : ' ',
			VALUE : ','
	};

	//计算扇形路径
	function computeSectorPath(option) {
		var points = [];
		var point = option.latlng;
		var inRad = parseFloat(option.inner_radius) * 0.3048;
		var outRad = parseFloat(option.outer_radius) * 0.3048;
		var sDeg = parseInt(option.s_degree) % 360;
		var eDeg = parseInt(option.e_degree) % 360;
		var sides = parseInt(option.sides); //边数
		var p = "";
		var deg = eDeg - sDeg;
		if (inRad !== 0) {
			var s = parseInt(sides * inRad / outRad);
			if (s < 1) {
				s = 1;
			}
			for (var i = 0; i <= s; i++) {
				var d = sDeg + deg * i / s;
				p = computeOffsetDestination(point, inRad, d);
				points.push(p);
			}
		} else {
			points.push(point);
		}
		for (var i = sides; i >= 0; i--) {
			var d = sDeg + deg * i / sides;
			p = computeOffsetDestination(point, outRad, d);
			points.push(p);
		}
		points.push(points[0]);
		return points;
	}
	//字符串转经纬度Latlng对象, 格式：lng,lat
	function strToLatlng(str) {
		var separator = SEPARATOR.VALUE_REG;
		var lat = str.split(separator)[1];
		var lng = str.split(separator)[0];
		return new google.maps.LatLng(lat, lng);
	}
	//string路径转latlng路径
	function strToPath(str) {
		var sep_line = SEPARATOR.LINE_REG;
		var sep_point = SEPARATOR.POINT_REG;
		var ls = str.split(sep_line);
		var paths = [];
		_.forEach(ls, function(l){
			var path = [];
			var ps = l.split(sep_point);
			_.forEach(ps, function(p){
				var latlng = strToLatlng(p);
				path.push(latlng);
			});
			paths.push(path);
		});
		if(paths.length === 1){
			paths = paths[0];
		}
		return paths;
	}
	//latlng路径转string
	function pathToStr(path){
		var separator = SEPARATOR.POINT;
		var str = "";
		for (var i = 0; i < path.length; i++) {
			str += latlngToStr(path[i]);
			if(i < path.length - 1){
				str += separator;
			}
		}
		return str;
	}
	//latlng转string
	function latlngToStr(latlng){
		var separator = SEPARATOR.VALUE;
		var lat = latlng.lat().toFixed(6);
		var lng = latlng.lng().toFixed(6);
		return lng + separator + lat;
	}
	//path转point string
	function pathToPointStr(path){
		var separator = SEPARATOR.POINT;
		var str = "";
		for (var i = 0; i < path.length; i++) {
			str += latlngToPointStr(path[i]);
			if(i < path.length - 1){
				str += separator;
			}
		}
		return str;
	}
	//point转string
	function pointToStr(point){
		var separator = SEPARATOR.VALUE;
		return point[0].toFixed(2) + separator + point[1].toFixed(2);
	}
	//latlng转point string
	function latlngToPointStr(latlng){
		var str = "";
		if(COORSYS_UTIL.latlngToPoint){
			var point = COORSYS_UTIL.latlngToPoint(latlng.lng(), latlng.lat());
			str = pointToStr(point);
		}
		return str;
	}
	//path转point数组
	function pathToPoints(path){
		var points = [];
		for(var i=0; i<path.length; i++){
			var latlng = path[i];
			var p = COORSYS_UTIL.latlngToPoint(latlng.lng(), latlng.lat());
			points.push(p);
		}
		return points;
	}
	//path转数组形式[[lng, lat], ...]
	function pathToArray(path){
		var res = [];
		for(var i=0; i<path.length; i++){
			var latlng = path[i];
			res.push([latlng.lng(), latlng.lat()]);
		}
		return res;
	}
	//path平移一段距离
	function pathMove(path, distance, heading){
		var _path = [];
		for(var i=0; i<path.length; i++){
			var p = google.maps.geometry.spherical.computeOffset(path[i], distance, heading);
			_path.push(p);
		}
		return _path;
	}
	//path绕center顺时针旋转一定角度
	function pathRotate(path, center, degrees){
		var _path = [];
		for(var i=0; i<path.length; i++){
			var distance = google.maps.geometry.spherical.computeDistanceBetween(center, path[i]);
			var heading = google.maps.geometry.spherical.computeHeading(center, path[i]);
			heading += degrees;
			var p = google.maps.geometry.spherical.computeOffset(center, distance, heading);
			_path.push(p);
		}
		return _path;
	}
	//判断polygon是否包含polyObj, polyObj可为polyline或polygon
	function containsPolygon(polyObj, polygon){
		//google.maps.geometry.poly.containsLocation
		var contains = true;
		var path = polyObj.getPath().getArray();
		_.forEach(path, function(latlng){
			var c = google.maps.geometry.poly.containsLocation(latlng, polygon);
			if(!c){
				contains = false;
				return false;
			}
		});
		return contains;
	}
	//计算坐标极限值,返回[minX, maxX, minY, maxY]
	function limitsOfPoints(ps){
		var limit = [0, 0, 0, 0];
		if(ps && ps.length > 0){
			var ori = ps[0];
			limit = [ori[0], ori[0], ori[1], ori[1]];
			_.forEach(ps, function(p){
				limit[0] = p[0] < limit[0] ? p[0] : limit[0];
				limit[1] = p[0] > limit[1] ? p[0] : limit[1];
				limit[2] = p[1] < limit[2] ? p[1] : limit[2];
				limit[3] = p[1] > limit[3] ? p[1] : limit[3];
			});
		}
		return limit;
	}
	//计算坐标中心
	function centerOfPoints(ps){
		if(ps.length === 0){
			return [0, 0];
		}
		var limit = limitsOfPoints(ps);
		var x =  (limit[0] + limit[1]) / 2;
		var y =  (limit[2] + limit[3]) / 2;
		return [x, y];
	}
	//字符串转坐标点，
	function strToPoints(pointstr){
		var separat1 = SEPARATOR.POINT_REG;
		var separat2 = SEPARATOR.VALUE_REG;
		var ps = pointstr.split(separat1);
		var result = [];
		_.forEach(ps, function(p){
			if(p !== ""){
				result.push(strToPoint(p));
			}
		});
		return result;
	}
	//字符串转坐标点
	function strToPoint(pointStr){
		var separat = SEPARATOR.VALUE_REG;
		var str = pointStr.split(separat);
		var result = [parseFloat(str[0]), parseFloat(str[1])];
		return result;
	}
	//直线上距离直线外一点最近的点, line: 直线上2点[[x1, y1], [x2, y2]]; point: 直线外的点[x3, y3]
	function closestPointOnLine(line, point){
		var x1 = line[0][0];
		var y1 = line[0][1];
		var x2 = line[1][0];
		var y2 = line[1][1];
		var x3 = point[0];
		var y3 = point[1];
		if(x1 == x2){
			return [x1, y3];
		}
		if(y1 == y2){
			return [x3, y1];
		}
		var a = (y1 -y2) / (x1 - x2);
		var b = y1 - a * x1;
		var c = y3 + x3 / a;
		var x = (c - b) / (a + 1 / a);
		var y = c - x / a;
		return [x, y];
	}
	//点到直线的距离,line: 直线上2点[[x1, y1], [x2, y2]]; point: 直线外的点[x3, y3]
	function lenOfPointToLine(line, point){
		var p = closestPointOnLine(line, point);
		var dis = lenOfLine(p, point);
		return dis;
	}
	//线段长度
	function lenOfLine(p1, p2){
		return Math.sqrt((p1[0] - p2[0]) * (p1[0] - p2[0]) + (p1[1] - p2[1]) * (p1[1] - p2[1]));
	}
	/**
	 * 用对角线和一条边所在直线建立矩形
	 * o: 边和对角线共用点， x: 边上另一点， r: 对角线上另一点
	 * 返回矩形4个点坐标[a, b, c, d]
	 */
	function buildRectWithDiagonal(o, r, x){
		var p1 = closestPointOnLine([o, x], r);
		var _x = o[0] + r[0] - p1[0],
			_y = o[1] + r[1] - p1[1];
		var p2 = [_x, _y];
		return [o, p1, r, p2];
	}
	/**
	 * 将一条直线分割成指定段数。
	 * from, to : 起始点latlng; 
	 * num : 段数; 
	 * gap : 间距; 
	 * reserve : 前后保留距离; 
	 * 单位 ： 米
	 * 返回latlng数组，含from和to
	 */
	function cutLine(from, to, num, gap, reserve){
		num = (!num || num < 1) ? 1 : num;
		gap = gap || 0;
		var heading = google.maps.geometry.spherical.computeHeading(from, to);
		if(reserve){
			from = google.maps.geometry.spherical.computeOffset(from, reserve, heading);
			to = google.maps.geometry.spherical.computeOffsetOrigin(to, reserve, heading);
		}
		var res = [from];
		var distance = google.maps.geometry.spherical.computeDistanceBetween(from, to);
		var _dis = (distance + gap) / num - gap;
		for(var i = 0; i < num - 1; i++){
			var p = google.maps.geometry.spherical.computeOffset(res[2*i], _dis, heading);
			res.push(p);
			if(gap){
				p = google.maps.geometry.spherical.computeOffset(p, gap, heading);
			}
			res.push(p);
		}
		res.push(to);
		return res;
	}
	/**
	 * 将一条路径切割成指定段数
	 * path: [latlng, ...]
	 * num: 段数
	 * 返回latlng数组，含起始点
	 */
	function cutPath(path, num){
		if(!path || path.length < 2 || !num || num < 1)
			return [];
		var len = google.maps.geometry.spherical.computeLength(path),
			step = len / num,
			res = [],
			from, to, _len = 0, last = path[0];
		res.push(path[0]);
		for(var i = 1; i < path.length; i++){
			from = path[i -1];
			to = path[i];
			var heading = google.maps.geometry.spherical.computeHeading(from, to);
			if(_len > 0){
				from = google.maps.geometry.spherical.computeOffsetOrigin(from, _len, heading);
				last = from;
			}
			_len += google.maps.geometry.spherical.computeDistanceBetween(from, to);
			while(_len >= step){
				var p = google.maps.geometry.spherical.computeOffset(last, step, heading);
				res.push(p);
				last = p;
				_len -= step;
			}
		}
		if(_len > step / 2){
			res.push(path[path.length - 1]);
		}
		return res;
	}
	/**
	 * 按比例切割polygon, 切割方向沿较长边
	 * path : polygon path
	 * parts : 各部分占比，取值0-100
	 */
	function cutPolygon(path, parts){
		if(!path || path.length < 4){
			return [];
		}
		var p;	//沿切割方向的2条边：p[0]->p[1], p[2]->p[3]
		var d1, d2; //沿切割方向的2条边长
		var dis1 = google.maps.geometry.spherical.computeDistanceBetween(path[0], path[1]);
		var dis2 = google.maps.geometry.spherical.computeDistanceBetween(path[1], path[2]);
		if(dis1 > dis2){
			//方向控制为从左向右切割
			var heading = google.maps.geometry.spherical.computeHeading(path[0], path[1]);
			p = heading > 0 ? [path[0], path[1], path[3], path[2]] : [path[1], path[0], path[2], path[3]];
			d1 = dis1;
			d2 = google.maps.geometry.spherical.computeDistanceBetween(path[3], path[2]);
		}else{
			var heading = google.maps.geometry.spherical.computeHeading(path[1], path[2]);
			p = heading > 0 ? [path[1], path[2], path[0], path[3]] : [path[2], path[1], path[3], path[0]];
			d1 = dis2;
			d2 = google.maps.geometry.spherical.computeDistanceBetween(path[0], path[3]);
		}
		var paths = [];
		var fraction = 0;
		var path = [p[2], p[0]];
		_.forEach(parts, function(part){
			fraction += part/100;
			var p1 = google.maps.geometry.spherical.interpolate(p[0], p[1], fraction);
			var p2 = google.maps.geometry.spherical.interpolate(p[2], p[3], fraction);
			path.push(p1);
			path.push(p2);
			paths.push(path);
			path = [p2, p1];
		});
		return paths;
	}
	/**
	 * 按位置排列多平行
	 * basePolygon : 按此多边形方向排列
	 * 返回：｛
	 * 		result : 排序后的结果
	 * 		heading : 排序依据的heading
	 * 		headingPoints : 决定heading的2点 [p1, p2], 取自basePolygon边的中点
	 * 		basePath : 调整顺序后的basePolygon Path [p1, p2, p3, p4], p1-p2、p4-p3同heading方向
	 * ｝
	 */
	function sortPolygonsByPosition(polygons, basePolygon){
		var basePath = basePolygon.getPath().getArray();
		var b1 = google.maps.geometry.spherical.interpolate(basePath[0], basePath[1], 0.5),
			b2 = google.maps.geometry.spherical.interpolate(basePath[1], basePath[2], 0.5),
			b3 = google.maps.geometry.spherical.interpolate(basePath[2], basePath[3], 0.5),
			b4 = google.maps.geometry.spherical.interpolate(basePath[3], basePath[0], 0.5);
		var dir1 = google.maps.geometry.spherical.computeHeading(b1, b3),
			dir2 = google.maps.geometry.spherical.computeHeading(b2, b4);
		var sumDir1 = 0, 
			sumDir2 = 0;
		_.forEach(polygons, function(polygon){
			var center = polygon.getCenter();
			sumDir1 += Math.abs(google.maps.geometry.spherical.computeHeading(b1, center) - dir1);
			sumDir2 += Math.abs(google.maps.geometry.spherical.computeHeading(b2, center) - dir2);
		});
		var baseDir = sumDir1 < sumDir2 ? dir1 : dir2;
		var basePoint = sumDir1 < sumDir2 ? b1 : b2;
		var sort = _.sortBy(polygons, [function(polygon){
			var center = polygon.getCenter();
			return google.maps.geometry.spherical.computeDistanceBetween(basePoint, center);
		}]);
		return {
			result : sort,
			heading : baseDir,
			headingPoints : sumDir1 < sumDir2 ? [b1, b3] : [b2, b4],
			basePath : sumDir1 < sumDir2 ? [basePath[1], basePath[2], basePath[3], basePath[0]] : basePath
		};
	}
	
	//地址查询,address支持经纬度和地址名。{location : LatLng}/{address : str}
	function seachAddress(address, successFun, errorFun) {
		var addr;
		var regLatlng = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/;
		if(regLatlng.test(address)){	//经纬度
			addr = {location : address};
		}else{	//地址
			addr = {address : address};
		}
		var seachService = new google.maps.Geocoder();
		seachService.geocode(addr, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				if(successFun){
					successFun(results);
				}
			} else {
				if(successFun){
					successFun(results);
				}
			}
		});
	}
	//产生随机整数，默认10位长度
	function randomInt(len){
		len = len || 10;
		return Math.floor(Math.floor(Math.random()*Math.pow(10, len)));
	}
	function isMobile(){
		var reg = /[android|ipad|iphone]/i;
		var userAgent = window.navigator.userAgent;
		return reg.test(userAgent);
	}
	/**
	 * 组合键
	 * e:事件对象
	 * down: 按下的键名
	 * up: 没有按下的键名键名
	 * 键名：String or Array, e.g.: 'alt' or ['alt', 'ctrl']
	 */
	function isCompositeKey(e, down, up){
		e = getMouseEvent(e);
		if(!e) return false;
		var result = true;
		down = down || [];
		if(typeof(down) == "string"){
			down = [down];
		}
		up = up || [];
		if(typeof(up) == "string"){
			up = [up];
		}
		_.forEach(down, function(k){
			k += "Key";
			result = result && e[k];
		});
		_.forEach(up, function(k){
			k += "Key";
			result = result && !e[k];
		});
		return result;
	}
	function getMouseEvent(e){
		if(!e) return null;
		if(e instanceof MouseEvent){
			return e;
		}
		var _e = null;
		_.forEach(e, function(p){
			if(p instanceof MouseEvent){
				_e = p;
				return false;
			}
		});
		return _e;
	}
	//============ LabelOverlay == =========
	/**
	 * 地图上添加文字标记
	 * position : 经纬度
	 * label : 要显示的文字或html
	 * option -->
	 * 	zoomRange : 在此范围内自动显示/隐藏 ，默认不自动，空值时不受自动控制，格式:[2,8]
	 * 	align : 值：right left center top bottom ,label相对于position的显示位置 ，默认right
	 * 	offset : //偏移像素点,配合align使用
	 * 	hasBorder : 是否显示边框，boolean类型,默认false
	 */
	function LabelOverlay(map, position, label, options) {
		var opt = options || {};

		this.zoomRange = opt.zoomRange;
		this.label = label;
		this.position = position;
		this.align = opt.align;
		this.offset = opt.offset ? parseInt(opt.offset) : 0;
		this.div = null;
		this.hasBorder = opt.hasBorder;

		this.map = map;
		this.setMap(map);
	}
	LabelOverlay.prototype = new google.maps.OverlayView();
	LabelOverlay.prototype.onAdd = function() {
		var div = this.div || document.createElement('div');
		div.style.border = "none";
		div.style.borderWidth = "0px";
		div.style.position = "absolute";
		div.style.textShadow = "1px 1px 0px white, -1px -1px 0px white, 1px -1px 0px white, -1px 1px 0px white "; //文字阴影
		div.style.fontSize = "12px";
		div.style.fontWeight = "600";
		div.style.zIndex = "800";
		if (this.hasBorder) {
			div.style.border = "solid";
			div.style.borderWidth = "1px";
			div.style.borderColor = "#CCCCCC";
			div.style.backgroundColor = "#EEEEEE";
		}
		div.innerHTML = this.label;

		if (this.div !== null && this.div.parentNode !== null) {
			this.div.parentNode.removeChild(this.div);
		}
		this.div = div;

		var panes = this.getPanes();
		if (panes) {
			panes.overlayLayer.appendChild(div);
		}
	};
	LabelOverlay.prototype.draw = function() {
		var overlayProjection = this.getProjection();
		if (!overlayProjection) {
			return;
		}
		var div = this.div;
		if(!div){
			this.onAdd();
			return;
		}
		var point = overlayProjection.fromLatLngToDivPixel(this.position);

		var left = point.x;
		var top = point.y;
		if (this.align == "right") {
			left += this.offset;
			top -= $(div).height() / 2;
		} else if (this.align == "left") {
			left -= $(div).width() + this.offset;
			top -= $(div).height() / 2;
		} else if (this.align == "center") {
			left -= $(div).width() / 2;
			top -= $(div).height() / 2;
		} else if (this.align == "top") {
			left -= $(div).width() / 2;
			top -= $(div).height() + this.offset;
		} else if (this.align == "bottom") {
			left -= $(div).width() / 2;
			top += this.offset;
		}
		div.style.left = left + "px";
		div.style.top = top + "px";

		this.autoDisplay();
	};
	LabelOverlay.prototype.onRemove = function() {
		if (this.div !== null && this.div.parentNode !== null) {
			this.div.parentNode.removeChild(this.div);
		}
		//this.div = null;
	};
	LabelOverlay.prototype.setPosition = function(position, offset) {
		this.offset = offset || this.offset;
		this.position = position || this.position;
		this.draw();
	};
	LabelOverlay.prototype.setLabel = function(label) {
		this.label = label;
		//this.onRemove()
		this.onAdd();
		this.draw();
	};
	LabelOverlay.prototype.setStyle = function(style) {
		$(this.div).css(style);
	};
	LabelOverlay.prototype.setVisible = function(boolean) {
		if (boolean) {
			$(this.div).show();
		} else {
			$(this.div).hide();
		}
	};
	LabelOverlay.prototype.getVisible = function() {
		if(this.getMap === null){
			return false;
		}
		return $(this.div).is(":visible");
	};
	LabelOverlay.prototype.autoDisplay = function() {
		if(!this.map){
			return;
		}
		var range = this.zoomRange;
		if (range && range.length > 1) {
			var zoom = this.map.zoom;
			if (zoom >= range[0] && zoom <= range[1]) {
				$(this.div).show();
			} else {
				$(this.div).hide();
			}
		}
	};
	//============== Map main ==============
	function Map(el, options){
		options = options || {};
		
		this.isMobile = isMobile();

		this.el = el;	//dom元素
		this.map = createMap(el, options.simple_map);

		this.currentPosition = null;	//鼠标当前Latlng
		
		this.locateMarkers = [];
		this.groupMarkers = {};		//分布Markers总揽
		this.polylines = {};	//线，按group分组
		this.polygons = {};	//多边形，按group分组
		this.polysArgs = {};	//创建polygon/polyline group参数备份, 在复制或者创建的时候会用到
		
		this.routePlayers = {};	//key : player. 路径播放interval
		
		this.ghostInfoWindow = null;	//公共的InfoWindow
		
		this.ghostLabel = null;	//用于鼠标跟随的动态label，防止Label过多导致页面卡顿
		this.ghostPolygon = null;	//用于鼠标跟随的polygon, 原始的Polygon对象，click时执行data.click函数
		this.controls = {};	//自定义地图控件
		this.noRecombineGroups = [];	//地图缩放时不需要重组的marker group
		
		this.coorSysLines = [];	//坐标系轴的polyline
		
		this.baseLine = null;	//辅助线，polygon对齐时会用到

		this.heatMap = null;	//热图
		this.heatLocation = null;
		
		this.rubberLine = null;	//画线的橡皮筋效果polyline
		this.rubberLinePath = [];	//橡皮筋polyline路径

		/**
		 * 地图各种状态时的回调函数,如无特别说明,回调是参数为对象的data数据
		 * editPolygonStart : polygon对象进入编辑状态
		 * editPolygonEnd : polygon对象完成编辑
		 * editPolygonEndAll : polygon对象全部完成编辑, 参数：无
		 * editPolygonRightclick : polygon对象编辑状态下鼠标右击事件	(该事件已取消)
		 * editPolygonCancel : polygon对象取消编辑状态
		 * editPolygonRemove : polygon对象移除
		 * 
		 * mapLine : 地图上添加polyline的时候触发，参数: path [[lng, lat], ...]
		 * editPolylineStart : polyline对象进入编辑状态
		 * editPolylineEnd : polyline对象完成编辑
		 * editPolylineEndAll : polyline对象全部完成编辑态, 参数：无
		 * editPolylineCancel : polyline对象取消编辑状态
		 * editPolylineRemove : polyline对象移除
		 * 
		 * mapMark : 地图上添加marker时触发
		 * editMarkerStart : marker对象进入编辑状态
		 * editMarkerEnd : marker对象完成编辑
		 * editMarkerEndAll : marker对象全部完成编辑, 参数：无
		 * editMarkerCancel : marker对象取消编辑
		 * editMarkerRemove : marker对象移除
		 * 
		 * mapDrawToolStatusChange : 绘图工具开关状态改变时触发，参数:{name: string, status: boolean}。 
		 * 							//name:工具名称, ['marker', 'polyline', 'polygon'...]; 
		 * 							//status: 开关状态
		 * 
		 * polygonClick : polygon对象单击
		 * polygonRightclick : polygon对象单击
		 * polygonDblclick : polygon对象单击
		 * polygonMouseover : polygon对象鼠标进入时触发
		 * polygonMouseout : polygon对象鼠标移出时触发
		 * 
		 * markerClick : marker对象单击
		 * markerRightclick : marker对象单击
		 * markerDblclick : marker对象单击
		 * 
		 * mapZoomChange : map zoom发生改变时触发，参数: map.zoom
		 * mapDragEnd : map 拖动事件结束时触发，参数: 无
		 * mapResize : map size改变时触发，参数: 无
		 *
		 * doCallback : 如果存在doCallback函数，则所有回调都通过该方法实现，参数为(callName, data), e.g.: doCallback(editPolygonStart, data);
		 */
		this.callbacks = {};

		//计算像素等算法需要
		this.overlay = new google.maps.OverlayView();
		this.overlay.draw = function() {};
		this.overlay.setMap(this.map);
		
		this.init();
		/*
		Route.map = this.map;
		Route.overLay = new google.maps.OverlayView();
		Route.overLay.draw = function() {};
		Route.overLay.setMap(this.map);
		*/
	}
	Map.PROVIDER_NAME = "Google Maps V3";

	Map.prototype.init = function(){
		this.edit.map = this;
		MAP = this;
		var _this = this;
		
		this.fitScreenControl(true);

		this.ghostInfoWindow = new google.maps.InfoWindow();
		this.ghostLabel = new LabelOverlay(null, null, "", {align : "center"});

		this.ghostPolygon = new google.maps.Polygon(COLOR_SCHEME.GHOST_POLYGON);
		this.ghostPolygon.putData({});
		google.maps.event.addListener(this.ghostPolygon, "click", function(e){
			if(EDIT_STATUS.editable && this.data && this.data.click){
				this.data.click(this.data.move ? e.latLng : null);
			}
		});
		google.maps.event.addListener(this.ghostPolygon, "rightclick", function(e){
			if(EDIT_STATUS.copy){
				this.setMap(null);
				EDIT_STATUS.copy = false;
			}
		});

		google.maps.event.addListener(this.map, "zoom_changed", function(){
			var zoom = this.zoom;

			$("#map-zoom").html("Zoom : "+zoom);
			
			_this.updateMarkerStatusInMap();
			_this.groupMarkersRecombine();
			_this.labelAutoDisplay();
			
			MAP.edit.doCallback("mapZoomChange", zoom);
		});
		google.maps.event.addListener(this.map, "click", function(e){
			if(EDIT_STATUS.mark){
				MAP.edit.mark();
				return;
			}
			if(EDIT_STATUS.line){
				MAP.edit.line("click");
				return;
			}
		});
		google.maps.event.addListener(this.map, "rightclick", function(e){
			if(EDIT_STATUS.line){
				MAP.edit.line("rightclick");
				return;
			}
			if(EDIT_STATUS.remove){
				$(_this.el).find("#edit-remove").trigger("click");
			}
			if(EDIT_STATUS.cut){
				//MAP.ghostPolygon.setMap(null);
				$(MAP.el).find("#edit-cut").trigger("click");
			}
			if(EDIT_STATUS.mark){
				$(MAP.el).find("#edit-mark").trigger("click");
			}
			if(EDIT_STATUS.justify){
				$(MAP.el).find("#edit-justify").trigger("click");
			}
			if(EDIT_STATUS.format){
				$(MAP.el).find("#edit-format-shape").trigger("click");
			}
			if(EDIT_STATUS.rotate){
				$(MAP.el).find("#edit-rotate").trigger("click");
			}
		});

		google.maps.event.addListener(this.map, "dragend", function(e){
			_this.updateMarkerStatusInMap();
			MAP.edit.doCallback("mapDragEnd");
		});
		
		google.maps.event.addListener(this.map, "resize", function(e){
			_this.updateMarkerStatusInMap();
			MAP.edit.doCallback("mapResize");
		});
		/*
		google.maps.event.addListener(this.map, "bounds_changed", function(e){
			console.log("bounds_changed");
		});
		*/
		google.maps.event.addListener(this.map, "mousemove", function(e){
			//_this.currentPosition = e.latLng; //鼠标进入覆盖图层上时失效
		});

		google.maps.event.addDomListener(this.el, "click", function(e){
			
		});
		google.maps.event.addDomListener(this.el, "mousemove", function(e){
			var offset = $(this).offset();
			_this.currentPosition = _this.fromContainerPixelToLatLng(e.clientX - offset.left, e.clientY - offset.top);

			//======  ghostPolygon  ========
			if(_this.ghostPolygon.getMap()){
				if(_this.ghostPolygon.data.move){
					_this.ghostPolygon.moveTo(_this.currentPosition);
				}
			}
			if(EDIT_STATUS.line){
				MAP.edit.line("move");
			}
			//======  ghostPolygon over ========
		});
		
		//监听map容器size变化
		var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
		if(MutationObserver){
			var observer = new MutationObserver(function(records){
				google.maps.event.trigger(_this.map, 'resize');
			});
			observer.observe(this.el, {attributes : true, attributesFilter : ["style"]});
		}
	};
	
	Map.prototype.setOptions = function(k, v){
		OPTIONS[k] = v;
	};
	//初始化坐标系
	Map.prototype.initCoorSysUtil = function(util){
		if(_.isEmpty(util.coorsys)){
			COORSYS_UTIL.coorsys = null;
			console.warn("[GIS] Empty coord sys params.");
			return;
		}
		//自动计算XY边长
		var coorsys = util.coorsys;
		if(!coorsys.maxX || !coorsys.maxY){
			var o = strToLatlng(coorsys.pointOrigin),
				x = strToLatlng(coorsys.pointX),
				y = strToLatlng(coorsys.pointY);
			coorsys.maxX = google.maps.geometry.spherical.computeDistanceBetween(o, x);
			coorsys.maxY = google.maps.geometry.spherical.computeDistanceBetween(o, y);
		}
		$.extend(COORSYS_UTIL, util);
		
		//coord show status
		var coordsysOn = $(this.el).find("#edit-coord").attr("on") == "on";
		if(coordsysOn){
			this.setCoorSysVisible(true);
		}
	};
	//显示/隐藏坐标系
	Map.prototype.setCoorSysVisible = function(visible){
		if(this.coorSysLines.length > 0){
			for(var i = 0; i < this.coorSysLines.length; i++){
				this.coorSysLines[i].setMap(null);
			}
		}
		if(visible){
			var lines = COORSYS_UTIL.getCoorSysLines();
			if(!lines){
				return;
			}
			for(var i = 0; i < lines.length; i++){
				lines[i].setMap(this.map);
			}
			this.coorSysLines = lines;
		}
	};
	Map.prototype.setGhostPolygon = function(paths, data, zIndex){
		zIndex = (zIndex === undefined || zIndex === null) ? COLOR_SCHEME.GHOST_POLYGON.zIndex : zIndex;
		data = data || {};
		
		var ghost = this.ghostPolygon;
		ghost.setPaths(paths);
		ghost.data = data;	//覆盖老数据
		ghost.setOptions({
			zIndex : zIndex
		});
		ghost.setMap(this.map);
	};
	/**
	 * 显示分散的位置。当地图缩放时，根据图标间的距离合并或拆分图标。
	 * group : String	分组名称
	 * locs : {
	 * 		latlng : string, 	//必须 格式：lng,lat
	 * 		name : string, 		//可选
	 * 		_icons : array, 	//可选
	 * 		_html : string		//可选
	 * 		_isNew : boolean	//可选
	 * }
	 * fitBounds : markers创建完成后调整视口,
	 * options : 
	 * 		noRecombine : 地图缩放时不重组
	 * 		noLabel : 不显示label
	 */
	Map.prototype.setMarkerPosition = function(marker, latlng) {
		var position = strToLatlng(latlng);
		marker.setPosition(position);

		var bounds = this.map.getBounds();
		var point = latlng.split(",");
		var lng = parseFloat(point[0]);
		var lat = parseFloat(point[1]);

        var keys = _.keys(bounds);
        var Ya = bounds[keys[0]] || {};
        var Xa = bounds[keys[1]] || {};
		if (lng < Xa.i || lng > Xa.j || lat < Ya.i || lat > Ya.j) {
			this.setCenter(position);
		}
	};
	Map.prototype.createMarker = function(loc) {
		var position = strToLatlng(loc.latlng);
		var icons = loc._icons;
		var marker = createMarker(position, icons);
		marker.setMap(this.map);

		var bounds = this.map.getBounds();
		var point = loc.latlng.split(",");
		var lng = parseFloat(point[0]);
		var lat = parseFloat(point[1]);

		var keys = _.keys(bounds);
		var Ya = bounds[keys[0]] || {};
		var Xa = bounds[keys[1]] || {};
		if (lng < Xa.i || lng > Xa.j || lat < Ya.i || lat > Ya.j) {
			this.setCenter(position);
		}

		return marker;
	};
	Map.prototype.createMarkers = function(group, locs, fitBounds, options){
		var _this = this;
		options = options || {};
		var noRecombine = options.noRecombine;
		var noLabel = options.noLabel;
		
		locs = locs || [];
		
		var markers = this.groupMarkers[group] || [];
		var _bounds = new google.maps.LatLngBounds();
		for(var i=0; i<locs.length; i++){
			var loc = locs[i];
			if(!loc.latlng){
				console.warn("No latlng to create Marker:\n", loc);
				continue;
			}
			var position = strToLatlng(loc.latlng);
			var icons = loc._icons;
			var marker = createMarker(position, icons);
			marker.putData(cleanData(loc));
			_bounds.extend(position);
			loc._uuid = marker.data._uuid;
			if(loc.name && !noLabel){
				//marker.setTitle(loc.name);
				var offset = (icons && icons[0].anchor) ? icons[0].anchor.y : 0;
				marker.data._label = new LabelOverlay(this.map, position, loc.name.toUpperCase(), {align: "bottom", offset : offset});
			}
			if(loc._isNew){
				marker.data._isNew = true;
				marker.setEdit(true);
			}
			if(loc._html){
				marker.data._html = loc._html;
			}
			markers.push(marker);
		}
		this.groupMarkers[group] = markers;
		if(noRecombine){
			this.noRecombineGroups.push(group);
			this.noRecombineGroups = _.uniq(this.noRecombineGroups);
		}else{
			this.groupMarkersRecombine(group);
		}
		if(fitBounds && !_.isEmpty(markers)){
			//this.fitBounds(_bounds);
			this.map.fitBounds(_bounds);
		}
		this.updateMarkerStatusInMap();
	};
	Map.prototype.showMarkers = function(group){
		for(var key in this.groupMarkers){
			if(group && group != key){
				continue;
			}
			var markers = this.groupMarkers[key];
			for(var i=0; i<markers.length; i++){
				var marker = markers[i];
				marker.setMap(this.map);
				if(marker.data._label){
					marker.data._label.setMap(this.map);
				}
			}
		}
	};
	/**
	 * 设置marker动画
	 * animat : {
	 * 		path : latlngStr, ...,
	 * 		speed : m/s
	 * }
	 */
	Map.prototype.setMarkerAnimat = function(uuid, animat){
		if(uuid){
			var marker = this.getMarkers(null, {_uuid : uuid})[0];
			if(marker){
				var path = strToPath(animat.path);
				marker.animate(path, animat.speed);
			}
		}
	};
	Map.prototype.setMarkerIcons = function(uuid, icons){
		if(uuid && icons){
			var marker = this.getMarkers(null, {_uuid : uuid})[0];
			if(marker){
				marker.setIcons(icons);
			}
		}
	};
	Map.prototype.renameMarker = function(uuid, name){
		var marker = this.getMarkers(null, {_uuid : uuid})[0];
		var data = marker.data;
		data.name = name;
		if(data._label){
			data._label.setLabel(name);
		}
	};
	Map.prototype.rebuildMarker = function(uuid, group, loc){
		if(uuid){
			var marker = this.getMarkers(null, {_uuid : uuid})[0];
			if(marker){
				marker.setMap(null);
				if(marker.data._label){
					marker.data._label.setMap(null);
				}
				_.remove(this.groupMarkers[marker.data._group], function(m){
					return m.data._uuid == uuid;
				});
			}
		}
		if(loc){
			this.createMarkers(group, [loc]);
		}
	};
	/**
	 * 过滤marker。
	 * group	为空时不考虑group条件；
	 * filter	json，过滤条件，匹配marker的data数据，为空时不考虑filter;
	 * withGroup boolean, 返回结果是否分组。分组时返回json；不分组时返回array，并在data内添加_group属性。
	 */
	Map.prototype.getMarkers = function(group, filter, withGroup){
		var list =  withGroup ? {} : [];
		for(var key in this.groupMarkers){
			if(group && group != key){
				continue;
			}
			if(withGroup){
				list[key] = list[key] || [];
			}
			var markers = this.groupMarkers[key];
			for(var i=0; i<markers.length; i++){
				var data = markers[i].data;
				var match = true;
				if(filter){
					for(var f in filter){
						if(data[f] != filter[f]){
							match = false;
							break;
						}
					}
				}
				if(match){
					if(withGroup){
						list[key].push(markers[i]);
					}else{
						markers[i].data._group = key;
						list.push(markers[i]);
					}
				}
			}
		}
		return list;
	};
	Map.prototype.fitBoundsWithMarkers = function(group, filter){
		var markers = this.getMarkers(group, filter);
		if(markers.length === 0)
			return;
		var bounds = new google.maps.LatLngBounds();
		_.forEach(markers, function(marker){
			var b = marker.getBounds();
			bounds.extend(b);
		});
		if(!bounds.isEmpty()){
			this.map.fitBounds(bounds);
		}
	};
	Map.prototype.clearMarkers = function(group, remove){
		for(var key in this.groupMarkers){
			if(group && group != key){
				continue;
			}
			var ms = this.groupMarkers[key];
			if(ms && ms.length>0){
				for(var i=0; i<ms.length; i++){
					var marker = ms[i];
					marker.setMap(null);
					if(marker.data._label){
						marker.data._label.setMap(null);
					}
				}
			}
			if(remove){
				delete this.groupMarkers[key];
			}
		}
	};
	//更新marker状态:是否在地图视野中
	Map.prototype.updateMarkerStatusInMap = function(){
		var bounds = this.map.getBounds();
		if(!bounds)
			return;
		var groups = this.groupMarkers;
		_.forEach(groups, function(group){
			if(group.length > 0){
				_.forEach(group, function(m){
					var inMap = bounds.contains(m.getPosition());
					m.data._inMap = inMap;
				});
			}
		});
	};
	/**
	 * Group Markers 重新组合
	 */
	Map.prototype.groupMarkersRecombine = function(group){
		//距离界限, px
		var LIMIT = 25;
		//无参数时默认刷新所有markers
		var groups = this.groupMarkers;
		for(var key in groups){
			if(group && group != key || _.includes(this.noRecombineGroups, key)){
				continue;
			}
			var ms = groups[key];
			if(ms && ms.length>0){
				for(var j=0; j<ms.length-1; j++){
					var m1 = ms[j];
					if(!m1.getVisible())
						continue;
					var merge = [];
					for(var k=j+1; k<ms.length; k++){
						var m2 = ms[k];
						if(j > 0 && !m2.getVisible()){
							continue;
						}
						var dis = this.distanceOfPixel(m1.getPosition(), m2.getPosition());
						if(dis >= 0 && dis < LIMIT){
							if(m2.data._label)
								m2.data._label.setVisible(false);
							m2.setVisible(false);
							merge.push(m2);
						}else{
							m2.setVisible(true);
							if(m2.data._label)
								m2.data._label.setVisible(true);
						}
					}
					var mergeSize = merge.length + 1;
					m1.putData({_merge : merge});
					if(mergeSize > 1){
						m1.setLabel(mergeSize+"");
						if(m1.data._label)
							m1.data._label.setVisible(false);
					}else{
						m1.setLabel(null);
						if(m1.data._label)
							m1.data._label.setVisible(true);
					}
					if(m1.data._infoWindow){
						m1.data._infoWindow.setContent(getInfoContent(merge.concat([m1])));
					}
				}
			}
		}

		function getInfoContent(markers){
			var html = "";
			for(var i=0; i<markers.length; i++){
				var marker = markers[i];
				if(marker.data.name){
					html += marker.data.name;
					if(i < markers.length-1){
						html += "<br/>";
					}
				}
			}
			return html;
		}
	};
	/**
	 * 创建一组Polygon
	 * style : 指定polyline的样式
	 * locs : {
	 * 		latlng : string, 	//必须 格式：lng,lat
	 * 		_isNew : boolean	//可选
	 * }
	 * options :
	 * 		editDisable : boolean, 是否不可编辑
	 * 		editDeceive : boolean, 编辑状态欺骗，进入编辑状态时，会产生编辑样式效果、回调，但不能被编辑（drag, edit）
	 */
	Map.prototype.createPolylines =function(group, lines, style, options){
		options = options || this.polysArgs[group+"_option"] || this.polysArgs.default_option || {};
		style = style || this.polysArgs[group+"_style"] || this.polysArgs.default_style || {};
		lines = lines || [];
		var list =  [];
		
		for(var i=0; i<lines.length; i++){
			var line = lines[i];
			if(!line.latlng){
				console.warn("No latlng to create Polyline:\n", line);
				continue;
			}
			var polyline = createPolyline(strToPath(line.latlng), (line.style || style), options);
			var data = cleanData(line);
			polyline.putData(data);
			var uuid = polyline.data._uuid;
			line._uuid = uuid;
			polyline.putData({
				_group : group,
				_editDisable : options.editDisable,
				_editDeceive : options.editDeceive
			});
			if(line._isNew){
				polyline.data._isNew = true;
				polyline.setEdit(true);
			}
			if(line._html){
				polyline.data._html = line._html;
			}
			
			list.push(polyline);
		}
		if(list.length > 0){
			var _group = this.polylines[group] || [];
			this.polylines[group] = _group.concat(list);
		}
		return list;
	};
	Map.prototype.showPolylines = function(group, filter, style){
		for(var key in this.polylines){
			if(group && group != key){
				continue;
			}
			var polylines = filter ? this.getPolylines(key, filter) : this.polylines[key];
			for(var i=0; i<polylines.length; i++){
				var polyline = polylines[i];
				if(style){
					polyline.data._style = style;
					polyline.setOptions(style);
				}
				polyline.setMap(this.map);
				if(polyline.data._label){
					polyline.data._label.setMap(this.map);
				}
			}
		}
	};
	/**
	 * 重建polyline
	 * 先删除原polyline, 再创建新的
	 * uuid : 原uuid
	 * group : 新group
	 * loc : 新loc
	 */
	Map.prototype.rebuildPolyline = function(uuid, group, line){
		//删除
		if(uuid){
			var polyline = this.getPolylines(null, {_uuid : uuid})[0];
			if(polyline){
				polyline.setMap(null);
				var data = polyline.data;
				_.remove(this.polylines[data._group], function(p){
					return p.data._uuid == uuid;
				});
			}
		}
		//重建
		if(line){
			this.createPolylines(group, [line]);
		}
	};
	Map.prototype.clearPolylines = function(group, remove){
		for(var key in this.polylines){
			if(group && group != key){
				continue;
			}
			var polylines = this.polylines[key];
			for(var i=0; i<polylines.length; i++){
				var polyline = polylines[i];
				polyline.setMap(null);
				if(polyline.data._label){
					polyline.data._label.setMap(null);
				}
			}
			if(remove){
				delete this.polylines[key];
			}
		}
	};
	/**
	 * 过滤polyline。
	 * group	为空时不考虑group条件；
	 * filter	json，过滤条件，匹配polygon的data数据，为空时不考虑filter;
	 * withGroup boolean, 返回结果是否分组。分组时返回json；不分组时返回array，并在data内添加_group属性。
	 */
	Map.prototype.getPolylines = function(group, filter, withGroup){
		var list =  withGroup ? {} : [];
		for(var key in this.polylines){
			if(group && group != key){
				continue;
			}
			if(withGroup){
				list[key] = list[key] || [];
			}
			var polylines = this.polylines[key];
			for(var i=0; i<polylines.length; i++){
				var data = polylines[i].data;
				var match = true;
				if(filter){
					for(var f in filter){
						if(data[f] != filter[f]){
							match = false;
							break;
						}
					}
				}
				if(match){
					if(withGroup){
						list[key].push(polylines[i]);
					}else{
						polylines[i].data._group = key;
						list.push(polylines[i]);
					}
				}
			}
		}
		return list;
	};
	Map.prototype.getPolylineDatas = function(group, filter){
		var lines = this.getPolylines(group, filter);
		var datas = [];
		_.forEach(lines, function(line){
			datas.push(line.data);
		});
		return datas;
	};
	/**
	 * 路径播放器
	 * id : 指定player的id
	 * pathStr : latlng串， 格式：lat,lng lat,lng lat,lng...
	 * options : 播放器选项
	 * 		interval : int, 播放速度，毫秒，默认200
	 * 		preRoute : boolean, 是否显示没有经过的线路, 默认false
	 * 		preRouteStyle : preRoute样式
	 * 		overRouteStyle : overRoute样式
	 * 		setProgress : function(index){}, 设置播放进度。参数：当前播放点索引
	 */
	Map.prototype.createRoutePlayer = function(id, pathStr, options){
		if(pathStr.length === 0){
			return;
		}
		id = id || "default_route";
		//删除同名player
		this.clearRoutePlayer(id);
		
		var preRoute = options.preRoute;
		var preRouteStyle = options.preRouteStyle || COLOR_SCHEME.ROUTE_PLAYER.PREVIEW;
		var overRouteStyle = options.overRouteStyle || COLOR_SCHEME.ROUTE_PLAYER.OVER;
		preRouteStyle.zIndex = 10;
		overRouteStyle.zIndex = 10;
		
		var intervalTime = options.interval || 200;

		var path = strToPath(pathStr);
		var overPath = [path[0]];

        var _bounds = new google.maps.LatLngBounds();
        _.forEach(path, function(point) {
            _bounds.extend(point);
		})
        this.map.fitBounds(_bounds);
		
		var route = preRoute ? createPolyline(path, preRouteStyle) : null;
		var overRoute = createPolyline(overPath, overRouteStyle);
		
		var marker = createMarker(path[0]);
		
		var player = {
				pathStr : pathStr,
				intervalTime : intervalTime,
				current : 0,
				status : "init",	//init, play, stop, pause
				path : path,
				overPath : overPath,
				route : route,
				overRoute : overRoute,
				marker : marker,
				setProgress : options.setProgress
		};
		this.routePlayers[id] = player;
		this.routePlayerCtrl(id, "play");
	};
	/**
	 * route player控制
	 * id : player id
	 * action : String, 控制动作。 取值:play, pause, stop
	 */
	Map.prototype.routePlayerCtrl = function(id, action){
		id = id || "default_route";
		var player = this.routePlayers[id];
		if(!player || !action){
			return;
		}
		action = action.toLowerCase();
		if(action == "play"){
			play(player)
		}else if(action == "stop"){
			stop(player)
		}else if(action == "pause"){
			pause(player)
		}
		
		//重置到初始状态
		function reset(player){
			if(player.interval){
				window.clearInterval(player.interval);
				player.interval = null;
			}
			player.status = "init";
			player.current = 0;
			player.path = strToPath(player.pathStr);
			player.overPath = [player.path[0]];
			
			player.marker.setPosition(player.path[0]);
			player.overRoute.setPath(player.overPath);
			player.route && player.route.setPath(player.path);
			
			player.setProgress && player.setProgress(player.current);
		}
		function pause(player){
			if(player.status == "play"){
				player.status = "pause";
			}
		}
		function stop(player){
			
			if(player.interval){
				window.clearInterval(player.interval);
				player.interval = null;
			}
			
			player.status = "stop";
			player.path = [];
			player.overPath = strToPath(player.pathStr);
			player.current = player.overPath.length - 1;
			
			player.marker.setPosition(player.overPath[player.current]);
			player.overRoute.setPath(player.overPath);
			player.route && player.route.setMap(null);
			
			player.setProgress && player.setProgress(player.current);
		}
		function play(player){
			if(player.status == "stop"){
				reset(player);
			}
			player.status = "play";
			if(!player.interval){
				player.interval = window.setInterval(function(){
					if(player.status !== "play"){
						return;
					}
					var curr = player.current++;
					player.path.shift();
					player.overPath.push(player.path[0]);
					//更新地图
					player.marker.setPosition(player.path[0]);
					player.overRoute.setPath(player.overPath);
					if(player.path.length <= 1){	//播放到最后一个点
						player.route && player.route.setMap(null);
						
						stop(player);
					}else{
						player.route && player.route.setPath(player.path);
						player.setProgress && player.setProgress(curr);
					}
				}, player.intervalTime);
			}
		}
	};
	//不指定id时清除全部
	Map.prototype.clearRoutePlayer = function(id){
		var _this = this;
		_.forEach(this.routePlayers, function(player, key){
			if(!id || id == key){
				window.clearInterval(player.interval);
				if(player.route){
					player.route.setMap(null);
				}
				player.overRoute.setMap(null);
				player.marker.setMap(null);
			}
			delete _this.routePlayers[key];
		});
	};
	/**
	 * 设置polygon的参数数和样式
	 * 格式 ：
	 * {
	 * 	groupName : {
	 * 			style : {},
	 * 			option : {}
	 * 		},
	 * 	...
	 * }
	 */
	Map.prototype.setPolysArgs = function(opt){
		for(var name in opt){
			var group = opt[name];
			if(group.style){
				this.polysArgs[name+"_style"] = group.style;
			}
			if(group.option){
				this.polysArgs[name+"_option"] = group.option;
			}
		}
	};
	/**
	 * 创建一组Polygon
	 * style : 指定polygon的边框和填充
	 * options -->
	 * 		fitBounds : boolean, 是否调整视野；
	 * 		nolabel : boolean, 是否禁用标签;
	 * 		labelZoomRange : Array, label显示的zoom范围，格式[2,10];
	 * 		zIndexUp : Number, zIndex高于默认值的数量;
	 * 		editDisable : boolean, 是否不可编辑
	 */
	Map.prototype.createPolygons = function(group, locs, style, options){
		options = options || this.polysArgs[group+"_option"] || this.polysArgs.default_option || {};
		style = style || this.polysArgs[group+"_style"] || this.polysArgs.default_style || {};

		locs = locs || [];
		var list = [];

		var _bounds = new google.maps.LatLngBounds();
		for(var i=0; i<locs.length; i++){
			var loc = locs[i];
			if(!loc.latlng){
				console.warn("No latlng to create Polygon:\n", loc);
				continue;
			}
			var polygonOpt = {
				zIndexUp : options.zIndexUp,
				editDisable : options.editDisable
			};
			var polygon = createPolygon(strToPath(loc.latlng), style, polygonOpt);
			polygon.data._isNew = loc._isNew;
			polygon.putData(cleanData(loc));
			_bounds.union(polygon.getBounds());

			if(loc.name && !options.noLabel){
				var opt = {
					align : "center",
					zoomRange : options.labelZoomRange
				};
				polygon.data._label = new LabelOverlay(this.map, polygon.getCenter(), loc.name.toUpperCase(), opt);
			}
			if(!options.noGhostLabel){
				polygon.data._ghostLabel = this.ghostLabel;
			}
			list.push(polygon);
		}
		if(list.length > 0){
			var _group = this.polygons[group] || [];
			this.polygons[group] = _group.concat(list);

			if(options.fitBounds){
				this.fitBounds(_bounds);
			}
		}
		return list;
	};
	
	Map.prototype.showPolygons = function(group, filter, style){
		for(var key in this.polygons){
			if(group && group != key){
				continue;
			}
			var polygons = filter ? this.getPolygons(key, filter) : this.polygons[key];
			for(var i=0; i<polygons.length; i++){
				var polygon = polygons[i];
				if(style){
					polygon.data._style = style;
					polygon.setOptions(style);
				}
				polygon.setMap(this.map);
				
				if(polygon.data._label){
					polygon.data._label.setMap(this.map);
				}
				polygon.partColors();
			}
		}
	};

	Map.prototype.setCenter=function(latLng){
		if (typeof latLng === "string") {
			var position = strToLatlng(latLng);
			this.map.setCenter(position);
		} else {
			this.map.setCenter(latLng);
		}
	}
	Map.prototype.setZoom=function(zoom){
		this.map.setZoom(zoom);
	}

	/**
	 * 重命名Polygon
	 */
	Map.prototype.renamePolygon = function(uuid, name){
		var polygon = this.getPolygons(null, {_uuid : uuid})[0];
		if(!polygon){
			return;
		}
		var data = polygon.data;
		data.name = name;
		if(data._label){
			data._label.setLabel(name);
		}
	};
	/**
	 * 重建polygon
	 * 先删除原polygon, 再创建新的
	 * uuid : 原uuid
	 * group : 新group
	 * loc : 新loc
	 */
	Map.prototype.rebuildPolygon = function(uuid, group, loc){
		//删除
		if(uuid){
			var polygon = this.getPolygons(null, {_uuid : uuid})[0];
			if(polygon){
				polygon.cornerMarkers(false);
				polygon.setMap(null);
				var data = polygon.data;
				data.name = name;
				if(data._label){
					data._label.setMap(null);
				}
				_.remove(this.polygons[data._group], function(p){
					return p.data._uuid == uuid;
				});
			}
		}
		//重建
		if(loc){
			this.createPolygons(group, [loc]);
		}
	};
	//标记polygon各角
	Map.prototype.markPolygon = function(filter, show){
		var polygons = this.getPolygons(null, filter);
		for(var i = 0; i < polygons.length; i++){
			polygons[i].cornerMarkers(show);
		}
	};
	/**
	 * 高亮显示
	 * group : 指定该高亮组的组名, 非polygon的分组
	 * 如果filter包含_style字段，则_style只用于指定高亮的样式，不参与过滤。
	 * 如果filter包含_html字段，则_html只用于InfoWindow数据显示，不参与过滤。
	 * 
	 * clean : 先清除改组已有的所有高亮
	 */
	Map.prototype.highlightPolygons = function(filters, group, clean){
		var _this = this;
		if(clean){
			this.cancelHighlightPolygons(group);
		}
		if(!filters){
			return;
		}
		_.forEach(filters, function(filter){
			var style = filter._style;
			delete filter._style;
			var html = filter._html;
			delete filter._html;
			var polygons = _this.getPolygons(null, filter);
			_.forEach(polygons, function(polygon){
				polygon.setHtml(html, "highlight");
				if(group){
					polygon.data._highlightGroup = group;
				}else{
					delete polygon.data._highlightGroup;
				}
				polygon.highlight(true, style);
			});
		});
	};
	Map.prototype.cancelHighlightPolygons = function(group){
		var search = {_highlight : true};
		if(group){
			search._highlightGroup = group;
		}
		var polygons = this.getPolygons(null, search);
		_.forEach(polygons, function(polygon){
			polygon.highlight(false);
			polygon.setHtml(null, "highlight");
		});
	};
	/**
	 * polygon分段颜色显示
	 * filter : 过滤条件
	 * colors : [{len : 0-100, color : "rgb"},  ...]
	 * 
	 */
	Map.prototype.polygonPartColors = function(filter, colors){
		var polygons = this.getPolygons(null, filter);
		_.forEach(polygons, function(polygon){
			polygon.partColors(colors);
		});
	};
	Map.prototype.clearPolygonPartColors = function(filter, remove){
		var polygons = this.getPolygons(null, filter);
		_.forEach(polygons, function(polygon){
			polygon.clearPartColors(remove);
		});
	};
	
	/**
	 * 过滤polygon。
	 * group	为空时不考虑group条件；
	 * filter	json，过滤条件，匹配polygon的data数据，为空时不考虑filter;
	 * withGroup boolean, 返回结果是否分组。分组时返回json；不分组时返回array，并在data内添加_group属性。
	 */
	Map.prototype.getPolygons = function(group, filter, withGroup){
		var list =  withGroup ? {} : [];
		for(var key in this.polygons){
			if(group && group != key){
				continue;
			}{}
			if(withGroup){
				list[key] = list[key] || [];
			}
			var polygons = this.polygons[key];
			for(var i=0; i<polygons.length; i++){
				var data = polygons[i].data;
				var match = true;
				if(filter){
					for(var f in filter){
						if(data[f] != filter[f]){
							match = false;
							break;
						}
					}
				}
				if(match){
					if(withGroup){
						list[key].push(polygons[i]);
					}else{
						polygons[i].data._group = key;
						list.push(polygons[i]);
					}
				}
			}
		}
		return list;
	};
	Map.prototype.fitBoundsWithPolygons = function(group, filter){
		var polygons = this.getPolygons(group, filter);
		if(polygons.length === 0)
			return;
		var bounds = new google.maps.LatLngBounds();
		_.forEach(polygons, function(polygon){
			var b = polygon.getBounds();
			bounds.union(b);
		});
		if(!bounds.isEmpty()){
			this.map.fitBounds(bounds);
		}
	};
	Map.prototype.clearPolygons = function(group, remove){
		for(var key in this.polygons){
			if(group && group != key){
				continue;
			}
			var polygons = this.polygons[key];
			for(var i=0; i<polygons.length; i++){
				var polygon = polygons[i];
				polygon.cornerMarkers(false);
				polygon.setMap(null); // 在指定的地图上渲染此形状。如果map设置为null，则该形状将被删除。
				if(polygon.data._label){
					polygon.data._label.setMap(null);
				}
				polygon.clearPartColors(remove);
			}
			if(remove){
				delete this.polygons[key];
			}
		}
	};
	//清除未选中的Polygons
	Map.prototype.clearUncheckedPolygons = function(group,checkLatlngs,remove){
		for(var key in this.polygons){
			if(group && group != key){
				continue;
			}
			var polygons = this.polygons[key];
			_.forEach(polygons,function(polygon){
				if(_.indexOf(checkLatlngs, polygon.data.latlng) < 0){
					polygon.cornerMarkers(false);
					polygon.setMap(null); // 在指定的地图上渲染此形状。如果map设置为null，则该形状将被删除。
					if(polygon.data._label){
						polygon.data._label.setMap(null);
					}
					polygon.clearPartColors(remove);
				}
			})
			
		}
	};
	
	//标签随地图层级变化显示或隐藏
	Map.prototype.labelAutoDisplay = function() {
		var zoom = this.map.zoom;
		for (var key in this.polygons) {
			var polygons = this.polygons;
			for(var i=0; i<polygons.length; i++ ){
				if (polygons[key] && polygons[key].data._label) {
					polygons[key].data._label.autoDisplay();
				}
			}
		}
	};
	//定位, addr : google.maps.GeocoderResult object 
	Map.prototype.locate = function(addr){
		if(!addr){
			return;
		}
		var latlng = addr.geometry.location;
		var bounds = addr.geometry.viewport || addr.geometry.bounds;
		this.map.fitBounds(bounds);
		var marker = createMarker(latlng);
		google.maps.event.addListener(marker, "dblclick", function(){
			this.setMap(null);
		});
		this.locateMarkers.push(marker);
	};
	//清除定位图标
	Map.prototype.clearLocateMarkers = function(remove){
		_.remove(this.locateMarkers, function(m){
			m.setMap(null);
			return remove;
		});
	};
	//fit screen, 调整视野，使当前所有元素可见
	Map.prototype.fitScreen = function(remove){
		var bounds = new google.maps.LatLngBounds();
		
		var objs = [this.groupMarkers, this.polylines, this.polygons];
		_.forEach(objs, function(groups){
			_.forEach(groups, function(group){
				_.forEach(group, function(obj){
					var _bounds = obj.getBounds();
					if(_bounds && !_bounds.isEmpty()){
						bounds.union(_bounds);
					}
				});
			});
		});
		if(!bounds.isEmpty()){
			this.map.fitBounds(bounds);
		}
	};
	
	Map.prototype.fitScreenControl = function(show){
		var _this = this;
		if(show){
			if(this.controls.fitScreen){
				this.controls.fitScreen.show();
			}else{
				this.controls.fitScreen = createControl();
				this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(this.controls.fitScreen[0]);
			}
		}else{
			if(this.controls.fitScreen){
				this.controls.fitScreen.hide();
			}
		}
		function createControl(){
			var html = "<div id='fit-screen-bounds' class='map-ctrl-single'>"+
							"<i class='material-icons' style='font-size: 20px;'>crop_free</i>"+
						"</div>";
			$(_this.el).on("click", "#fit-screen-bounds", function(e){
				_this.fitScreen();
			});
			return $(html);
		}
	};
	
	//定位(地址搜索)控件
	Map.prototype.locateControl = function(show){
		var _this = this;
		if(show){
			if(this.controls.locate){
				this.controls.locate.show();
			}else{
				this.controls.locate = createControl();
				this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(this.controls.locate[0]);
			}
		}else{
			if(this.controls.locate){
				this.controls.locate.hide();
			}
		}
		function createControl(){
			var html = "<div class='ctrl-bar ctrl-locate'>"+
							"<input id='locate-address' class='ctrl-locate-address' placeholder='Address/Lng,lat'>"+
							"<span id='locate-search' title='Locate' class='glyphicon glyphicon-search ctrl-btn'></span>" +
							"<div id='locate-result' class='ctrl-locate-combobox list-group'></div>"+
						"</div>";
			$(_this.el).on("click", "#locate-search", function(e){
				var addr = $(_this.el).find("#locate-address").val().trim();
				if(!addr){
					return;
				}
				seachAddress(addr, function(addrList){
					var div =  $(_this.el).find("#locate-result");
					div.html("");
					if(addrList && addrList.length > 0){
						_.forEach(addrList, function(address){
							var html = "<a class='list-group-item'>" + address.formatted_address + "</a>";
							var el = $(html);
							el.data("address", address);
							div.append(el);
						});
					}else{
						div.html("<a class='list-group-item'>No record!</a>");
					}
					setTimeout(function(){
						$(_this.el).find("#locate-result").html("");
					}, 5000);
				});
			});
			$(_this.el).on("click", "#locate-result>a", function(e){
				var addr = $(e.currentTarget).data("address");
				_this.clearLocateMarkers(true);
				_this.locate(addr);
				$(_this.el).find("#locate-result").html("");
			});
			$(document).keyup(function(e){
				var code = e.keyCode;
				var targetId = e.target.id;
				if(code == 13 && targetId === "locate-address"){	//enter
					$(_this.el).find("#locate-search").trigger("click");
				}
			});
			return $(html);
		}
	};
	Map.prototype.setCursor = function(cursor){
		if(EDIT_STATUS.editable){
			$(this.el).attr("cursor", cursor);
		}else{
			$(this.el).attr("cursor", "");
		}
	};
	
	/**
	 * datas : {
	 * 		filter : {},	//polygon筛选条件
	 * 		weight : int	//权重， 1-10
	 * }
	 */
	Map.prototype.polygonHeatMap = function(datas, group){
		if (this.heatMap != null) {
			this.heatMap.setMap(null);
			this.heatMap = null;
		}
		if(!datas || datas.length == 0){
			return;
		}
		var _this = this;
		var points = [];
		_.forEach(datas, function(data){
			var polygons = _this.getPolygons(group, data.filter);
			var weight = data.weight || 1;
			weight = weight < 1 ? 1 : weight;
			weight = weight > 10 ? 10 : weight;
			_.forEach(polygons, function(poly){
				var space = 2 - weight / 10;
				var ps = poly.getSplashes(space);
				points = _.concat(points, ps);
			});
		});
		this.heatMap = new google.maps.visualization.HeatmapLayer({
			data: points,
			radius : 3,
			map: this.map
		});
	};
	/**
	 * datas : {
	 * 		filter : {},	//polyline筛选条件
	 * 		weight : int	//权重， 1-10
	 * }
	 */
	Map.prototype.polylineHeatMap = function(datas, group){
		if (this.heatMap != null) {
			this.heatMap.setMap(null);
			this.heatMap = null;
		}
		if(!datas || datas.length == 0){
			return;
		}
		var _this = this;
		var points = [];
		_.forEach(datas, function(data){
			var polylines = _this.getPolylines(group, data.filter);
			var weight = data.weight || 1;
			weight = weight < 1 ? 1 : weight;
			weight = weight > 10 ? 10 : weight;
			_.forEach(polylines, function(poly){
				var space = 2 - weight / 10;
				var ps = poly.getSplashes(space);
				points = _.concat(points, ps);
			});
		});
		this.heatMap = new google.maps.visualization.HeatmapLayer({
			data: points,
			radius : 9,
			map: this.map
		});
	};
	
	Map.prototype.setHeatMap = function (points) {
		if (this.heatMap != null) {
			this.heatMap.setMap(null);
			this.heatMap = null;
		}
		if (points == null) {
			return;
		}

		var latLngs = [];
		_.forEach(points, function (point) {
			latLngs.push({
				location : new google.maps.LatLng(point.y, point.x),
				weight : point.weight
			});
		})
		this.heatMap = new google.maps.visualization.HeatmapLayer({
			data: latLngs,
			map: this.map
		});
	};
	Map.prototype.setHeatLocation = function (loc) {
		if (this.heatLocation) {
			this.heatLocation.setMap(null);
			this.heatLocation = null;
		}
		if(!loc || !loc.latlng) return;
		
		var options = this.polysArgs["location_option"] || this.polysArgs.default_option || {};
		var style = COLOR_SCHEME.HIGHLIGHT;

		var polygonOpt = {
			zIndexUp : 2
		};
		this.heatLocation = createPolygon(strToPath(loc.latlng), style, polygonOpt);
		this.heatLocation.putData(cleanData(loc));

		if(loc.name && !options.noLabel){
			var opt = {
				align : "center",
				zoomRange : options.labelZoomRange
			};
			this.heatLocation.data._label = new LabelOverlay(this.map, this.heatLocation.getCenter(), loc.name.toUpperCase(), opt);
		}
		if(!options.noGhostLabel){
			this.heatLocation.data._ghostLabel = this.ghostLabel;
		}

		this.heatLocation.setMap(this.map);

		var bounds = this.map.getBounds();
		if (!bounds.contains(this.heatLocation.getCenter())) {
			this.map.panTo(this.heatLocation.getCenter());
		}
	};
//###################


	//编辑控件,显示/隐藏
	Map.prototype.editControl = function(show){
		var _this = this;
		if(show){
			if(this.controls.edit){
				this.controls.edit.show();
			}else{
				this.controls.edit = createControl();
				this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(this.controls.edit[0]);
			}
		}else{
			if(this.controls.edit){
				this.controls.edit.hide();
			}
		}
		//返回一个就query对象
		function createControl(){
			var html = 
				"<div id='edit_ctrl_bar' class='ctrl-bar'>" +
					"<span class='ctrl-group'>"+
						"<span id='edit-union' title='Union [Alt+U]' class='glyphicon glyphicon-link ctrl-btn'></span>" +
						"<span id='edit-mark' title='New marker [Alt+M]' class='glyphicon glyphicon-map-marker ctrl-btn ctrl-btn-mark'></span>" +
						"<span id='edit-new' title='New polygon [Alt+N]' class='glyphicon glyphicon-file ctrl-btn'></span>" +
						"<span id='edit-copy' title='Copy [Alt+C]' class='glyphicon glyphicon-duplicate ctrl-btn'></span>" +
						"<span title='Fill [Alt+F]'><i id='edit-cut' class='material-icons ctrl-btn ctrl-btn-mark'>grid_on</i></span>" +
					"</span>"+
					"<span class='parting'></span>" +
					"<span class='ctrl-group'>"+
						"<span id='edit-line' title='New line' class='glyphicon material-icons ctrl-btn ctrl-btn-mark'>timeline</span>" +
					"</span>"+
					"<span class='parting'></span>" +
					"<span class='ctrl-group'>"+
						"<span id='edit-align' side='left' title='Left align' class='glyphicon glyphicon-object-align-left ctrl-btn'></span>" +
						"<span id='edit-align' side='right' title='Right align' class='glyphicon glyphicon-object-align-right ctrl-btn'></span>" +
						"<span id='edit-align' side='top' title='Top align' class='glyphicon glyphicon-object-align-top ctrl-btn'></span>" +
						"<span id='edit-align' side='bottom' title='Bottom align' class='glyphicon glyphicon-object-align-bottom ctrl-btn'></span>" +
						"<span id='edit-align' side='horizontal' title='Horizontal align' class='glyphicon glyphicon-object-align-horizontal ctrl-btn'></span>" +
						"<span id='edit-align' side='vertical' title='Vertical align' class='glyphicon glyphicon-object-align-vertical ctrl-btn'></span>" +
						"<span title='Justify Align'><i id='edit-justify' class='material-icons ctrl-btn ctrl-btn-mark'>format_line_spacing</i></span>" +
					"</span>"+
					"<span class='parting'></span>" +
					"<span class='ctrl-group'>"+
						"<span title='Coord sys'><i id='edit-coord' class='material-icons ctrl-btn'>shuffle</i></span>" +
						"<span title='Format shape'><i id='edit-format-shape' class='material-icons ctrl-btn ctrl-btn-mark'>format_shapes</i></span>" +
						"<span title='Rotate'><i id='edit-rotate' class='material-icons ctrl-btn ctrl-btn-mark'>rotate_90_degrees_ccw</i></span>" +
						//"<span id='edit-rotate' title='Rotate left 90°'><i class='material-icons ctrl-btn'>rotate_left</i></span>" +
						//"<span id='edit-rotate' title='Rotate right 90°'><i class='material-icons ctrl-btn'>rotate_right</i></span>" +
					"</span>"+
					"<span class='parting'></span>" +
					"<span class='ctrl-group'></span>" +
						"<span id='edit-remove' title='Delete [Alt+D]' class='glyphicon glyphicon-remove ctrl-btn ctrl-btn-mark'></span>" +
						"<span id='edit-cancel' title='Cancel [Alt+X]' class='glyphicon glyphicon-ban-circle ctrl-btn'></span>" +
						"<span id='edit-save' title='Save [Alt+S]' class='glyphicon glyphicon-ok ctrl-btn'></span>" +
					"</span>"+
					//=====  ctrl bar option  ======
					"<div id='edit-cut-option' class='ctrl-option' style='display:none;'>"+
						"<span>X Rows:<input id='x-rows' value='2'/></span>"+
						"<span>Y Rows:<input id='y-rows' value='2'/></span>"+
						"<span>X Gap:<input id='x-gap' value='0'/></span>"+
						"<span>Y Gap:<input id='y-gap' value='0'/></span>"+
						"<span>Margin:<input id='margin' value='0'/></span>"+
					"</div>"+
				"</div>";

			$(_this.el).on("click", "#edit-union", function(e){
				var el = $(this);
				var on = el.attr("on") == "on";
				el.attr("on", on ? "off" : 'on');
				EDIT_STATUS.union = !on;
			});
			
			$(_this.el).on("click", "#edit-mark", function(e){
				if(_this.ghostPolygon.getMap()){
					return;
				}
				
				var el = $(this);
				var on = el.attr("on") == "on";
				el.attr("on", on ? "off" : 'on');
				
				$(_this.el).attr("cursor", on ? "" : "marker");
				EDIT_STATUS.mark = !on;
				
				singleItem(el);
				//添加marker状态改变回调
				_this.edit.doCallback("mapDrawToolStatusChange", {
					name: 'marker',
					status: EDIT_STATUS.mark
				});
			});
			
			$(_this.el).on("click", "#edit-copy", function(e){
				singleItem();
				_this.edit.copy();
			});
			
			$(_this.el).on("click", "#edit-new", function(e){
				singleItem();
				_this.edit.create();
			});
			
			$(_this.el).on("click", "#edit-justify", function(e){
				if(_this.ghostPolygon.getMap()){
					return;
				}
				var el = $(this);
				var on = el.attr("on") == "on";
				el.attr("on", on ? "off" : 'on');
				singleItem(el);
				$(_this.el).attr("cursor", on ? "" : "justify");
				EDIT_STATUS.justify = !on;
			});
			$(_this.el).on("click", "#edit-format-shape", function(e){
				if(_this.ghostPolygon.getMap()){
					return;
				}
				var el = $(this);
				var on = el.attr("on") == "on";
				el.attr("on", on ? "off" : 'on');
				singleItem(el);
				$(_this.el).attr("cursor", on ? "" : "format");
				EDIT_STATUS.format = !on;
			});
			$(_this.el).on("click", "#edit-rotate", function(e){
				if(_this.ghostPolygon.getMap()){
					return;
				}
				var el = $(this);
				var on = el.attr("on") == "on";
				el.attr("on", on ? "off" : 'on');
				singleItem(el);
				$(_this.el).attr("cursor", on ? "" : "rotate");
				EDIT_STATUS.rotate = !on;
			});
			
			$(_this.el).on("click", "#edit-cut", function(e){
				if(_this.ghostPolygon.getMap()){
					return;
				}
				var el = $(this);
				var on = el.attr("on") == "on";
				el.attr("on", on ? "off" : 'on');
				var opt = $(_this.el).find("#edit-cut-option");
				if(on){
					opt.hide();
				}else{
					opt.show();
				}
				singleItem(el);
				$(_this.el).attr("cursor", on ? "" : "cut");
				EDIT_STATUS.cut = !on;
			});
			
			$(_this.el).on("click", "#edit-remove", function(e){
				if(_this.ghostPolygon.getMap()){
					return;
				}
				
				var el = $(this);
				var on = el.attr("on") == "on";
				el.attr("on", on ? "off" : 'on');
				
				singleItem(el);
				
				$(_this.el).attr("cursor", on ? "" : "remove");
				EDIT_STATUS.remove = !on;
			});
			
			$(_this.el).on("click", "#edit-cancel", function(e){
				_this.edit.cancelAll();
			});
			
			$(_this.el).on("click", "#edit-save", function(e){
				_this.edit.saveAll();
			});
			
			$(_this.el).on("click mouseover mouseout", "#edit-align", function(e){
				var preview = e.type == "mouseover";
				var side = e.type == 'mouseout' ? null : $(e.currentTarget).attr("side");
				_this.edit.align(side, preview);
			});
			
			$(_this.el).on("click", "#edit-coord", function(e){
				var el = $(this);
				var on = el.attr("on") == "on";
				el.attr("on", on ? "off" : 'on');
				_this.setCoorSysVisible(!on);
			});

			$(_this.el).on("click", "#edit-line", function(e) {
				if(_this.ghostPolygon.getMap()){
					return;
				}
				var el = $(this);
				var on = el.attr("on") == "on";
				el.attr("on", on ? "off" : 'on');
				singleItem(el);
				$(_this.el).attr("cursor", on ? "" : "crosshairs");
				EDIT_STATUS.line = !on;
				//添加line状态改变回调
				_this.edit.doCallback("mapDrawToolStatusChange", {
					name: 'polyline',
					status: EDIT_STATUS.line
				});
			});

			//shortcut key
			$(document).keyup(function(e){
				if(!e.altKey || !EDIT_STATUS.editable){
					return;
				}
				var code = e.keyCode;
				if(code == 85){	//U union
					var el = $(_this.el).find("#edit-union").trigger("click");
				}else if(code == 88){	//X	cancel all
					_this.edit.cancelAll();
				}else if(code == 68){	//D	duplicate
					_this.edit.copy();
				}else if(code == 83){	//S save all
					_this.edit.saveAll();
				}
			});
			return $(html);
		}
		function singleItem(el){
			if(el && el.attr("on") != "on"){
				return;
			}
			var items = $(_this.el).find(".ctrl-btn-mark");
			items.each(function(i, _item){
				var item = $(_item);
				if((!el || item.attr("id") != el.attr("id")) && item.attr("on") == "on"){
					item.trigger('click');
				}
			});
		}
	};
	//=============== edit functions =================
	/**
	 * 编辑polygon, polyline, marker的一些方法，集中到map.edit下，方便管理
	 */
	Map.prototype.edit = {
		map : null,	//在init()的时候将map设置为Map对象
		unionObjs : [],
		//设置编辑开关状态
		setEditable : function(status){
			//退出编辑状态时取消各种编辑状态及页面效果
			if(!status){
				this.cancelAll();
				MAP.ghostPolygon.setMap(null);
				MAP.setCursor();
				$(MAP.el).find("#edit_ctrl_bar [on=on]").trigger("click");
				_.forEach(EDIT_STATUS, function(val, key){
					if(key != "editable"){
						EDIT_STATUS[key] = false;
					}
				});
			}
			EDIT_STATUS.editable = status;
			this.map.editControl(EDIT_STATUS.editable);
			this.map.locateControl(EDIT_STATUS.editable);
		},
		/**
		 * 获取编辑中的多边形
		 * polygon : 如果参数存在，返回该polygon内包含的polygon
		 */
		getEditObjs : function(polygon){
			var polygons = this.map.getPolygons(null, {_inEdit : true});
			this.unionObjs = polygons;
			var res;
			if(polygon){
				res = [];
				_.forEach(polygons, function(p){
					if(p.data._uuid != polygon.data._uuid && containsPolygon(p, polygon)){
						res.push(p);
					}
				});
			}
			return res || polygons;
		},
		union : function(status){
			EDIT_STATUS.union = status;
		},
		unionMoveStart : function(currObj, e){
			var objs = this.getEditObjs();
			for(var i=0; i<objs.length; i++){
				var obj = objs[i];
				obj.data._moveStartPath = obj.getPath().getArray();
				if(!obj.data._editable){
					obj.data._editable = obj.data._editable || obj.getEditable();
					obj.setEditable(false);
				}
			}
		},
		unionMoveEnd : function(currObj, e){
			var objs = this.unionObjs;
			for(var i=0; i<objs.length; i++){
				var obj = objs[i];
				if(obj.data._editable){
					obj.setEditable(true);
				}
				delete obj.data._editable;
			}
		},
		/**
		 * 移动联合对象
		 * curr : 当前拖动对象
		 */
		unionMove : function(currObj, e){
			var objs = this.unionObjs;
			if(objs.length <= 1)
				return;

			var start = currObj.data._dragStartLatlng;
			var distance = google.maps.geometry.spherical.computeDistanceBetween(start, e.latLng);
			var heading = google.maps.geometry.spherical.computeHeading(start, e.latLng);

			for(var i=0; i<objs.length; i++){
				var obj = objs[i];
				obj.move(distance, heading);
			}
		},
		//取消所有对象的编辑状态
		cancelAll : function(){
			//取消polygon
			var polygons = this.getEditObjs();
			for(var i = 0; i < polygons.length; i++){
				var polygon = polygons[i];
				polygon.setEdit(false, false, true);
				//触发取消事件回调函数
				this.doCallback("editPolygonCancel", polygon.data);
				//删除新增对象
				if(polygon.data._isNew){
					this.map.rebuildPolygon(polygon.data._uuid);
				}else{
					//回到原始位置
					polygon.moveTo(polygon.data._originPath);
				}
			}
			//取消polyline
			var polylines = this.map.getPolylines(null, {_inEdit : true});
			for(var i = 0; i < polylines.length; i++){
				var polyline = polylines[i];
				polyline.setEdit(false, false, true);
				//触发取消事件回调函数
				this.doCallback("editPolylineCancel", polyline.data);
				//删除新增对象
				if(polyline.data._isNew){
					this.map.rebuildPolyline(polyline.data._uuid);
				}else{
					//回到原始位置
					//polyline.moveTo(polyline.data._originPath);
				}
			}
			//取消marker
			var markers = this.map.getMarkers(null, {_inEdit : true});
			for(var i = 0; i < markers.length; i++){
				var marker = markers[i];
				marker.setEdit(false, false, true);
				//触发取消事件回调函数
				this.doCallback("editMarkerCancel", marker.data);
				//删除新增对象
				if(marker.data._isNew){
					this.map.rebuildMarker(marker.data._uuid);
				}else{
					//回到原始位置
					marker.moveTo(marker.data._originPosition);
				}
			}
		},
		//保存所有编辑中对象
		saveAll : function(){
			//保存polygon
			var polygons = this.getEditObjs();
			for(var i=0; i<polygons.length; i++){
				var polygon = polygons[i];
				polygon.setEdit(false);
			}
			(polygons.length > 0) && this.doCallback("editPolygonEndAll");
			//保存polyline
			var polylines = this.map.getPolylines(null, {_inEdit : true});
			for(var i=0; i<polylines.length; i++){
				var polyline = polylines[i];
				polyline.setEdit(false);
			}
			(polylines.length > 0) && this.doCallback("editPolylineEndAll");
			//保存marker
			var markers = this.map.getMarkers(null, {_inEdit : true});
			for(var i = 0; i < markers.length; i++){
				var marker = markers[i];
				marker.setEdit(false);
			}
			(markers.length > 0) && this.doCallback("editMarkerEndAll");
		},
		/**
		 * 改变指定的多个polygon对象编辑状态
		 */
		changePolygonsEditStatus : function(editable, group, filter, doCallback){
			var polygons = this.map.getPolygons(group, filter);
			for(var i=0; i<polygons.length; i++){
				var polygon = polygons[i];
				if(polygon.data._isNew){
					this.map.rebuildPolygon(polygon.data._uuid);
					continue;
				}
				if(polygon.data._inEdit != editable){
					polygon.setEdit(editable, doCallback, true);
				}
			}
		},
		/**
		 * 改变指定的多个marker对象编辑状态
		 */
		changeMarkersEditStatus : function(editable, group, filter, doCallback){
			var markers = this.map.getMarkers(group, filter);
			for(var i=0; i<markers.length; i++){
				var marker = markers[i];
				if(marker.data._isNew){
					this.map.rebuildMarker(marker.data._uuid);
					continue;
				}
				if(marker.data._inEdit != editable){
					marker.setEdit(editable, doCallback, true);
				}
			}
		},
		/**
		 * 复制选中的所有polygon对象, 进入可粘贴状态
		 */
		copy : function(){
			var polygons = this.map.getPolygons(null, {_inEdit : true}, true);
			var paths = [];
			var groups = {};
			for(var group in polygons){
				var ps = polygons[group];
				var locs = [];
				for(var i=0; i<ps.length; i++){
					var p = ps[i];
					paths.push(p.getPath().getArray());
					p.data._isNew || p.setEdit(false);	//保存被复制的非新建对象
					var data = cleanData(p.data);
					data._isNew = true;	//标记为新建对象
					locs.push(data);
				}
				if(locs.length > 0){
					groups[group] = locs;
				}
			}
			if(_.size(groups) === 0){
				return;
			}
			var ghost = this.map.ghostPolygon;
			this.map.setGhostPolygon(paths, {
				click : this.paste, 
				move : true
			});
			
			this.copyDatas = groups;
			this.copyPosition = ghost.getCenter();
			if(!google.maps.geometry.poly.containsLocation(this.copyPosition, ghost)){
				paths.push(this.map.getCirclePath(this.copyPosition, 15));
				ghost.setPaths(paths);
			}
			EDIT_STATUS.copy = true;
		},
		//粘贴复制的对象, position目标位置中心
		paste : function(position){
			var copyDatas = MAP.edit.copyDatas;
			for(var group in copyDatas){
				var locs = copyDatas[group];
				locs = rename(locs);
				var copys = MAP.createPolygons(group, locs);
				for(var i=0; i<copys.length; i++){
					if(position){
						var distance = google.maps.geometry.spherical.computeDistanceBetween(MAP.edit.copyPosition, position);
						var heading = google.maps.geometry.spherical.computeHeading(MAP.edit.copyPosition, position);
						copys[i].move(distance, heading);
					}
					copys[i].setEdit(true);
				}
			}
			function rename(locs){
				var _locs = [];
				for(var i=0; i<locs.length; i++){
					var loc = locs[i];
					var n = loc._copyNo+1 || 1;
					var _loc = _.clone(loc);
					_loc.name = loc.name + "-COPY" + n;
					_locs.push(_loc);
					loc._copyNo = n++;
				}
				return _locs;
			}
		},
		//创建新的对象
		create : function(){
			var map = this.map;
			var center = map.map.getCenter();
			var path = map.getCirclePath(center, 50, 4);
			path = pathRotate(path, center, COORSYS_UTIL.getCoorHeading() - 45);
			var ghost = this.map.ghostPolygon;
			
			this.map.setGhostPolygon(path, {
				click : this.paste, 
				move : true
			});
			this.copyDatas = {"NEW" : [{
				latlng : pathToStr(path),
				_isNew : true,
				name : "NEW",
			}]};
			this.copyPosition = ghost.getCenter();
			EDIT_STATUS.copy = true;
		},
		remove : function(data, isMarker){
			if(data._editDisable){
				return;
			}
			var type = data._polyType;
			var callback = {
				marker: 'editMarkerRemove',
				polygon: 'editPolygonRemove',
				polyline: 'editPolylineRemove'
			}[type];
			this.doCallback(callback, data);
			if(OPTIONS.forceRemove){
				var rebuild = {
					marker: MAP.rebuildMarker,
					polygon: MAP.rebuildPolygon,
					polyline: MAP.rebuildPolyline
				}[type];
				rebuild(data._uuid);
			}
		},
		/**
		 * 对齐编辑对象, 如果处于copy状态，则不执行该操作。
		 * side : left, right, top, bottom, horizontal, vertical。不指定side时将清除对齐效果
		 * preview ：boolean，是否仅预览
		 */
		align : function(side, preview){
			if(EDIT_STATUS.copy){
				return;
			}
			if(!side && MAP.baseLine){
				MAP.baseLine.setMap(null);
				MAP.ghostPolygon.setMap(null);
				return;
			}
			var polygons = this.getEditObjs();
			if(polygons.length < 2){
				return;
			}
			var ps = [];
			for(var i=0; i<polygons.length; i++){
				var polygon = polygons[i];
				var str = polygon.data.points;
				var _ps = strToPoints(str);
				ps = ps.concat(_ps);
			}
			var limit = limitsOfPoints(ps);
			limit.push((limit[0] + limit[1]) / 2);	//horizontal
			limit.push((limit[2] + limit[3]) / 2);	//vertical
			
			//计算base polyline
			var minx = limit[0] < 0 ? limit[0] : 0;
			var maxx = COORSYS_UTIL.coorsys.maxX > limit[1] ? COORSYS_UTIL.coorsys.maxX : limit[1];
			var miny = limit[2] < 0 ? limit[2] : 0;
			var maxy = COORSYS_UTIL.coorsys.maxY > limit[3] ? COORSYS_UTIL.coorsys.maxY : limit[3];
			
			var limitArea = [[minx, maxx], [miny, maxy]];	//x, y
			var basePoint = {
					left : [[limit[0], limitArea[1][0]], [limit[0], limitArea[1][1]]],
					right : [[limit[1], limitArea[1][0]], [limit[1], limitArea[1][1]]],
					top : [[limitArea[0][0], limit[3]], [limitArea[0][1], limit[3]]],
					bottom : [[limitArea[0][0], limit[2]], [limitArea[0][1], limit[2]]],
					horizontal : [[limitArea[0][0], limit[5]], [limitArea[0][1], limit[5]]],
					vertical : [[limit[4], limitArea[1][0]], [limit[4], limitArea[1][1]]]
			}[side];
			if(preview){
				var baseLinePath = [COORSYS_UTIL.pointToLatlng(basePoint[0][0], basePoint[0][1]), COORSYS_UTIL.pointToLatlng(basePoint[1][0], basePoint[1][1])];
				if(MAP.baseLine){
					MAP.baseLine.setPath(baseLinePath);
					MAP.baseLine.setMap(MAP.map);
				}else{
					MAP.baseLine = new google.maps.Polyline({
						map : MAP.map,
						path: baseLinePath,
						zIndex : COLOR_SCHEME.ALIGN.zIndex,
						strokeColor: COLOR_SCHEME.ALIGN.strokeColor,
						strokeWeight: COLOR_SCHEME.ALIGN.strokeWeight,
						strokeOpacity: COLOR_SCHEME.ALIGN.strokeOpacity
					});
				}
			}
			
			var ghostPath = [];
			for(var i=0; i<polygons.length; i++){
				var polygon = polygons[i];
				var distance, heading;
				var str = polygon.data.points;
				var _ps = strToPoints(str);
				if($.inArray(side, ['horizontal', 'vertical']) > -1){
					var center = centerOfPoints(_ps);
					var closest = closestPointOnLine(basePoint, center);
					var to = COORSYS_UTIL.pointToLatlng(closest[0], closest[1]);
					var from = COORSYS_UTIL.pointToLatlng(center[0], center[1]);
					distance = google.maps.geometry.spherical.computeDistanceBetween(from, to);
					heading = google.maps.geometry.spherical.computeHeading(from, to);
				}else{
					var to, from, _distance;
					for(var j = 0; j < _ps.length; j++){
						var _p = _ps[j];
						var closest = closestPointOnLine(basePoint, _p);
						var _to = COORSYS_UTIL.pointToLatlng(closest[0], closest[1]);
						var _from = COORSYS_UTIL.pointToLatlng(_p[0], _p[1]);
						var _dis = google.maps.geometry.spherical.computeDistanceBetween(_from, _to);
						if(j === 0){
							_distance = _dis;
							to = _to;
							from = _from;
						}
						if(_dis < _distance){
							_distance = _dis;
							to = _to;
							from = _from;
						}
					}
					distance = _distance;
					heading = google.maps.geometry.spherical.computeHeading(from, to);
				}
				if(distance === undefined){
					continue;
				}
				var path = pathMove(polygon.getPath().getArray(), distance, heading);
				if(preview){
					ghostPath.push(path);
				}else{
					polygon.moveTo(path);
				}
			}
			if(preview){
				MAP.ghostPolygon.data.move = false;
				MAP.ghostPolygon.setPaths(ghostPath);
				MAP.ghostPolygon.setMap(MAP.map);
			}
		},
		/**
		 * 切割polygon，产生多个小的polygon，切割时四边形以上视作四边形，取4点计算
		 * polygon : 被切割的polygon，切割后不对该polygon产生任何修改; 不给此参数时创建cut后的polygon
		 * xRow, yRow : 行数
		 * xGap, yGap : 切片间距
		 * margin : 外围留白距离
		 */
		cut : function(polygon, xRow, yRow, xGap, yGap, margin){
			if(!polygon){
				google.maps.event.trigger(this.map.ghostPolygon, 'click', {});
				this.map.ghostPolygon.setMap(null);
				return;
			}
			var path = polygon.getPath().getArray();
			if(path.length < 3){
				return;
			}
			if(path.length === 3){
				path[3] = path[0];
			}
			var x1 = [path[0], path[1]], 
				x2 = [path[3], path[2]];
			var x1Ps = cutLine(x1[0], x1[1], xRow, xGap, margin),
				x2Ps = cutLine(x2[0], x2[1], xRow, xGap, margin);
			
			var paths = [];
			var groupItems = [];
			for(var i = 0; i < xRow; i++){
				var y1 = [x1Ps[2*i], x2Ps[2*i]],
					y2 = [x1Ps[2*i+1], x2Ps[2*i+1]];
				var y1Ps = cutLine(y1[0], y1[1], yRow, yGap, margin),
					y2Ps = cutLine(y2[0], y2[1], yRow, yGap, margin);
				for(var j = 0; j < yRow; j++){
					var _path = [y1Ps[2*j], y2Ps[2*j], y2Ps[2*j+1], y1Ps[2*j+1]];
					paths.push(_path);
					groupItems.push({
						latlng : pathToStr(_path),
						_isNew : true,
						name : "NEW-" +i+j,
					});
				}
			}
			this.map.setGhostPolygon(paths, {
				click : this.paste, 
				move : false
			}, 0);
			
			this.copyDatas = {"NEW" : groupItems};
			EDIT_STATUS.copy = true;
		},
		//地图上添加标记点
		mark : function(){
			var position = MAP.currentPosition;
			var data = {
					latlng : latlngToStr(position),
					point : latlngToPointStr(position),
					_isNew : true
			};
			this.doCallback("mapMark", data);
		},
		//格式化多边形
		format : function(polygon, preview){
			if(!polygon.data._inEdit){
				return;
			}
			if(!preview){
				var path = this.map.ghostPolygon.getPath().getArray();
				polygon.moveTo(path);
				return;
			}
			var str = polygon.data.points;
			var ps = strToPoints(str);
			if(ps.length < 4){
				return;
			}
			var p1 = ps[0], p2 = ps[1], p3 = ps[2], p4 = ps[3];
			//4边、对角线
			var lines = [[p1, p2], [p2, p3], [p3, p4], [p4, p1], [p1, p3], [p2, p4]];
			var lens = [];
			_.forEach(lines, function(line){
				lens.push(lenOfLine(line[0], line[1]));
			});
			//对角线
			var diagonal = Math.max(lens[4], lens[5]) == lens[4] ? lines[4] : lines[5];
			//边
			var max = Math.max(lens[0], lens[1], lens[2], lens[3]);
			var i = lens.indexOf(max);
			var side = lines[i];
			//确定矩形的3个点
			var o, x, r;	//o: 边和对角线共用点， x: 边上另一点， r: 对角线上另一点
			if(diagonal[0] == side[0] || diagonal[0] == side[1]){
				o = diagonal[0];
				r = diagonal[1];
				x = diagonal[0] == side[0] ? side[1] : side[0];
			}else{
				o = diagonal[1];
				r = diagonal[0];
				x = diagonal[1] == side[0] ? side[1] : side[0];
			}
			var rect = buildRectWithDiagonal(o, r, x);
			var path = [];
			_.forEach(rect, function(p){
				path.push(COORSYS_UTIL.pointToLatlng(p[0], p[1]));
			});
			this.map.setGhostPolygon(path, {
				move : false
			}, 0);
		},
		//旋转polygon.	deg:度数，正/负数-->顺/逆时针方向，
		rotate : function(polygon, e, preview){
			if(!polygon.data._inEdit){
				return;
			}
			if(!preview){
				var path = this.map.ghostPolygon.getPath().getArray();
				polygon.moveTo(path);
				return;
			}
			var path = polygon.getPath().getArray();
			var center = polygon.getCenter();
			var deg = getDeg(e, path);
			path = pathRotate(path, center, deg);
			this.map.setGhostPolygon(path, {
				move : false
			}, 0);
			function getDeg(e, path){
				//no key: 1°
				//ctrl : 15°
				//alt : -deg，反方向
				//shift : 对齐warehouse正方向
				var ctrl = isCompositeKey(e, "ctrl"),
					alt = isCompositeKey(e, "alt"),
					shift = isCompositeKey(e, "shift");
				var deg = ctrl ? 15 : 1;
				if(alt){
					deg = -deg;
				}
				if(shift){
					var base = COORSYS_UTIL.getCoorHeading(alt);
					var head = google.maps.geometry.spherical.computeHeading(path[0], path[1]);
					deg = base - head;
				}
				return deg;
			}
		},
		justify : function(polygon, preview){
			var polys = this.getEditObjs(polygon);
			if(!polys || polys.length == 0){
				return;
			}
			if(!preview){
				_.forEach(polys, function(p){
					var justifyPath = p.data._justifyPath;
					if(justifyPath){
						p.moveTo(justifyPath);
					}
				});
				return;
			}
			var sort = sortPolygonsByPosition(polys, polygon);
			var lens = [];	//sort.result在sort.heading方向的边长
			var sumLen = 0;
			_.forEach(sort.result, function(p){
				p.data._justifyPath = null;
				var path = p.getPath().getArray();
				var h1 = google.maps.geometry.spherical.computeHeading(path[0], path[1]),
					h2 = google.maps.geometry.spherical.computeHeading(path[1], path[2]);
				h1 = Math.abs(h1 - sort.heading);
				h2 = Math.abs(h2 - sort.heading);
				var ps = h1 < h2 ? [path[0], path[1]] : [path[1], path[2]];
				var len = google.maps.geometry.spherical.computeDistanceBetween(ps[0], ps[1]);
				lens.push(len);
				sumLen += len;
			});
			var middlePoint = sort.headingPoints[0];
			var middleLen = google.maps.geometry.spherical.computeDistanceBetween(sort.headingPoints[0], sort.headingPoints[1]);
			var ghostPath = [];
			var _sumLen = 0;
			_.forEach(sort.result, function(p, i){
				_sumLen += lens[i];
				var ratio = (_sumLen - lens[i] / 2) / sumLen;
				var path = p.getPath().getArray(),
					center = p.getCenter(),
					centerTo = google.maps.geometry.spherical.interpolate(sort.headingPoints[0], sort.headingPoints[1], ratio);
				var distance = google.maps.geometry.spherical.computeDistanceBetween(center, centerTo),
					heading = google.maps.geometry.spherical.computeHeading(center, centerTo);
				var newPath = pathMove(path, distance, heading);
				ghostPath.push(newPath);
				p.data._justifyPath = newPath;
			});
			this.map.setGhostPolygon(ghostPath, {
				move : false
			}, 0);
		},
		/**
		 * 添加线时的处理
		 * action: String, values in [move, click, rightclick, rest]
		 * param: rest--latlngStr
		 */
		line : function(action, param){
			if(!this.rubberLine){
				this.rubberLine = new google.maps.Polyline(COLOR_SCHEME.RUBBER_LINE);
			}
			var curr = MAP.currentPosition,
				path = this.rubberLinePath,
				line = this.rubberLine;
			
			if(action == "move"){
				if(!path || path.length == 0){
					return;
				}else if(path.length > 1){
					path.pop();
				}
				path.push(curr);
				line.setPath(path);
			}else if(action == "rightclick"){
				if(!path || path.length == 0){
					$(MAP.el).find("#edit-line").trigger("click");
				}else{
					this.rubberLinePath = [];
					line.setMap(null);
				}
			}else if(action == "click"){
				if(!path || path.length == 0){
					this.rubberLinePath = [curr];
					line.setPath(this.rubberLinePath);
					line.setMap(MAP.map);
				}else{
					path.pop();
					this.rubberLinePath.push(curr);
				}
				this.doCallback("mapLine", pathToArray(this.rubberLinePath));
			}else if(action == "reset"){
				this.rubberLinePath = [];
				if(param){
					this.rubberLinePath = [strToLatlng(param)];
					line.setPath(this.rubberLinePath);
					line.setMap(MAP.map);
				}else{
					line.setMap(null);
				}
				
			}
		},
		//回调
		doCallback : function(event, arg){
			var callbacks = this.map.callbacks;
			if(callbacks.doCallback){
				callbacks.doCallback(event, arg);
				return ;
			}else if(callbacks[event]){
				callbacks[event](arg);
			}
		}
	};
	//2个Latlng之间的像素距离
	Map.prototype.distanceOfPixel = function(from, to){
		var p1 = this.fromLatLngToContainerPixel(from);
		var p2 = this.fromLatLngToContainerPixel(to);
		if(p1 === null || p2 === null){
			return -1;
		}
		var dis = Math.sqrt(Math.pow((p1.x - p2.x), 2) + Math.pow((p1.y - p2.y), 2));
		return parseInt(dis);
	};
	//指定像素长度在当前地图上的距离
	Map.prototype.pixelToDistance = function(n){
		var from = this.fromContainerPixelToLatLng(1, 1);
		var to = this.fromContainerPixelToLatLng(1 + n, 1);
		return google.maps.geometry.spherical.computeDistanceBetween(from, to);
	};
	//指定像素长度在当前地图上的经纬度距离
	Map.prototype.pixelToLatlngLength = function(n){
		var from = this.fromContainerPixelToLatLng(1, 1);
		var to = this.fromContainerPixelToLatLng(1, 1 + n);
		var len = Math.abs(from.lat() - to.lat());
		return len;
	};
	//像素坐标转经纬度坐标
	Map.prototype.fromContainerPixelToLatLng = function(x, y) {
		var latlng = null;
		if (this.overlay.getProjection()) {
			latlng = this.overlay.getProjection().fromContainerPixelToLatLng(new google.maps.Point(x, y));
		}
		return latlng;
	};
	//经纬度转像素坐标
	Map.prototype.fromLatLngToContainerPixel = function(latlng) {
		var pixel = null;
		if (this.overlay.getProjection()) {
			pixel = this.overlay.getProjection().fromLatLngToContainerPixel(latlng);
		}
		return pixel;
	};
	//调整视野，并触发map的zoom_changed事件
	Map.prototype.fitBounds = function(bounds){
		var zoom = this.map.zoom;
		this.map.fitBounds(bounds);
		if(this.map.zoom != zoom){
			google.maps.event.trigger(this.map, "zoom_changed");
		}
	};
	//radius半径，单位：像素, sides: 边数，默认8
	Map.prototype.getCirclePath = function(position, radius, sides){
		var path = [];
		var r = this.pixelToDistance(radius);
		var sides = sides ||　8;
		for(var i=0; i<sides; i++){
			var p = google.maps.geometry.spherical.computeOffset(position, r, -180 + 360 / sides * i);
			path.push(p);
		}
		return path;
	};
	//清除所有图层
	Map.prototype.clearAllLayers = function(){
		this.setCoorSysVisible(false);
		this.clearMarkers(null, true);
		this.clearPolygons(null, true);
		this.clearLocateMarkers(true);
		this.clearPolylines(null, true);
		this.clearRoutePlayer();
	};
	window.map = Map;
// });






















	var LAYER_STYLE = {
			"BASE" : {"strokeColor" : "#AAAAAA", "strokeWeight" : 3, "strokeOpacity" : 1, "fillColor" : "#AAAAAA", "fillOpacity" : 0},
			//"LOCATION" : {"strokeColor" : "#00bb00", "strokeWeight" : 1, "strokeOpacity" : 1, "fillColor" : "#B8FA7D", "fillOpacity" : 1},
			"LOCATION" : {"strokeColor" : "#795046", "strokeWeight" : 1, "strokeOpacity" : 1, "fillColor" : "#EEDC82", "fillOpacity" : 1},
			"LOCATION3D" : {"strokeColor" : "#795046", "strokeWeight" : 1, "strokeOpacity" : 1, "fillColor" : "#87CEEB", "fillOpacity" : 1},
			"LOCATION2D" : {"strokeColor" : "#795046", "strokeWeight" : 1, "strokeOpacity" : 1, "fillColor" : "#EEDC82", "fillOpacity" : 1},
			"STAGING" : {"strokeColor" : "#966E0F", "strokeWeight" : 1, "strokeOpacity" : 1, "fillColor" : "#FFFFB4", "fillOpacity" : 1},
			"DOCK" : {"strokeColor" : "#69D46E", "strokeWeight" : 2, "strokeOpacity" : 1, "fillColor" : "#93FBBF", "fillOpacity" : 1},
			"PARKING" : {"strokeColor" : "#69D46E", "strokeWeight" : 2, "strokeOpacity" : 1, "fillColor" : "#93FBBF", "fillOpacity" : 1,'OccupyColor':'#ff7c00'},
			"ZONE" : {"strokeColor" : "#AAAAAA", "strokeWeight" : 2, "strokeOpacity" : 1, "fillColor" : "#AAAAAA", "fillOpacity" : 0},
			"OTHER" : {"strokeColor" : "#75B4D0", "strokeWeight" : 2, "strokeOpacity" : 1, "fillColor" : "#6AB3FB", "fillOpacity" : 0},
			"WEBCAM" : {"strokeColor" : "#F88F87", "strokeWeight" : 1, "strokeOpacity" : 0.2, "fillColor" : "#F88F87", "fillOpacity" : 0.2},
			"GHOST_POLYGON" : {"strokeColor" : "#337AB7", "strokeWeight" : 1, "strokeOpacity" : 0.2, "fillColor" : "#FFFFFF", "fillOpacity" : 0},
			"DEFAULT" : {"strokeColor" : "#AAAAAA", "strokeWeight" : 2, "strokeOpacity" : 1, "fillColor" : "#AAAAAA", "fillOpacity" : 0},
			
			"EMPTY_CTN" : {"strokeColor": "#FF8C00", "strokeWeight" : 1, "strokeOpacity": 1, "fillColor": "#F9BC73", "fillOpacity": 1},
			"FULL_CTN" : {"strokeColor": "#FF2222", "strokeWeight" : 1, "strokeOpacity": 1, "fillColor": "#F56262", "fillOpacity": 1},
			"HIGHTLIGHT_BORDER" : {"strokeColor": "#0BB30B", "strokeWeight" : 2, "strokeOpacity": 1},
			
			"LOAD_STATUS_LINE" : {"strokeColor" : "#077DE2", "strokeWeight" : 3, "strokeOpacity" : 0.8},
			"ROAD_MAIN" : {"strokeColor": '#DDDDDD', "strokeWeight": 10,
				            "icons": [{repeat: "1px", icon: {path: 'M -0.5,0 z', strokeColor: '#0159cf', strokeWeight: 1}},
				                    {repeat: "20px", icon: {path: 'M 0,-1 0,1', strokeColor: '#0159cf', strokeWeight: 1, scale: 4}},
				                    {repeat: "1px", icon: {path: 'M 0.5,0 z', strokeColor: '#0159cf', strokeWeight: 1}}]},
			"ROAD_SUB" : {"strokeColor": '#DDDDDD', "strokeWeight": 6,
							icons: [{repeat: "1px", icon: {path: 'M -0.5,0 z', strokeColor: '#0159cf', strokeWeight: 1}},
							        {repeat: "1px", icon: {path: 'M 0.5,0 z', strokeColor: '#0159cf', strokeWeight: 1}}]},
			
			"STATE_LINE" : {"strokeColor" : "#795046", "strokeWeight" : 1, "strokeOpacity" : 0.8, "fillColor" : "#EEDC82", "fillOpacity" : 0.8},
			"STATE_LINE_LIMIT" : {
				"INVENTORY" : [[179, 226, 255], [4, 94, 165]], //blue
				"DEMAND" : [[247, 207, 221], [233, 30, 99]],	//red
			},		//rgb
			"UTILIZATION_RATE" : {"used" : "#FF8B60", "free" : "#AAEA78"}
	};
	var LAYER_OPTION = {
			"BASE" : 		{noLabel : true, noGhostLabel : true, fitBounds : true, zIndexUp : -1, editDisable :true},
			"LOCATION" : 	{noLabel : true, labelZoomRange:[20,21], zIndexUp : 1},
			"LOCATION3D" : 	{noLabel : true, labelZoomRange:[20,21], zIndexUp : 1},
			"LOCATION2D" : 	{noLabel : true, labelZoomRange:[20,21], zIndexUp : 1},
			"STAGING" : 	{labelZoomRange:[20,21]},
			"DOCK" : 		{labelZoomRange:[19,21]},
			"PARKING" : 	{labelZoomRange:[19,21]},
			"ZONE" : 		{labelZoomRange:[18,19]},
			"OTHER" : 		{labelZoomRange:[20,21]},
			"STATE_LINE" : 	{labelZoomRange:[4, 6]},
			"ROAD" : 		{zoomRange:[18,21], editDeceive:false, zIndexUp : 2},
			"DEFAULT" : 	{labelZoomRange:[20,21]}
			
	};
	var WEBCAM_ICON = {
			"0" : [{url : "./assets/img/gis/webcam_0.png", anchor : {x : 5, y : 12}},
			       {url : "./assets/img/gis/webcam_red_0.png", anchor : {x : 5, y : 12}}],
	        "30" : [{url : "./assets/img/gis/webcam_30.png", anchor : {x : 11, y : 13}},
			       {url : "./assets/img/gis/webcam_red_30.png", anchor : {x : 11, y : 13}}],
	        "60" : [{url : "./assets/img/gis/webcam_60.png", anchor : {x : 13, y : 10}},
	               {url : "./assets/img/gis/webcam_red_60.png", anchor : {x : 13, y : 10}}],
	        "90" : [{url : "./assets/img/gis/webcam_90.png", anchor : {x : 12, y : 5}},
			       {url : "./assets/img/gis/webcam_red_90.png", anchor : {x : 12, y : 5}}],
	        "120" : [{url : "./assets/img/gis/webcam_120.png", anchor : {x : 13, y : 10}},
			       {url : "./assets/img/gis/webcam_red_120.png", anchor : {x : 13, y : 10}}],
	        "150" : [{url : "./assets/img/gis/webcam_150.png", anchor : {x : 11, y : 13}},
			       {url : "./assets/img/gis/webcam_red_150.png", anchor : {x : 11, y : 13}}],
	        "180" : [{url : "./assets/img/gis/webcam_180.png", anchor : {x : 5, y : 12}},
	               {url : "./assets/img/gis/webcam_red_180.png", anchor : {x : 5, y : 12}}],
	               
	        "-30" : [{url : "./assets/img/gis/webcam_n30.png", anchor : {x : 11, y : 13}},
			       {url : "./assets/img/gis/webcam_red_n30.png", anchor : {x : 11, y : 13}}],
	        "-60" : [{url : "./assets/img/gis/webcam_n60.png", anchor : {x : 13, y : 10}},
			       {url : "./assets/img/gis/webcam_red_n60.png", anchor : {x : 13, y : 10}}],
	        "-90" : [{url : "./assets/img/gis/webcam_n90.png", anchor : {x : 12, y : 5}},
			       {url : "./assets/img/gis/webcam_red_n90.png", anchor : {x : 12, y : 5}}],
	        "-120" : [{url : "./assets/img/gis/webcam_n120.png", anchor : {x : 13, y : 10}},
	               {url : "./assets/img/gis/webcam_red_n120.png", anchor : {x : 13, y : 10}}],
	        "-150" : [{url : "./assets/img/gis/webcam_n150.png", anchor : {x : 11, y : 13}},
			       {url : "./assets/img/gis/webcam_red_n150.png", anchor : {x : 11, y : 13}}],
	        "-180" : [{url : "./assets/img/gis/webcam_n180.png", anchor : {x : 5, y : 12}},
		           {url : "./assets/img/gis/webcam_red_n180.png", anchor : {x : 5, y : 12}}],
	};
	var EQUIPMENT_ICON = {
		"PRINTER": [{url: "./assets/img/gis/printer.png", anchor: {x: 13, y: 12}},
			{url: "./assets/img/gis/printer_red.png", anchor: {x: 13, y: 12}}],
		"COMPUTER": [{url: "./assets/img/gis/computer.png", anchor: {x: 12, y: 9}},
			{url: "./assets/img/gis/computer_red.png", anchor: {x: 12, y: 9}}],
		"WARP_MACHINE": [{url: "./assets/img/gis/warp_machine.png", anchor: {x: 11, y: 13}},
			{url: "./assets/img/gis/warp_machine_red.png", anchor: {x: 11, y: 13}}],
		"FORKLIFT": [{url: "./assets/img/gis/forklift.png", anchor: {x: 12, y: 9}},
			{url: "./assets/img/gis/forklift_red.png", anchor: {x: 12, y: 9}}],
		"TRUCK": [{url: require("..//assets/images/map/point_out_red.gif"), anchor: {x: 15, y: 15}},
			{url: require("..//assets/images/map/point_out_red.gif"), anchor: {x: 15, y: 15}}],
		"STORE": [{url: require("../assets/images/map/point_out_red.gif"), anchor: {x: 15, y: 15}},
			{url: require("../assets/images/map/point_out_red.gif"), anchor: {x: 15, y: 15}}],
        "STAR": [{url: "./assets/img/gis/star.png", anchor: {x: 15, y: 15}},
            {url: "./assets/img/gis/star.png", anchor: {x: 15, y: 15}}],
		"WORKER": [{url: "./assets/img/gis/worker.png", anchor: {x: 15, y: 15}},
			{url: "./assets/img/gis/worker.png", anchor: {x: 15, y: 15}}],
		"WORKER_HL": [{url: "./assets/img/gis/workeron.png", anchor: {x: 16, y: 16}},
			{url: "./assets/img/gis/workeron.png", anchor: {x: 16, y: 16}}],
		"WORKER_WR": [{url: "./assets/img/gis/workerw.png", anchor: {x: 16, y: 16}},
			{url: "./assets/img/gis/workerw.png", anchor: {x: 16, y: 16}}],
		"PEOPLE_ZONE": [{url: "./assets/img/gis/people_group.png", anchor: {x: 15, y: 10}},
			{url: "./assets/img/gis/people_group.png", anchor: {x: 15, y: 10}}],
		"PEOPLE_LOCATE": [{url: "./assets/img/gis/people_locate.png", anchor: {x: 10, y: 14}},
			{url: "./assets/img/gis/people_locate.png", anchor: {x: 10, y: 14}}],
		"DISPLAY": [{url: "./assets/img/gis/display.png", anchor: {x: 11, y: 10}},
			{url: "./assets/img/gis/display_red.png", anchor: {x: 11, y: 10}}],
		"HUMITURE": [{url: "./assets/img/gis/humiture.png", anchor: {x: 12, y: 12}},
			{url: "./assets/img/gis/humiture_red.png", anchor: {x: 12, y: 12}}]
	};
	function getCamIcons(cam){
		var icons = null;
		if(cam){
			var dir = cam.direction || 0;
			dir = (dir / 30).toFixed(0) * 30;
			icons = WEBCAM_ICON[dir];
			//正在播放的cam标记为红色
			if(cam.playing){
				icons = [icons[1], icons[0]];
			}
		}
		return icons;
	}
	function getEquipmentIcons(eqp){
		var icons = null;
		var type = eqp.type.toUpperCase();
		if(type == "WEBCAM"){
			icons = getCamIcons(eqp);
		}else{
			icons = EQUIPMENT_ICON[type];
			if(eqp._active){
				icons = [icons[1], icons[0]];
			}
		}
		return icons;
	}
	
	function getStateColor(style, level, levels){
		level -= 1;
		levels -= 1;
		var colors = LAYER_STYLE.STATE_LINE_LIMIT[style] || [[230, 230, 230], [25, 25, 25]];	//默认黑白色
		var min = colors[0];
		var max = colors[1];
		var r = Math.floor(min[0] + (max[0] - min[0]) /  levels * level);
		var g = Math.floor(min[1] + (max[1] - min[1]) /  levels * level);
		var b = Math.floor(min[2] + (max[2] - min[2]) /  levels * level);
		var color = rgbToStr([r, g, b]);
		return {"strokeColor" : color, "fillColor" : color};
	}
	
	function getStateColors(style){
		var colors = LAYER_STYLE.STATE_LINE_LIMIT[style] || [[230, 230, 230], [25, 25, 25]];	//默认黑白色
		var min = colors[0];
		var max = colors[1];
		return {min : rgbToStr(min), max : rgbToStr(max)};
	}
	//rgb : [r, g, b]
	function rgbToStr(rgb){
		var color = "#";
		_.forEach(rgb, function(c){
			var s = c.toString(16);
			if(s.length === 1){
				s = "0" + s;
			}
			color += s;
		});
		return color;
	}
	
	var CoorUtil = {
			coorsys : null,
			/**
			 * return: [lng, lat]
			 */
			pointToLatlngArray : function(x, y){
				var COORSYS = this.coorsys;
				if(_.isEmpty(COORSYS)){
					return [0, 0];	
				}
				
				var maxX = COORSYS.maxX;
				var maxY = COORSYS.maxY;
				
				var pointO = COORSYS.pointOrigin;
				var pointX = COORSYS.pointX;
				var pointY = COORSYS.pointY;
				
				//计算缩放比例和旋转角度
				var aLng = parseFloat(pointO.split(",")[0]);
				var aLat = parseFloat(pointO.split(",")[1]);
				var bLng = parseFloat(pointX.split(",")[0]);
				var bLat = parseFloat(pointX.split(",")[1]);
				var dLng = parseFloat(pointY.split(",")[0]);
				var dLat = parseFloat(pointY.split(",")[1]);
				var ratio = Math.hypot(aLat-bLat,aLng-bLng)/maxX;
				var radX = Math.atan((aLat-bLat)/(aLng-bLng));
				var radY = Math.atan((aLat-dLat)/(aLng-dLng));
				if(radY <= 0){
					radY += Math.PI;
				}
				radY -= Math.PI/2;
				var radN = radX - radY;
				var maxY_map = Math.hypot(aLat-dLat,aLng-dLng)/ratio; 
				
				var X = x;
				var Y = y;
				
				//仓库相对地图旋转、缩放、平移等处理
				Y /= maxY/maxY_map;  //Y轴拉伸
				
				X = X + Y*Math.sin(radN)*Math.cos(radN);
				Y = Y*Math.cos(radN);
				
				var sign = X>0 ? 1 : -1 ;//由于atan(x)结果在第1,4象限，计算rad时2,3象限的点被旋转180°，即中心对称，因此需作此处理
				var rad = radX + Math.atan(Y/X);
				var len = Math.hypot(X,Y); 
				var lat = sign*len*ratio*Math.sin(rad) + aLat;
				var lng = sign*len*ratio*Math.cos(rad) + aLng;
				if(isNaN(lat)){
					lat = aLat;
				}
				if(isNaN(lng)){
					lng = aLng;
				}
				return [parseFloat(lng.toFixed(6)), parseFloat(lat.toFixed(6))];
			},
			/**
			 * return: [x, y]
			 */
			latlngToPoint : function(lng, lat){
				var COORSYS = this.coorsys;
				if(_.isEmpty(COORSYS)){
					return [0, 0];
				}
				
				var maxX = COORSYS.maxX;
				var maxY = COORSYS.maxY;
				
				var pointO = COORSYS.pointOrigin;
				var pointX = COORSYS.pointX;
				var pointY = COORSYS.pointY;
				
				//计算缩放比例和旋转角度
				var aLng = parseFloat(pointO.split(",")[0]);
				var aLat = parseFloat(pointO.split(",")[1]);
				var bLng = parseFloat(pointX.split(",")[0]);
				var bLat = parseFloat(pointX.split(",")[1]);
				var dLng = parseFloat(pointY.split(",")[0]);
				var dLat = parseFloat(pointY.split(",")[1]);
				var ratio = Math.hypot(aLat-bLat,aLng-bLng)/maxX;
				var radX = Math.atan((aLat-bLat)/(aLng-bLng));
				var radY = Math.atan((aLat-dLat)/(aLng-dLng));
				if(radY <= 0){
					radY += Math.PI;
				}
				radY -= Math.PI/2;
				var radN = radX - radY;
				var maxY_map = Math.hypot(aLat-dLat,aLng-dLng)/ratio;
				
				lng -= aLng;
				lat -= aLat;
				
				var sign = lng>0 ? 1 : -1 ;//由于atan(x)结果在第1,4象限，计算rad时2,3象限的点被旋转180°，即中心对称，因此需作此处理
				var rad = radX - Math.atan(lat/lng);
				var len = Math.hypot(lat,lng);
				
				var Y = sign*len*Math.sin(rad)/ratio*maxY/maxY_map;
				var X = sign*len*Math.cos(rad)/ratio;
				
				Y /= -Math.cos(radN);
				X -= Y*Math.sin(radN)/(maxY/maxY_map);
				
				if(isNaN(X)){
					X = 0;
				}
				if(isNaN(Y)){
					Y = 0;
				}
				return [parseFloat(X.toFixed(2)), parseFloat(Y.toFixed(2))];
			}
	};
	
	function Jsmap(){
		this.map = window.map;
		this.el_id = null;
		this.workerMarker = null;
		/**
		 * 记录图层状态
		 * created : 是否已创建
		 */
		this.status = {
			base : {},
			zone : {},
			rack : {},
			location : {},
			dock : {},
			staging : {},
			parking : {},
			other : {},
			webcam : {},
			stateLine : {},
			locationLine:{},
			road: {}
		};
	}
	
	Jsmap.prototype.initMap = function(el_id, simple_map){
		simple_map = simple_map || false;
		//if (this.map == null) {
			var options = {simple_map : simple_map};
	        var el = document.getElementById(el_id);
	        if (el !== null) {
	            try {
	            	this.map = new window.map(el);
	            	this.setLayerStyle();
	            	this.setMapOptions();
	                if (!this.map) {
	                    alert("[Jsmap.init]: " + window.map.PROVIDER_NAME + "\n" + 
	                        "Error occured while creating JSMap" +
	                        "(map provider service may be temporarily unavailable)");
	                }
	            } catch (e) {
	            	console.error(e);
	                alert(
	                    "[Jsmap.init]: " + window.map.PROVIDER_NAME + "\n" + 
	                    "Error initializing map\n" +
	                    "(map provider service may be temporarily unavailable)\n" +
	                    e
	                    );
	            }
	        } else {
	            alert(
	                "[Jsmap.init]: " + window.map.PROVIDER_NAME + "\n" + 
	                "Div '" + el_id + "' not found"
	                );
	        }
	    //}
	};
	
	Jsmap.prototype.setCoorSys = function(coorSys){
		CoorUtil.coorsys = coorSys;
		this.map.initCoorSysUtil(CoorUtil);
	};
	Jsmap.prototype.setMapOptions = function(){
		this.map.setOptions('forceExitEdit', false);
		this.map.setOptions('forceRemove', false);
	};
	//warehouse
	Jsmap.prototype.markAllWarehouses = function(whs, fitBounds){
		this.map.createMarkers("warehouse", whs, fitBounds);
	};
	Jsmap.prototype.hideAllWarehouses = function(){
		this.map.clearMarkers("warehouse");
	};
	Jsmap.prototype.getWarehouseInMap = function(){
		var markers = this.map.getMarkers("warehouse", {_inMap : true});
		return _.map(markers, "data");
	};
	
	Jsmap.prototype.setLayerStyle = function(){
		this.map.setPolysArgs({
			base : 		{style : LAYER_STYLE.BASE, 			option : LAYER_OPTION.BASE },
			location : 	{style : LAYER_STYLE.LOCATION, 		option : LAYER_OPTION.LOCATION },
			staging : 	{style : LAYER_STYLE.STAGING, 		option : LAYER_OPTION.STAGING},
			dock : 		{style : LAYER_STYLE.DOCK, 			option : LAYER_OPTION.DOCK},
			parking : 	{style : LAYER_STYLE.PARKING, 		option : LAYER_OPTION.PARKING},
			zone : 		{style : LAYER_STYLE.ZONE, 			option : LAYER_OPTION.ZONE},
			rack : 		{style : LAYER_STYLE.LOCATION3D, 	option : LAYER_OPTION.LOCATION3D},
			other : 	{style : LAYER_STYLE.OTHER, 		option : LAYER_OPTION.OTHER},
			stateLine : {style : LAYER_STYLE.STATE_LINE, 	option : LAYER_OPTION.STATE_LINE},
			locationLine : {style : LAYER_STYLE.STATE_LINE, option : LAYER_OPTION.STATE_LINE},

			loadStatusLine : {style : LAYER_STYLE.LOAD_STATUS_LINE},
			road : 		{style : LAYER_STYLE.ROAD_MAIN,		option : LAYER_OPTION.ROAD},
			"default" : {style : LAYER_STYLE.DEFAULT, 		option : LAYER_OPTION.DEFAULT}
		});
	};
	//coor
	Jsmap.prototype.setCoorSysVisible = function(visible){
		this.map.setCoorSysVisible(visible);
	};
	//base
	Jsmap.prototype.showBase = function(base){
		this.map.createPolygons("base", base);
	};
	//all kinds location
	Jsmap.prototype.showLocation = function(type, locs){
		type = type.toLowerCase();
		if(this.status[type].created){
			this.map.showPolygons(type);
		}else{
			var list = this.map.createPolygons(type, locs);
			this.status[type].created = true;
			this.status[type].locs = list;
		}
	};
	Jsmap.prototype.hideLocation = function(type){
		this.map.clearPolygons(type);
	};


	//location utilization rate
	Jsmap.prototype.showLocsUtilizationRate = function(locs){
		var map = this.map;
		locs = locs || [];
		//test
		_.forEach(locs, function(loc){
			
			var filter = {
					//id : loc.id
					name : loc
			};
			var colors = [{
					len : parseInt(Math.random() * 100), color : LAYER_STYLE.UTILIZATION_RATE.used
				}, {
					color : LAYER_STYLE.UTILIZATION_RATE.free
				}];
			map.polygonPartColors(filter, colors);
		});
	};

	Jsmap.prototype.hideLocsUtilizationRate = function(){
		this.map.clearPolygonPartColors(null, true);
	};
	
	//state line
	Jsmap.prototype.initStateLines = function(lines){
		var _lines = this.map.createPolygons("stateLine", lines);
		var uuids = {};
		_.forEach(_lines, function(line){
			var uuid = line.data._uuid;
			var name = line.data.name;
			uuids[name] = uuid;
		});
		this.status.stateLine.lines = uuids;
		//隐藏
		this.map.clearPolygons("stateLine");
	};
	Jsmap.prototype.fitStateBounds = function(){
		this.map.fitBoundsWithPolygons("stateLine");
	};
	Jsmap.prototype.hideStateLines = function(){
		this.map.clearPolygons("stateLine");
	};
	Jsmap.prototype.showStateLine = function(colorStyle, stateName, newName, level, levels){
		colorStyle = (colorStyle || "").toUpperCase();
		if(!this.status.stateLine.lines)
			return;
		var uuid = this.status.stateLine.lines[stateName];
		if(uuid){
			var style = getStateColor(colorStyle, level, levels);
			this.map.renamePolygon(uuid, newName);
			this.map.showPolygons("stateLine", {_uuid : uuid}, style);
		}
	};
	Jsmap.prototype.getStateColors = function(colorStyle){
		colorStyle = (colorStyle || "").toUpperCase();
		return getStateColors(colorStyle);
	};

	//location line
	Jsmap.prototype.initLocationLines = function(lines){
		var _lines = this.map.createPolygons("locationLine", lines);
		var uuids = {};
		_.forEach(_lines, function(line){
			var uuid = line.data._uuid;
			var name = line.data.name;
			uuids[name] = uuid;
		});
		this.status.locationLine.lines = uuids;
		//隐藏
		this.map.clearPolygons("locationLine");
	};
	Jsmap.prototype.hideLocationLines = function(){
		this.map.clearPolygons("locationLine");
	};

	Jsmap.prototype.hideUncheckedPolygons = function(type,checkLatlngs){
		this.map.clearUncheckedPolygons(type,checkLatlngs);
	};
	
	Jsmap.prototype.showLocationLine = function(colorStyle, locationName, newName, level, levels){
		colorStyle = (colorStyle || "").toUpperCase();
		if(!this.status.locationLine.lines)
			return;
		var uuid = this.status.locationLine.lines[locationName];
		if(uuid){
			var style = getStateColor(colorStyle, level, levels);
			this.map.renamePolygon(uuid, newName);
			this.map.showPolygons("locationLine", {_uuid : uuid}, style);
		}
		
	};
	Jsmap.prototype.setCenter=function(latLng){
		this.map.setCenter(latLng);
	}
	Jsmap.prototype.setZoom=function(zoom){
		this.map.setZoom(zoom);
	}
	Jsmap.prototype.getLocationColors = function(colorStyle){
		colorStyle = (colorStyle || "").toUpperCase();
		return getStateColors(colorStyle);
	};
	Jsmap.prototype.fitLocationBounds = function(){
		this.map.fitBoundsWithPolygons("locationLine");
	};
	


	//webcam
	Jsmap.prototype.showWebcam = function(cams){
		if(this.status.webcam.created){
			this.map.showMarkers("webcam");
		}else{
			_.forEach(cams, function(cam){
				var icons = getCamIcons(cam);
				cam._icons = icons;
			});
			this.map.createMarkers("webcam", cams);
			this.status.webcam.created = true;
		}
	};
	Jsmap.prototype.hideWebcam = function(){
		this.map.clearMarkers("webcam");
	};
	Jsmap.prototype.refreshWebcam = function(uuid, cam){
		if(cam){
			var icons = getCamIcons(cam);
			cam._icons = icons;
		}
		this.map.rebuildMarker(uuid, "webcam", cam);
	};
	Jsmap.prototype.refreshWebcamIcons = function(cam){
		var icons = getCamIcons(cam);
		this.map.setMarkerIcons(cam._uuid, icons);
	};
	//all type equipment
	Jsmap.prototype.showEquipment = function(type, equipments, refresh){
		this.status[type] = this.status[type] || {};
		if(refresh){
			this.map.clearMarkers(type, true);
			this.status[type].created = false;
		}
		if(this.status[type].created){
			this.map.showMarkers(type);
		}else{
			_.forEach(equipments, function(equipment){
				var icons = getEquipmentIcons(equipment);
				equipment._icons = icons;
				if(equipment.latlng.indexOf(" ") > -1){
					equipment.latlng = getCenter(equipment.latlng).toString();
				}
			});
			this.map.createMarkers(type, equipments, false, {
				noRecombine : true
			});
			this.status[type].created = true;
		}
	};
	Jsmap.prototype.hideEquipment = function(type){
		this.map.clearMarkers(type);
	};
	Jsmap.prototype.refreshEquipment = function(uuid, equipment){
		if(equipment){
			var icons = getEquipmentIcons(equipment);
			equipment._icons = icons;
		}
		this.map.rebuildMarker(uuid, equipment && equipment.type, equipment);
	};
	Jsmap.prototype.refreshEquipmentIcons = function(equipment){
		var icons = getEquipmentIcons(equipment);
		this.map.setMarkerIcons(equipment._uuid, icons);
	};
	Jsmap.prototype.equipmentAnimate = function(equipment, pathStr){
		this.map.setMarkerAnimat(equipment._uuid, {
			path : pathStr,
			speed : equipment.type == "FORKLIFT" ? 3 : 1
		});
	};
	
	//truck
	Jsmap.prototype.markTrucks = function(trucks, fitBounds){
		//先清除所有truck, 再重建
		this.hideTrucks();
		_.forEach(trucks, function(truck){
			truck._icons = EQUIPMENT_ICON.TRUCK;
		});
		this.map.createMarkers("truck", trucks, fitBounds, {
			noRecombine : true,
			noLabel : true
		});
	};
	Jsmap.prototype.hideTrucks = function(){
		this.map.clearMarkers("truck", true);
	};

	Jsmap.prototype.markWorkers = function(workers, fitBounds){
		//先清除所有truck, 再重建
		this.hideWorkers();
		_.forEach(workers, function(worker){
			if (worker.isWarn) {
				worker._icons = EQUIPMENT_ICON.WORKER_WR;
			} else {
				worker._icons = EQUIPMENT_ICON.WORKER;
			}
		});
		this.map.createMarkers("worker", workers, fitBounds, {
			noRecombine : true,
			noLabel : true
		});
	};
	Jsmap.prototype.hideWorkers = function(){
		this.map.clearMarkers("worker", true);
	};
	Jsmap.prototype.workerHighlight = function(worker) {
		if (!worker) {
			if (this.workerMarker) {
				this.workerMarker.setMap(null);
				this.workerMarker = null;
			}
			return;
		}
		if (!this.workerMarker) {
			worker._icons = EQUIPMENT_ICON.WORKER_HL;
			this.workerMarker = this.map.createMarker(worker);

		} else {
			this.map.setMarkerPosition(this.workerMarker, worker.latlng);
		}
	};
	
	//load status
	Jsmap.prototype.showLoadStatus = function(loads, lines, fitBounds){
		var markers = [];
		//var lines = [];
		_.forEach(loads, function(load){
		    var icon = EQUIPMENT_ICON.TRUCK;
		    if (load.notHighlight) icon = EQUIPMENT_ICON.STORE;
            if (load.type === "star") icon = EQUIPMENT_ICON.STAR;

			var marker = {
				_icons : icon,
				latlng : load.latlng,
				orderNo: load.OrderNo
			};
			if(load._html) {
				marker._html = load._html;
			}
			markers.push(marker);
		});
		
		//先清除所有load, 再重建
		this.hideLoadStatus();
		this.map.createMarkers("loadStatus", markers, fitBounds, {
			noRecombine : true,
			noLabel : true
		});
		this.map.createPolylines("loadStatusLine", lines);
	};
	Jsmap.prototype.hideLoadStatus = function(){
		this.map.clearMarkers("loadStatus", true);
		this.map.clearPolylines("loadStatusLine", true);
	};
	/**
	 * 路径回放
	 * path: 线路
	 * progressChange : function, 播放进度改变时执行
	 */
	Jsmap.prototype.gpsRouteCreate = function(path, progressChange){
		this.map.createRoutePlayer("truckGPS", _.join(path, " "), {
			preRoute : true,
			setProgress : progressChange
		});
	};
	Jsmap.prototype.gpsRouteRemove = function(){
		this.map.clearRoutePlayer("truckGPS");
	};
	Jsmap.prototype.gpsRouteStop = function(){
		this.map.routePlayerCtrl("truckGPS", "stop");
	};
	Jsmap.prototype.gpsRoutePlay = function(){
		this.map.routePlayerCtrl("truckGPS", "play");
	};
	Jsmap.prototype.gpsRoutePause = function(){
		this.map.routePlayerCtrl("truckGPS", "pause");
	};
	
	//设置编辑状态
	Jsmap.prototype.setEditable = function(status){
		this.map.edit.setEditable(status);
	};
	
	//设置回调函数
	Jsmap.prototype.setCallbacks = function(callbacks){
		callbacks = callbacks || {};
		$.extend(this.map.callbacks, callbacks);
	};
	//选中zone内部所有location
	Jsmap.prototype.editInnerLocations = function(id, checked){
		this.map.edit.changePolygonsEditStatus(checked, "location", {parentId:id});
	};
	//设置对象的编辑状态，silent : boolean,静默执行,不触发回调函数
	Jsmap.prototype.setEditStatus = function(loc, editable, silent){
		if(!loc._uuid){
			return;
		}
		this.map.edit.changeMarkersEditStatus(editable, null, {_uuid : loc._uuid}, !silent);
		this.map.edit.changePolygonsEditStatus(editable, null, {_uuid : loc._uuid}, !silent);
	};
	//重命名locations
	Jsmap.prototype.renameLocations = function(locs){
		var map = this.map;
		_.forEach(locs, function(loc){
			map.renamePolygon(loc._uuid, loc.name);
		});
	};
	//重命名markers
	Jsmap.prototype.renameMarkers = function(markers){
		var map = this.map;
		_.forEach(markers, function(marker){
			map.renameMarker(marker._uuid, marker.name);
		});
	};
	//刷新location
	Jsmap.prototype.refreshLocation = function(uuid, loc){
		var group = null;
		if(loc){
			uuid = uuid || loc._uuid;
			group = loc.type.toLowerCase();
		}
		this.map.rebuildPolygon(uuid, group, loc);
	};
	
	//road
	Jsmap.prototype.setDefaultRoadStyle = function (isMain) {
		var style = isMain ? LAYER_STYLE.ROAD_MAIN : LAYER_STYLE.ROAD_SUB;
		this.map.setPolysArgs({
			road : {STYLE : style}
		});
	};
	Jsmap.prototype.refreshRoad = function (uuid, road) {
		this.map.rebuildPolyline(uuid, "road", road);
	};
	Jsmap.prototype.resetRoadRubber = function (latlng) {
		var latlngStr;
		if(latlng){
			latlngStr = latlng[0] + "," + latlng[1];
		}
		this.map.edit.line('reset', latlngStr);
	};
	Jsmap.prototype.showRoad = function (roads, extend) {
		if(this.status.road.created && !extend){
			this.map.showPolylines("road");
		}else{
			var main = [], sub = [];
			_.forEach(roads, function(road){
				var type = road.type.toLowerCase();
				if(type == "main road"){
					main.push(road);
				}else{
					sub.push(road);
				}
			});
			if(main.length > 0){
				this.map.createPolylines("road", main, LAYER_STYLE.ROAD_MAIN);
			}
			if(sub.length > 0){
				this.map.createPolylines("road", sub, LAYER_STYLE.ROAD_SUB);
			}
			this.status.road.created = true;
		}
	};
	Jsmap.prototype.hideRoad = function () {
		this.map.clearPolylines("road");
	};
	Jsmap.prototype.setDefaultRoadType = function(isMain){
		var style = isMain ? LAYER_STYLE.ROAD_MAIN : LAYER_STYLE.ROAD_SUB;
		this.map.setPolysArgs({
			road : {style : style}
		});
	};
	
	
	
	Jsmap.prototype.showPickRoad = function (roadDatas) {
		this.map.createPickRoads(roadDatas);
	};
	Jsmap.prototype.hidePickRoad = function () {
		this.map.clearPickRoads();
	};
	Jsmap.prototype.showHeatMap = function (datas) {
		this.map.setHeatMap(datas);
	};

	
	
	Jsmap.prototype.showHeatLocation = function (loc) {
		this.map.setHeatLocation(loc);
	};
	/**
	 * locs: [{
	 * 			filter: {},			//location过滤条件
	 * 			weight: Number		//权重，取值范围1-10
	 * 		}, ...]
	 */
	Jsmap.prototype.showHeatMapFromLoc = function (locs) {
		locs = locs || [];
		var max, min;
		var datas = [];
		
		_.forEach(locs, function(loc){
			if(_.isNumber(loc.weight) && !_.isEmpty(loc.filter)){
				var weight = loc.weight;
				max = Math.max(max || weight, weight);
				min = Math.min(min || weight, weight);
				datas.push(_.clone(loc));
			}
		});
		var step = (max - min) || min;
		_.forEach(datas, function(data){
			var w = data.weight;
			w = Math.ceil(((w - min) / step) * 10) || 1;
			data.weight = w;
		});
		this.map.polygonHeatMap(datas);
	};
	/**
	 * locs: [{
	 * 			filter: {},			//location过滤条件
	 * 			weight: Number		//权重，取值范围1-10
	 * 		}, ...]
	 */
	Jsmap.prototype.showHeatMapFromRoad = function (roads) {
		roads = roads || [];
		var max, min;
		var datas = [];
		
		_.forEach(roads, function(road){
			if(_.isNumber(road.weight) && !_.isEmpty(road.filter)){
				var weight = road.weight;
				max = Math.max(max || weight, weight);
				min = Math.min(min || weight, weight);
				datas.push(_.clone(road));
			}
		});
		var step = (max - min) || min;
		_.forEach(datas, function(data){
			var w = data.weight;
			w = Math.ceil(((w - min) / step) * 10) || 1;
			data.weight = w;
		});
		this.map.polylineHeatMap(datas, "road");
	};
	
	
	//按位置排序,按坐标系正方向分列排序，排序结果为二维数组。sort = [[Loc11, Loc12 ...], [Loc21, Loc22 ...] ...]。
	//返回结果包含X、Y2个方向的排序结果，为三维数组, [X-sort, Y-sort]
	//accuracy ： 精度，决定同列对象允许偏离该列轴线的距离，单位：坐标系单位，默认值：2。
	Jsmap.prototype.sortByPosition = function(locs, accuracy){
		accuracy = accuracy || 2;
		//compute objects's center
		_.forEach(locs, function(loc){
			var center = getCenter(loc.latlng);
			loc._x = center[0];
			loc._y = center[1];
		});
		//cols follow x-axis
		var fy = _.sortBy(locs, function(loc){
			return loc._y;
		});
		//cols follow y-axis
		var fx = _.sortBy(locs, function(loc){
			return loc._x;
		});
		return [fy, fx];

		// var X = [];
		// var last = fy[0]._y;
		// var lastArray = [];
		// var deviation = accuracy;
		// _.forEach(fy, function(loc){
		// 	deviation -= loc._y - last;
		// 	last = loc._y;
		// 	if(deviation < 0){
		// 		deviation = accuracy;
		// 		X.push(_.sortBy(lastArray, function(l){
		// 			return l._x;
		// 		}));
		// 		lastArray = [];
		// 	}
		// 	lastArray.push(loc);
		// });
		// X.push(_.sortBy(lastArray, function(l){
		// 	return l._x;
		// }));
		//
		// //cols follow y-axis
		// var fx = _.sortBy(locs, function(loc){
		// 	return loc._x;
		// });
		// var Y = [];
		// last = fx[0]._x;
		// lastArray = [];
		// deviation = accuracy;
		// _.forEach(fx, function(loc){
		// 	deviation -= loc._x - last;
		// 	last = loc._x;
		// 	if(deviation < 0){
		// 		deviation = accuracy;
		// 		Y.push(_.sortBy(lastArray, function(l){
		// 			return l._y;
		// 		}));
		// 		lastArray = [];
		// 	}
		// 	lastArray.push(loc);
		// });
		// Y.push(_.sortBy(lastArray, function(l){
		// 	return l._y;
		// }));
		// return [X, Y];
	};
	
	Jsmap.prototype.polygonMarkers = function(loc, show){
		var filter = {};
		if(loc._uuid){
			filter["_uuid"] = loc._uuid;
		}else if(loc.id){
			filter["id"] = loc.id;
		}else{
			return;
		}
		this.map.markPolygon(filter, show);
	};
	
	Jsmap.prototype.highlightLocs = function(locs, group){
		_.forEach(locs, function(loc){
			loc._style = loc._warn === false ? LAYER_STYLE.EMPTY_CTN : LAYER_STYLE.FULL_CTN;
			delete loc._warn;
			if(loc._type == 'border'){
				loc._style = LAYER_STYLE.HIGHTLIGHT_BORDER;
				delete loc._type;
			}
		});
		this.map.highlightPolygons(locs, group, true);
	};
	
	Jsmap.prototype.getLocationCenter = function(loc){
		var center = "";
		if(loc && loc.latlng){
			var c = getCenter(loc.latlng);
			return c[0].toFixed(6) + "," + c[1].toFixed(6);
		}
		return center;
	};
	
	Jsmap.prototype.setMarkerCursor = function(type){
		if(!type)
			return;
		type = type.toLowerCase();
		var cursor = {
				webcam : "webcam",
				printer : "printer",
				computer : "computer",
				warp_machine : "warp_machine",
				forklift : "forklift",
				display : "display",
				humiture : "humiture"
		}[type];
		if(cursor){
			this.map.setCursor(cursor);
		}
	};
	
	//清除所有图层
	Jsmap.prototype.clearAllLayers = function(){
		this.map.clearAllLayers();
		
		//var ignore = ["stateLine"];
		var status = this.status;
		for(var key in status){
			//if(_.includes(ignore, key))
			//	continue;
			status[key] = {};
		}
	};
	
	//百像素对应的长度， return: {distance: Float m, latlng: Float}
	Jsmap.prototype.centumPixelToLength = function(){
		var dis = this.map.pixelToDistance(100);
		var len = this.map.pixelToLatlngLength(100);
		return {
			distance: dis,
			latlngOffset: len
		};
	};
	
	//============== util functions =============
	function getCenter(points){
		var ps = pointsToArrays(points);
		if(ps.length === 0){
			return [0, 0];
		}
		var xSum = 0;
		var ySum = 0;
		_.forEach(ps, function(p){
            xSum += p[0];
            ySum += p[1];
		});
		var x = xSum / ps.length;
		var y = ySum / ps.length;
		return [x, y];
	}
	function pointsToArrays(points, separat1, separat2){
		separat1 = separat1 || / +/;
		separat2 = separat2 || / *, */;
		var ps = points.split(separat1);
		var result = [];
		_.forEach(ps, function(p){
			if(p !== ""){
				result.push(pointToArray(p));
			}
		});
		return result;
	}
	function pointToArray(point, separat){
		separat = separat || / *, */;
		var str = point.split(separat);
		var result = [parseFloat(str[0]), parseFloat(str[1])];
		return result;
	}
	//============== util functions end =============
	jsmap = new Jsmap();
}
window.jsmap = jsmap;
export default jsmap;
// });
