var Util = (function () {
    function Util() {
    }
    Util.prototype.sinal = function (x) {
        return x < 0 ? -1 : x == 0 ? 0 : 1;
    };
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
        var retorno;

        if (eter == 0) {
            retorno = this.calcVelocidade(0, x, y);
        } else if (incli == 0 || incli == 180) {
            retorno = this.calcVelocidade(3, x, y);
        } else if (incli == 90 || incli == 270) {
            retorno = this.calcVelocidade(1, x, y);
        } else {
            retorno = this.calcVelocidade(2, x, y);
        }

        
        $("#vLuz").html(luz);
        $("#vEter").html(eter);
        $("#grau").html(incli);
        $("#comprimento").html(this.plano.getComprimento());

        return retorno;
    };

    Particula.prototype.calcVelocidade = function (n, x, y) {
        if (n == 0) {
            return this.equacao(0);
        } else if (n == 1) {
            return this.equacao(1);
        } else if (n == 2) {
            if (this.x < x) {
                return this.equacao(2);
            }
            return this.equacao(-2);
        } else {
            if (this.x < x) {
                return this.equacao(3);
            }
            return this.equacao(-3);
        }
    };

    Particula.prototype.equacao = function (n) {
        return (((this.plano.getComprimento()) / this.plano.getVLuz())*(1+(10*(((this.plano.getVEter()*this.plano.getVEter()) / (this.plano.getVLuz()*this.plano.getVLuz()))*n)))*1000))/this.plano.getComprimento();
    };

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
        plano.changeEter(Eter);
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
        plano.setInclinacao(plano.getInclinacaoLiteral() + 45);
    });

    $("#eter").click(function () {
        if (Eter) {
            $(this).css("background", "lightskyblue");
            Eter = false;
        } else {
            $(this).css("background", "red");
            Eter = true;
        }
    });

    $("#parar").click(function () {
        parar();
    });

    $("#iniciar").click(function () {
        parar();
        iniciar();
    });

    var lancar = function () {
        particula.setVisivel(true);
        particula.setPosicaoAnimate(245, 245, function () {
            particulaVai.setVisivel(true);
            particulaSobe.setVisivel(true);
            particula.destruir();

            particulaVai.setPosicaoAnimate(470, 245, function () {
                particulaVai.setPosicaoAnimate(245, 245, function () {
                    if (particulaVai.tempoAte(245, 245) == particulaSobe.tempoAte(245, 245)) {
                        particulaResultante.setVisivel(true);
                        particulaVai.destruir();
                        particulaSobe.destruir();

                        particulaResultante.setPosicaoAnimate(245, 470, function () {
                        });
                    } else {
                        particulaVai.setPosicaoAnimate(245, 470, function () {
                        });
                    }
                });
            });

            particulaSobe.setPosicaoAnimate(245, 20, function () {
                particulaSobe.setPosicaoAnimate(245, 245, function () {
                    if (particulaVai.tempoAte(245, 245) != particulaSobe.tempoAte(245, 245)) {
                        particulaSobe.setPosicaoAnimate(245, 470, function () {
                        });
                    }
                });
            });
            $("#velocidade").html("(bCima: " + particulaSobe.getVelocidade(245, 20) + ", bDireita: " + particulaVai.getVelocidade(470, 245));
        });
    };
});
