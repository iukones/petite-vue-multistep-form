// import { createApp, nextTick } from "./module/petite-vue.es.js";
import { createApp, nextTick } from "https://unpkg.com/petite-vue?module";
console.log('Dentro de app.js');

function FieldComponent(props) {
  return {
    $template: "#field-component-template",
    field: props.field,
    get isInvalid() {
      return props.isInvalid();
    },
    get invalidMessage() {
      return props.invalidMessage();
    },
    // methods
    validate() {
      nextTick(() => {
        if (this.isInvalid) props.validate();
      });
    }
  };
}

function StepsIndicatorComponent(props) {
  return {
    $template: "#step-indicator-component-template",
    stepsCount: props.stepsCount,
    get stepsCountWithSuccessPage() {
      return this.stepsCount + 1;
    }
  };
}
createApp({
  // components
  FieldComponent,
  StepsIndicatorComponent,
  // Data
  submitted: false,
  currentStep: 0,
  invalids: {},
  fields: {
    name: {
      label: "Nombre",
      value: "",
      validations: [
        {
          message: "Nombre es requerido",
          test: (value) => value
        }
      ]
    },
    email: {
      label: "Email",
      value: "",
      validations: [
        {
          message: "Debe ser una dirección de correo electrónico válida",
          test: (value) => validateEmail(value)
        },
        {
          message: "Email es requerido",
          test: (value) => value
        }
      ]
    },
    address: {
      label: "Dirección",
      value: "",
      validations: [
        {
          message: "Dirección es requerido",
          test: (value) => value
        }
      ]
    },
    city: {
      label: "Ciudad",
      value: "",
      validations: [
        {
          message: "Ciudad es requerido",
          test: (value) => value
        }
      ]
    },
    state: {
      label: "Estado",
      value: "",
      validations: [
        {
          message: "Estado es requerido",
          test: (value) => value
        }
      ]
    },
    zip: {
      label: "C.P",
      value: "",
      validations: [
        {
          message: "C.P es requerido",
          test: (value) => value
        },
        {
          message: "C.P debe tener 5 dígitos",
          test: (value) => !isNaN(value) && value.length === 5
        }
      ]
    },
    donationAmount: {
      label: "Cantidad a donar",
      value: "",
      validations: [
        {
          message: "Donación es requerido",
          test: (value) => value
        },
        {
          message: "importe de la donación debe ser un número válido",
          test: (value) => !isNaN(value)
        }
      ]
    }
  },
  steps: [
    ["name", "email"],
    ["address", "city", "state", "zip"],
    ["donationAmount"]
  ],

  // Getters
  get currentFields() {
    return this.steps[this.currentStep];
  },
  get totalSteps() {
    return this.steps.length;
  },
  get isFirstStep() {
    return this.currentStep === 0;
  },
  get isLastStep() {
    return this.currentStep === this.totalSteps - 1;
  },

  // Methods
  previousStep() {
    if (this.isFirstStep) return;
    // removes all invalids so doesn't show error messages on back
    this.invalids = {};
    this.currentStep--;
  },
  nextStep() {
    if (this.isLastStep) return;
    this.validate();
    if (this.isInvalid) return;
    this.currentStep++;
  },
  get isInvalid() {
    return !!Object.values(this.invalids).filter((key) => key).length;
  },

  // methods  
  validate() {
    this.invalids = {};
    // validates all the fields on the current page
    this.currentFields.forEach((key) => {
      this.validateField(key);
    });
  },
  validateField(fieldKey) {
    this.invalids[fieldKey] = false;
    const field = this.fields[fieldKey];
    // run through each of the fields validation tests
    field.validations.forEach((validation) => {
      if (!validation.test(field.value)) {
        this.invalids[fieldKey] = validation.message;
      }
    });
  },
  reloadPage() {
    window.location.reload();
  },

  submit() {
    // if form not valid don't submit
    this.validate();
    if (this.isInvalid) return;

    // submit on valid form
    console.log("haciendo submit a:", JSON.stringify(this.fields));
    this.submitted = true;
  },
  preventReload() {
    this.onbeforeunload = function() {
      return `Estas seguro de recargar la ventana, tienes datos sin guardar`
    };
  }


}).mount("#multi-step-form");

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
/* const beforeUnloadListener = (event) => {
  event.preventDefault();
  return event.returnValue = "Are you sure you want to exit?";
};
const nameInput = document.querySelector("#formId");
console.log(nameInput);

nameInput.addEventListener("input", (event) => {
  if (event.target.value !== "") {
    addEventListener("beforeunload", beforeUnloadListener, {capture: true});
  } else {
    removeEventListener("beforeunload", beforeUnloadListener, {capture: true});
  }
}); */
