import { AfterViewInit, Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SubSink } from 'subsink';

import { User } from '@iote/bricks';

import { AppClaimDomains } from '@app/model/access-control';

import { Poppers } from '../../model/side-menu-popper.model';
import { slideToggle, slideUp } from '../../providers/side-menu-const.function';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss']
})
export class SideMenuComponent implements OnInit, AfterViewInit, OnDestroy {
  private _sbS = new SubSink();

  @Input() user: User;

  FIRST_SUB_MENUS_BTN: NodeListOf<Element>;

  readonly CAN_VIEW_DASH = AppClaimDomains.CompanyData;
  readonly CAN_VIEW_COM = AppClaimDomains.CompanyData;
  readonly CAN_VIEW_CON = AppClaimDomains.ContactData;
  readonly CAN_VIEW_OPPS = AppClaimDomains.OppsData;
  readonly CAN_VIEW_INV = AppClaimDomains.InvData;
  readonly CAN_VIEW_SETTINGS = AppClaimDomains.SettingsData;
  
  constructor(private _router$$: Router,
              @Inject('ENVIRONMENT') private _env: any)
  { }

  ngOnInit() {}

  ngAfterViewInit(): void {
    const featureName = this._router$$.url.split('/')[1];

    this.handlerUserNavClicks();
    this.openActiveFeature(featureName);
  }

  handlerUserNavClicks() {

    const PoppersInstance = new Poppers();
    const SIDEBAR_EL = document.getElementById("sidebar");
    this.FIRST_SUB_MENUS_BTN = document.querySelectorAll(
      ".menu > ul > .menu-item.sub-menu > a"
    );
    const INNER_SUB_MENUS_BTN = document.querySelectorAll(
      ".menu > ul > .menu-item.sub-menu .menu-item.sub-menu > a"
    );
    const defaultOpenMenus = document.querySelectorAll(".menu-item.sub-menu.open");

    defaultOpenMenus.forEach((element: any) => {
      element.lastElementChild.style.display = "block";
    });    

    /**
     * handle top level submenu click
     */
    this.FIRST_SUB_MENUS_BTN.forEach((element) => {
      element.addEventListener("click", () => {
        if (SIDEBAR_EL?.classList.contains("collapsed"))
          PoppersInstance.togglePopper(element.nextElementSibling);
        else {
          const parentMenu = element.closest(".menu.open-current-submenu");
          if (parentMenu)
            parentMenu
              .querySelectorAll(":scope > ul > .menu-item.sub-menu > a")
              .forEach(
                (el: any) =>
                  window.getComputedStyle(el.nextElementSibling).display !==
                  "none" && slideUp(el.nextElementSibling)
              );
          slideToggle(element.nextElementSibling);
        }
      });
    });

    /**
     * handle inner submenu click
     */
    INNER_SUB_MENUS_BTN.forEach((element) => {
      element.addEventListener("click", () => {
        slideToggle(element.nextElementSibling);
      });
    });
  }

  openActiveFeature(feature: string, ) {
    const features = ['home', 'business', 'operations', 'budgets'];
    const featureIndex = features.indexOf(feature);
    const featureEl = this.FIRST_SUB_MENUS_BTN[featureIndex];
    slideToggle(featureEl?.nextElementSibling);
  }

  ngOnDestroy() {
    this._sbS.unsubscribe();
  }
}