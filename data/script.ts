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
	destruida: boolean;
	
	constructor(x: number, y: number) {
		this.particula = $("<div class='particula' />");
		this.setPosicao(x, y);
		this.destruida = false;
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
	// @return O tempo gasto pela particula até o ponto especificado
	//
	tempoAte(x: number, y: number): number {
		return this.getVelocidade(x, y) * this.plano.getComprimento();
	}
	
	//
	// @return Retorna o tempo(ms) que a particula gasta para percorrer 1 px
	//
	getVelocidade(x: number, y: number): number {
		var vLuz = this.plano.getVLuz();
		var vEter = this.plano.getVEter();
		var inclinacao = this.plano.getInclinacao();
		var retorno;
				
		if(vEter == 0){
			retorno = this.calcVelocidade(0, x, y);
		}else if (inclinacao == 0 || inclinacao == 180) {
			retorno = this.calcVelocidade(3, x, y);
		}
		else if (inclinacao == 90 || inclinacao == 270) {
			retorno = this.calcVelocidade(1, x, y);			
		}
		
		retorno = this.calcVelocidade(2, x, y);
		
		$("#vEter").html(vEter);
		$("#velocidade").html(retorno);
		$("#grau").html(inclinacao);
		$("#comprimento").html(this.plano.getComprimento());
		
		return retorno;
	}
	
	//
	//método auxiliar de getVelocidade para calcular a velocidade
	//
	private calcVelocidade(n: number, x: number, y: number): number{
		if (n == 0) {
			return this.equacao(0);
		}else if (n == 1) {
			return this.equacao(1);
		}else if (n == 2) {
			if (this.x < x) {
				return this.equacao(2);
			}
			return this.equacao(-2);			
		}else{
			if (this.x < x) {
				return this.equacao(3);
			}
			return this.equacao(-3);				
		}		
	}
	
	private equacao(n: number): number{
		return ((this.plano.getComprimento() / this.plano.getVLuz())*(1+(10*((this.plano.getVEter()*this.plano.getVEter() / this.plano.getVLuz()*this.plano.getVLuz())*n)))*1000)/this.plano.getComprimento();
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
			if (particula.destruida) return;
			
			var dX = xFinal - particula.x;
			var dY = yFinal - particula.y;
			
			if (dX == 0 && dY == 0) {
					if (callback) callback();
					return;
			}
			
			if (sinal(dX) == 0 || sinal(dY) == 0) {
				particula.setPosicao(particula.x + sinal(dX), particula.y + sinal(dY));
			} else if (particula.x != xFinal || particula.y != yFinal) {
				x = particula.x + sinal(dX);				
				particula.setPosicao(x, f(x));
			}
			
			setTimeout(function() {mover(particula)}, particula.getVelocidade(xFinal,yFinal));
		}
		mover(this);
	}
	
	setPlano(plano: Plano) {
		this.plano = plano;
	}
	
	getElement(): Object {
		return this.particula;
	}
	
	destruir(): void {
		this.particula.remove();
		this.destruida = true;
		this.setVisivel(false);
	}
	
	setVisivel(visivel: boolean): void {
		if (visivel) {
			this.particula.css("display", "block");
		} else {
			this.particula.css("display", "none");
		}
	}
}

//
// O Plano contendo as particulas
//
class Plano {
	particulas: Array<Particula>;
	vLuz = 46; // px/ms
	eterAtivado = false;
	vEter = 4.6;
	comprimento: number; //px
	inclinacao: number; //graus
	id: string;
	
	//
	// @param id, o id do elemento que representara o plano
	constructor(id: string) {
		this.id = id;
		this.particulas = new Array();
		this.inclinacao = parseInt($("#"+id).attr("angle"));
		this.comprimento = 230;
	}
	
	setComprimento(comprimento: number) {
		this.comprimento = comprimento;
	}
	
	getVLuz(): number {
		return this.vLuz;
	}
	
	getVEter(): number {
		if (this.eterAtivado) return 4.8;
		return 0;
	}
	changeEter(b: boolean): void {
		this.eterAtivado = b;
	}
	
	getComprimento(): number {
		return this.comprimento;
	}
	
	getComprimentoEmGigaMetros(): number {
		return 0;
	}
	
	getInclinacao(): number {
		return this.inclinacao % 360;
	}
	
	getInclinacaoLiteral(): number {
		return this.inclinacao;
	}
	
	setInclinacao(g: number): void {
		this.inclinacao = g;
		var circulo = $("#"+this.id);
		circulo.css("-webkit-transform", "rotate("+g+"deg)");
		circulo.attr("angle", g);
	}
	
	addParticula(particula: Particula): void {
		this.particulas.push(particula);
		$("#"+this.id).prepend(particula.getElement());
		particula.setPlano(this);
	}
	
	getParticulas(): Array<Particula> {
		return this.particulas;
	}
}

	var Eter = false;

$(document).ready(function() {
	var plano;
	var rodando = false;
	var particula;
	var particulaVai;
	var particulaSobe;
	var particulaResultante;
	
	var iniciar = function() {
		plano = new Plano("circulo");
		plano.changeEter(Eter);
		particula = new Particula(20, 245);
		particulaVai = new Particula(245,245);
		particulaSobe = new Particula(245, 245);
		particulaResultante = new Particula(245,245);
		particulaVai.setColor("red");
		particulaSobe.setColor("purple");
		particulaResultante.setColor("yellow");
		plano.addParticula(particula);
		plano.addParticula(particulaVai);
		plano.addParticula(particulaSobe);
		plano.addParticula(particulaResultante);
		
		lancar();
		rodando = true;
	}
	
	var parar = function() {
		if (rodando) {
			for (var i = 0; i < plano.getParticulas().length; i++) {
				plano.getParticulas()[i].destruir();
			}
		}
	}
	
	$("#rodar").click(function() {
		plano.setInclinacao(plano.getInclinacaoLiteral() + 45);
	});
	
	$("#eter").click(function(){
		if(Eter) {
			$(this).css("background", "lightskyblue");
			Eter = false;
		} else {
			$(this).css("background", "red");
			Eter = true;
		}
	});
	
	$("#parar").click(function() {
		parar();
	});
	
	$("#iniciar").click(function(){
		parar();
		iniciar();
	});
	
	var lancar = function() {
		particula.setVisivel(true);
		particula.setPosicaoAnimate(245, 245, function() {			
			particulaVai.setVisivel(true);
			particulaSobe.setVisivel(true);
			particula.destruir();
			
			particulaVai.setPosicaoAnimate(470, 245, function() {
				particulaVai.setPosicaoAnimate(245, 245, function(){
                	if (particulaVai.tempoAte(245, 245) == particulaSobe.tempoAte(245, 245)) {
                		particulaResultante.setVisivel(true);
                		particulaVai.destruir();
                		particulaSobe.destruir();
                		
						particulaResultante.setPosicaoAnimate(245, 470, function(){});
                	} else {
						particulaVai.setPosicaoAnimate(245, 470, function(){});
					}
				});
			});
			
			particulaSobe.setPosicaoAnimate(245, 20, function() {
				particulaSobe.setPosicaoAnimate(245, 245, function(){
					if (particulaVai.tempoAte(245, 245) != particulaSobe.tempoAte(245, 245)) {
						particulaSobe.setPosicaoAnimate(245, 470, function(){});
					}
				});
			});
		});
	}
});
