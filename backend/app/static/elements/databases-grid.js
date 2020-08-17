import { PolymerElement, html, NumberFieldElement, $momentDefault as moment } from '../shared_bundle_1.js';
const $_documentContainer = document.createElement('template');
$_documentContainer.innerHTML = `<dom-module id="vaadin-integer-field-template">

  
</dom-module>`;
document.head.appendChild($_documentContainer.content);
/**
* `<vaadin-integer-field>` is a Web Component for integer field control in forms.
*
* ```html
* <vaadin-integer-field label="Number">
* </vaadin-integer-field>
* ```
*
* @memberof Vaadin
* @demo demo/index.html
*/

class IntegerFieldElement extends NumberFieldElement {
  static get is() {
    return 'vaadin-integer-field';
  }

  static get version() {
    return '2.5.5';
  }

  static get properties() {
    // Hide inherited props that don't work with <input type="number"> from JSDoc.
    return {
      /**
       * @private
       */
      pattern: String,

      /**
       * @private
       */
      preventInvalidInput: Boolean,

      /**
       * @private
       */
      minlength: Number,

      /**
       * @private
       */
      maxlength: Number
    };
  }

  ready() {
    super.ready();
    this._enabledCharPattern = '[-+\\d]';
  }

  _valueChanged(newVal, oldVal) {
    if (newVal !== '' && !this.__isInteger(newVal)) {
      console.warn(`Trying to set non-integer value "${newVal}" to <vaadin-integer-field>.` + ` Clearing the value.`);
      this.value = '';
      return;
    }

    super._valueChanged(newVal, oldVal);
  }

  _stepChanged(newVal, oldVal) {
    if (!this.__hasOnlyDigits(newVal)) {
      console.warn(`Trying to set invalid step size "${newVal}",` + ` which is not a positive integer, to <vaadin-integer-field>.` + ` Resetting the default value 1.`);
      this.step = 1;
      return;
    }

    super._stepChanged(newVal, oldVal);
  }

  __isInteger(value) {
    return /^(-\d)?\d*$/.test(String(value));
  }

  __hasOnlyDigits(value) {
    return /^\d*$/.test(String(value));
  }

}

window.customElements.define(IntegerFieldElement.is, IntegerFieldElement);
var vaadinIntegerField = {
  __proto__: null,
  IntegerFieldElement: IntegerFieldElement
};

class DatabasesGrid extends PolymerElement {
  static get template() {
    return html`
      <style>
        vaadin-grid {
          min-height: 900px;
        }

        form {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        vaadin-text-field {
          margin: 20px;
        }
      </style>
      <iron-ajax
        auto
        url="{{api_url}}/get_databases"
        headers="{{headers}}"
        handle-as="json"
        last-response="{{data}}">
      </iron-ajax>

      <vaadin-button theme="primary" on-click="addDatabase">
        <iron-icon icon="lumo:plus" slot="prefix"></iron-icon>
        Add database 
      </vaadin-button>

      <vaadin-grid id="grid" items="{{data}}" heightByRows data-id="[[item.id]]" loading>
        <vaadin-grid-sort-column path="id" header="ID" text-align="center" auto-width resizable></vaadin-grid-sort-column>
        <vaadin-grid-sort-column path="name" header="Name" text-align="center" auto-width resizable></vaadin-grid-sort-column>
        <vaadin-grid-sort-column path="host" header="Host" text-align="center" auto-width resizable></vaadin-grid-sort-column>        
        <vaadin-grid-sort-column path="port" header="Port" text-align="center" auto-width resizable></vaadin-grid-sort-column>
        <vaadin-grid-sort-column path="database" header="Database" text-align="center" auto-width resizable></vaadin-grid-sort-column>
        <vaadin-grid-sort-column path="user" header="User" text-align="center" auto-width resizable></vaadin-grid-sort-column>
        <vaadin-grid-sort-column path="password" header="Password" text-align="center" auto-width resizable></vaadin-grid-sort-column>
        <vaadin-grid-sort-column path="last_for" header="Last for" text-align="center" auto-width resizable></vaadin-grid-sort-column>
        <vaadin-grid-sort-column class="date" path="created" header="Created" text-align="center" auto-width resizable></vaadin-grid-sort-column>
        <vaadin-grid-sort-column class="date" path="updated" header="Updated" text-align="center" auto-width resizable></vaadin-grid-sort-column>
        <vaadin-grid-sort-column path="cron" header="Cron" text-align="center" auto-width resizable></vaadin-grid-sort-column>
        <vaadin-grid-sort-column path="active" header="Active" text-align="center" auto-width resizable></vaadin-grid-sort-column>
        <vaadin-grid-column text-align="center" header="Action" auto-width>
          <template class="header">Action</template>
          <template>
           <vaadin-button theme="contrast primary small" on-click="forceBackup">
              <iron-icon icon="lumo:download" slot="prefix"></iron-icon>
              Backup
            </vaadin-button>
            <vaadin-button theme="primary small" on-click="editDatabase">
              <iron-icon icon="lumo:edit" slot="prefix"></iron-icon>
              Edit
            </vaadin-button>
            <vaadin-button theme="error primary small" on-click="deleteDatabase">
              <iron-icon icon="lumo:cross" slot="prefix"></iron-icon>
              Delete
            </vaadin-button>
          </template>
        </vaadin-grid-column> 
      </vaadin-grid>

      <vaadin-dialog id="dialog" no-close-on-outside-click></vaadin-dialog>

      <vaadin-notification></vaadin-notification>
    `;
  }

