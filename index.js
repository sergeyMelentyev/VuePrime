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
})(window);

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
})(window);

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
})(window);

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
})(window);

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
})(window);

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

	// <li v-for="n in evenNumbers">{{ n }}</li>
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
})(window);







(function(){
	
})(window);
