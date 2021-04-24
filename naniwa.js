//マップオブジェクト設定
var mapObj;
//浪速区の中心地を安養寺の緯度・軽度の初期値に設定
var posX=135.49515;
var posY=34.659552;
//小中校のマーカーと円の配列（表示、非表示で操作するため）
var allmarkers = new Array();
var allcircles = new Array();
var allcircles2 = new Array();
var allcircles3 = new Array();

//マップ描画
function drawMap(){
  //初期設定
	var map = document.getElementById("map_canvas");
	var options = {
		zoom: 15,
		center: new google.maps.LatLng(posY, posX),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	mapObj = new google.maps.Map(map, options);

	//小学校CSVファイル読み込み
	var xhr = new XMLHttpRequest();
	xhr.onload = function(){
		var tempArray = xhr.responseText.split("\n");
		//
		csvArray = new Array();
		for(var i=0;i<tempArray.length;i++){
			csvArray[i] = tempArray[i].split(",");
			var data = csvArray[i];
			//マーカー作成　画像ファイルを読み込み
			var image = 'icon_elementary.png';
			var marker_image = new google.maps.MarkerImage(
				image,
				//画像サイズ
				new google.maps.Size(32,32),
				//画像描画開始位置
				new google.maps.Point(0,0),
				//基準点
				new google.maps.Point(15,15)
			);
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng( parseFloat(data[1]), parseFloat(data[0]) ),
				map: mapObj,
				icon: marker_image,
				title: data[2]
			});
			//生成したマーカーをグローバル配列に保存
			allmarkers.push(marker);
			//csvファイル　施設名:data[2] 所在地:data[3] TEL:data[4] 緯度:data[1] 経度:data[0]
			attachMessage(marker, data[2], data[3], data[4], data[1], data[0]);
			//円　生成　後で描くほうが上になるので200mから先に描く
			//200m
				var cOpt3 = {
					center: new google.maps.LatLng( parseFloat(data[1]), parseFloat(data[0])),
					radius: 200,
					strokeWeight: 3,
					strokeColor: "#00ffff",
					strokeOpacity: 0.5,
					fillColor: "#00ffff",
					fillOpacity: 0.4
				};
			var circle3 = new google.maps.Circle(cOpt3);
			circle3.setMap(mapObj);
			allcircles3.push(circle3);
			//100m
				var cOpt2 = {
					center: new google.maps.LatLng( parseFloat(data[1]), parseFloat(data[0])),
					radius: 100,
					strokeWeight: 3,
					strokeColor: "#ffff00",
					strokeOpacity: 0.5,
					fillColor: "#ffff00",
					fillOpacity: 0.4
				};
			var circle2 = new google.maps.Circle(cOpt2);
			circle2.setMap(mapObj);
			allcircles2.push(circle2);
			//50m
				var cOpt = {
					center: new google.maps.LatLng( parseFloat(data[1]), parseFloat(data[0])),
					radius: 50,
					strokeWeight: 3,
					strokeColor: "#ff0000",
					strokeOpacity: 0.5,
					fillColor: "#ff0000",
					fillOpacity: 0.4
				};
			var circle = new google.maps.Circle(cOpt);
			circle.setMap(mapObj);
			allcircles.push(circle);
		}
	};
	xhr.open("get", "elementaryschool.csv", true);
	xhr.send(null);

	//防犯カメラ（公設置）
	drawFacilities("camera_naniwa.csv", "icon_camera32x32.png");

	//浪速区境界ポリゴン
	//ポリゴン緯度経度データ　CSVファイル読み込み
		var xhr4 = new XMLHttpRequest();
		xhr4.onload = function(){
			var tempArray = xhr4.responseText.split("\n");
			var csvArray = new Array();
			var points = new Array();
			// 座標の配列を作成
			for(var i=0;i<tempArray.length;i++){
				csvArray[i] = tempArray[i].split(",");
				var data = csvArray[i];
				points.push(new google.maps.LatLng( parseFloat(data[0]), parseFloat(data[1])));
			}
			// ポリゴンオプション設定
			var polygonOptions = {
				path: points,
				strokeWeight: 5,
				strokeColor: "#ff0000",
				strokeOpacity: "0.9",
				fillColor: "#008000",
				fillOpacity: 0.0
			};
			// ポリゴンを設定
			var polygon = new google.maps.Polygon(polygonOptions);
			polygon.setMap(mapObj);
		};
		xhr4.open("get", "naniwa.csv", true);
		xhr4.send(null);
}