  constructor() {
    super();
    this.api_key = window.config.api_key;
    this.api_url = window.config.api_url;
    this.headers = {
      "x-api-key": this.api_key
    };
  }

  connectedCallback() {
    super.connectedCallback();
    const dialog = this.root.querySelector('vaadin-dialog');
    const columns = this.root.querySelectorAll('.date');

    for (let column of columns) {
      column.renderer = (root, column, rowData) => {
        let raw_date = rowData.item[column.getAttribute('path')];
        let date = moment.utc(raw_date);
        if (date.isValid()) root.textContent = date.local().format('DD.MM.YYYY - HH:mm:ss');
      };
    }

    dialog.renderer = async (root, dialog) => {
      let item = {};

      if (this.current_dialog == "edit" || this.current_dialog == "delete") {
        item = this.current_item.item;
      }

      const elements = {
        "edit": [{
          type: 'iron-form',
          properties: {
            id: "updateForm"
          },
          children: [{
            type: 'form',
            properties: {
              method: "PATCH",
              action: `${this.api_url}/database?api_key=${this.api_key}`
            },
            children: [{
              type: 'div',
              text: "Update database",
              css: {
                "font-size": "35px",
                "text-align": "center"
              }
            }, {
              type: 'input',
              properties: {
                name: 'id',
                value: item.id
              },
              css: {
                "display": "none"
              }
            }, {
              type: 'vaadin-text-field',
              properties: {
                id: 'name',
                label: 'Name',
                name: "name",
                value: item.name
              },
              css: {
                "margin-right": "20px"
              }
            }, {
              type: "br"
            }, {
              type: 'vaadin-text-field',
              properties: {
                id: 'host',
                label: 'Host',
                name: 'host',
                value: item.host
              },
              css: {
                "margin-right": "20px"
              }
            }, {
              type: 'vaadin-number-field',
              properties: {
                id: 'port',
                label: 'Port',
                name: 'port',
                value: item.port
              }
            }, {
              type: "br"
            }, {
              type: 'vaadin-text-field',
              properties: {
                id: 'database',
                label: 'Database',
                name: 'database',
                value: item.database
              }
            }, {
              type: "br"
            }, {
              type: 'vaadin-text-field',
              properties: {
                id: 'user',
                label: 'User',
                name: 'user',
                value: item.user
              },
              css: {
                "margin-right": "20px"
              }
            }, {
              type: 'vaadin-password-field',
              properties: {
                id: 'password',
                label: 'Password',
                name: 'password',
                value: item.password
              }
            }, {
              type: "br"
            }, {
              type: 'vaadin-text-field',
              properties: {
                id: 'cron',
                label: 'Cron',
                name: 'cron',
                value: item.cron
              },
              css: {
                "margin-right": "20px"
              }
            }, {
              type: 'vaadin-radio-group',
              properties: {
                label: "Active"
              },
              children: [{
                type: 'vaadin-radio-button',
                properties: {
                  name: 'active',
                  value: true
                },
                text: 'True',
                checked: item.active === true ? true : false
              }, {
                type: 'vaadin-radio-button',
                properties: {
                  name: 'active',
                  value: false
                },
                text: 'False',
                checked: item.active === false ? true : false
              }]
            }, {
              type: "br"
            }, {
              type: 'vaadin-button',
              properties: {
                theme: "primary large",
                onclick: "updateForm.submit(); document.querySelector('vaadin-dialog-overlay').close()"
              },
              css: {
                "margin-top": "30px",
                width: "100%"
              },
              text: 'Update'
            }, {
              type: 'vaadin-button',
              properties: {
                theme: "primary large error",
                onclick: "document.querySelector('vaadin-dialog-overlay').close()"
              },
              css: {
                width: "100%"
              },
              text: 'Cancel'
            }]
          }]
        }],
        "add": [{
          type: 'iron-form',
          properties: {
            id: "updateForm"
          },
          children: [{
            type: 'form',
            properties: {
              method: "POST",
              action: `${this.api_url}/database?api_key=${this.api_key}`
            },
            children: [{
              type: 'div',
              text: "Add database",
              css: {
                "font-size": "35px",
                "text-align": "center"
              }
            }, {
              type: 'vaadin-text-field',
              properties: {
                id: 'name',
                label: 'Name',
                name: "name",
                placeholder: "example-db"
              },
              css: {
                "margin-right": "20px"
              }
            }, {
              type: "br"
            }, {
              type: 'vaadin-text-field',
              properties: {
                id: 'host',
                label: 'Host',
                name: 'host',
                placeholder: "172.149.43.222"
              },
              css: {
                "margin-right": "20px"
              }
            }, {
              type: 'vaadin-number-field',
              properties: {
                id: 'port',
                label: 'Port',
                name: 'port',
                placeholder: "3306"
              }
            }, {
              type: "br"
            }, {
              type: 'vaadin-text-field',
              properties: {
                id: 'database',
                label: 'Database',
                name: 'database',
                placeholder: "Books"
              }
            }, {
              type: "br"
            }, {
              type: 'vaadin-text-field',
              properties: {
                id: 'user',
                label: 'User',
                name: 'user',
                placeholder: "root"
              },
              css: {
                "margin-right": "20px"
              }
            }, {
              type: 'vaadin-password-field',
              properties: {
                id: 'password',
                label: 'Password',
                name: 'password',
                placeholder: "*******"
              }
            }, {
              type: "br"
            }, {
              type: 'vaadin-text-field',
              properties: {
                id: 'cron',
                label: 'Cron',
                name: 'cron',
                placeholder: "* * * * *"
              },
              css: {
                "margin-right": "20px"
              }
            }, {
              type: 'vaadin-radio-group',
              properties: {
                label: "Active"
              },
              children: [{
                type: 'vaadin-radio-button',
                properties: {
                  name: 'active',
                  value: true
                },
                text: 'True',
                checked: true
              }, {
                type: 'vaadin-radio-button',
                properties: {
                  name: 'active',
                  value: false
                },
                text: 'False',
                checked: false
              }]
            }, {
              type: "br"
            }, {
              type: 'vaadin-button',
              properties: {
                theme: "primary large",
                onclick: "updateForm.submit(); document.querySelector('vaadin-dialog-overlay').close()"
              },
              css: {
                "margin-top": "30px",
                width: "100%"
              },
              text: 'Add'
            }, {
              type: 'vaadin-button',
              properties: {
                theme: "primary large error",
                onclick: "document.querySelector('vaadin-dialog-overlay').close()"
              },
              css: {
                width: "100%"
              },
              text: 'Cancel'
            }]
          }]
        }],
        "delete": [{
          type: 'iron-form',
          properties: {
            id: "updateForm"
          },
          children: [{
            type: 'form',
            properties: {
              method: "DELETE",
              action: `${this.api_url}/database?api_key=${this.api_key}`
            },
            children: [{
              type: 'input',
              properties: {
                name: 'id',
                value: item.id
              },
              css: {
                "display": "none"
              }
            }, {
              type: 'input',
              properties: {
                name: 'name',
                value: item.name
              },
              css: {
                "display": "none"
              }
            }, {
              type: 'div',
              text: "Delete database",
              css: {
                "font-size": "35px",
                "text-align": "center"
              }
            }, {
              type: "br"
            }, {
              type: 'div',
              text: `Do you really want to delete database config for "${item.name}"?`,
              css: {
                "text-align": "center"
              }
            }, {
              type: "br"
            }, {
              type: "div",
              css: {
                "display": "flex",
                "align-items": "center",
                "justify-content": "space-between"
              },
              children: [{
                type: 'vaadin-button',
                properties: {
                  theme: "primary small",
                  onclick: "updateForm.submit(); document.querySelector('vaadin-dialog-overlay').close();"
                },
                css: {
                  width: "47.5%"
                },
                text: 'Delete config'
              }, {
                type: 'vaadin-button',
                properties: {
                  theme: "primary small error",
                  onclick: "document.querySelector('vaadin-dialog-overlay').close()"
                },
                css: {
                  width: "47.5%"
                },
                text: 'Cancel'
              }]
            }]
          }]
        }]
      };

      if (root.firstElementChild) {
        root.removeChild(root.querySelector('#updateForm'));
      }

      this.create_content(root, elements[this.current_dialog]);
      return;
    };
  }

