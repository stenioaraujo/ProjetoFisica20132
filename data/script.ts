class Util {
	//
	// Indica se o Número é negativo, nulo ou positivo
	// @param x O número a ser verificado.
	// @return 
	//
	sinal(x: number): number {
		return x < 0? -1: x == 0? 0: 1;
	}
}

//
//  Representação de uma particula
//
class Particula {
	x: number;
	y: number;
	particula;
	plano: Plano;
	
	constructor(particula, x: number, y: number) {
		this.particula = particula;
		this.setPosicao(x, y);
	}
	
	//
	// Definir a cor da partícula
	// @param color Cor hexadecimal.
	//
	setColor(color: string): void {
		this.particula.css("background", color);
	}
	
	//
	// Pega a posição atual da Particula
	// @return {x:,y:}
	//
	getPosicao(): Object {
		return {"x": this.x, "y": this.y};
	}
	
	//
	// @return Retorna o tempo que a particula gasta para percorrer 1 px
	//
	getVelocidade(): number {
		var vLuz = this.plano.getVLuz();
		var eter = this.plano.eterExiste();
		var inclinacao = this.plano.getInclinacao();
		
		return 21;
	}
	
	//
	// Move a particula para a posição. Não há trasição.
	//
	setPosicao(x: number, y: number): void {
		this.x = x;
		this.y = y;
		
		this.particula.css("left", x);
		this.particula.css("top",  y);
	}
	
	//
	// Move a particula para a posição com um movimento linear uniforme, com base nas condições do plano.
	// @param x, posição X no plano, em pixel;
	// @param y, posição Y no plano, em pixel;
	// @param callback, A função a ser chamada após o término da animação
	//
	setPosicaoAnimate(x: number, y: number, callback:any) {
		var sinal = new Util().sinal;
		var xFinal = x;
		var yFinal = y;
		var xInicial = this.x;
		var yInicial = this.y;
		
		var f = function(xDestino: number): number {
			return ((yFinal - yInicial) / (xFinal - xInicial)) * (xDestino - xInicial) + yInicial;
		}
		
		var mover = function(particula: Particula) {
			var dX = xFinal - particula.x;
			var dY = yFinal - particula.y;
			
			if (sinal(dX) == 0 || sinal(dY) == 0) {
				particula.setPosicao(particula.x + sinal(dX), particula.y + sinal(dY));
			} else if (particula.x != xFinal || particula.y != yFinal) {
				x = particula.x + sinal(dX);				
				particula.setPosicao(x, f(x));
			} else {
				if (callback) callback();
				return;
			}
			
			setTimeout(function() {mover(particula)}, this.getVelocidade());
		}
		mover(this);
	}
	
	setPlano(plano: Plano) {
		this.plano = plano;
	}
}

//
// O Plano contendo as particulas
//
class Plano {
	particulas: Array<Particula>;
	vLuz = 46; // px/ms
	eter = false;
	comprimento: number; //px
	inclinacao: number; //graus
	
	constructor() {
		this.particulas = new Array();
	}
	
	setComprimento(comprimento: number) {
		this.comprimento = comprimento;
	}
	
	getVLuz(): number {
		return this.vLuz;
	}
	
	eterExiste(): boolean {
		return this.eter;
	}
	
	getComprimento(): number {
		return this.comprimento;
	}
	
	getComprimentoEmGigaMetros(): number {
		return 0;
	}
	
	getInclinacao(): number {
		return this.inclinacao;
	}
	
	addParticula(particula: Particula): void {
		this.particulas.push(particula);
		particula.setPlano(this);
	}
	
	getParticulas(): Array<Particula> {
		return this.particulas;
	}
}


$(document).ready(function() {
	$("#teste").click(function() {
		var circulo = $("#circulo");
		var angle = parseInt(circulo.attr("angle")) + 45;

		circulo.css("-webkit-transform", "rotate("+angle+"deg)");
		circulo.attr("angle", angle);
	});
	
	var plano = new Plano();
	
	var lancar = function() {
		var particula = $("<div class='particula' />");
		$("#circulo").append(particula);
		
		var particulaInicial = new Particula(particula, 20, 245);
		plano.addParticula(particulaInicial);
		
		particulaInicial.setPosicaoAnimate(150, 250, function() {});
	}
	
	lancar();
});