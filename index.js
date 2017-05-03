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









(function(){
	
})(window);