  forceBackup(e) {
    let data = this.root.querySelector('vaadin-grid').getEventContext(e);
    const Http = new XMLHttpRequest();
    const url = `${this.api_url}/backup?db=${data.item.name}&api_key=${this.api_key}`;
    Http.open("GET", url);
    Http.send();

    Http.onreadystatechange = () => {
      if (Http.status == 200) {
        this.notificate(`Backup for "${data.item.name}" has been started!`, 'success');
      } else {
        this.notificate(`An error occured! HTTP Code: ${Http.status}`, 'error');
      }
    };
  }

  addDatabase() {
    let dialog = this.root.querySelector('vaadin-dialog');
    this.current_dialog = "add";
    dialog.opened = true;
  }

  editDatabase(e) {
    let data = this.root.querySelector('vaadin-grid').getEventContext(e);
    let dialog = this.root.querySelector('vaadin-dialog');
    this.current_item = data;
    this.current_dialog = "edit";
    dialog.opened = true;
  }

  deleteDatabase(e) {
    let data = this.root.querySelector('vaadin-grid').getEventContext(e);
    let dialog = this.root.querySelector('vaadin-dialog');
    this.current_item = data;
    this.current_dialog = "delete";
    dialog.opened = true;
  }

  create_content(root, elements) {
    for (let element of elements) {
      this.create_element(root, element);
    }
  }

