import Vue from 'vue';

Vue.directive('dialogDrag', {
    bind(el: any) {
        Vue.nextTick(() => {
            const dialogHeaderEl = el.querySelector('.el-dialog');
            dialogHeaderEl.style.cursor = 'move';
            const sty = dialogHeaderEl.currentStyle || window.getComputedStyle(dialogHeaderEl, null);
            dialogHeaderEl.onmousedown = (e: any) => {
                const disX = e.clientX - dialogHeaderEl.offsetLeft;
                const disY = e.clientY - dialogHeaderEl.offsetTop;
                const marginTop = sty.marginTop.replace(/\px/g, '');
                const styL: any = '';
                document.onmousemove = function(e) {
                    dialogHeaderEl.style.left = `${e.clientX - disX}px`;
                    dialogHeaderEl.style.marginLeft = '0';
                    dialogHeaderEl.style.marginTop = sty.marginTop;
                    dialogHeaderEl.style.top = `${e.clientY - disY - marginTop}px`;
                };
                document.onmouseup = function(e) {
                    document.onmousemove = null;
                    document.onmouseup = null;
                };
            };
        });
    }
});