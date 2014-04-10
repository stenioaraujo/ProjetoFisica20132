// CONSTANTES
var lightSpeed = 46; //px/s

// VARIAVEIS
var eterSpeed = 0;

$(document).ready(function() {
	$("#teste").click(function() {
		var circulo = $("#circulo");
		var angle = parseInt(circulo.attr("angle")) + 45;

		circulo.css("-webkit-transform", "rotate("+angle+"deg)");
		circulo.attr("angle", angle);
	});


	//Movendo do lan�ador at� o espelho central
	moveHorizontalUp("#particle", "245px", function() {
		$("#particle").css("display", "none");
		criaHorizontal();
		criaVertical();
	});

	//Criando particulas
	function criaHorizontal() {
		var horizontal = $("#particleHorizontal");

		horizontal.css("display", "block");

		// Move parte da horizontal
		moveHorizontalUp("#particleHorizontal", "470px", function(){
			moveHorizontalDown("#particleHorizontal", "245px");
		});
	}

	function criaVertical() {
		var horizontal = $("#particleVertical");

		horizontal.css("display", "block");

		// Move parte da horizontal
		moveVerticalDown("#particleVertical", "20px", function(){
			moveVerticalUp("#particleVertical", "245px");
		});
	}

	//Mover horizontal
	//px � o destino final
	function moveHorizontalUp(id, px, callback) {
		px = parseInt(px.replace("px",""));
		var obj = $(id);

		var posX = parseInt(obj.css("left").replace("px",""));

		var mover = function() {
			if (posX < px) {
				obj.css("left", posX+1);
				posX += 1;
				setTimeout(mover, 21.739130);
			}else {
				if (callback) callback();
			}
		};
		mover();				
	}
	function moveHorizontalDown(id, px, callback) {
		px = parseInt(px.replace("px",""));
		var obj = $(id);

		var posX = parseInt(obj.css("left").replace("px",""));

		var mover = function() {
			if (posX > px) {
				obj.css("left", posX-1);
				posX -= 1;
				setTimeout(mover, 21.739130);
			}else {
				if (callback) callback();
			}
		};
		mover();				
	}

	//Mover horizontal
	//px � o destino final
	function moveVerticalUp(id, px, callback) {
		px = parseInt(px.replace("px",""));
		var obj = $(id);

		var posY = parseInt(obj.css("top").replace("px",""));

		var mover = function() {
			if (posY < px) {
				obj.css("top", posY+1);
				posY += 1;
				setTimeout(mover, 21.739130);
			}else {
				if (callback) callback();
			}
		};
		mover();				
	}
	function moveVerticalDown(id, px, callback) {
		px = parseInt(px.replace("px",""));
		var obj = $(id);

		var posY = parseInt(obj.css("top").replace("px",""));

		var mover = function() {
			if (posY > px) {
				obj.css("top", posY-1);
				posY -= 1;
				setTimeout(mover, 21.739130);
			}else {
				if (callback) callback();
			}
		};
		mover();
	}

});
