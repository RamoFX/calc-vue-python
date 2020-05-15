declare const calcExp: any
declare const eel: any

const compCalc = Vue.component('comp-calc', {
  data: function() {
    const self = this

    return {

      buttons: {

        advanced: [
          {
            text: 'sin',
            value: 'sin(x)'
          },
          {
            text: 'cos',
            value: 'cos(x)'
          },
          {
            text: 'tan',
            value: 'tan(x)'
          },
          {
            text: 'rad',
            value: 'rad(deg)'
          },
          {
            text: 'asin',
            value: 'asin(x)'
          },
          {
            text: 'acos',
            value: 'acos(x)'
          },
          {
            text: 'atan',
            value: 'atan(x)'
          },
          {
            text: 'deg',
            value: 'deg(rad)'
          },
          {
            text: 'x<sup>e</sup>',
            value: 'x**e'
          },
          {
            text: '&radic;x',
            value: 'sqrt(x)'
          },
          {
            text: '//',
            value: '//'
          },
          {
            text: '%',
            value: '%'
          }
        ],

        basic: [
          {
            text: '*'
          },
          {
            text: '/'
          },
          {
            text: '+'
          },
          {
            text: '-'
          }
        ],

        controls: [
          {
            icon: 'equal',
            key: 13,
            method: async function() {
              const python_calcExp = await eel.calcExp((self as any).calcInput)

              python_calcExp().then( (resolved) => {

                resolved = JSON.parse(resolved)

                if(resolved.status === 'ok') {
                  (self as any).calcInput = resolved.details
                } else if(resolved.status === 'error') {
                  alert(resolved.details)
                }

              } )
            }
          },
          {
            icon: 'backspace-outline',
            method: function() {
              (self as any).calcInputChange('remove')
            }
          },
          {
            icon: 'tray-remove',
            key: 27,
            method: function() {
              (self as any).calcInput = ''
            }
          }
        ]

      },

      calcInput: ''

    }
  },

  mounted: function(): void {
    self = this

    interface controlsObject {
      key?: number,
      method: Function
    }

    // listen for enter and esc keydown
    this.buttons.controls.map((v: controlsObject, i: number): void => {
      if(v.key) {
        window.addEventListener('keydown', function(e): void {
          e.which == v.key && (self as any).calcInput.length > 0 ? v.method() : null
        })
      }
    })

    // keep input focused even on click away
    document.addEventListener('mousedown', e => {
      (e as any).target.localName != 'input' ? e.preventDefault() : null
    })
  },

  methods: {
    calcInputChange: function(mode: string, value = undefined):void {
      // number hasn't length prop so convert it to string
      mode === 'add' ? value ? value = String(value) : '' : null

      const $i = document.querySelector('input')
      const selStart: number = $i.selectionStart
      const selEnd: number = $i.selectionEnd

      let selOffset: number = 0
      let newValue: string = ''

      if(mode === 'add') {

        selOffset = value.length
        newValue = `${ $i.value.slice(0, selStart) }${ value }${ $i.value.slice(selEnd, $i.value.length) }`

      } else if(mode === 'remove') {

        selOffset = selStart !== 0 && selStart === selEnd ? -1 : selStart !== selEnd ? 0 : null
        newValue = `${ $i.value.slice(0, selStart + selOffset) }${ $i.value.slice(selEnd, $i.value.length) }`

      }

      this.calcInput = $i.value = newValue

      // set caret position after inserted value
      $i.selectionStart = $i.selectionEnd = selStart + selOffset
      $i.blur()
      $i.focus()
    }
  },

  template: `
    <div class="calc">

      <input
        type="text"
        autocomplete="off"
        spellcheck="false"
        placeholder="Type an expression"
        v-model.trim="calcInput"
      />

      <div class="calc-container" rows>

        <div class="calc-buttons-operators-advanced" row>
          <span
            v-for="operator in buttons.advanced"
            v-html="operator.text"
            @click="calcInputChange('add', operator.value)"
          ></span>
        </div>

        <div class="calc-buttons-operators-basic" row>
          <span
            v-for="operator in buttons.basic"
            v-html="operator.text"
            @click="calcInputChange('add', operator.text)"
          ></span>
        </div>

        <div class="calc-container-numbers-controls" cols>

          <div class="calc-buttons-numbers" row>

            <span
              v-for="n of 9"
              v-html="n"
              @click="calcInputChange('add', n)"
            ></span>

          </div>

          <div class="calc-buttons-controls" rows>

            <comp-icon
              v-for="control in buttons.controls"
              :key="'comp-icon_' + control.icon"
              :prop_icon="control.icon"
              prop_size="1-5"
              @click.native="calcInput.length > 0 ? control.method() : null"
            />

          </div>

        </div>

      </div>

    </div>
  `
})
