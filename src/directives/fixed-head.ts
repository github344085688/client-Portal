import Vue from 'vue';
const FixedHead = {
    install: function (vue: any) {
        vue.directive("fixed-head", FixedHeads);
    }
};
let flexNode: any = null;
let needToResizeHead: boolean = false;
let tdNodeHtml: any = null;
let tbodyNode: any = null;
function handleScroll() {
    let scrollTop = window.pageYOffset || document.body.scrollTop;
    let tdNodechilds = flexNode.getElementsByTagName('tbody')[0].firstChild.getElementsByTagName('td');
    tdNodeHtml = tdNodechilds[tdNodechilds.length - 1].innerHTML;
    tbodyNode = flexNode.getElementsByTagName('tbody')[0];
    setNodeWidth();
    if (scrollTop > (flexNode.offsetTop - 60)) {
        if (flexNode.getElementsByTagName('thead')[0]) {
            needToResizeHead = false;
            flexNode.getElementsByTagName('thead')[0].classList.add('thead-position');
        } else {
            flexNode.getElementsByTagName('thead')[0].classList.remove('thead-position');
            needToResizeHead = true;
        }
    } else {
        flexNode.getElementsByTagName('thead')[0].classList.remove('thead-position');
        needToResizeHead = true;
        if (! tdNodeHtml) {
            flexNode.removeChild(tbodyNode);
        }
    }
}

function setNodeWidth() {
    if (needToResizeHead) {
        let thNode = flexNode.getElementsByTagName('thead')[0].firstChild.getElementsByTagName('th');
        for (let i = 0; i < thNode.length; i++) {
            thNode[i].setAttribute("style", 'width:' + thNode[i]!.clientWidth + 'px');
        }
        if (!tdNodeHtml) {
            for (let i = 0; i < thNode.length; i++) {
                let tdNode = flexNode.getElementsByTagName('tbody')[0].firstChild.getElementsByTagName('td');
                tdNode[i].setAttribute("style", 'width:' + thNode[i]!.clientWidth + 'px;');
            }
        } else {
            let tbody = document.createElement('tbody');
            let tr = document.createElement("tr");
            for (let i = 0; i < thNode.length; i++) {
                let td = document.createElement("td");
                td.setAttribute("style", 'width:' + thNode[i]!.clientWidth + 'px; height:1px;padding: 0;');
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
            flexNode.insertBefore(tbody, tbodyNode);
        }
    }
}

const FixedHeads = {
    bind(el: any, binding: any, vnode: any) {
    },

    update(el: any, binding: any) {
        if (needToResizeHead) {
            needToResizeHead = false;
        }
        window.addEventListener('scroll', handleScroll);
        flexNode = el;
        flexNode.getElementsByTagName('thead')[0].classList.remove('thead-position');
    },

    unbind(el: any, binding: any) {
    }
};

export default FixedHead;