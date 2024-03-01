import '@/index.html'
import '@/style/main.scss'

import Inputmask from "./inputmask.min";

const valid = require("card-validator");
const validMail = require("email-validator");

const arr = document.querySelectorAll('input')

const maskCard = Inputmask('9999 9999 9999 9999 [99]');
const maskDate = Inputmask('99/99');
const maskCvc = Inputmask('999');
const maskEmail = Inputmask({
  mask: '*{1,20}[.*{1,20}][.*{1,20}][.*{1,20}]@*{1,20}[.*{2,6}][.*{1,2}]',
  greedy: false,
  onBeforePaste(pastedValue, opts) {
    pastedValue = pastedValue.toLowerCase();
    return pastedValue.replace('mailto:', '');
  },
  definitions: {
    '*': {
      validator: "[0-9A-Za-z!#$%&'*+/=?^_`{|}~-]",
      casing: 'lower',
    },
  },
});

maskCard.mask(arr[0]);
maskDate.mask(arr[1]);
maskCvc.mask(arr[2]);
maskEmail.mask(arr[3]);


const btn = document.querySelector('.paymentForm__btn')

const cardTypes = [
  'american-express', 'diners-club', 'discover', 'elo', 'hiper', 'hipercard', 'jcb', 'maestro', 'mastercard', 'mir', 'unionpay', 'visa'
]

function setClassList(event) {
  if (event.target.dataset.validate === 'true') {
    if(event.currentTarget.name === 'maskCard') {
      let clName = valid.number(event.currentTarget.value).card.type
      cardTypes.forEach( (item) => {
        event.currentTarget.classList.remove(item)
      } )
      event.currentTarget.classList.add(clName)
    } else {
      event.currentTarget.classList.add('validateTrue')
      event.currentTarget.classList.remove('validateFalse')
    }
  } else {
    event.currentTarget.classList.remove('validateTrue')
    cardTypes.forEach( (item) => {
      event.currentTarget.classList.remove(item)
    } )
    event.currentTarget.classList.add('validateFalse')
  }

  if (event.currentTarget.value == '') {
    event.currentTarget.classList.remove('validateTrue')
    event.currentTarget.classList.remove('validateFalse')
  }

}

function checkBtn(array) {
  let attr = []

  array.forEach( (item) => {
    attr = [...attr, item.dataset.validate]
  })

  attr.filter((item) => item == 'false').length === 0
    ? btn.removeAttribute('disabled')
    : btn.setAttribute("disabled", "")
}

arr.forEach( (item) => {
  if (item.name !== 'maskEmail') {
    item.addEventListener('blur', (e) => {

      let currentInpName = e.currentTarget.name
      let currentInpValue = e.currentTarget.value

      const items = {
        maskCard: 'number',
        maskDate: 'expirationDate',
        maskCvc: 'cvv',
      }

      if (valid[items[currentInpName]](currentInpValue).isValid) {
        e.target.dataset.validate = 'true'
        setClassList(e)
      } else {
        e.target.dataset.validate = 'false'
        setClassList(e)
      }

      checkBtn(arr)
    })
  } else {
    item.addEventListener('blur', (e) => {
      let currentInpValue = e.currentTarget.value
      if (validMail.validate(currentInpValue)) {
        e.target.dataset.validate = 'true'
        setClassList(e)
      } else {
        e.target.dataset.validate = 'false'
        setClassList(e)
      }

      checkBtn(arr)
    })
  }
})
