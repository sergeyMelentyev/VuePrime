function expression() {
    // single JavaScript expression
    {{ number + 1 }}
    {{ ok ? 'YES' : 'NO' }}
    {{ message.split('').reverse().join('') }}
    {{ methodName() }}
    }
function instance() {
    var vm = new Vue({ el: "#app" })   // the same as
    vm.$mount("#app")      // setup vue obj, execute code, mount to elem after it is exist

    // target index.html, create template, render template
    // index.html <div id="app">
    // prime.vue <template>... <script> export default {...}
    // main.js import Vue import Prime new Vue({ el: "#app", render: (h)=> h(Prime) })
    }
function lifeCycle() {
	// https://vuejs.org/v2/guide/instance.html#Lifecycle-Diagram
    beforeCreate(){}  // after instance initialized, before data observation, event/watcher
	created(){}	// after the instance is created
	beforeMount(){} // called right before the mounting begins
    mounted(){}	// after instance has been mounted, "el" is replaced by "vm.$el"
	beforeUpdate(){}   // data changes, before the virtual DOM is re-rendered and patched
    updated(){}	// after data change causes the virtual DOM to re-rendered
	activated(){}	// when a kept-alive component is activated
	beforeDestroy(){}	// before instance (still functional) is destroyed
	destroyed(){}	// after a vue instance has been destroyed
    }

function buildInDirective() {
	// directive "v-bind" can be used for binding any sort of attrs, class, id, src...
    // expected to be a single JavaScript expression
    <div v-bind:id="'list-' + vue.$data.id">
    <div v-bind:classAttr="vue.$computed.className">

    // arguments
    <a v-bind:href="url">

    // modifiers
    <form v-on:submit.prevent="onSubmit">
    }
function customDirective() {
    // register global directive
    // "el" element the directive is bound to
    // "binding" contain data from passed value, "binding.value.text"
    // "binding.arg" contain passed "argName" value
    // "vnode" = node in a virtual dom
    <div v-demo:argName.myModifName="{ text: 'hello' }"><div>
    <div v-demo="{ color: 'white', text: 'hello!' }"><div>  // pass multiple vals

    Vue.directive("demo", {     
        bind(el, binding, vnode) {
            // called once after directive is attached
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
        },
        unbind: function () {
            // 
        }
    })

    // register local directive
    export default {
        directives: {
            'demo': {
                bind(el, binding, vnode) {
                    // logic here
                }
            }
        }
    }
    }
function filter() {
    // via method call
    <li v-for="story in storiesBy('Sergey')">
    methods:
        storiesBy(writer) { return this.stories.filter(story => story.writer === writer) }

    // via computed props
    computed:
        famous() { return this.stories.filter(item => item.upvotes > 25) }

    // via global registration
    Vue.filter("capitalize", function(value){...})  // {{ value | capitalize }}
    filters:
        capitalize(val) { return value.charAt(0).toUpperCase() + value.slice(1) }
    }
function order() {
    // via computed props
    <li v-for="story in orderedStories">
    <button @click="order *= -1">       // toggle order

    data: { stories: [...], order : -1 }
    computed:
        orderedStories() {
            var order = this.order
            return this.stories.sort((a, b) => (a.upvotes - b.upvotes) * order)
        }
    }

function component() {
	// dynamic

    // static
    <template>
        <div v-once>...<div>    // contains a lot of static content, evaluated once and cached
    <template>
    }
function slot() {
    // single slot, parent content will be discarded if child template contains no <slot>
    <template id="child">
        <h1> title <h1>
        <slot> fallback content <slot>
    <template>

    <template id="parent">
        <child> <p> data <p> <p> data <p> <child>
    <template>


    // named slot can have unnamed (default) slot serves as a catch-all unmatched content
    <template id="child">
        <header> <slot name="header"> <header>
        <main> <slot name="main"> <main>
        <footer> <slot> fallback content <slot> <footer>
    <template>

    <template id="parent">
        <child>
            <h1 slot="header"> title <h1>
            <div slot="main"> main content <div>
            <footer> footer content <footer>
        <child>
    <template>

    // scoped slot, pass data into a slot
    <template id="child">
        <ul>
            <slot name="item" v-for="item in items" v-bind:text="item.text"><slot>
        <ul>
    <template>

    <template id="parent">
        <child v-bind:items="items">
            <li slot="item" slot-scope="props"> {{ props.text }} <li>
        <child>
    <template>
    }
