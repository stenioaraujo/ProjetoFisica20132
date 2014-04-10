var Particula = (function () {
    function Particula(particula, x, y) {
        this.particula = particula;
        this.setPosition(x, y);
    }
    Particula.prototype.setPosition = function (x, y) {
        this.x = x;
        this.y = y;

        this.particula.css("left", x);
        this.particula.css("top", y);
    };

    Particula.prototype.setPositionAnimate = function (x, y, callback) {
    };

    Particula.prototype.setPlano = function (plano) {
        this.plano = plano;
    };
    return Particula;
})();

var Plano = (function () {
    function Plano() {
        this.vLuz = 46;
        this.vEter = 1.84;
    }
    Plano.prototype.setComprimento = function (comprimento) {
        this.comprimento = comprimento;
    };

    Plano.prototype.getVLuz = function () {
        return this.vLuz;
    };

    Plano.prototype.getVEter = function () {
        return this.vEter;
    };

    Plano.prototype.getComprimento = function () {
        return this.comprimento;
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
    var lancar = function () {
        var particula = $("<div class='particula' />");
        $("#circulo").add(particula);

        var particulaInicial = new Particula(particula, 0, 0);
        plano.addParticula(particulaInicial);

        particulaInicial.setPositionAnimate(0, 250, function () {
        });
    };
});
