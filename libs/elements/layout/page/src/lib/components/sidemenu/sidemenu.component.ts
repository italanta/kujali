import { AfterViewInit, Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';

import { SubSink } from 'subsink';

import { User } from '@iote/bricks';

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

  orgId = ''
  flowId = ''
  projectName: string;
  projectInfo: string;

  constructor(@Inject('ENVIRONMENT') private _env: any) { }

  ngOnInit() { }

  ngAfterViewInit(): void {
    this.handlerUserNavClicks();
  }

  getLogo = () => 'assets/images/italanta-logo.png'

  handlerUserNavClicks() {

    const PoppersInstance = new Poppers();

    const SIDEBAR_EL = document.getElementById("sidebar");
    const FIRST_SUB_MENUS_BTN = document.querySelectorAll(
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
    FIRST_SUB_MENUS_BTN.forEach((element) => {
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

  ngOnDestroy() {
    this._sbS.unsubscribe();
  }
}
