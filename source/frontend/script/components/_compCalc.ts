const compCalc = Vue.component('comp-calc', {
  data: function() {
    return {

      operators: [
        'x^e', '&radic;(x)', '//', '%',
        '*', '/', '+', '-'
      ],

      controls: {
        back: () => {
          console.warn('back')
        },
        clear: () => {
          console.warn('clear')
        },
        calc: () => {
          console.warn('calc')
        }
      },

      calcValue: ''

    }
  },

  template: `
    <div class="main" jc="c" ai="c">
      <div class="calc">

        <input
          type="text"
          autocomplete="off"
          spellcheck="false"
          v-model="calcValue"
        />

        <div class="calc-buttons" rows>

          <div class="calc-buttons-operators" row>
            <span
              class="calc-button-operator"
              v-for="o in operators"
              v-html="o"
              @click="calcValue += o"
            ></span>
          </div>

          <div class="calc-container-numbers-controls" cols>

            <div class="calc-buttons-numbers" row>
              <span
                class="calc-button-number"
                v-for="n of 9"
                v-html="n"
                @click="calcValue += n"
              ></span>
            </div>

            <div class="calc-buttons-controls" rows>
              <span
                class="calc-button-control"
                v-for="v, k of controls"
                v-html="k"
                @click="v()"
              ></span>
            </div>

          </div>

        </div>

      </div>
    </div>
  `
})
