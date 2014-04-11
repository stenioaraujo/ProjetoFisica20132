var Util = (function () {
    function Util() {
    }
    Util.prototype.sinal = function (x) {
        return x < 0 ? -1 : x == 0 ? 0 : 1;
    };
    Util.prototype.distancia = function (p1, p2) {
    	return Math.sqrt(Math.pow(p1.y-p2.y, 2) + Math.pow(p1.x-p2.x, 2));
    }
    return Util;
})();

var Particula = (function () {
    function Particula(x, y) {
        this.particula = $("<div class='particula' />");
        this.setPosicao(x, y);
        this.destruida = false;
    }
    Particula.prototype.setColor = function (color) {
        this.particula.css("background", color);
    };


    Particula.prototype.getPosicao = function () {
        return { "x": this.x, "y": this.y };
    };

    Particula.prototype.tempoAte = function (x, y) {
        return this.getVelocidade(x, y) * this.plano.getComprimento();
    };

    Particula.prototype.getVelocidade = function (x, y) {
        var luz = this.plano.getVLuz();
        var eter = this.plano.getVEter();
        var incli = this.plano.getInclinacao();
        var velocidades = {
        	0:   25,
        	45:  24,
        	90:  23,
        	135: 21,
        	180: 19,
        	225: 21,
        	270: 23,
        	315: 24
        }
        $("#vLuz").html(luz);
        $("#vEter").html(eter);
        $("#grau").html(incli);
        $("#comprimento").html(this.plano.getComprimento());
        
        if (this.plano.getVEter() != 0) return velocidades[this.anguloAte(x, y)];
        return 21;
    };
    
    Particula.prototype.anguloAte = function(x, y) {
    	var sinal = (new Util()).sinal;
    	if (x - this.x == 0) {
    		var dY = y - this.y;
    		return ((sinal(dY) < 0 ? 180: 0) + 90 + this.plano.getInclinacao()) % 360;
    	} else if (y - this.y == 0) {
    		var dX = x - this.x;
    		return ((sinal(dX) < 0 ? 180: 0) + this.plano.getInclinacao()) % 360;
    	}
    }

    Particula.prototype.setPosicao = function (x, y) {
        this.x = x;
        this.y = y;

        this.particula.css("left", x);
        this.particula.css("top", y);
    };

    Particula.prototype.setPosicaoAnimate = function (x, y, callback) {
        var sinal = new Util().sinal;
        var xFinal = x;
        var yFinal = y;
        var xInicial = this.x;
        var yInicial = this.y;

        var f = function (xDestino) {
            return ((yFinal - yInicial) / (xFinal - xInicial)) * (xDestino - xInicial) + yInicial;
        };

        var mover = function (particula) {
            if (particula.destruida)
                return;

            var dX = xFinal - particula.x;
            var dY = yFinal - particula.y;

            if (dX == 0 && dY == 0) {
                if (callback)
                    callback();
                return;
            }

            if (sinal(dX) == 0 || sinal(dY) == 0) {
                particula.setPosicao(particula.x + sinal(dX), particula.y + sinal(dY));
            } else if (particula.x != xFinal || particula.y != yFinal) {
                x = particula.x + sinal(dX);
                particula.setPosicao(x, f(x));
            }

            setTimeout(function () {
                mover(particula);
            }, particula.getVelocidade(xFinal, yFinal));
        };
        mover(this);
    };

    Particula.prototype.setPlano = function (plano) {
        this.plano = plano;
    };

    Particula.prototype.getElement = function () {
        return this.particula;
    };

    Particula.prototype.destruir = function () {
        this.particula.remove();
        this.destruida = true;
        this.setVisivel(false);
    };

    Particula.prototype.setVisivel = function (visivel) {
        if (visivel) {
            this.particula.css("display", "block");
        } else {
            this.particula.css("display", "none");
        }
    };
    return Particula;
})();

var Plano = (function () {
    function Plano(id) {
        this.vLuz = 46;
        this.eterAtivado = false;
        this.vEter = 4.6;
        this.id = id;
        this.particulas = new Array();
        this.inclinacao = parseInt($("#" + id).attr("angle"));
        this.comprimento = 225;
    }
    Plano.prototype.setComprimento = function (comprimento) {
        this.comprimento = comprimento;
    };

    Plano.prototype.getVLuz = function () {
        return this.vLuz;
    };

    Plano.prototype.getVEter = function () {
        if (this.eterAtivado)
            return this.vEter;
        return 0;
    };
    Plano.prototype.changeEter = function (b) {
        this.eterAtivado = b;
    };

    Plano.prototype.getComprimento = function () {
        return this.comprimento;
    };

    Plano.prototype.getComprimentoEmGigaMetros = function () {
        return 0;
    };

    Plano.prototype.getInclinacao = function () {
        return this.inclinacao % 360;
    };

    Plano.prototype.getInclinacaoLiteral = function () {
        return this.inclinacao;
    };

    Plano.prototype.setInclinacao = function (g) {
        this.inclinacao = g;
        var circulo = $("#" + this.id);
        circulo.css("-webkit-transform", "rotate(" + g + "deg)");
        circulo.attr("angle", g);
    };

    Plano.prototype.addParticula = function (particula) {
        this.particulas.push(particula);
        $("#" + this.id).prepend(particula.getElement());
        particula.setPlano(this);
    };

    Plano.prototype.getParticulas = function () {
        return this.particulas;
    };
    return Plano;
})();

