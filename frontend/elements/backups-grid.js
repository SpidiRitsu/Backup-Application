import { html, PolymerElement } from '@polymer/polymer/polymer-element';
import '@polymer/iron-ajax/iron-ajax';
import '@vaadin/vaadin-grid/all-imports';
import '@vaadin/vaadin-button/vaadin-button';
import moment from 'moment';
class BackupsGrid extends PolymerElement {
  static get template() {
    return html`
      <style>
        vaadin-grid {
          min-height: 900px;
        }
      </style>
      <iron-ajax
        auto
        url="{{api_url}}/get_backups"
        headers="{{headers}}"
        handle-as="json"
        last-response="{{data}}"> -->
      </iron-ajax>
      <vaadin-grid id="grid" items="{{data}}">
        <vaadin-grid-sort-column path="id" header="ID" text-align="center" auto-width resizable></vaadin-grid-sort-column>
        <vaadin-grid-sort-column path="database_id" header="Database ID" text-align="center" auto-width resizable></vaadin-grid-sort-column>
        <vaadin-grid-sort-column path="filename" header="Filename" text-align="center" auto-width resizable></vaadin-grid-sort-column>
        <vaadin-grid-sort-column class="date" path="created" header="Created" text-align="center" auto-width resizable></vaadin-grid-sort-column>
        <vaadin-grid-sort-column class="date" path="finished" header="Finished" text-align="center" auto-width resizable></vaadin-grid-sort-column>
        <vaadin-grid-sort-column class="date" path="duration" header="Duration" text-align="center" auto-width resizable></vaadin-grid-sort-column>
        <vaadin-grid-sort-column path="status" header="Status" text-align="center" auto-width resizable></vaadin-grid-sort-column>
        <vaadin-grid-sort-column id="error" header="Error Message" text-align="center" resizable></vaadin-grid-sort-column>
        <vaadin-grid-column header="Action" text-align="center" auto-width>
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

    const grid = this.root.querySelector('vaadin-grid');

    const columns = this.root.querySelectorAll('.date');

    for (let column of columns) {
      column.renderer = (root, column, rowData) => {
        let path = column.getAttribute('path')
        if (path === 'duration') {
          let started = moment(rowData.item['created'])
          let finished = moment(rowData.item['finished'])
          let duration = moment.duration(finished.diff(started))
          if (duration._isValid) {
            root.textContent = duration.asSeconds() + 's'
          }
        }
        else {
          let raw_date = rowData.item[path];
          let date = moment.utc(raw_date)
          if (date.isValid())
            root.textContent = date.local().format('DD.MM.YYYY - HH:mm:ss')
        }
      }
    }

    const error = this.root.querySelector('#error')

    error.renderer = (root, column, rowData) => {
      const button = window.document.createElement('vaadin-button')
      button.setAttribute('theme', 'primary error small')

      button.addEventListener('click', (e) => this.showError(e))
      
      const icon = window.document.createElement('iron-icon')
      icon.setAttribute('icon', 'lumo:error')
      icon.setAttribute('slot', 'prefix')
      
      button.appendChild(icon)
      button.appendChild(window.document.createTextNode('Show'))

      if (root.firstElementChild) {
        root.removeChild(root.querySelector('vaadin-button'))
      }

      if (rowData.item.status !== "Succeeded" && rowData.item.status !== "Deleted" && rowData.item.status !== "Started") {
        root.appendChild(button)
      }
    }

    const column = this.root.querySelector('vaadin-grid-column')

    column.renderer = (root, column, rowData) => {
      const wrapper = window.document.createElement('div');
      wrapper.style.display = 'flex';
      wrapper.style.alignItems = 'center';
      wrapper.style.justifyContent = 'space-between';
      const button = window.document.createElement('vaadin-button')
      button.setAttribute('theme', 'primary small')

      let href = `${this.api_url}/backups/${rowData.item.id}`

      button.setAttribute('onclick', `location.href="${href}"`)
      
      const icon = window.document.createElement('iron-icon')
      icon.setAttribute('icon', 'lumo:download')
      icon.setAttribute('slot', 'prefix')
      
      button.appendChild(icon)
      button.appendChild(window.document.createTextNode(`Download (\t${formatBytes(rowData.item.size)}\t)`))

      if (root.firstElementChild) {
        root.removeChild(root.querySelector('div'))
      }
      
      
      const restore = window.document.createElement('vaadin-button')
      restore.setAttribute('theme', ' primary success small')
      restore.addEventListener('click', () => this.restoreBackup(dialog, rowData.item.id));

      const restoreIcon = window.document.createElement('iron-icon')
      restoreIcon.setAttribute('icon', 'lumo:reload')
      restoreIcon.setAttribute('slot', 'prefix')

      restore.appendChild(restoreIcon);
      restore.appendChild(window.document.createTextNode('Restore'))
      restore.style.marginLeft = '10px';

      wrapper.appendChild(button);
      wrapper.appendChild(restore)

      if (rowData.item.status !== "Succeeded") {
        button.setAttribute('disabled', '')
        restore.setAttribute('disabled', '')
      }

      root.appendChild(wrapper)
    }
    
    dialog.renderer = (root, dialog) => {
      
      let item = [{}];
      
      if (this.current_dialog == "error") {
        item = this.current_item.item
      } else if (this.current_dialog == "restore-existing") {
        item = this.current_item
      } else if (this.current_dialog == "confirmation-new" || this.current_dialog == "confirmation-existing") {
        item = this.current_item
      }

      const elements = {
        "error": [
          {
            type: 'div',
            properties: {
              id: "errorWrapper"
            },
            css: {
              "max-width": "900px"
            },
            children: [
              {
                type: 'div',
                text: "Error message",
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
                text: `${item.error != '' && item.error != null ? item.error : 'Sorry! There\'s no error to show...'}`,
              },
              {
                type: "br"
              },
              {
                type: 'vaadin-button',
                properties: {
                  theme: "primary small error",
                  onclick: "document.querySelector('vaadin-dialog-overlay').close()"
                },
                css: {
                  width: "100%"
                },
                text: 'Close'
              }
            ]
          }
        ],
        "restore": [
          {
            type: 'div',
            properties: {
              id: 'restoreWrapper'
            },
            children: [
              {
                type: 'div',
                text: "Backup restoration",
                css: {
                  "font-size": "35px",
                  "text-align": "center",
                }
              },
              {
                type: 'hr'
              },
              {
                type: 'vaadin-button',
                properties: {
                  id: 'existing',
                  theme: "primary large",
                },
                css: {
                  width: "100%"
                },
                text: 'Restore existing database'
              },
              {
                type: "br"
              },
              {
                type: 'vaadin-button',
                properties: {
                  id: 'new',
                  theme: "contrast primary large",
                },
                css: {
                  width: "100%"
                },
                text: 'Restore new database'
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
        ],
        "restore-existing": [
          {
            type: 'iron-form',
            properties: {
              id: 'restoreBackupForm',
            },
            children: [
              {
                type: 'form',
                properties: {
                  method: "POST",
                  action: `${this.api_url}/restore?api_key=${this.api_key}`
                },
                children: [
                  {
                    type: 'div',
                    text: "Restore backup to existing database",
                    css: {
                      "font-size": "35px",
                      "text-align": "center",
                    }
                  },
                  {
                    type: 'hr'
                  },
                  {
                    type: 'div',
                    children: this.current_dialog != 'error' ? item.map((el) => {
                      let button = {
                        type: 'vaadin-button',
                        properties: {
                          class: 'restore-existing',
                          theme: 'success primary large',
                          "data-id": el.id,
                        },
                        css: {
                          "margin-top": "15px",
                          width: "100%"
                        },
                        children: [
                          {
                            type: 'iron-icon',
                            properties: {
                              icon: 'lumo:reload',
                              slot: 'prefix'
                            }
                          },
                          {
                            type: 'span',
                            text: `${el.name}`
                          }
                        ]
                      };
                      return button;
                    }) : 'XD?' 
                  },
                  {
                    type: 'vaadin-button',
                    properties: {
                      theme: "primary large error",
                      onclick: "document.querySelector('vaadin-dialog-overlay').close()"
                    },
                    css: {
                      "margin-top": "15px",
                      width: "100%"
                    },
                    text: 'Cancel'
                  }
                ]
              }
            ]
          }
        ],
        "restore-new": [
          {
            type: 'div',
            properties: {
              id: 'restoreNewBackup',
            },
            children: [
              {
                type: 'div',
                text: "Restore backup to new database",
                css: {
                  "font-size": "35px",
                  "text-align": "center"
                }
              },
              {
                type: 'hr'
              },
              {
                type: 'input',
                properties: {
                  name: 'backup_id',
                  value: this.backup_id
                },
                css: {
                  "display": "none"
                }
              },
              {
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
              },
              {
                type: 'vaadin-number-field',
                properties: {
                  id: 'port',
                  label: 'Port',
                  name: 'port',
                  placeholder: "3306"
                }
              },
              {
                type: "br"
              },
              {
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
              },
              {
                type: 'vaadin-password-field',
                properties: {
                  id: 'password',
                  label: 'Password',
                  name: 'password',
                  placeholder: "*******"
                }
              },
              {
                type: "br"
              },
              {
                type: 'vaadin-text-field',
                properties: {
                  id: 'database',
                  label: 'Database',
                  name: 'database',
                  placeholder: "Books"
                }
              },
              {
                type: "br"
              },
              {
                type: 'vaadin-button',
                properties: {
                  class: "restore-confirm-new",
                  theme: "primary large",
                },
                css: {
                  "margin-top": "30px",
                  width: "100%"
                },
                text: 'Restore'
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
        ],
        "confirmation-existing": [
          {
            type: 'iron-form',
            properties: {
              id: 'restoreBackupForm',
            },
            children: [
              {
                type: 'div',
                text: "Confirmation",
                css: {
                  "font-size": "35px",
                  "text-align": "center"
                }
              },
              {
                type: 'hr'
              },
              {
                type: 'div',
                text: `Are you sure you want to restore this backup?`,
                css: {
                  "text-align": "center",
                }
              },
              {
                type: 'input',
                properties: {
                  name: 'backup_id',
                  value: this.backup_id
                },
                css: {
                  "display": "none"
                }
              },
              {
                type: 'vaadin-button',
                properties: {
                  class: "confirm-existing",
                  theme: "primary large",
                  "data-db": item[0] != null ? item[0].db_id : 'DATABASERINO_IDERINO'
                },
                css: {
                  "margin-top": "30px",
                  width: "100%"
                },
                text: 'Confirm'
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
        ],
        "confirmation-new": [
          {
            type: 'iron-form',
            properties: {
              id: 'restoreNewBackupForm',
            },
            children: [
              {
                type: 'form',
                properties: {
                  method: "POST",
                  action: `${this.api_url}/restore/new?api_key=${this.api_key}`
                },
                children: [
                  {
                    type: 'div',
                    text: "Confirmation",
                    css: {
                      "font-size": "35px",
                      "text-align": "center"
                    }
                  },
                  {
                    type: 'hr'
                  },
                  {
                    type: 'div',
                    text: `Are you sure you want to restore this backup to the unknown database?`,
                    css: {
                      "text-align": "center",
                    }
                  },
                  {
                    type: 'input',
                    properties: {
                      name: 'backup_id',
                      value: this.backup_id
                    },
                    css: {
                      "display": "none"
                    }
                  },
                  {
                    type: 'input',
                    properties: {
                      name: 'host',
                      value: item[0] != null ? item[0].host : 'HOSTERINO'
                    },
                    css: {
                      "display": "none"
                    }
                  },
                  {
                    type: 'input',
                    properties: {
                      name: 'port',
                      value: item[0] != null ? item[0].port : 'PORTERINO'
                    },
                    css: {
                      "display": "none"
                    }
                  },
                  {
                    type: 'input',
                    properties: {
                      name: 'user',
                      value: item[0] != null ? item[0].user : 'USERINO'
                    },
                    css: {
                      "display": "none"
                    }
                  },
                  {
                    type: 'input',
                    properties: {
                      name: 'password',
                      value: item[0] != null ? item[0].password : 'PASSWORDERINO'
                    },
                    css: {
                      "display": "none"
                    }
                  },
                  {
                    type: 'input',
                    properties: {
                      name: 'database',
                      value: item[0] != null ? item[0].database : 'DATABASERINO'
                    },
                    css: {
                      "display": "none"
                    }
                  },
                  {
                    type: 'vaadin-button',
                    properties: {
                      theme: "primary large",
                      onclick: "restoreNewBackupForm.submit(); document.querySelector('vaadin-dialog-overlay').close();"
                    },
                    css: {
                      "margin-top": "30px",
                      width: "100%"
                    },
                    text: 'Confirm'
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
        ]
      }
      
      if (root.firstElementChild) {
        const toDelete = ['errorWrapper', 'restoreWrapper', 'restoreNewBackup', 'restoreNewBackupForm', 'restoreNewBackup', 'restoreBackupForm'];
        toDelete.forEach(id => {
          const element = root.querySelector(`#${id}`);
          if (element) {
            root.removeChild(element);
          }
        });
      }
  
      this.create_content(root, elements[this.current_dialog])
      return;
    }
  }

  showError(e) {
    let data = this.root.querySelector('vaadin-grid').getEventContext(e)
    let dialog = this.root.querySelector('vaadin-dialog')
    this.current_item = data
    this.current_dialog = "error"
    dialog.opened = true;
  }

  create_content(root, elements) {
    for (let element of elements) {
      this.create_element(root, element)
    }
  }

  create_element(root, element) {
    let field = window.document.createElement(element.type)
    if (element.type == 'iron-form') {
      field.addEventListener('iron-form-response', (event) => {
        let text = "Critical error occured!"

        if (this.current_dialog == "confirmation-new") {
          text = "Restoration to the remote server has started!"
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

    if (element.type == 'vaadin-button') {
      if (field.id == 'existing') {
        field.addEventListener('click', () => this.restoreBackupExistingDatabase(this.root.querySelector('#dialog')))
      } else if (field.id == 'new') {
        field.addEventListener('click', () => this.restoreBackupNewDatabase(this.root.querySelector('#dialog')))
      }

      if (field.classList.contains('restore-existing')) {
        field.addEventListener('click', () => this.confirmExisting(this.root.querySelector('#dialog'), field.dataset.id, field.dataset.environment));
      } else if (field.classList.contains('restore-confirm-new')) {
        field.addEventListener('click', () => this.confirmNew(this.root.querySelector('#dialog')));
      } else if (field.classList.contains('confirm-existing')) {
        field.addEventListener('click', () => this.restoreExistingBackup(this.root.querySelector('#dialog'), field.dataset.db));
      }
    }

    root.appendChild(field)

    if (element.children && element.children.length > 0) {
      this.create_content(field, element.children)
    }
  }

  restoreBackup(dialog, backup_id) {
    this.backup_id = backup_id;
    this.current_dialog = "restore"
    dialog.opened = true;
  }

  async restoreBackupExistingDatabase(dialog) {
    let response = await fetch(`${this.api_url}/get_databases?api_key=${this.api_key}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    let data = await response.json();
    this.current_item = data;
    dialog.opened = false;
    this.current_dialog = "restore-existing"
    dialog.opened = true;
  }

  restoreBackupNewDatabase(dialog) {
    dialog.opened = false;
    this.current_dialog = "restore-new"
    dialog.opened = true;
  }

  confirmNew(dialog) {
    let data = {
      host: document.querySelector("#restoreNewBackup > #host").value,
      port: document.querySelector("#restoreNewBackup > #port").value,
      user: document.querySelector("#restoreNewBackup > #user").value,
      password: document.querySelector("#restoreNewBackup > #password").value,
      database: document.querySelector("#restoreNewBackup > #database").value,
    }
    this.current_item = [data];
    dialog.opened = false;
    this.current_dialog = "confirmation-new"
    dialog.opened = true;
  }

  async confirmExisting(dialog, id) {
    let data = {
      db_id: id,
    }
    this.current_item = [data];
    dialog.opened = false;
    this.current_dialog = "confirmation-existing"
    dialog.opened = true;
  }

  async restoreExistingBackup(dialog, id) {
    dialog.opened = false;
    let response = await fetch(`${this.api_url}/restore/existing?db=${id}&backup=${this.backup_id}&api_key=${this.api_key}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (response.status == 200) {
      this.notificate("Restoration has started!", 'success');
    } else {
      this.notificate("An error occurred!", 'error');
    }
  }

  notificate(text, theme='contrast', duration='3000', position='bottom-center') {
    const notification = this.root.querySelector('vaadin-notification')
  
    notification.setAttribute('theme', theme)
    notification.setAttribute('duration', duration)
    notification.setAttribute('position', position)

    notification.renderer = (root) => {
      // Global config thingy
      if (root.firstElementChild) {
        const element = root.querySelector('#id')
        return;
      } else {
        const element = window.document.createTextNode(text)
        element.id = 'text'
        root.appendChild(element)
        return;
      }
    }
    notification.open()
  }
}

customElements.define('backups-grid', BackupsGrid);

function formatBytes(bytes, decimals = 0) {
  if (bytes == 0 || typeof(bytes) != "number") return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
