import { Component, OnInit, AfterViewInit, HostListener, ViewChild, ElementRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgOptimizedImage } from "@angular/common"; 
import { gsap } from 'gsap';
import { Flip } from 'gsap/all';

gsap.registerPlugin(Flip);

@Component({
  selector: 'app-sobre-mim',
  imports: [CommonModule, NgOptimizedImage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Adicione esta linha aqui
  templateUrl: './sobre-mim.html',
  styleUrl: './sobre-mim.scss',
})

export class SobreMim implements OnInit, AfterViewInit {
  @ViewChild('desk') desk!: ElementRef;
  @ViewChild('header') header!: ElementRef;

  activeMode = 'chaos';
  
  // Seus dados de tamanhos e layouts (mantive igual ao seu JS)
  itemSizes: any = { cd: 400, caderno: 375, cafe: 225, caneta: 125, error: 300, ferramentas: 250, musica: 375, fone: 275, pasta: 150, ps: 100, tenis: 250, vs: 100, infancia: 300};

  arrangements: any = {
    chaos: {
      header: { x: 50, y: 47.5, center: true },
      items: [
        { id: "cd", x: 72.5, y: 5, rotation: 0 },
        { id: "caderno", x: 65, y: 30, rotation: -5 },
        { id: "cafe", x: 2.5, y: 45, rotation: -10 },
        { id: "caneta", x: 72.5, y: 75, rotation: 0 },
        { id: "error", x: 80, y: 60, rotation: 15 },
        { id: "ferramentas", x: 9.5, y: 55, rotation: 15 },
        { id: "musica", x: -2.5, y: -6.5, rotation: -10 }, 
        { id: "fone", x: 8, y: 20, rotation: 10 },
        { id: "pasta", x: 90, y: 50, rotation: 5 },
        { id: "ps", x: 20, y: 15, rotation: 5 },
        { id: "tenis", x: -2.5, y: 65, rotation: -35 },
        { id: "vs", x: 65, y: 80, rotation: 10 }, 
        { id: "infancia", x: 65, y: 3, rotation: 10 },
      ],
    },
    cleanup: {
      header: { x: 60, y: 37.5, center: false },
      items: [
        { id: "cd", x: 0, y: 47.5, rotation: 0 },
        { id: "caderno", x: 80, y: 30.5, rotation: 0 },
        { id: "cafe", x: -6, y: 3.5, rotation: 0 },
        { id: "caneta", x: 63.5, y: 23, rotation: 0 },
        { id: "error", x: 34.5, y: 59, rotation: 0 },
        { id: "ferramentas", x: 15, y: 60, rotation: 0 },
        { id: "musica", x: 9, y: -3.5, rotation: 0 },
        { id: "fone", x: 76.5, y: -1, rotation: 0 },
        { id: "pasta", x: 24.5, y: 33, rotation: 0 },
        { id: "ps", x: 64.5, y: 6, rotation: 0 },
        { id: "tenis", x: 60, y: 65.5, rotation: 0 },
        { id: "vs",x: 82.5, y: 80, rotation: 0 }, 
        { id: "infancia", x: 36.5, y: 5.5, rotation: 0 },
      ],
    },
    notebook: {
      header: { x: 50, y: 47.5, center: true },
      items: [
        { id: "cd", x: 27.5, y: 15, rotation: 10 },
        { id: "caderno", x: 57.5, y: 20, rotation: 10 },
        { id: "cafe", x: 30, y: 7.5, rotation: 30 },
        { id: "caneta", x: 75, y: 35, rotation: 0 },
        { id: "error", x: 30, y: 57.5, rotation: 10 },
        { id: "ferramentas", x: 50, y: 50, rotation: -5 },
        { id: "musica", x: 10, y: 10, rotation: -30 },
        { id: "fone", x: 45, y: 0.5, rotation: 20 },
        { id: "pasta", x: 25, y: 40, rotation: 10 },
        { id: "ps", x: 65, y: 70, rotation: 25 },
        { id: "tenis", x: 16.5, y: 50, rotation: -20 },
        { id: "vs", x: 50, y: 70, rotation: 0 }, 
        { id: "infancia", x: 60, y: 5.5, rotation: -10 },
      ],
    }
  };

  ngOnInit() {}

  ngAfterViewInit() {
    // Inicializa o layout logo após o Angular renderizar a view
    setTimeout(() => {
      this.initLayout();
    }, 200);
  }

  initLayout() {
    // Chamamos o setLayout para o modo inicial
    this.setLayout(this.activeMode);
    
    // O segredo para o erro de maximizar:
    // Forçamos o GSAP a invalidar caches antigos e ler o DOM de novo
    gsap.ticker.add(() => {}, true); 
  }

  // Escuta o redimensionamento da janela (substitui o window.addEventListener)
  @HostListener('window:resize')
  onResize() {
    this.setLayout(this.activeMode);
  }

  setLayout(mode: string) {
  if (!this.desk || !this.header) return;

  const deskEl = this.desk.nativeElement;
  const headerEl = this.header.nativeElement;
  const deskWidth = deskEl.offsetWidth;
  const deskHeight = deskEl.offsetHeight;

  if (deskWidth <= 0 || deskHeight <= 0) return;

  const layout = this.arrangements[mode];
  const isMobile = deskWidth < 1000;

  // AJUSTE AQUI: No mobile, vamos dar um "desconto" menor ou manter o centro,
  // mas ainda usar as coordenadas do layout para ele se mexer!
  
  const headerX = isMobile ? layout.header.x : layout.header.x;
  const headerY = isMobile ? layout.header.y : layout.header.y;

  // Se for mobile, centralizamos o ponto de ancoragem para não bugar
  const offsetX = isMobile || layout.header.center ? headerEl.offsetWidth / 2 : 0;
  const offsetY = isMobile || layout.header.center ? headerEl.offsetHeight / 2 : 0;

  const finalHeaderX = (headerX / 100) * deskWidth - offsetX;
  const finalHeaderY = (headerY / 100) * deskHeight - offsetY;

  if (!isNaN(finalHeaderX) && !isNaN(finalHeaderY)) {
    gsap.set(headerEl, {
      x: finalHeaderX,
      y: finalHeaderY,
      rotation: 0,
    });
  }

  layout.items.forEach((item: any) => {
    const itemEl = deskEl.querySelector(`#${item.id}`);
    if (itemEl) {
      // No mobile, talvez você queira diminuir o tamanho dos itens?
      // Exemplo: itemSizes[item.id] * 0.7
      const multiplier = isMobile ? 0.6 : 1; 

      const itemX = (item.x / 100) * deskWidth;
      const itemY = (item.y / 100) * deskHeight;

      if (!isNaN(itemX) && !isNaN(itemY)) {
        gsap.set(itemEl, {
          x: itemX,
          y: itemY,
          width: this.itemSizes[item.id] * multiplier,
          height: this.itemSizes[item.id] * multiplier,
          rotation: item.rotation,
        });
      }
    }
  });
}

  switchMode(mode: string) {
  if (mode === this.activeMode) return;

  const headerEl = this.header.nativeElement;
  const itemEls = this.desk.nativeElement.querySelectorAll('.item');
  const flipTargets = [headerEl, ...Array.from(itemEls)];

  const state = Flip.getState(flipTargets);
  
  this.activeMode = mode;
  
  // O requestAnimationFrame é mais preciso que o setTimeout para animações
  requestAnimationFrame(() => {
    this.setLayout(mode);
    Flip.from(state, {
      duration: 1.25,
      ease: "power3.inOut",
      stagger: { amount: 0.1, from: "center" },
      absolute: true,
    });
  });
  }
}
