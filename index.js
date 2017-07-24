function instance(){
    var vm = new Vue({ el: "#app" });   // the same as
    vm.$mount("#app");      // setup vue obj, execute code, mount to elem after it is exist

    // target index.html, create template, render template
    // index.html <div id="app">
    // prime.vue <template>... <script> export default {...}
    // main.js import Vue; import Prime; new Vue({ el: "#app", render: (h)=> h(Prime) });
}
function lifeCycle() {
	// https://vuejs.org/v2/guide/instance.html#Lifecycle-Diagram
	...created(){}...	// synchronously after the instance is created
	...mounted(){}...	// after instance has been mounted, "el" is replaced by "vm.$el"
	...updated(){}...	// after data change causes the virtual DOM to re-rendered
	...activated(){}...	// when a kept-alive component is activated
	...beforeDestroy(){}...	// before instance (still functional) is destroyed
	...destroyed(){}...	// after a vue instance has been destroyed
}
function buildInDirective() {
	// directive "v-bind" can be used for binding any sort of attrs, class, id, src...
	// <div v-bind:attrName="vue.$data.propName">
	...data: { key: "value" }...	// <div v-bind:class="key"> => <div class="value">
}
function customDirective(){
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
function filter(){
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
		// <div id="app"> <counter></counter> </div>
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
		// <div id="app"> <custom></custom> </div>
	}
    {   // global component with external custom.vue source file
        /*<template><div>...</div></template>*/     // Custom.vue
        export default { }

        //use component <custom></custom>
        import Custom from "./Custom.vue";
        Vue.component("custom", Custom);
        new Vue({
            el: "app",
            render: h => h(App);
        });
    }
}
function slot() {
    {   // named slots
        /*  <template><div>
                <slot name="header"></slot>
                <div name="data" v-for="item in childData"> {{item}} </div>
            </div></template>  */
       export default { name: 'custom', props: ['childData'] }

       /* <template><div id="app">
            <custom v-bind:childData="values">
                <h4 slot="header"></h4>
            </custom>
        </div></template>  */
        import Custom from './components/Custom.vue';
        export default {
            name: "app",
            data: function () {
                return { values: ['Data', 'from', 'server'] };
            },
            components: { Custom }
        }
    }
    {   // scoped slots 
        /*  <template><div>
                <slot name="header"></slot>
                <ul>
                    <slot name="item" v-for="item in childProps" v-bind:text="item.text"></slot>
                </ul>
            </div></template>  */
        export default { name: "custom", props: ["childProps"] };

        /*  <template><div>
                <custom v-bind:childProps="parentData">
                    <h4 slot="header">Component Header</h4>
                    <template slot="item" scope="props">
                        <li>{{ props.text }}</li>
                    </template>
                </custom>
            </div></template> */
            import Custom from './components/Custom.vue';
            export default {
                name: 'app',
                data: function () {
                    return { parentData: [{text: 'a'}, {text: 'b'}, {text: 'c'}] };
                },
                components: { Custom }
            }
    }
}
function passData() {
	{	// pass data down to local inline template component 
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
		// <counter v-bind:add-num="5"></counter>
	}
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
function computedProp() {
	{	// simple computed property
		let app = new Vue({
			el: "#app",
			data: {
				text: ""
			},
			computed: {
				upper() { return this.text.toUpperCase(); }
			}
		});
		// <input v-model="vue.$data.prop"><p>{{vue.$computed.prop}}</p>
	}
}
function watchProp(){
    // <input v-model="question"> <p> {{ answer }} </p>
    export default {
        data: function () {
            return {
                question: '',
                answer: 'I cannot give you an answer until you ask a question!',
                obj: {
                    key: "",
                    name: ""
                }
            };
        },
        watch: {
            question: function () {
                this.answer = 'Waiting until you stop typing...';
                this.getAnswer();
            },
            "obj.key": function() { /* logic here*/ }
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
function targetHtmlEl() {
    // <div ref="yourName"></div>
    // target html elem, not reactive, will not be added to the vue template
    // will be lost after new render
    this.$refs.yourName
}
function listRendering() {
	// always provide "key" attr with v-for directive for in-place patch strategy
	{	// list rendering with "remove" method by item index
		// <ul v-for="(item,index) in vue.$data.itemsArr" key="index">
		// <button v-on:click="vue.$methods.remove(index)">
		...methods: remove(index) { this.itemsArr.splice(index,1) }
		}
	}
}
function formHandling(){
    // <input v-bind:value="something" v-on:input="something = $event.target.value">
    
    /*  <select v-model="selected">
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
function conditionalRendering(){
    /*  <template v-if="loginType === 'username'">
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
function classBinding() {
    // <div class="static" v-bind:class="classObject"></div>
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
function event(){
    {   // event modifiers
        // <a v-on:click.stop.prevent="doThat"></a>
        // <input v-on:keyup.13="submit">
        // <button v-on:click="send('+', $event)"></button>     // access the original DOM event
    }
    {   // parent-child communication
        // v-on must be used to listen to events emitted by children
        // <template v-on:eventNameFromChild="parentMethodName"></template>
        methods: {
            childMethodName: function () {
                this.$emit('eventNameFromChild');
                this.$emit('eventNameFromChild', data);
            }
        }

    }
    {   // non parent-child communication
        export const bus = new Vue();

        import { bus } from './main';   // emittter
        bus.$emit('event-name', data);

        import { bus } from './main';   // listener
        export default {
            name: 'app',
            created: function() {
               bus.$on('event-name', function (data) { /* logic */ });
            }
        }
    }
}
function router() {
    // main app.js config file
    import Vue, VueRouter, App, Foo, Bar, Baz;   // import vue templates
    Vue.use(VueRouter);
    const routes = [                    // define routes
        { path: "/", name: "index", components: { foo: Foo, bar: Bar } },
        { path: "/contacts", name: "contacts", component: Baz }
    ];
    const router = new VueRouter({mode: "history", routes}); // create router instance and pass routes option
    new Vue({ router });    // create and mount the root instance, inject router with router option
    // main app.vue template file
    /*
        <router-link to="/">home</router-link>
        <router-link to="/contacts">contacts</router-link>

        <router-view name="foo"></router-view>
        <router-view name="bar"></router-view>
        <router-view></router-view>
    */

    // dynamic route matching
    const routes = [ { path: "/user/:name/post/:id", component: User } ];   // main app.js config file
    /*<router-link to="/user/sergey/post/123">User</router-link>*/      // main app.vue component
    data(){ return { user_name: this.$route.params.name, post_id: this.$route.params.id }; } // custom.vue component

    // programmatic navigation, access to router instance as $router
    this.$router.push(location, onComplete?, onAbort?); // navigate to new URL, pushe new entry into history stack
    router.push("home");    // literal string path
    router.push({ path: "home" });  // object
    router.push({ name: "user", params: { userId: 123 }});  // named route
    this.$router.replace(location, onComplete?, onAbort?); // navigates without pushing a new history entry
    this.$router.go(n); // indicates by how many steps to go forwards or go backwards in the history stack

    // named routes
    routes: [ { path: "/user/:userId", name: "user", component: User } ];
    /*<router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>*/
    this.$router.push({ name: "user", params: { userId: 123 }});

    // named views, several components in one view
    routes: [ { path: '/', components: { default: Foo, a: Bar } } ];    // main app.js config file
    /*<router-view class="default"></router-view> <router-view class="named" name="a"></router-view>*/

    // redirect
    routes: [ { path: "/a", redirect: "/b" } ];
    routes: [ { path: "/a", redirect: { name: "foo" } } ];  // targeting named route
    routes: [ { path: "/a", redirect: to => {// func receive target route as arg, return redirect path } } ];
}
function mixin() {
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




function components(){
    ???
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
