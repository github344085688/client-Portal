
import { Observable }  from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import util from '../shared/util';
import Vue from 'vue';


const RxEvent = {
    install: function(vue: any) {
        vue.directive("rx-event", RxEventHandler);
    }
};

function getKey(binding: any) {
    return binding.arg;
}

// Copy from vue-rx:  v-stream directives
const RxEventHandler =  {

  bind (el: any, binding: any, vnode: any) {


    let handle = binding.value;
    const event = binding.arg;
    const streamName = binding.expression;
    const modifiers = binding.modifiers;

    if (util.isSubject(handle)) {
      handle = { subject: handle };
    } else if (!handle || !util.isSubject(handle.subject)) {
      console.warn(
        'Invalid Subject found in directive with key "' + streamName + '".' +
        streamName + ' should be an instance of Rx.Subject or have the ' +
        'type { subject: Rx.Subject, data: any }.',
        vnode.context
      );
      return;
    }

    const modifiersFuncs: any = {
      stop: (e: any) => e.stopPropagation(),
      prevent: (e: any)  => e.preventDefault()
    };

    let modifiersExists = Object.keys(modifiersFuncs).filter(
        key => modifiers[key]
    );

    const subject = handle.subject;
    const next = (subject.next || subject.onNext).bind(subject);

    if (!modifiers.native && vnode.componentInstance) {
      handle.subscription = util.eventToObservable(vnode.componentInstance, event).subscribe( (e: any) => {
        modifiersExists.forEach( mod => modifiersFuncs[mod](e));
        next({
          event: e,
          data: handle.data
        });
      });
    } else {
      if (!Observable.fromEvent) {
        console.warn(
          `No 'fromEvent' method on Observable class. ` +
          `v-stream directive requires Rx.Observable.fromEvent method. ` +
          `Try import 'rxjs/add/observable/fromEvent' for ${streamName}`,
          vnode.context
        );
        return;
      }
      handle.subscription = Observable.fromEvent(el, event, handle.options).subscribe( (e: any) => {
        modifiersExists.forEach(mod => modifiersFuncs[mod](e));
        next({
          event: e,
          data: handle.data
        });
      });

      // store handle on element with a unique key for identifying
      // multiple v-stream directives on the same node
      (el._rxHandles || (el._rxHandles = {}))[getKey(binding)] = handle;
    }
  },


  update(el: any, binding: any) {
    const handle = binding.value;
    const _handle = el._rxHandles && el._rxHandles[getKey(binding)];
    if (_handle && handle && util.isSubject(handle.subject)) {
      _handle.data = handle.data;
    }
  },

  unbind (el: any, binding: any) {
    const key = getKey(binding);
    const handle = el._rxHandles && el._rxHandles[key];
    if (handle) {
        if (handle.subscription) {
            handle.subscription.unsubscribe();
        }
      el._rxHandles[key] = null;
    }
  }
};

export default RxEvent;


