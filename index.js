function instance(){
    // <div ref="yourName"></div>
    // target html elem, not reactive, will not be added to the vue template
    // and will be lost after new render
    this.$refs.yourName

    var vm = new Vue({ el: "#app" });   // the same as
    vm.$mount("#app");      // setup vue obj, execute code, mount to elem after it is exist
}
function bind() {
	// directive "v-bind" can be used for binding any sort of attrs, class, id, src...
	// <div v-bind:attrName="vue.$data.propName">
	...data: { key: "value" }...	// <div v-bind:class="key"> => <div class="value">
}
function component() {
	{	// local component with inline template
		let counter = Vue.component("counter", {
			template: `
			<div>
				<div>Count: {{this.count}}</div>
				<button v-on:click='increment'>increment</button>
			</div>
			`,
			data() {
				return { count: 0 };
			},
			methods: {
				increment() { this.count += 1; }
			}
		});
		let app = new Vue({
			el: "#app",
			components: { counter }
		});
		// usecase: <div id="app"> <counter></counter> </div>
	}
	{	// global component with inline template
	    Vue.component('custom', {
	        template: '<button v-on:click="addOne"> {{ counter }} </button>',
	        data: function () {
	            return {
	                counter: 0
	            }
	        },
	        methods: {
	            addOne: function () {
	                ++this.counter;
	            }
	        }
	    });
	    let app = new Vue({
			el: "#app"
		});
		// usecase: <div id="app"> <custom></custom> </div>
	}
}
function passDataToComponent() {
	{	// pass data down to local component with inline template
		let counter = Vue.component("counter", {
			template: `
			<div>
				<div>Count: {{this.count}}</div>
				<button v-on:click='increment'>increment</button>
			</div>
			`,
			props: {
				addNum: {
					type: Number,
					default: 1
				}
			},
			data() {
				return { count: 0 };
			},
			methods: {
				increment() { this.count += this.addNum; }
			}
		});
		let app = new Vue({
			el: "#app",
			components: { counter }
		});
		// usecase: <counter v-bind:add-num="5"></counter>
	}
}