var Eter = false;

$(document).ready(function () {
    var plano;
    var rodando = false;
    var particula;
    var particulaVai;
    var particulaSobe;
    var particulaResultante;

    var iniciar = function () {
        plano = new Plano("circulo");
        plano.changeEter(Eter?true : false);
        particula = new Particula(20, 245);
        particulaVai = new Particula(245, 245);
        particulaSobe = new Particula(245, 245);
        particulaResultante = new Particula(245, 245);
        particulaVai.setColor("red");
        particulaSobe.setColor("purple");
        particulaResultante.setColor("yellow");
        plano.addParticula(particula);
        plano.addParticula(particulaVai);
        plano.addParticula(particulaSobe);
        plano.addParticula(particulaResultante);
	$("#receptor div").css("display", "none");
	
        lancar();
        rodando = true;
    };

    var parar = function () {
        if (rodando) {
            for (var i = 0; i < plano.getParticulas().length; i++) {
                plano.getParticulas()[i].destruir();
            }
        }
    };

    $("#rodar").click(function () {
    	parar();
        plano.setInclinacao(plano.getInclinacaoLiteral() + 45);
    });

    $("#eter").click(function () {
        if (Eter) {
            $(this).css("background", "lightskyblue");
            $("#fluxoEter").css("display", "none");
            clearInterval(Eter);
            Eter = false;
        } else {
            $(this).css("background", "red");
            Eter = movimentarEter();
        }
    });

    $("#parar").click(function () {
        parar();
    });

    $("#iniciar").click(function () {
        parar();
        iniciar();
    });
    
    var fim = function(igual) {
	$("#receptor div").css("background", (igual?"yellow":"white"));
	$("#receptor div").css("display", "block");
    };
    
    var lancar = function () {
        particula.setVisivel(true);
        particula.setPosicaoAnimate(245, 245, function () {
            particulaVai.setVisivel(true);
            particulaSobe.setVisivel(true);
            particula.destruir();

            particulaVai.setPosicaoAnimate(470, 245, function () {
            	$("#velocidade").html("(bCima: " + particulaSobe.getVelocidade(245, 245) + ", bDireita: " + particulaVai.getVelocidade(245, 245));
        	particulaVai.setPosicaoAnimate(245, 245, function () {
                    if ((new Util()).distancia(particulaVai, particulaSobe) < 3) {
                        particulaResultante.setVisivel(true);
                        particulaVai.destruir();
                        particulaSobe.destruir();

                        particulaResultante.setPosicaoAnimate(245, 480, function () {
                        	fim(true)
                        });
                    } else {
                        particulaVai.setPosicaoAnimate(245, 480, function () {
                        	fim(false)
                        });
                    }
                });
            });

            particulaSobe.setPosicaoAnimate(245, 20, function () {
                $("#velocidade").html("(bCima: " + particulaSobe.getVelocidade(245, 245) + ", bDireita: " + particulaVai.getVelocidade(245, 245));
        	particulaSobe.setPosicaoAnimate(245, 245, function () {
                    if ((new Util()).distancia(particulaVai, particulaSobe) >= 3) {
                        particulaSobe.setPosicaoAnimate(245, 480, function () {
                        	fim(false)
                        });
                    }
                });
            });
            $("#velocidade").html("(bCima: " + particulaSobe.getVelocidade(245, 20) + ", bDireita: " + particulaVai.getVelocidade(470, 245));
        });
    };
    
    var criarFluxoEter = function() {
    	for (var i = 0; i < 20; i++) {
    		var linha = $("<div class='linhaFluxo'></div>");
    		
    		for (var j = 0; j < 50; j++) {
    			var fluxo = $("<div class='fluxo'></div>");
    			linha.append(fluxo);
    		}
    		
    		$("#fluxoEter").append(linha);
    	}
    };
    
    var movimentarEter = function() {
    	var movimento = 0;
		$(".linhaFluxo").css("margin-left", movimento);
    	$("#fluxoEter").css("display", "block");
    	var fluxoEter = setInterval(function(){
    		if (movimento < - 50) movimento = 0;
    		movimento -= 1;
    		$(".linhaFluxo").css("margin-left", movimento);
    	}, 50);
    	
    	return fluxoEter;
    };
    
    criarFluxoEter();
    iniciar();
    parar();
});
