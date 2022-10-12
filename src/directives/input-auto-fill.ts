import Vue from 'vue';

let InputAutoFill = {
    install: function() {
        Vue.directive('inputAutoFill', {
            update: function (el: any, binding: any) {
                if (el.value && el.value.indexOf(binding.value) === -1) {
                    el.value = binding.value + el.value;
                }
            }
        });
    }
};

export default InputAutoFill;