//マップオブジェクト設定
var mapObj;
//中心地設定
var posX=135.5847133;
var posY=34.7188567;

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

	//GPSデータ
	drawFacilities("naniwa800se655_20190402.csv", "truck.png");

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

//GPS描画
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
				position: new google.maps.LatLng( parseFloat(data[2]), parseFloat(data[3]) ),
				map: mapObj,
				icon: marker_image,
				title: data[2]
			});
			//csvファイル　日時:data[0] 車番:data[1]
			attachMessage2(marker, data[0], data[1]);
		}
	};
	xhr.open("get", filename, true);
	xhr.send(null);
}

//GPSinfowindow
function attachMessage2(getmarker, date_time, car_no) {
	//Infowindow生成
	var infowin = new google.maps.InfoWindow({ content:"日時:"+date_time+"</br>車番:"+car_no});
	//マウスオーバー
	google.maps.event.addListener(getmarker, 'mouseover', function() {
		infowin.open(getmarker.getMap(), getmarker);
	});
	//マウスアウト
	google.maps.event.addListener(getmarker, 'mouseout', function(){
		infowin.close();
	});
}

//現在地取得
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
