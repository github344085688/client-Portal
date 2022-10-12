import Vue from 'vue';
const FixedHead = {
    install: function (vue: any) {
        vue.directive("fixed-head", FixedHeads);
    }
};
let flexTableEl: any = null;
let absoluteThead: any = null;
function handleScroll() {
    let scrollTop = window.pageYOffset || document.body.scrollTop;
    if (!flexTableEl) return;
    let theads = flexTableEl.getElementsByTagName('thead');
    let orginThead = theads[0];
    if (scrollTop > (flexTableEl.offsetTop - 60) && flexTableEl.offsetTop) {
        let childThs = orginThead.children[0].getElementsByTagName('th');
        if (absoluteThead) {
            absoluteThead.setAttribute("style", "position:absolute;top:" + (scrollTop + 51) + "px;");
            absoluteThead.firstChild.setAttribute("style", "display: inline-flex;");
        } else {
            for (let i = 0; i < childThs.length; i++) {
                childThs[i].setAttribute("style", 'width:' + childThs[i]!.clientWidth + 'px');
            }
            absoluteThead = orginThead.cloneNode(true);
            flexTableEl.appendChild(absoluteThead);
        }

    } else {
        if (absoluteThead) {
            flexTableEl.removeChild(absoluteThead);
        }
        absoluteThead = null;
    }
}

function autoFixHeaderWhenSizeChange() {
    let orginTbody = flexTableEl.getElementsByTagName('tbody')[0];
    if (!orginTbody.children[0]) return;
    let childTds = orginTbody.children[0].getElementsByTagName('td');
    if (!absoluteThead) return;
    let absoluteThs = absoluteThead.children[0].getElementsByTagName('th');
    for (let i = 0; i < childTds.length; i++) {
        absoluteThs[i].setAttribute("style", 'width:' + childTds[i]!.clientWidth + 'px');
    }
}



const FixedHeads = {
    bind(el: any, binding: any, vnode: any) {
        absoluteThead = null;
        flexTableEl = el;
    },

    update(el: any, binding: any) {

    },

    unbind(el: any, binding: any) {
    }
};
window.addEventListener('scroll', handleScroll);
document.addEventListener('click', (e: any) => {
    if (e.target.alt === 'flex-logo') {
        setTimeout(autoFixHeaderWhenSizeChange, 500);
    }
});

export default FixedHead;