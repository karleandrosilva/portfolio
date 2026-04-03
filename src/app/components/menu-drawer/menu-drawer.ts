import { NgOptimizedImage } from '@angular/common';
import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  ViewChildren,
  QueryList,
  inject,
  PLATFORM_ID,
  OnDestroy
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';

import gsap from 'gsap';
import { Draggable } from 'gsap/all';


@Component({
  selector: 'app-menu-drawer',
  imports: [NgOptimizedImage],
  templateUrl: './menu-drawer.html',
  styleUrl: './menu-drawer.scss',
})

export class MenuDrawer implements AfterViewInit, OnDestroy {
  
  platformId = inject(PLATFORM_ID);

  // Referências do HTML
  @ViewChild('menuDropZone') menuDropZone!: ElementRef;
  @ViewChild('menuDrawer') menuDrawer!: ElementRef;
  @ViewChild('menuLogo') menuLogo!: ElementRef;
  @ViewChild('menuItems') menuItems!: ElementRef;
  @ViewChild('menuToggler') menuToggler!: ElementRef;

  @ViewChildren('menuItem') menuItemElements!: QueryList<ElementRef>;

  private isMenuOpen = false;

  private menuItemsFullWidth!: number;
  private drawerGap!: number;
  private closedMenuWidth!: number;
  private openMenuWidth!: number;

  private draggableInstance: any;

  // INIT
  ngAfterViewInit(): void {

    if (!isPlatformBrowser(this.platformId)) return;

    gsap.registerPlugin(Draggable);

    this.setupMenu();
    this.createDraggable();
  }

  // SETUP INICIAL (equivalente ao JS)
  private setupMenu() {

    const menuItemsEl = this.menuItems.nativeElement;
    const menuLogoEl = this.menuLogo.nativeElement;
    const menuDropZoneEl = this.menuDropZone.nativeElement;
    const menuTogglerEl = this.menuToggler.nativeElement;
    const menuItemEls = this.menuItemElements.map(e => e.nativeElement);

    gsap.set(menuItemsEl, { width: "auto" });
    gsap.set(menuItemEls, { opacity: 1 });

    const menuItemsFullWidth = menuItemsEl.offsetWidth;
    const drawerGap = 0.35 * 16;
    const drawerPadding = 0.35 * 16;
    const logoWidth = menuLogoEl.offsetWidth;
    const togglerWidth = menuTogglerEl.offsetWidth;

    this.closedMenuWidth =
      drawerPadding + logoWidth + drawerGap + togglerWidth + drawerPadding;

    this.openMenuWidth =
      drawerPadding +
      logoWidth +
      drawerGap +
      menuItemsFullWidth +
      drawerGap +
      togglerWidth +
      drawerPadding;

    this.menuItemsFullWidth = menuItemsFullWidth;
    this.drawerGap = drawerGap;

    gsap.set(menuItemsEl, { width: 0, marginRight: 0 });
    gsap.set(menuItemEls, { opacity: 0, scale: 0.85 });
    gsap.set(menuDropZoneEl, { width: this.closedMenuWidth });
  }

  // TOGGLE MENU
  toggleMenu() {

    if (!isPlatformBrowser(this.platformId)) return;

    this.isMenuOpen ? this.closeMenu() : this.openMenu();
    this.isMenuOpen = !this.isMenuOpen;
  }

  private openMenu() {

    const menuItemsEl = this.menuItems.nativeElement;
    const menuItemEls = this.menuItemElements.map(e => e.nativeElement);
    const menuTogglerEl = this.menuToggler.nativeElement;

    menuTogglerEl.classList.add("close");

    gsap.to(menuItemsEl, {
      width: this.menuItemsFullWidth,
      marginRight: this.drawerGap,
      duration: 0.5,
      ease: "power3.inOut",
      onStart: () => {
        gsap.to(menuItemEls, {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          stagger: 0.05,
          delay: 0.2,
          ease: "power3.out"
        });
      }
    });
  }

  private closeMenu() {

    const menuItemsEl = this.menuItems.nativeElement;
    const menuItemEls = this.menuItemElements.map(e => e.nativeElement);
    const menuTogglerEl = this.menuToggler.nativeElement;

    menuTogglerEl.classList.remove("close");

    gsap.to(menuItemEls, {
      opacity: 0,
      scale: 0.85,
      duration: 0.2,
      stagger: 0.03
    });

    gsap.to(menuItemsEl, {
      width: 0,
      marginRight: 0,
      duration: 0.4,
      ease: "power3.inOut"
    });
  }

  // DRAGGABLE 
  private createDraggable() {

    const menuDrawerEl = this.menuDrawer.nativeElement;
    const menuDropZoneEl = this.menuDropZone.nativeElement;

    this.draggableInstance = Draggable.create(menuDrawerEl, {
      type: "x,y",

      bounds: {
        minX: -window.innerWidth,
        maxX: window.innerWidth,
        minY: -window.innerHeight,
        maxY: window.innerHeight
      },

      allowEventDefault: true,
      inertia: false,

      cursor: "grab",
      activeCursor: "grabbing",

      onDragStart: () => {
        const activeWidth = this.isMenuOpen
          ? this.openMenuWidth
          : this.closedMenuWidth;

        gsap.set(menuDropZoneEl, { width: activeWidth });
      },

      onDrag: function (this: any) {
        const within =
        Math.abs(this['x']) < 200 && Math.abs(this['y']) < 200;

        gsap.to(menuDropZoneEl, {
          opacity: within ? 1 : 0,
          duration: 0.1
        });
      },

      onDragEnd: function (this: any) {

        gsap.to(menuDropZoneEl, { opacity: 0, duration: 0.1 });

        const within =
          Math.abs(this['x']) < 200 && Math.abs(this['y']) < 200;

        if (within) {
          gsap.to(menuDrawerEl, {
            x: 0,
            y: 0,
            duration: 0.3,
            ease: "power2.out"
          });
        }
      }
    });
  }

  // DESTROY 
  ngOnDestroy(): void {
    if (this.draggableInstance) {
      this.draggableInstance.forEach((d: any) => d.kill());
    }
  }
}