function passData() {
    // pass data down to child component
    <parent childPropName="parentPropName">             // binding normal attr to an expression
    <parent v-bind:childPropName="parentPropName">      // dynamic binding, if data in parent updated it will flow down to child
    <parent v-bind="{childPropOne: vm.$data.papam, childPropTwo: vm.$data.papams}">

    // pass data up from child to parent
    <parent v-on:eventNameFromChild="parentMethodName">
    vm.child.methods: { childMethodName() { this.$emit("eventNameFromChild"); this.$emit("eventNameFromChild", data) } }

    // pass data from non parent-child components
    export const bus = new Vue()

    import { bus } from "./main"        // emittter
    bus.$emit("event-name", data)

    import { bus } from "./main"        // listener
    created() { bus.$on("event-name", function (data) { ... }) }
    }
function propValidation() {
	props: {
        age: {
          type: Number,
          default: 0,
          required: true,
          validator: function (value) {
            return value >= 0
          }
        }
      }
    }

function computedProp() {
	{	// computed and reactive getter func with no side effect, cached based on dependencies
        // will re-evaluate when dependencies changed, multiple access to vm.upper will return previous result (if vm.text is the same)
        // vm.upper depends on vm.text, any bindings that depend on vm.upper will be updated when vm.text changes
		let app = new Vue({
			el: "#app",
			data: { text: "" },
			computed: { upper() { return this.text.toUpperCase() } }
		})
	}
    {   // computed setter func
        data: {
            firstName: "Name",
            lastName: "Last"
        },
        computed: {
          fullName: {
            get: function () {
              return this.firstName + ' ' + this.lastName
            },
            set: function (newValue) {
              var names = newValue.split(' ')
              this.firstName = names[0]
              this.lastName = names[names.length - 1]
            }
          }
        }
    }
    }
