import * as React from "react";
import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <>
     <div class="pet-header mdl-layout__header mdl-layout__header--waterfall">
        <div class="mdl-layout__header-row">
          <span class="pet-title mdl-layout-title">
            <img class="pet-logo-image" src="images/Petco-Logo.png" />
          </span>
          <div class="pet-header-spacer mdl-layout-spacer"></div>
          <div class="pet-navigation-container">
            <nav class="pet-navigation mdl-navigation">
              <Link class="mdl-navigation__link mdl-typography--text-uppercase"  to="/">Pets</Link>
              <Link class="mdl-navigation__link mdl-typography--text-uppercase"  to="/tutores">Tutores</Link>
            </nav>
          </div>
          <span class="pet-mobile-title mdl-layout-title">
            <img class="pet-logo-image" src="images/pet-logo.png" />
          </span>
          <button class="pet-more-button mdl-button mdl-js-button mdl-button--icon mdl-js-ripple-effect" id="more-button">
            <i class="material-icons">more_vert</i>
          </button>
          <ul class="mdl-menu mdl-js-menu mdl-menu--bottom-right mdl-js-ripple-effect" for="more-button">
            <li class="mdl-menu__item">Sobre PetDiet</li>
          </ul>
        </div>
      </div>
      <div class="pet-drawer mdl-layout__drawer">
        <span class="mdl-layout-title">
          <img class="pet-logo-image" src="images/Petco-Logo.png"/>
        </span>
      </div>
    </>
 );
};

export default Layout;