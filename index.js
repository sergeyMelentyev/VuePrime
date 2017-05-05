(function(filters){
	new Vue({
		filters: {
			capitalize: function (value) {
				if (!value) return '';
				value = value.toString();
				return value.charAt(0).toUpperCase() + value.slice(1);
			}
		}
	});
	// {{ value | capitalize }}			// use case inside vue template
})();
(function(computedProps){
	var vm = new Vue({
		el: '#example',
		data: {			// not cached properties
			message: 'Hello'
		},
		computed: {			// cached properties, will not reevaluate untile 'message' prop change
			reversedMessage: function () {		// computed getter
				return this.message.toUpperCase;		// 'this' points to the vm instance
			}
		}
	});
})();
(function(watchedPropsWithAsyncCall){
	// <input v-model="question"> <p> {{ answer }} </p>
	export default {
        data: function () {
            return {
                question: '',
                answer: 'I cannot give you an answer until you ask a question!'
            };
        },
        watch: {
            question: function () {
                this.answer = 'Waiting until you stop typing...';
                this.getAnswer();
            }
        },
        methods: {
            getAnswer: _.debounce(function () {			// https://lodash.com/docs#debounce
                if (this.question.indexOf('?') === -1) {
                    this.answer = 'Question should contain a question mark';
                    return;
                }
                this.answer = '...thinking...';
                let vm = this;
                axios.get('https://yesno.wtf/api')		// https://www.npmjs.com/package/axios
                    .then(function (response) {
                        vm.answer = response.data.answer;
                    })
                    .catch(function (error) {
                        // error logic
                    });
            }, 1000)
        }
    }
})();
(function(classBinding){
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
})();
(function(conditionals){
	/* <template v-if="loginType === 'username'">		// will not render if starting condion is false
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
})();
(function(listRendering){
	// <div v-for="item of items"></div>			// iterate over array
	// <div v-for="item in items"></div>			// the same as above

	// <li v-for="value in object"></li>			// iterate over object values
	// <div v-for="(value, key) in object"></div>	// iterate over object key and value
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

    // push, pop, shift, unshift, splice, sort, reverse.	mutation methods
    // filter, concat, slice.			// not mutation methods, return a new array

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
})();
(function(events){
	// <a v-on:click.stop.prevent="doThat"></a>		// event modifiers .capture .self .once
	// <input v-on:keyup.13="submit">		// only call vm.submit() when the keyCode is 13
	// <button v-on:click="send('+', $event)"></button>		// access the original DOM event
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

    // Parent-Child Communication
    // v-on must use to listen to events emitted by children
    // <div> Total is {{total}} </div>
    // <button-counter v-on:eventNameFromChild="parentMethodName"></button-counter>
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

    // Non Parent-Child Communication
    var bus = new Vue();
	bus.$emit('id-selected', 1)		// first component method
	bus.$on('id-selected', function (id) { });	// second component created hook
})();
(function(forms){
	// <input v-bind:value="something" v-on:input="something = $event.target.value">
	// <input v-model="something">			// the same as above
	
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
})();
(function(components){
	// <custom> simple component with inline template </custom>
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

    // Dynamic Props
    // v-bind dynamically bind child props to parent data
    
    // <input v-model="parent">
    // <child v-bind:childProp="parent"></child>
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
        data: function () {
            return {
                parent: ''
            };
        }
    }
})();
(function(slots){
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
})();
(function(dynamicComponents){
	// Dynamic Components with 'keep-alive' in order to save component in ram
    // <keep-alive><component v-bind:is="currentView"></component></keep-alive>
    export default {
        name: 'app',
        data: function () {
            return {
                currentView: 'home'
            };
        },
        components: {
            home: { template: '<div>Home Element</div>' },
            posts: { template: '<div>Posts Element</div>' },
            archive: { template: '<div>Archive Element</div>' }
        }
    }	
})();










(function(){
	
})();