function watchProp() {
    // <input v-model="question"> <p> {{ answer }} </p>
    {
        data: function () {
            return {
                question: '',
                answer: 'I cannot give you an answer until you ask a question!',
                obj: {
                    key: "",
                    name: ""
                }
            }
        },
        watch: {
            question: function () {
                this.answer = 'Waiting until you stop typing...'
                this.getAnswer()
            },
            "obj.key": function() { /* logic here*/ }
        },
        methods: {
            getAnswer: _.debounce(function () {         // https://lodash.com/docs#debounce
                if (this.question.indexOf('?') === -1) {
                    this.answer = 'Question should contain a question mark'
                    return
                }
                this.answer = '...thinking...'
                let vm = this
                axios.get("https://yesno.wtf/api")      // https://www.npmjs.com/package/axios
                    .then(function (response) { vm.answer = response.data.answer })
            }, 1000)
        }
    }
    {   // deep watcher
         data: {
            a: 1
          },
          watch: {
            c: {
              handler: function (val, oldVal) { },
              deep: true
            }
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
	// array rendering, always provide unique "key" attr for in-place patch strategy (track each node’s identity)
	<li v-for="(item,i) in vue.$data.itemsArr" key="i"><button v-on:click="vm.remove(i)">
    methods: { remove(index) { this.itemsArr.splice(index,1) }

    // inside v-for block we have full access to parent scope props
    <li v-for="(item, index) in items"> {{ parentMessage }} - {{ index }} - {{ item.message }}
    data: {
        parentMessage: "Parent",
        items: [ { message: "Foo" }, { message: "Bar" } ]
    }

    // object rendering
    <li v-for="value in object"> {{ value }}
    <li v-for="(value, key) in object"> {{ key }}: {{ value }}
    <div v-for="(value, key, index) in object"> {{ index }}. {{ key }}: {{ value }}
    data: {
        object: { firstName: 'John', age: 30 }
    }

    // array mutation methods, with side effect
    push(), pop(), shift(), unshift(), splice(), sort(), reverse()  // will also trigger view updates

    // array non-mutating methods, with-out side effect, always return new array
    filter(), concat(), slice()

    // object change detection, assign number of new props to an existing obj, saving reactivity
    data: {
        userProfile: { name: "Name" }
    }
    this.userProfile = Object.assign({}, this.userProfile, {
        age: 27, favoriteColor: "Green" }
    )

    // filtered/sorted results
    <li v-for="n in evenNumbers">{{ n }}    // vm.evenNumbers is a computed property
    <li v-for="n in even(numbers)">{{ n }}  // vm.even() is a method that take vm.numbers array as an arg

    // v-for on a <template> to render a block of multiple elems
    <template v-for="item in items">
        <li>{{ item.msg }}
        <li classAttr="divider">
    <template>

    // rendering with condition
    <li v-for="todo in todos" v-if="!todo.isComplete"> {{ todo }} <li>
    }
function formHandling() {
    <select v-model="selected">                                                         // syntactic sugar
    <input v-bind:value="something" v-on:input="something = $event.target.value">       // the same as above
    <custom-input v-bind:value="something" v-on:input="value => { something = value }"> // used with component
    
    <option v-for="option in options" v-bind:value="option.value">{{ option.text }}
    data() {
        return {
            something: '',
            options: [ { text: 'One', value: 'A' }, { text: 'Two', value: 'B' } ]
        }
    }
    }
function conditionalRendering() {
    // controll reusable elems with key="unique-key"
    <template v-if="loginType === 'username'">
        <label>Username</label>
        <input placeholder="Enter your username">
    </template>
    <template v-else-if="loginType === 'username'">
        <label>Username</label>
        <input placeholder="Enter your username">
    </template>
    <template v-else>
        <label>Email</label>
        <input placeholder="Enter your email address">
    </template>
    }
function classBinding() {
    // pass an obj to dynamically toggle class, determined by truthiness of data prop
    <div v-bind:classAttr="{ className: vm.isActive, anotherClassName: vm.error }">

    // pass a computed bound obj
    <div v-bind:classAttr="classObject">
    data() {
        return { isActive: true, error: true, classObject: { active: true, danger: false} }
    },
    computed: {
        classObject() {
            return { active: this.isActive && !this.error, danger: this.error && this.error.type === "fatal" }
        }
    }

    // array syntax
    <div v-bind:classAttr="[activeClass, errorClass]">
    data: function () {
        return { activeClass: "active", errorClass: "danger" }
    }
    // toggle classes
    <div v-bind:classAttr="[isActive ? activeClass : '', errorClass]">
    <div v-for="route in routes" v-bind:classAttr="[{active : route.name === $data.activeTab}, 'class-name__' + route.style]">

    // binding inline styles
    <div v-bind:style="[baseStyles, overridingStyles]">
    <div v-bind:style="[ product.offer ? {'justify-content': 'flex-start'}: {}]">

    // binding style obj, can be used with computed prop that return an obj
    <div v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }">
    data: { activeColor: "red", fontSize: 30 }
    <div v-bind:style="styleObject">
    data: { styleObject: { color: "red", fontSize: "13px" } }
    }

function event() {
    // use method name, DOM event will be passed automaticaly
    <button v-on:click="greet">
    methods: { greet(event) { if (event) alert(event.target.tagName) } }    // access the original DOM event

    // use method call
    <button v-on:click="greet('name', $event)">  

    // event modifiers .stop .prevent .capture .self .once
    <a v-on:click.stop.prevent="doThat">
    <input v-on:keyup.13="submit">

    // native event
    <component v-on:click.native="doTheThing">
    }

function router() {
    {   // router construction options
        $router    // router instance
        $route     // current active route
        const RouteConfig = {
            path: "string",
            component?: VueComponent,
            name?: "string",
            components?: {"nameOne": ComponentOne, "nameTwo": ComponentTwo},
            redirect?: [{path: "/a", redirect: "/b"}],
            redirect?: [{path: "/a", redirect: { name: "foo"}}],
            redirect?: [{path: "/a", redirect: to => { /* func receive target route as arg, return redirect path */ }}],
            props?: boolean | string | Function,
            alias?: string | Array<string>,
            children?: [        // rendered inside "VueComponent" <router-view>
                { path: "profile", component: UserProfile },    // when /vuecomponent/:id/profile is matched
                { path: "posts", component: UserPosts }     // when /vuecomponent/:id/posts is matched
            ],
            beforeEnter?: (to: Route, from: Route, next: Function) => void 0,
            meta?: any,
            caseSensitive?: boolean,        // use case sensitive match (default: false)
            pathToRegexpOptions?: Object    // path-to-regexp options for compiling regex
        }
    }
    {   // route object
        // state of current active route, contains parsed info of current URL and route records matched by URL
        this.$route    // get route object inside component
        router.match(location) // return value will be route object

        // properties
        $route.path // "string" that equals path of current route, always resolved as an absolute path "/foo/bar"
        $route.params  // obj contains key/value pairs of dynamic segments and star segments
        $route.query   // obj contains key/value pairs of query string, "/foo?user=1" => "$route.query.user == 1"
        $route.fullPath    // full resolved URL including query and hash
        $route.matched // array containing route records for all nested path segments of the current route
        $route.name    // name of the current route
    }
    {   // router-link
        // component for enabling user navigation
        <router-link v-on:click.native="activeNavTab = route.name">
        <router-link to="home">     // value of the "to=" prop will be passed to router.push() internally
        <router-link v-bind:to="'home'">
        <router-link :to="{ path: 'home' }">
        <router-link :to="{ name: 'user', params: { userId: 123 }}">
        <router-link :to="{ path: 'register', query: { plan: 'private' }}"> // will result in "/register?plan=private"

        <router-link :to="{ path: '/abc'}" replace>

        <router-link :to="{ path: 'relative/path'}" append>     // appends the relative path to the current path

        <router-link to="/foo" tag="li">foo         // render <router-link> as another tag => "<li>foo</li>"
    }
    {   // router-view
        // functional component that renders the matched component for the given path
        // 
    }
    {   // general use
        // main app.js config file
        import Vue, VueRouter, App, Foo, Bar, Baz   // import vue templates
        Vue.use(VueRouter)
        const routes = [                    // define routes
            { path: "/", name: "index", components: { foo: Foo, bar: Bar } },
            { path: "/contacts", name: "contacts", component: Baz }
        ]
        const router = new VueRouter({mode: "history", routes}) // create router instance and pass routes option
        new Vue({ router })    // create and mount the root instance, inject router with router option
        
        // main app.vue template file
        /*  <router-link to="/">home</router-link>
            <router-link to="/contacts">contacts</router-link>
            <router-view name="foo"></router-view>
            <router-view name="bar"></router-view>
            <router-view></router-view>  */
    }
    {   // dynamic route matching
        const routes = [ { path: "/user/:name/post/:id", component: User } ]   // main app.js config file
        /*<router-link to="/user/sergey/post/123">User</router-link>*/      // main app.vue component
        data(){ return { user_name: this.$route.params.name, post_id: this.$route.params.id } } // custom.vue component
    }
    {   // programmatic navigation, access to router instance as $router
        this.$router.push(location, onComplete?, onAbort?) // navigate to new URL, pushe new entry into history stack
        router.push("home"); router.push({ path: "home" }); router.push({ name: "user", params: { userId: 123 }})
        this.$router.replace(location, onComplete?, onAbort?) // navigates without pushing a new history entry
        this.$router.go(n) // indicates by how many steps to go forwards or go backwards in the history stack
        this.$router.back()
        this.$router.forward()
    }
    {   // named routes
        routes: [ { path: "/user/:userId", name: "user", component: User } ]
        /*<router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>*/
        this.$router.push({ name: "user", params: { userId: 123 }})
    }
    {   // data fetching
        // navigate and render the incoming component immediately, fetch data in the component created hook
        <template>
          <div class="post">
            <div class="loading" v-if="loading"> Loading... </div>
            <div v-if="error" class="error"> {{ error }} </div>
            <div v-if="post" class="content"> <h2>{{ post.title }}</h2> <p>{{ post.body }}</p> </div>
          </div>
        </template>

        export default {
          data () { return { loading: false, post: null, error: null } },
          created () {
            this.fetchData()   // fetch data when view is created and data is already being observed
          },
          watch: {
            '$route': 'fetchData'   // call again the method if the route changes
          },
          methods: {
            fetchData () {
              this.error = this.post = null
              this.loading = true
              getPost(this.$route.params.id, (err, post) => {
                this.loading = false
                if (err) {
                  this.error = err.toString()
                } else {
                  this.post = post
                }
              })
            }
          }
        }
    }
    }

function mixin() {
    // compose reusable functionality for vue components
    // hook funcs with the same name are merged into an array
    // mixin load first, component data second with ability to override (method, component, directive)
    export const myMixin = {
        created: function () {
            this.hello()
        },
        methods: {
            hello: function () {
                // logic here
            }
        }
    }
    // new component will have 'hello()' method that fires after it is created
    import { myMixin } from './myMixin'
    export default {
        name: 'app',
        mixins: [myMixin]
    }

    // global mixin registration, will be added to all instances
    Vue.mixin({
        created() {
            // logic here
        }
    })
    }
function plugins() {
    {   // simple plugin
        // plugin index.js
        export default {
            install(Vue) {
                Vue.popup = Vue.prototype.$popup = new Vue()
            }

            // main.js plugin global registration
            import Popup from './plugins/popup'
            Vue.use(Popup)
        }
    }
    {   //
        //
    }
    }

function vuex() {
    // vuex.js config file
    import Vue from 'vue'
    import Vuex from 'vuex'
    Vue.use(Vuex)
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
    				return todo.done
    			})
    		}
    	},
    	mutations: {
    		increment(state, payload) {
    			state.count += payload.amount
    		},
    		decrement(state, payload) {
    			state.count -= payload.amount
    		}
        },       // must be synchronous
        actions: {
        	incrementAsync(context) {
        		setTimeout(function () {
        			context.commit('increment', { amount: 5 })
        		}, 2000)
        	}
        }       // can perform async actions, communicate only with mutations
    })

    // main.js app config file
    import store from './vuex'
    new Vue({
    	el: '#app',
    	store,
    	template: '<app></app>',
    	components: { App }
    })

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
                    return this.$store.state.count
                },
                data: function {
                    return this.$store.getters["basket/hasProduct"](this.product.id)
                },
        		doneTodos: function () {
        			return this.$store.getters.doneTodos
        		}
        	},
        	methods: {
        		increment(){
        			this.$store.commit('increment', {
        				amount: 5
        			})
        		},
        		decrement(){
        			this.$store.commit('decrement', {
        				amount: 5
        			})
        		},
        		incrementAsync() {
        			this.$store.dispatch('incrementAsync')
        		},
                callAsyncAction() {
                    this.$store.dispatch("basket/purchaseProduct", {product: item})
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
    import partOne from './partOne.js'
    new Vue({
    	el: '#app',
    	modules {
    		partOne
    	},
    	template: '<app></app>',
    	components: { App }
    })
    }
function api() {
    {   // nextTick, will return Promise if no callback provided
        // gobal method with callback function
        Vue.nextTick(function () {})
        // instance method with callback function
        this.$nextTick(function () {
            this.$el.textContent = "data"  // context will be bound to the current instance
        })
    }
    {   // 
        //
    } 
    }


// scoped slots

// dynamic components
// async components
// recursive components
// functional components

// render function

// $refs
