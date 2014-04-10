var Util = (function () {
    function Util() {
    }
    //
    // Indica se o Número é negativo, nulo ou positivo
    // @param x O número a ser verificado.
    // @return
    //
    Util.prototype.sinal = function (x) {
        return x < 0 ? -1 : x == 0 ? 0 : 1;
    };
    return Util;
})();

//
//  Representação de uma particula
//
var Particula = (function () {
    function Particula(particula, x, y) {
        this.particula = particula;
        this.setPosicao(x, y);
    }
    //
    // Definir a cor da partícula
    // @param color Cor hexadecimal.
    //
    Particula.prototype.setColor = function (color) {
        this.particula.css("background", color);
    };

    //
    // Pega a posição atual da Particula
    // @return {x:,y:}
    //
    Particula.prototype.getPosicao = function () {
        return { "x": this.x, "y": this.y };
    };

    //
    // @return Retorna o tempo(ms) que a particula gasta para percorrer 1 px
    //
    Particula.prototype.getVelocidade = function (x, y) {
        var vLuz = this.plano.getVLuz();
        var vEter = this.plano.getVEter();
        var inclinacao = this.plano.getInclinacao();
        if (vEter == 0) {
            return this.calcVelocidade(0, x, y);
        } else if (inclinacao == 0 || inclinacao == 180) {
            return this.calcVelocidade(3, x, y);
        } else if (inclinacao == 90 || inclinacao == 270) {
            return this.calcVelocidade(1, x, y);
        }
        return this.calcVelocidade(2, x, y);
    };

    //
    //método auxiliar de getVelocidade para calcular a velocidade
    //
    Particula.prototype.calcVelocidade = function (n, x, y) {
        if (n == 0) {
            return this.equacao(0);
        } else if (n == 1) {
            return this.equacao(1);
        } else if (n == 2) {
            if (this.particula.x < x) {
                return this.equacao(2);
            }
            return this.equacao(-2);
        } else {
            if (this.particula.x < x) {
                return this.equacao(3);
            }
            return this.equacao(-3);
        }
    };

    Particula.prototype.equacao = function (n) {
        return ((this.plano.getComprimento() / this.plano.getVLuz()) * (1 + (10 * ((this.plano.getVEter() * this.plano.getVEter() / this.plano.getVLuz() * this.plano.getVLuz()) * n))) * 1000) / this.plano.getComprimento();
    };

    //
    // Move a particula para a posição. Não há trasição.
    //
    Particula.prototype.setPosicao = function (x, y) {
        this.x = x;
        this.y = y;

        this.particula.css("left", x);
        this.particula.css("top", y);
    };

    //
    // Move a particula para a posição com um movimento linear uniforme, com base nas condições do plano.
    // @param x, posição X no plano, em pixel;
    // @param y, posição Y no plano, em pixel;
    // @param callback, A função a ser chamada após o término da animação
    //
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
            var dX = xFinal - particula.x;
            var dY = yFinal - particula.y;

            if (sinal(dX) == 0 || sinal(dY) == 0) {
                particula.setPosicao(particula.x + sinal(dX), particula.y + sinal(dY));
            } else if (particula.x != xFinal || particula.y != yFinal) {
                x = particula.x + sinal(dX);
                particula.setPosicao(x, f(x));
            } else {
                if (callback)
                    callback();
                return;
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
    return Particula;
})();

//
// O Plano contendo as particulas
//
var Plano = (function () {
    function Plano() {
        this.vLuz = 46;
        this.eterAtivado = false;
        this.vEter = 4.6;
        this.particulas = new Array();
    }
    Plano.prototype.setComprimento = function (comprimento) {
        this.comprimento = comprimento;
    };

    Plano.prototype.getVLuz = function () {
        return this.vLuz;
    };

    Plano.prototype.getVEter = function () {
        if (this.eterAtivado)
            return 4.8;
        return 0;
    };
    Plano.prototype.setEterAtivado = function (b) {
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
    };

    Plano.prototype.addParticula = function (particula) {
        this.particulas.push(particula);
        particula.setPlano(this);
    };

    Plano.prototype.getParticulas = function () {
        return this.particulas;
    };
    return Plano;
})();

$(document).ready(function () {
    var plano = new Plano();

    $("#teste").click(function () {
        var circulo = $("#circulo");
        var angle = plano.getInclinacaoLiteral() + 45;

        circulo.css("-webkit-transform", "rotate(" + angle + "deg)");
        circulo.attr("angle", angle);
        plano.setInclinacao(angle);
    });

    var lancar = function () {
        var particula = $("<div class='particula' />");
        $("#circulo").append(particula);

        var particulaInicial = new Particula(particula, 20, 245);
        plano.addParticula(particulaInicial);

        particulaInicial.setPosicaoAnimate(150, 250, function () {
        });
    };

    lancar();
});
