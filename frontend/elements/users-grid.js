import { html, PolymerElement } from '@polymer/polymer/polymer-element';
import '@polymer/iron-ajax/iron-ajax';
import '@vaadin/vaadin-grid/all-imports';
class UsersGrid extends PolymerElement {
  static get template() {
    return html`
      <style>
        vaadin-grid {
          min-height: 900px;
        }
      </style>
      <iron-ajax
        auto
        url="{{api_url}}/get_users"
        headers="{{headers}}"
        handle-as="json"
        last-response="{{data}}">
      </iron-ajax>

      <vaadin-button theme="primary" on-click="addUser">
        <iron-icon icon="lumo:plus" slot="prefix"></iron-icon>
        Add user 
      </vaadin-button>

      <vaadin-grid id="grid" items="{{data}}">
        <vaadin-grid-sort-column path="id" header="ID" text-align="center" auto-width resizable></vaadin-grid-sort-column>
        <vaadin-grid-sort-column path="username" header="Username" text-align="center" auto-width resizable></vaadin-grid-sort-column>
        <vaadin-grid-sort-column path="password" header="Password" text-align="center" resizable></vaadin-grid-sort-column>
        <vaadin-grid-sort-column path="api_key" header="Api Key" text-align="center" auto-width resizable></vaadin-grid-sort-column>
        <vaadin-grid-column text-align="center" auto-width>
          <template class="header">Action</template>
          <template>
            <vaadin-button theme="primary small" on-click="editUser">
              <iron-icon icon="lumo:edit" slot="prefix"></iron-icon>
              Edit
            </vaadin-button>
            <vaadin-button theme="error primary small" on-click="deleteUser">
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
    this.api_key = window.config.api_key
    this.api_url = window.config.api_url
    this.headers = {"x-api-key": this.api_key}
  }

  connectedCallback() {
    super.connectedCallback();

    const dialog = this.root.querySelector('vaadin-dialog')

    dialog.renderer = (root, dialog) => {
      
      let item = {}

      if (this.current_dialog == "edit" || this.current_dialog == "delete") {
        item = this.current_item.item
      }
  
      const elements = {
        "edit":  [
          {
            type: 'iron-form',
            properties: {
              id: "updateForm"
            },
            children: [
              {
                type: 'form',
                properties: {
                  method: "PATCH",
                  action: `${this.api_url}/user?api_key=${this.api_key}`
                },
                children: [
                  {
                    type: 'div',
                    text: "Update user",
                    css: {
                      "font-size": "35px",
                      "text-align": "center"
                    }
                  },
                  {
                    type: 'input',
                    properties: {
                      name: 'id',
                      value: item.id
                    },
                    css: {
                      "display": "none"
                    }
                  },
                  {
                    type: 'vaadin-text-field',
                    properties: {
                      id: 'username',
                      label: 'Username',
                      name: "username",
                      value: item.username
                    }
                  },
                  {
                    type: "br"
                  },
                  {
                    type: 'vaadin-password-field',
                    properties: {
                      id: 'password',
                      label: 'Password',
                      name: "password",
                      placeholder: "New password"
                    }
                  },
                  {
                    type: "br"
                  },
                  {
                    type: 'vaadin-text-field',
                    properties: {
                      id: 'apiKey',
                      label: 'Api Key',
                      name: "api_key",
                      value: item.api_key,
                      readonly: ""
                    },
                    css: {
                      "width": "100%"
                    }
                  },                  
                  {
                    type: "br"
                  },
                  {
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
                  },
                  {
                    type: 'vaadin-button',
                    properties: {
                      theme: "primary large error",
                      onclick: "document.querySelector('vaadin-dialog-overlay').close()"
                    },
                    css: {
                      width: "100%"
                    },
                    text: 'Cancel'
                  }
                ]
              }
            ]
          }
        ],
        "add": [
          {
            type: 'iron-form',
            properties: {
              id: "updateForm"
            },
            children: [
              {
                type: 'form',
                properties: {
                  method: "POST",
                  action: `${this.api_url}/user?api_key=${this.api_key}`
                },
                children: [
                  {
                    type: 'div',
                    text: "Add user",
                    css: {
                      "font-size": "35px",
                      "text-align": "center"
                    }
                  },
                  {
                    type: 'vaadin-text-field',
                    properties: {
                      id: 'username',
                      label: 'Username',
                      name: "username",
                      placeholder: "New username"
                    }
                  },
                  {
                    type: "br"
                  },
                  {
                    type: 'vaadin-password-field',
                    properties: {
                      id: 'password',
                      label: 'Password',
                      name: "password",
                      placeholder: "New password"
                    }
                  },              
                  {
                    type: "br"
                  },
                  {
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
                  },
                  {
                    type: 'vaadin-button',
                    properties: {
                      theme: "primary large error",
                      onclick: "document.querySelector('vaadin-dialog-overlay').close()"
                    },
                    css: {
                      width: "100%"
                    },
                    text: 'Cancel'
                  }
                ]
              }
            ]
          }
        ],
        "delete": [
          {
            type: 'iron-form',
            properties: {
              id: "updateForm"
            },
            children: [
              {
                type: 'form',
                properties: {
                  method: "DELETE",
                  action: `${this.api_url}/user?api_key=${this.api_key}`
                },
                children: [
                  {
                    type: 'input',
                    properties: {
                      name: 'id',
                      value: item.id
                    },
                    css: {
                      "display": "none"
                    }
                  },
                  {
                    type: 'input',
                    properties: {
                      name: 'username',
                      value: item.username
                    },
                    css: {
                      "display": "none"
                    }
                  },
                  {
                    type: 'div',
                    text: "Delete user",
                    css: {
                      "font-size": "35px",
                      "text-align": "center"
                    }
                  },
                  {
                    type: "br"
                  },
                  {
                    type: 'div',
                    text: `Do you really want to delete user with username "${item.username}"?`,
                    css: {
                      "text-align": "center"
                    }
                  },
                  {
                    type: "br"
                  },
                  {
                    type: "div",
                    css: {
                      "display": "flex",
                      "align-items": "center",
                      "justify-content": "space-between"
                    },
                    children: [
                      {
                        type: 'vaadin-button',
                        properties: {
                          theme: "primary small",
                          onclick: "updateForm.submit(); document.querySelector('vaadin-dialog-overlay').close()"
                        },
                        css: {
                          width: "47.5%"
                        },
                        text: 'Delete user'
                      },
                      {
                        type: 'vaadin-button',
                        properties: {
                          theme: "primary small error",
                          onclick: "document.querySelector('vaadin-dialog-overlay').close()"
                        },
                        css: {
                          width: "47.5%"
                        },
                        text: 'Cancel'
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
  
      if (root.firstElementChild) {
        root.removeChild(root.querySelector('#updateForm'))
      }
  
      this.create_content(root, elements[this.current_dialog])
      return;
    }
  }

  addUser() {
    let dialog = this.root.querySelector('vaadin-dialog')
    this.current_dialog = "add"
    dialog.opened = true;
  }

  editUser(e) {
    let data = this.root.querySelector('vaadin-grid').getEventContext(e)
    let dialog = this.root.querySelector('vaadin-dialog')
    this.current_item = data
    this.current_dialog = "edit"
    dialog.opened = true;
  }

  deleteUser(e) {
    let data = this.root.querySelector('vaadin-grid').getEventContext(e)
    let dialog = this.root.querySelector('vaadin-dialog')
    this.current_item = data
    this.current_dialog = "delete"
    dialog.opened = true;
  }

  create_content(root, elements) {
    for (let element of elements) {
      this.create_element(root, element)
    }
  }

  create_element(root, element) {
    let field = window.document.createElement(element.type)

    if (element.type = 'iron-form') {
      field.addEventListener('iron-form-response', (event) => {
        let text = "Critical error occured!"

        if (this.current_dialog == "edit") {
          text = "User was updated!"
        }
        else if (this.current_dialog == "add") {
          text = "User was created!"
        }
        else if (this.current_dialog == "delete") {
          document.querySelector('vaadin-dialog-overlay').close()
          text = "User was deleted!"
        }
        
        this.notificate(text, 'success')
      });
      field.addEventListener('iron-form-error', (event) => {
        this.notificate('An error occured', 'error')
      });
      field.addEventListener('iron-form-invalid', (event) => {
        this.notificate('Invalid input')
      });
    }

    for (let property in element.properties) {
      field.setAttribute(property, element.properties[property])
    }

    for (let property in element.css) {
      field.style[property] = element.css[property]
    }

    if (element.text) {
      field.textContent = element.text
    }

    if (element.checked) {
      field.checked = true
    }

    if (element.click) {
      field.addEventListener('click', () => element.click(this.root))
    }

    root.appendChild(field)

    if (element.children && element.children.length > 0) {
      this.create_content(field, element.children)
    }
  }

  notificate(text, theme='contrast', duration='3000', position='bottom-center') {
    const notification = this.root.querySelector('vaadin-notification')
  
    notification.setAttribute('theme', theme)
    notification.setAttribute('duration', duration)
    notification.setAttribute('position', position)

    notification.renderer = (root) => {
      if (root.firstElementChild) {
        const element = root.querySelector('#id')
        return;
      }
      else {
        const element = window.document.createTextNode(text)
        element.id = 'text'
        root.appendChild(element)
        return;
      }
    }
    notification.open()
  }
}

customElements.define('users-grid', UsersGrid);