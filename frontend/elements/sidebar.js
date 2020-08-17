import { html, PolymerElement } from '@polymer/polymer/polymer-element';
import "@vaadin/vaadin-lumo-styles/all-imports";
import "@vaadin/vaadin-app-layout/vaadin-app-layout";
import "@vaadin/vaadin-app-layout/vaadin-drawer-toggle";
import "@vaadin/vaadin-tabs/vaadin-tab";
import "@vaadin/vaadin-tabs/vaadin-tabs"
import "@polymer/iron-icon/iron-icon";
import "@vaadin/vaadin-icons/vaadin-icons";

class SidebarLayout extends PolymerElement {
    static get template() {
        return html`
          <style>
            vaadin-tab > a > iron-icon {
              margin-right: 10px;
            }
          </style>
          <vaadin-app-layout>
            <vaadin-drawer-toggle slot="navbar"></vaadin-drawer-toggle>
            <h2 slot="navbar">Backups Application</h2>
            <vaadin-tabs orientation="vertical" slot="drawer">
              <vaadin-tab>
                <a href="/">
                  <iron-icon icon="vaadin:harddrive-o"></iron-icon>
                  Backups
                </a>
              </vaadin-tab>
              <vaadin-tab>
                <a href="databases">
                  <iron-icon icon="vaadin:database"></iron-icon>
                  Databases
                </a>
              </vaadin-tab>
              <vaadin-tab>
                <a href="users">
                  <iron-icon icon="vaadin:user"></iron-icon>
                  Users
                </a>
              </vaadin-tab>
              <vaadin-tab>
                <a href="scp">
                  <iron-icon icon="vaadin:cloud-upload-o"></iron-icon>
                  Secure Copy
                </a>
              </vaadin-tab>
            </vaadin-tabs>
            <slot></slot>
          </vaadin-app-layout>
        `;
      }
}

customElements.define("sidebar-layout", SidebarLayout);