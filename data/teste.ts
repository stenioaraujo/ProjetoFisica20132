/*
  Representação de uma particula
*/
class Particula {
	x: number;
	y: number;
	particula;
	plano: Plano;
	
	constructor(particula, x: number, y: number) {
		this.particula = particula;
		this.setPosition(x, y);
	}
	
	//
	// Move a particula para a posição. Não há trasição.
	//
	setPosition(x: number, y: number): void {
		this.x = x;
		this.y = y;
		
		this.particula.css("left", x);
		this.particula.css("top",  y);
	}
	
	//
	// Move a particula para a posição com um movimento linear uniforme, com base na velocidade do plano e em seu comprimento.
	// @param x, posição X no plano, em pixel;
	// @param y, posição Y no plano, em pixel;
	setPositionAnimate(x: number, y: number, callback: any) {
		
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
	vEter = 1.84;
	comprimento: number; // GigaMetro
	
	setComprimento(comprimento: number) {
		this.comprimento = comprimento;
	}
	
	getVLuz(): number {
		return this.vLuz;
	}
	
	getVEter(): number {
		return this.vEter;
	}
	
	getComprimento(): number {
		return this.comprimento;
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
	var plano = new Plano();
	var lancar = function() {
		var particula = $("<div class='particula' />");
		$("#circulo").add(particula);
		
		var particulaInicial = new Particula(particula, 0, 0);
		plano.addParticula(particulaInicial);
		
		particulaInicial.setPositionAnimate(0, 250, function() {});
	}
});