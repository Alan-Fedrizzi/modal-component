class Modal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.isOpen = false;

    this.shadowRoot.innerHTML = `
      <style>
        :host([open]) #backdrop,
        :host([open]) #modal {
          opacity: 1;
          visibility: visible;
          pointer-events: all;
        }

        :host([open]) #modal {
          top: 50%;
        }

        #backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background: rgba(0, 0, 0, 0.75);
          z-index: 10;

          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transition: all .3s ease-out;
        }

        #modal {
          position: fixed;
          top: 25%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 50%;
          z-index: 20;
          background: #fff;
          border-radius: 3px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transition: all .3s ease-out;
        }

        header {
          padding: 1rem;
          border-bottom: 1px solid #ccc;
        }

        ::slotted(h1) {
          font-size: 1.25rem;
          margin: 0;
        }

        #main {
          padding: 1rem;
        }

        #actions {
          border-top: 1px solid #ccc;
          padding: 1rem;
          display: flex;
          justify-content: flex-end;
        }

        #actions button {
          margin: 0 0.25rem;
        }
      </style>
      
      <div id="backdrop"></div>

      <div id="modal">
        <header>
          <slot name="title">Please confirm payment</slot>
          </header>
          <section id="main">
            <slot></slot>
          </section>
          <section id="actions">
            <button id="cancel-btn">Cancel</button>
            <button id="confirm-btn">OK</button>
          </section>
      </div>
    `;

    const slots = this.shadowRoot.querySelectorAll("slot");
    slots[1].addEventListener("slotchange", (evet) => {
      console.dir(slots[1].assignedNodes());
    });

    const cancelButton = this.shadowRoot.getElementById("cancel-btn");
    const confirmButton = this.shadowRoot.getElementById("confirm-btn");
    cancelButton.addEventListener("click", this._cancel.bind(this));
    confirmButton.addEventListener("click", this._confirm.bind(this));

    const backdrop = this.shadowRoot.getElementById("backdrop");
    backdrop.addEventListener("click", this._cancel.bind(this));

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && this.hasAttribute("open")) {
        this._cancel();
      }
    });
  }

  static get observedAttributes() {
    return ["open"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.hasAttribute("open")) {
      this.isOpen = true;
    } else {
      this.isOpen = false;
    }
  }

  open() {
    this.setAttribute("open", "");
    this.isOpen = true;
  }

  hide() {
    if (this.hasAttribute("open")) {
      this.removeAttribute("open");
    }
    this.isOpen = false;
  }

  _cancel(event) {
    this.hide();
    const cancelEvent = new Event("cancel");
    this.dispatchEvent(cancelEvent);
  }

  _confirm() {
    this.hide();
    const confirmEvent = new Event("confirm");
    this.dispatchEvent(confirmEvent);
  }
}

customElements.define("uc-modal", Modal);