function directives(){
    // register global directive
    // <div v-demo:argName.myModifName="{ text: 'hello' }"></div>
    Vue.directive("demo", {     
        bind(el, binding, vnode) {
            // after directive is attached
            // "el" = element the directive is bound to
            // "binding" contain data from passed value, "binding.value.text"
            // "binding.arg" contain passed "argName" value
            // "vnode" = node in a virtual dom
            if (binding.arg === "argName") {}
            if (binding.modifiers["myModifName"]) {}
        },
        inserted(el, binding, vnode) {
            // after inserted in paret node
        },
        update(el, binding, vnode, oldVnode) {
            // after components updates without children components
        },
        componentUpdated(el, binding, vnode, oldVnode) {
            // after components updates with children components
        }
    });

    // register local directive
    export default {
        directives: {
            'demo': {
                bind(el, binding, vnode) {
                    // logic here
                }
            }
        }
    };
}
function filters(){
    // transform data representation, not data itself
    Vue.filter('capitalize', function(value){
        // global filter registration
    });

    export default {
        filters: {      // local filter registration
            capitalize: function (value) {
                if (!value) return '';
                value = value.toString();
                return value.charAt(0).toUpperCase() + value.slice(1);
            }
        }
    }
    // {{ value | capitalize }}         // use case inside vue template
}
function propValidation(){
    export default {
        props: {
            propOne: String,
            propTwo: [String, Array],
            propThree: {
                type: String,
                required: true
            },
            propFour: {
                type: Object,
                default: function() {
                    return {
                        key: 'value'
                    };
                }
            }
        }
    }
}
function computedProps(){
    var vm = new Vue({
        el: '#example',
        data: {         // not cached properties
            message: 'Hello'
        },
        computed: {         // cached properties, will not reevaluate untile 'message' prop change
            reversedMessage: function () {      // computed getter
                return this.message.toUpperCase;        // 'this' points to the vm instance
            }
        }
    });
}
function classBinding(){
    // <div class="static" v-bind:class="classObject"></div>
    // <div class="static active text-danger"></div>
    export default {
        data: function () {
            return {
                isActive: true,
                error: true
            };
        },
        computed: {
            classObject: function () {
                return {
                    active: this.isActive && !this.error,
                    'text-danger': this.error && this.error.type === 'fatal',
                }
            }
        }
    }

    // <div v-bind:class="[activeClass, errorClass]">
    export default {
        data: function () {
            return {
                activeClass: 'active',
                errorClass: 'text-danger'
            };
        }
    }
}
function watchedPropsWithAsyncCall(){
    // <input v-model="question"> <p> {{ answer }} </p>
    export default {
        data: function () {
            return {
                question: '',
                answer: 'I cannot give you an answer until you ask a question!',
                city: {
                    name: "",
                    id: ""
                }
            };
        },
        watch: {
            question: function () {
                this.answer = 'Waiting until you stop typing...';
                this.getAnswer();
            },
            'city.name': function() {}
        },
        methods: {
            getAnswer: _.debounce(function () {         // https://lodash.com/docs#debounce
                if (this.question.indexOf('?') === -1) {
                    this.answer = 'Question should contain a question mark';
                    return;
                }
                this.answer = '...thinking...';
                let vm = this;
                axios.get('https://yesno.wtf/api')      // https://www.npmjs.com/package/axios
                    .then(function (response) {
                        vm.answer = response.data.answer;
                    })
                    .catch(function (error) {
                        // error logic
                    });
            }, 1000)
        }
    }
}
function conditionals(){
    /* <template v-if="loginType === 'username'">
        <label>Username</label>
        <input placeholder="Enter your username">
    </template>
    <template v-else>
        <label>Email</label>
        <input placeholder="Enter your email address">
    </template> */
    export default {
        data: function () {
            return {
                loginType: 'username'
            };
        }
    }
}
function listRendering(){
    // <div v-for="item of items"></div>            // iterate over array
    // <div v-for="item in items"></div>            // the same as above

    // <li v-for="value in object"></li>            // iterate over object values
    // <div v-for="(value, key) in object"></div>   // iterate over object key and value
    export default {
        data: function () {
            return {
                items: ['John', 'Doe', 30],
                object: {
                  firstName: 'John',
                  lastName: 'Doe',
                  age: 30
                }
            };
        }
    }

    // push, pop, shift, unshift, splice, sort, reverse.    mutation methods
    // filter, concat, slice.           // not mutation methods, return a new array

    // <li v-for="n in even">{{ n }}</li>
    export default {
        data: function () {
            return {
                numbers: [1,2,3,4,5,6,7,8,9,10]
            };
        },
        computed: {
            even: function () {
                return this.numbers.filter(function (number) {
                    return number % 2 === 0;
                });
            }
        }
    }
}
function events(){
    // <a v-on:click.stop.prevent="doThat"></a>     // event modifiers .capture .self .once
    // <input v-on:keyup.13="submit">       // only call vm.submit() when the keyCode is 13
    // <button v-on:click="send('+', $event)"></button>     // access the original DOM event
    export default {
        data: function () {
            return {
                name: ''
            };
        },
        methods: {
            send: function (obj, event) {
                this.name = obj;
                console.log(this.name + ' ' + event.type);
            }
        }
    }

    // parent-child communication
    // v-on must be used to listen to events emitted by children
    // <div> Total is {{total}} </div>
    // <button-counter v-on:eventNameFromChild="parentMethodName"></button-counter>
    // <button-counter v-on:eventNameFromChild="total = $event"></button-counter>
    Vue.component('button-counter', {
        data: function () {
            return {
                counter: 0
            };
        },
        template: '<button v-on:click="childMethodName"> {{counter}} </button>',
        methods: {
            childMethodName: function () {
                ++this.counter;
                this.$emit('eventNameFromChild');
                this.$emit('eventNameFromChild', data);
            }
        }
    });

    export default {
        name: 'app',
        data: function () {
            return {
                total: 0
            };
        },
        methods: {
            parentMethodName: function () {
                ++this.total;
            }
        }
    }

    // non parent-child communication
    export const bus = new Vue();

    import { bus } from './main';   // emittter
    bus.$emit('id-selected', data);

    import { bus } from './main';   // listener
    export default {
        name: 'app',
        created: function() {
            bus.$on('id-selected', function (data) { /* logic */ });
        }
    }
}
function forms(){
    // <input v-bind:value="something" v-on:input="something = $event.target.value">
    // <input v-model.lazy="something">          // the same as above with modifier
    
    /*<select v-model="selected">
        <option v-for="option in options" v-bind:value="option.value">
            {{ option.text }}
        </option>
    </select>
    <span>Selected: {{ selected }}</span>*/
    
    export default {
        data: function () {
            return {
                selected: 'A',
                options: [
                    { text: 'One', value: 'A' },
                    { text: 'Two', value: 'B' },
                    { text: 'Three', value: 'C' }
                ]
            };
        }
    }
}
function components(){
    // global component with inline template
    Vue.component('custom', {
        template: '<button v-on:click="addOne"> {{ counter }} </button>',
        data: function () {
            return {
                counter: 0
            }
        },
        methods: {
            addOne: function () {
                ++this.counter;
            }
        }
    });

    // local component with inline template
    var cmp = {
        template: '<button v-on:click="addOne"> {{ counter }} </button>',
        data: function () {
            return {
                counter: 0
            }
        },
        methods: {
            addOne: function () {
                ++this.counter;
            }
        }
    };
    export default {
        name: 'app',
        components: {
            custom: cmp
        }
    }

    // global component from external .vue source file
    // <template><div>...</div></template>
    export default {
        data: function () { return { 'data' }; }
    }
    //use component <template><custom>...</custom></template>
    import Custom from './Custom.vue';
    Vue.component('custom', Custom);
    new Vue({
        el: 'app',
        render: h => h(App);
    });

    // v-bind dynamically bind child props to parent data
    // <input v-model="parent"><child v-bind:childProp="parent"></child>
    Vue.component('child', {
        template: '<p> Data from parent: {{ finalVal }} </p>',
        props: ['childProp'],
        computed: {
            finalVal: function () {
                return this.childProp.toUpperCase();
            }
        }
    });
    export default {
        name: 'app',
        data: function () { return { parent: '' }; }
    }

    // DYNAMIC COMPONENT, will be destoyed each time a new one is called
    /*<template> <div><h4>Component one</h4></div> </template>*/
    export default { activated(){}, deactivated(){} }

    /*<template> <div><h4>Component two</h4></div> </template>*/
    export default { activated(){}, deactivated(){} }

    /*<template>
      <div>
        <button v-on:click="selectedComp = 'comp-one'">First</button>
        <button v-on:click="selectedComp = 'comp-two'">Second</button>
        <keep-alive><component v-bind:is="selectedComp"></component></keep-alive>
      </div>
    </template>*/
    import ComponentOne from './components/ComponentOne.vue';
    import ComponentTwo from './components/ComponentTwo.vue';
    export default {
        name: 'app',
        data: function () {
            return { selectedComp: 'comp-one' };
        },
        components: { compOne: ComponentOne, compTwo: ComponentTwo }
    }
}
function slots(){
    // NAMED SLOTS INLINE TEMPLATE
    /*<app-layout>
        <h4 slot="header">I am a slot header</h4>
        <div slot="main">A paragraph for the main content</div>
        <div slot="footer">Here's some contact info</div>
    </app-layout>*/
    Vue.component('app-layout', {
        template: '<div>' +
        '<header> <slot name="header"></slot> </header>' +
        '<main> <slot name="main"></slot> </main>' +
        '<footer> <slot name="footer"></slot> </footer>' +
        '</div>'
    });

    // NAMED SLOTS IMPORT TEMPLATE
    /* <template>
        <div id="custom">
            <slot name="header"></slot>
            <slot name="main"></slot>
            <div name="data" v-for="item in childData"> {{item}} </div>
        </div>
    </template>*/
    export default { name: 'custom', props: ['childData'] }

    /*<template>
        <div id="app">
            <custom v-bind:childData="values">
                <h4 slot="header">Component Header</h4>
                <main slot="main">Component Body</main>
            </custom>
        </div>
    </template>*/
    import Custom from './components/Custom.vue';
    export default {
        name: 'app',
        data: function () {
            return { values: ['Data', 'from', 'server'] };
        },
        components: { Custom }
    }

    // SCOPED SLOTS IMPORT TEMPLATE
    /*<template>
        <div id="custom">
            <slot name="header"></slot>
            <ul>
                <slot name="item" v-for="item in childProps" v-bind:text="item.text"></slot>
            </ul>
        </div>
    </template>*/
    import Vue from 'vue';
    export default { name: 'custom', props: ['childProps'] };

    /*<template>
        <div id="app">
            <custom v-bind:childProps="parentData">
                <h4 slot="header">Component Header</h4>
                <template slot="item" scope="props">
                    <li>{{ props.text }}</li>
                </template>
            </custom>
        </div>
    </template>*/
    import Custom from './components/Custom.vue';
    export default {
        name: 'app',
        data: function () {
            return { parentData: [{text: 'a'}, {text: 'b'}, {text: 'c'}] };
        },
        components: { Custom }
    }

    /*
        <template class="SlotTemplate">
            <div class="container-fluid">
                <slot name="headerFirst"></slot>
                <slot name="headerSecond"></slot>
            </div>
        </template>

        <template class="ContentHeader">
          <div class="container-fluid">
            <h4>This is the first part of the header</h4>
            <div>This is the second part of the header</div>
          </div>
        </template>

        <template class="App">
          <div id="app">
            <slot-template><content-header slot="headerFirst"></content-header></slot-template>
          </div>
        </template> */

          import SlotTemplate from './components/SlotTemplate.vue';
          import ContentHeader from './components/ContentHeader.vue';

          export default {
            name: 'app',
            components: {
              SlotTemplate,
              ContentHeader
            }
          }
}
function mixins(){
    // compose reusable functionality for vue components
    // mixin load first, component data second with ability to override mixin
    export const myMixin = {
        created: function () {
            this.hello();
        },
        methods: {
            hello: function () {
                // logic here
            }
        }
    };
    // new component will have 'hello()' method that fires after it is created
    import { myMixin } from './myMixin';
    export default {
        name: 'app',
        mixins: [myMixin]
    }

    // global mixin registration, will be added to all instances
    Vue.mixin({
        created() {
            // logic here
        }
    });
}
function plugins(){
    // plugin index.js
    export default {
        install(Vue) {
            Vue.popup = Vue.prototype.$popup = new Vue();
        }

        // main.js plugin global registration
        import Popup from './plugins/popup';
        Vue.use(Popup);
    };
}
function vuex(){
    // vuex.js config file
    import Vue from 'vue';
    import Vuex from 'vuex';
    Vue.use(Vuex);
    export default new Vuex.Store({
        state: {
            count: 0,
            todos: [
                { id: 1, text: 'text one', done: true},
                { id: 2, text: 'text two', done: false}
            ]
        },
        getters: {
            doneTodos: function(state) {
                return state.todos.filter(function (todo) {
                    return todo.done;
                });
            }
        },
        mutations: {
            increment(state, payload) {
                state.count += payload.amount;
            },
            decrement(state, payload) {
                state.count -= payload.amount;
            }
        },       // must be synchronous
        actions: {
            incrementAsync(context) {
              setTimeout(function () {
                context.commit('increment', { amount: 5 })
              }, 2000);
            }
        }       // can perform async actions, communicate only with mutations
    });

    // main.js app config file
    import store from './vuex';
    new Vue({
        el: '#app',
        store,
        template: '<app></app>',
        components: { App }
    });

    // app.vue component file
    /*<template>
        <div id="app">
            <button v-on:click="increment">+</button>
            <button v-on:click="decrement">-</button>
            <button v-on:click="incrementAsync">-</button>
            <div v-for="item in doneTodos"> {{item}} </div>
        </div>
    </template>*/
    export default {
        computed: {
            count: function () {
                return this.$store.state.count;
            },
            doneTodos: function () {
                return this.$store.getters.doneTodos;
            }
        },
        methods: {
            increment(){
                this.$store.commit('increment', {
                    amount: 5
                });
            },
            decrement(){
                this.$store.commit('decrement', {
                    amount: 5
                });
            },
            incrementAsync() {
                this.$store.dispatch('incrementAsync');
            }
        }
    }

    // MODULES
    // partOne.js module config file 
    const state = { /* regular state object */ }
    const getters = { /* regular getter object */ }
    const mutations = { /* regular mutation object */ }
    const actions = { /* regular action object */ }
    export default {
        state,
        getters,
        mutations,
        actions
    }

    // main.js app config file
    import partOne from './partOne.js';
    new Vue({
        el: '#app',
        modules {
            partOne
        },
        template: '<app></app>',
        components: { App }
    });
}
function router(){
	this.$route;		// object contain all current information

	// index.js router config file
    import Router from 'vue-router';
    Vue.use(Router);
    const routes = [
	    {
	        path: '/',
	        name: 'index',
	        components: {
	            indexBlock: Index,
	            footerBlock: Footer
	        }
	    },
	    {
	        path: '/login',
	        name: 'login',
	        component: Login
	    }
	];
	export default new Router({
	    mode: 'history',
	    base: '/',
	    routes
	});

	// vue component file
	/*<div id="app">
		<router-view name="indexBlock"></router-view>
		<router-view name="footerBlock"></router-view>
		<router-view></router-view>
		<router-link v-bind:to="{ name: 'login' }">Login</router-link>
		<router-link to="/">Home</router-link>
        <button v-on:click="goHome">Home</button>
	</div>*/
	export default {
        methods: {
            goHome() {
                this.$router.push('/');
                this.$router.go(-1);
            }
        }
    }
}