  create_element(root, element) {
    let field = window.document.createElement(element.type);

    if (element.type == 'iron-form') {
      field.addEventListener('iron-form-response', event => {
        let text = "Critical error occured!";

        if (this.current_dialog == "edit") {
          text = "Database was updated!";
        } else if (this.current_dialog == "add") {
          text = "Database was created!";
        } else if (this.current_dialog == "delete") {
          document.querySelector('vaadin-dialog-overlay').close();
          text = "Database was deleted!";
        }

        this.notificate(text, 'success');
      });
      field.addEventListener('iron-form-error', event => {
        this.notificate('An error occured', 'error');
      });
      field.addEventListener('iron-form-invalid', event => {
        this.notificate('Invalid input');
      });
    }

    for (let property in element.properties) {
      field.setAttribute(property, element.properties[property]);
    }

    for (let property in element.css) {
      field.style[property] = element.css[property];
    }

    if (element.text) {
      field.textContent = element.text;
    }

    if (element.checked) {
      field.checked = true;
    }

    if (element.click) {
      field.addEventListener('click', () => element.click(this.root));
    }

    root.appendChild(field);

    if (element.children && element.children.length > 0) {
      this.create_content(field, element.children);
    }
  }

  notificate(text, theme = 'contrast', duration = '3000', position = 'bottom-center') {
    const notification = this.root.querySelector('vaadin-notification');
    notification.setAttribute('theme', theme);
    notification.setAttribute('duration', duration);
    notification.setAttribute('position', position);

    notification.renderer = root => {
      // Global config thingy
      if (root.firstElementChild) {
        const element = root.querySelector('#id');
        return;
      } else {
        const element = window.document.createTextNode(text);
        element.id = 'text';
        root.appendChild(element);
        return;
      }
    };

    notification.open();
  }

}

customElements.define('databases-grid', DatabasesGrid);
export { vaadinIntegerField as $vaadinIntegerField, IntegerFieldElement };