//読み込んだcsvからinfowindowと左側に表示する施設HTML生成
function attachMessage(getmarker, name, add, tel, posy, posx) {
	//Infowindow生成
	var infowin = new google.maps.InfoWindow({ content:name+"</br>"+"住所:"+add+"</br>"+"問合せ先："+tel+"</br>"});
	//マウスオーバー
	google.maps.event.addListener(getmarker, 'mouseover', function() {
		infowin.open(getmarker.getMap(), getmarker);
	});
	//マウスアウト
	google.maps.event.addListener(getmarker, 'mouseout', function(){
		infowin.close();
	});
}

//防犯カメラ描画
function drawFacilities(filename, iconname){
	var xhr = new XMLHttpRequest();
	xhr.onload = function(){
		var tempArray = xhr.responseText.split("\n");
		//
		csvArray = new Array();
		for(var i=0;i<tempArray.length;i++){
			csvArray[i] = tempArray[i].split(",");
			var data = csvArray[i];
			//マーカー作成　画像ファイルを読み込み
			var image;
			    image = iconname;
			var marker_image = new google.maps.MarkerImage(
				image,
				//画像サイズ
				new google.maps.Size(36,36),
				//画像描画開始位置
				new google.maps.Point(0,0),
				//基準点
				new google.maps.Point(18,18)
			);
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng( parseFloat(data[0]), parseFloat(data[1]) ),
				map: mapObj,
				icon: marker_image,
				title: data[2]
			});
			//csvファイル　住所:data[2] 設置場所:data[3] 事業名:data[4] 設置台数:data[5]
			attachMessage2(marker, data[2], data[3], data[4], data[5]);
		}
	};
	xhr.open("get", filename, true);
	xhr.send(null);
}

//防犯カメラinfowindow
function attachMessage2(getmarker, address, place, year, number) {
	//Infowindow生成
	var infowin = new google.maps.InfoWindow({ content:"住所:"+address+"</br>設置場所:"+place+"</br>事業名:"+year+"</br>設置台数:"+number});
	//マウスオーバー
	google.maps.event.addListener(getmarker, 'mouseover', function() {
		infowin.open(getmarker.getMap(), getmarker);
	});
	//マウスアウト
	google.maps.event.addListener(getmarker, 'mouseout', function(){
		infowin.close();
	});
}

//小学校アイコンのチェックボックスクリック
function clickCheckbox(){
	//チェックをはずしたら消す
	if (!document.checkbox.elements[0].checked){  //document.フォーム名.elements[].checked
		for (var i=0;i<allmarkers.length;i++){　
				allmarkers[i].setVisible(false);
		}
	} else {
	//そうでなければチェックがついたので表示する
		for (var i=0;i<allmarkers.length;i++){
				allmarkers[i].setVisible(true);
		}
	}
}

//小学校半径50mのチェックボックスクリック
function clickCheckbox1(){
	//チェックをはずしたら消す
	if (!document.checkbox.elements[1].checked){
		for (var i=0;i<allcircles.length;i++){
				allcircles[i].setVisible(false);
		}
	} else {
	//そうでなければチェックがついたので表示する
		for (var i=0;i<allcircles.length;i++){
				allcircles[i].setVisible(true);
		}
	}
}

//小学校半径100mのチェックボックスクリック
function clickCheckbox2(){
	//チェックをはずしたら消す
	if (!document.checkbox.elements[2].checked){
		for (var i=0;i<allcircles2.length;i++){
				allcircles2[i].setVisible(false);
		}
	} else {
	//そうでなければチェックがついたので表示する
		for (var i=0;i<allcircles2.length;i++){
				allcircles2[i].setVisible(true);
		}
	}
}

//小学校半径200mのチェックボックスクリック
function clickCheckbox3(){
  //チェックをはずしたら消す
  if (!document.checkbox.elements[3].checked){
	  for (var i=0;i<allcircles3.length;i++){
			  allcircles3[i].setVisible(false);
		}
	} else {
	//そうでなければチェックがついたので表示する
		for (var i=0;i<allcircles3.length;i++){
				allcircles3[i].setVisible(true);
		}
	}
}

function getPosition(){
	//現在地取得
  //Geolocation API対応チェック
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
			//取得成功
			function(position) {
			  var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			  var infowindow = new google.maps.InfoWindow({ map: mapObj, position: pos, content: '現在地'});
			  mapObj.setCenter(pos);
		  },
		  //取得失敗
		  function(error){
			  switch(error.code){
				  case 1: //PERMISSION_DENIED
					  alert("この端末の位置情報利用が許可されていません");
					  break;
				  case 2: //POSITION_UNAVAILABLE
					  alert("現在地が取得できませんできした");
					  break;
				  case 3: //TIMEOUT
					  alert("時間切れになりました");
					  break;
				  default:
					  alert("エラーが出ました(error code:"+error.code+")");
					  break;
			  }
		  }
	  );
	} else {
		alert("この端末では位置情報が取得できません");
	}
}
