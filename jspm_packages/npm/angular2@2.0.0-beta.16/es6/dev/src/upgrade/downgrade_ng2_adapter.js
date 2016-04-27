/* */ 
"format esm";
import { provide, ReflectiveInjector } from 'angular2/core';
import { NG1_SCOPE } from './constants';
const INITIAL_VALUE = {
    __UNINITIALIZED__: true
};
export class DowngradeNg2ComponentAdapter {
    constructor(id, info, element, attrs, scope, parentInjector, parse, componentFactory) {
        this.id = id;
        this.info = info;
        this.element = element;
        this.attrs = attrs;
        this.scope = scope;
        this.parentInjector = parentInjector;
        this.parse = parse;
        this.componentFactory = componentFactory;
        this.component = null;
        this.inputChangeCount = 0;
        this.inputChanges = null;
        this.componentRef = null;
        this.changeDetector = null;
        this.contentInsertionPoint = null;
        this.element[0].id = id;
        this.componentScope = scope.$new();
        this.childNodes = element.contents();
    }
    bootstrapNg2() {
        var childInjector = ReflectiveInjector.resolveAndCreate([provide(NG1_SCOPE, { useValue: this.componentScope })], this.parentInjector);
        this.contentInsertionPoint = document.createComment('ng1 insertion point');
        this.componentRef =
            this.componentFactory.create(childInjector, [[this.contentInsertionPoint]], '#' + this.id);
        this.changeDetector = this.componentRef.changeDetectorRef;
        this.component = this.componentRef.instance;
    }
    setupInputs() {
        var attrs = this.attrs;
        var inputs = this.info.inputs;
        for (var i = 0; i < inputs.length; i++) {
            var input = inputs[i];
            var expr = null;
            if (attrs.hasOwnProperty(input.attr)) {
                var observeFn = ((prop) => {
                    var prevValue = INITIAL_VALUE;
                    return (value) => {
                        if (this.inputChanges !== null) {
                            this.inputChangeCount++;
                            this.inputChanges[prop] =
                                new Ng1Change(value, prevValue === INITIAL_VALUE ? value : prevValue);
                            prevValue = value;
                        }
                        this.component[prop] = value;
                    };
                })(input.prop);
                attrs.$observe(input.attr, observeFn);
            }
            else if (attrs.hasOwnProperty(input.bindAttr)) {
                expr = attrs[input.bindAttr];
            }
            else if (attrs.hasOwnProperty(input.bracketAttr)) {
                expr = attrs[input.bracketAttr];
            }
            else if (attrs.hasOwnProperty(input.bindonAttr)) {
                expr = attrs[input.bindonAttr];
            }
            else if (attrs.hasOwnProperty(input.bracketParenAttr)) {
                expr = attrs[input.bracketParenAttr];
            }
            if (expr != null) {
                var watchFn = ((prop) => (value, prevValue) => {
                    if (this.inputChanges != null) {
                        this.inputChangeCount++;
                        this.inputChanges[prop] = new Ng1Change(prevValue, value);
                    }
                    this.component[prop] = value;
                })(input.prop);
                this.componentScope.$watch(expr, watchFn);
            }
        }
        var prototype = this.info.type.prototype;
        if (prototype && prototype.ngOnChanges) {
            // Detect: OnChanges interface
            this.inputChanges = {};
            this.componentScope.$watch(() => this.inputChangeCount, () => {
                var inputChanges = this.inputChanges;
                this.inputChanges = {};
                this.component.ngOnChanges(inputChanges);
            });
        }
        this.componentScope.$watch(() => this.changeDetector && this.changeDetector.detectChanges());
    }
    projectContent() {
        var childNodes = this.childNodes;
        var parent = this.contentInsertionPoint.parentNode;
        if (parent) {
            for (var i = 0, ii = childNodes.length; i < ii; i++) {
                parent.insertBefore(childNodes[i], this.contentInsertionPoint);
            }
        }
    }
    setupOutputs() {
        var attrs = this.attrs;
        var outputs = this.info.outputs;
        for (var j = 0; j < outputs.length; j++) {
            var output = outputs[j];
            var expr = null;
            var assignExpr = false;
            var bindonAttr = output.bindonAttr ? output.bindonAttr.substring(0, output.bindonAttr.length - 6) : null;
            var bracketParenAttr = output.bracketParenAttr ?
                `[(${output.bracketParenAttr.substring(2, output.bracketParenAttr.length - 8)})]` :
                null;
            if (attrs.hasOwnProperty(output.onAttr)) {
                expr = attrs[output.onAttr];
            }
            else if (attrs.hasOwnProperty(output.parenAttr)) {
                expr = attrs[output.parenAttr];
            }
            else if (attrs.hasOwnProperty(bindonAttr)) {
                expr = attrs[bindonAttr];
                assignExpr = true;
            }
            else if (attrs.hasOwnProperty(bracketParenAttr)) {
                expr = attrs[bracketParenAttr];
                assignExpr = true;
            }
            if (expr != null && assignExpr != null) {
                var getter = this.parse(expr);
                var setter = getter.assign;
                if (assignExpr && !setter) {
                    throw new Error(`Expression '${expr}' is not assignable!`);
                }
                var emitter = this.component[output.prop];
                if (emitter) {
                    emitter.subscribe({
                        next: assignExpr ? ((setter) => (value) => setter(this.scope, value))(setter) :
                            ((getter) => (value) => getter(this.scope, { $event: value }))(getter)
                    });
                }
                else {
                    throw new Error(`Missing emitter '${output.prop}' on component '${this.info.selector}'!`);
                }
            }
        }
    }
    registerCleanup() {
        this.element.bind('$destroy', () => {
            this.componentScope.$destroy();
            this.componentRef.destroy();
        });
    }
}
class Ng1Change {
    constructor(previousValue, currentValue) {
        this.previousValue = previousValue;
        this.currentValue = currentValue;
    }
    isFirstChange() { return this.previousValue === this.currentValue; }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG93bmdyYWRlX25nMl9hZGFwdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC05RDFpR1FWRy50bXAvYW5ndWxhcjIvc3JjL3VwZ3JhZGUvZG93bmdyYWRlX25nMl9hZGFwdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJPQUFPLEVBQ0wsT0FBTyxFQU9QLGtCQUFrQixFQUNuQixNQUFNLGVBQWU7T0FDZixFQUFDLFNBQVMsRUFBQyxNQUFNLGFBQWE7QUFLckMsTUFBTSxhQUFhLEdBQUc7SUFDcEIsaUJBQWlCLEVBQUUsSUFBSTtDQUN4QixDQUFDO0FBRUY7SUFVRSxZQUFvQixFQUFVLEVBQVUsSUFBbUIsRUFDdkMsT0FBaUMsRUFBVSxLQUEwQixFQUNyRSxLQUFxQixFQUFVLGNBQXdCLEVBQ3ZELEtBQTRCLEVBQVUsZ0JBQWtDO1FBSHhFLE9BQUUsR0FBRixFQUFFLENBQVE7UUFBVSxTQUFJLEdBQUosSUFBSSxDQUFlO1FBQ3ZDLFlBQU8sR0FBUCxPQUFPLENBQTBCO1FBQVUsVUFBSyxHQUFMLEtBQUssQ0FBcUI7UUFDckUsVUFBSyxHQUFMLEtBQUssQ0FBZ0I7UUFBVSxtQkFBYyxHQUFkLGNBQWMsQ0FBVTtRQUN2RCxVQUFLLEdBQUwsS0FBSyxDQUF1QjtRQUFVLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUFaNUYsY0FBUyxHQUFRLElBQUksQ0FBQztRQUN0QixxQkFBZ0IsR0FBVyxDQUFDLENBQUM7UUFDN0IsaUJBQVksR0FBa0MsSUFBSSxDQUFDO1FBQ25ELGlCQUFZLEdBQWlCLElBQUksQ0FBQztRQUNsQyxtQkFBYyxHQUFzQixJQUFJLENBQUM7UUFHekMsMEJBQXFCLEdBQVMsSUFBSSxDQUFDO1FBTTNCLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUMvQixJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FB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USxJQUFJLENBQUMsQ0FBQztnQkFDNUYsQ0FBQztZQUNILENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQztJQUVELGVBQWU7UUFDYixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDNUIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUMvQixJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQzlCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztBQUNILENBQUM7QUFFRDtJQUNFLFlBQW1CLGFBQWtCLEVBQVMsWUFBaUI7UUFBNUMsa0JBQWEsR0FBYixhQUFhLENBQUs7UUFBUyxpQkFBWSxHQUFaLFlBQVksQ0FBSztJQUFHLENBQUM7SUFFbkUsYUFBYSxLQUFjLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxLQUFLLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO0FBQy9FLENBQUM7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIHByb3ZpZGUsXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBJbmplY3RvcixcbiAgT25DaGFuZ2VzLFxuICBDb21wb25lbnRGYWN0b3J5LFxuICBDb21wb25lbnRSZWYsXG4gIFNpbXBsZUNoYW5nZSxcbiAgUmVmbGVjdGl2ZUluamVjdG9yXG59IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xuaW1wb3J0IHtORzFfU0NPUEV9IGZyb20gJy4vY29uc3RhbnRzJztcbmltcG9ydCB7Q29tcG9uZW50SW5mb30gZnJvbSAnLi9tZXRhZGF0YSc7XG5pbXBvcnQgRWxlbWVudCA9IHByb3RyYWN0b3IuRWxlbWVudDtcbmltcG9ydCAqIGFzIGFuZ3VsYXIgZnJvbSAnLi9hbmd1bGFyX2pzJztcblxuY29uc3QgSU5JVElBTF9WQUxVRSA9IHtcbiAgX19VTklOSVRJQUxJWkVEX186IHRydWVcbn07XG5cbmV4cG9ydCBjbGFzcyBEb3duZ3JhZGVOZzJDb21wb25lbnRBZGFwdGVyIHtcbiAgY29tcG9uZW50OiBhbnkgPSBudWxsO1xuICBpbnB1dENoYW5nZUNvdW50OiBudW1iZXIgPSAwO1xuICBpbnB1dENoYW5nZXM6IHtba2V5OiBzdHJpbmddOiBTaW1wbGVDaGFuZ2V9ID0gbnVsbDtcbiAgY29tcG9uZW50UmVmOiBDb21wb25lbnRSZWYgPSBudWxsO1xuICBjaGFuZ2VEZXRlY3RvcjogQ2hhbmdlRGV0ZWN0b3JSZWYgPSBudWxsO1xuICBjb21wb25lbnRTY29wZTogYW5ndWxhci5JU2NvcGU7XG4gIGNoaWxkTm9kZXM6IE5vZGVbXTtcbiAgY29udGVudEluc2VydGlvblBvaW50OiBOb2RlID0gbnVsbDtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGlkOiBzdHJpbmcsIHByaXZhdGUgaW5mbzogQ29tcG9uZW50SW5mbyxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBlbGVtZW50OiBhbmd1bGFyLklBdWdtZW50ZWRKUXVlcnksIHByaXZhdGUgYXR0cnM6IGFuZ3VsYXIuSUF0dHJpYnV0ZXMsXG4gICAgICAgICAgICAgIHByaXZhdGUgc2NvcGU6IGFuZ3VsYXIuSVNjb3BlLCBwcml2YXRlIHBhcmVudEluamVjdG9yOiBJbmplY3RvcixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBwYXJzZTogYW5ndWxhci5JUGFyc2VTZXJ2aWNlLCBwcml2YXRlIGNvbXBvbmVudEZhY3Rvcnk6IENvbXBvbmVudEZhY3RvcnkpIHtcbiAgICAoPGFueT50aGlzLmVsZW1lbnRbMF0pLmlkID0gaWQ7XG4gICAgdGhpcy5jb21wb25lbnRTY29wZSA9IHNjb3BlLiRuZXcoKTtcbiAgICB0aGlzLmNoaWxkTm9kZXMgPSA8Tm9kZVtdPjxhbnk+ZWxlbWVudC5jb250ZW50cygpO1xuICB9XG5cbiAgYm9vdHN0cmFwTmcyKCkge1xuICAgIHZhciBjaGlsZEluamVjdG9yID0gUmVmbGVjdGl2ZUluamVjdG9yLnJlc29sdmVBbmRDcmVhdGUoXG4gICAgICAgIFtwcm92aWRlKE5HMV9TQ09QRSwge3VzZVZhbHVlOiB0aGlzLmNvbXBvbmVudFNjb3BlfSldLCB0aGlzLnBhcmVudEluamVjdG9yKTtcbiAgICB0aGlzLmNvbnRlbnRJbnNlcnRpb25Qb2ludCA9IGRvY3VtZW50LmNyZWF0ZUNvbW1lbnQoJ25nMSBpbnNlcnRpb24gcG9pbnQnKTtcblxuICAgIHRoaXMuY29tcG9uZW50UmVmID1cbiAgICAgICAgdGhpcy5jb21wb25lbnRGYWN0b3J5LmNyZWF0ZShjaGlsZEluamVjdG9yLCBbW3RoaXMuY29udGVudEluc2VydGlvblBvaW50XV0sICcjJyArIHRoaXMuaWQpO1xuICAgIHRoaXMuY2hhbmdlRGV0ZWN0b3IgPSB0aGlzLmNvbXBvbmVudFJlZi5jaGFuZ2VEZXRlY3RvclJlZjtcbiAgICB0aGlzLmNvbXBvbmVudCA9IHRoaXMuY29tcG9uZW50UmVmLmluc3RhbmNlO1xuICB9XG5cbiAgc2V0dXBJbnB1dHMoKTogdm9pZCB7XG4gICAgdmFyIGF0dHJzID0gdGhpcy5hdHRycztcbiAgICB2YXIgaW5wdXRzID0gdGhpcy5pbmZvLmlucHV0cztcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGlucHV0cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlucHV0ID0gaW5wdXRzW2ldO1xuICAgICAgdmFyIGV4cHIgPSBudWxsO1xuICAgICAgaWYgKGF0dHJzLmhhc093blByb3BlcnR5KGlucHV0LmF0dHIpKSB7XG4gICAgICAgIHZhciBvYnNlcnZlRm4gPSAoKHByb3ApID0+IHtcbiAgICAgICAgICB2YXIgcHJldlZhbHVlID0gSU5JVElBTF9WQUxVRTtcbiAgICAgICAgICByZXR1cm4gKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5pbnB1dENoYW5nZXMgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgdGhpcy5pbnB1dENoYW5nZUNvdW50Kys7XG4gICAgICAgICAgICAgIHRoaXMuaW5wdXRDaGFuZ2VzW3Byb3BdID1cbiAgICAgICAgICAgICAgICAgIG5ldyBOZzFDaGFuZ2UodmFsdWUsIHByZXZWYWx1ZSA9PT0gSU5JVElBTF9WQUxVRSA/IHZhbHVlIDogcHJldlZhbHVlKTtcbiAgICAgICAgICAgICAgcHJldlZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudFtwcm9wXSA9IHZhbHVlO1xuICAgICAgICAgIH07XG4gICAgICAgIH0pKGlucHV0LnByb3ApO1xuICAgICAgICBhdHRycy4kb2JzZXJ2ZShpbnB1dC5hdHRyLCBvYnNlcnZlRm4pO1xuICAgICAgfSBlbHNlIGlmIChhdHRycy5oYXNPd25Qcm9wZXJ0eShpbnB1dC5iaW5kQXR0cikpIHtcbiAgICAgICAgZXhwciA9IGF0dHJzW2lucHV0LmJpbmRBdHRyXTtcbiAgICAgIH0gZWxzZSBpZiAoYXR0cnMuaGFzT3duUHJvcGVydHkoaW5wdXQuYnJhY2tldEF0dHIpKSB7XG4gICAgICAgIGV4cHIgPSBhdHRyc1tpbnB1dC5icmFja2V0QXR0cl07XG4gICAgICB9IGVsc2UgaWYgKGF0dHJzLmhhc093blByb3BlcnR5KGlucHV0LmJpbmRvbkF0dHIpKSB7XG4gICAgICAgIGV4cHIgPSBhdHRyc1tpbnB1dC5iaW5kb25BdHRyXTtcbiAgICAgIH0gZWxzZSBpZiAoYXR0cnMuaGFzT3duUHJvcGVydHkoaW5wdXQuYnJhY2tldFBhcmVuQXR0cikpIHtcbiAgICAgICAgZXhwciA9IGF0dHJzW2lucHV0LmJyYWNrZXRQYXJlbkF0dHJdO1xuICAgICAgfVxuICAgICAgaWYgKGV4cHIgIT0gbnVsbCkge1xuICAgICAgICB2YXIgd2F0Y2hGbiA9ICgocHJvcCkgPT4gKHZhbHVlLCBwcmV2VmFsdWUpID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5pbnB1dENoYW5nZXMgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5pbnB1dENoYW5nZUNvdW50Kys7XG4gICAgICAgICAgICB0aGlzLmlucHV0Q2hhbmdlc1twcm9wXSA9IG5ldyBOZzFDaGFuZ2UocHJldlZhbHVlLCB2YWx1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuY29tcG9uZW50W3Byb3BdID0gdmFsdWU7XG4gICAgICAgIH0pKGlucHV0LnByb3ApO1xuICAgICAgICB0aGlzLmNvbXBvbmVudFNjb3BlLiR3YXRjaChleHByLCB3YXRjaEZuKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgcHJvdG90eXBlID0gdGhpcy5pbmZvLnR5cGUucHJvdG90eXBlO1xuICAgIGlmIChwcm90b3R5cGUgJiYgKDxPbkNoYW5nZXM+cHJvdG90eXBlKS5uZ09uQ2hhbmdlcykge1xuICAgICAgLy8gRGV0ZWN0OiBPbkNoYW5nZXMgaW50ZXJmYWNlXG4gICAgICB0aGlzLmlucHV0Q2hhbmdlcyA9IHt9O1xuICAgICAgdGhpcy5jb21wb25lbnRTY29wZS4kd2F0Y2goKCkgPT4gdGhpcy5pbnB1dENoYW5nZUNvdW50LCAoKSA9PiB7XG4gICAgICAgIHZhciBpbnB1dENoYW5nZXMgPSB0aGlzLmlucHV0Q2hhbmdlcztcbiAgICAgICAgdGhpcy5pbnB1dENoYW5nZXMgPSB7fTtcbiAgICAgICAgKDxPbkNoYW5nZXM+dGhpcy5jb21wb25lbnQpLm5nT25DaGFuZ2VzKGlucHV0Q2hhbmdlcyk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgdGhpcy5jb21wb25lbnRTY29wZS4kd2F0Y2goKCkgPT4gdGhpcy5jaGFuZ2VEZXRlY3RvciAmJiB0aGlzLmNoYW5nZURldGVjdG9yLmRldGVjdENoYW5nZXMoKSk7XG4gIH1cblxuICBwcm9qZWN0Q29udGVudCgpIHtcbiAgICB2YXIgY2hpbGROb2RlcyA9IHRoaXMuY2hpbGROb2RlcztcbiAgICB2YXIgcGFyZW50ID0gdGhpcy5jb250ZW50SW5zZXJ0aW9uUG9pbnQucGFyZW50Tm9kZTtcbiAgICBpZiAocGFyZW50KSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgaWkgPSBjaGlsZE5vZGVzLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgcGFyZW50Lmluc2VydEJlZm9yZShjaGlsZE5vZGVzW2ldLCB0aGlzLmNvbnRlbnRJbnNlcnRpb25Qb2ludCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc2V0dXBPdXRwdXRzKCkge1xuICAgIHZhciBhdHRycyA9IHRoaXMuYXR0cnM7XG4gICAgdmFyIG91dHB1dHMgPSB0aGlzLmluZm8ub3V0cHV0cztcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IG91dHB1dHMubGVuZ3RoOyBqKyspIHtcbiAgICAgIHZhciBvdXRwdXQgPSBvdXRwdXRzW2pdO1xuICAgICAgdmFyIGV4cHIgPSBudWxsO1xuICAgICAgdmFyIGFzc2lnbkV4cHIgPSBmYWxzZTtcblxuICAgICAgdmFyIGJpbmRvbkF0dHIgPVxuICAgICAgICAgIG91dHB1dC5iaW5kb25BdHRyID8gb3V0cHV0LmJpbmRvbkF0dHIuc3Vic3RyaW5nKDAsIG91dHB1dC5iaW5kb25BdHRyLmxlbmd0aCAtIDYpIDogbnVsbDtcbiAgICAgIHZhciBicmFja2V0UGFyZW5BdHRyID1cbiAgICAgICAgICBvdXRwdXQuYnJhY2tldFBhcmVuQXR0ciA/XG4gICAgICAgICAgICAgIGBbKCR7b3V0cHV0LmJyYWNrZXRQYXJlbkF0dHIuc3Vic3RyaW5nKDIsIG91dHB1dC5icmFja2V0UGFyZW5BdHRyLmxlbmd0aCAtIDgpfSldYCA6XG4gICAgICAgICAgICAgIG51bGw7XG5cbiAgICAgIGlmIChhdHRycy5oYXNPd25Qcm9wZXJ0eShvdXRwdXQub25BdHRyKSkge1xuICAgICAgICBleHByID0gYXR0cnNbb3V0cHV0Lm9uQXR0cl07XG4gICAgICB9IGVsc2UgaWYgKGF0dHJzLmhhc093blByb3BlcnR5KG91dHB1dC5wYXJlbkF0dHIpKSB7XG4gICAgICAgIGV4cHIgPSBhdHRyc1tvdXRwdXQucGFyZW5BdHRyXTtcbiAgICAgIH0gZWxzZSBpZiAoYXR0cnMuaGFzT3duUHJvcGVydHkoYmluZG9uQXR0cikpIHtcbiAgICAgICAgZXhwciA9IGF0dHJzW2JpbmRvbkF0dHJdO1xuICAgICAgICBhc3NpZ25FeHByID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAoYXR0cnMuaGFzT3duUHJvcGVydHkoYnJhY2tldFBhcmVuQXR0cikpIHtcbiAgICAgICAgZXhwciA9IGF0dHJzW2JyYWNrZXRQYXJlbkF0dHJdO1xuICAgICAgICBhc3NpZ25FeHByID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGV4cHIgIT0gbnVsbCAmJiBhc3NpZ25FeHByICE9IG51bGwpIHtcbiAgICAgICAgdmFyIGdldHRlciA9IHRoaXMucGFyc2UoZXhwcik7XG4gICAgICAgIHZhciBzZXR0ZXIgPSBnZXR0ZXIuYXNzaWduO1xuICAgICAgICBpZiAoYXNzaWduRXhwciAmJiAhc2V0dGVyKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHByZXNzaW9uICcke2V4cHJ9JyBpcyBub3QgYXNzaWduYWJsZSFgKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZW1pdHRlciA9IHRoaXMuY29tcG9uZW50W291dHB1dC5wcm9wXTtcbiAgICAgICAgaWYgKGVtaXR0ZXIpIHtcbiAgICAgICAgICBlbWl0dGVyLnN1YnNjcmliZSh7XG4gICAgICAgICAgICBuZXh0OiBhc3NpZ25FeHByID8gKChzZXR0ZXIpID0+ICh2YWx1ZSkgPT4gc2V0dGVyKHRoaXMuc2NvcGUsIHZhbHVlKSkoc2V0dGVyKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKChnZXR0ZXIpID0+ICh2YWx1ZSkgPT4gZ2V0dGVyKHRoaXMuc2NvcGUsIHskZXZlbnQ6IHZhbHVlfSkpKGdldHRlcilcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE1pc3NpbmcgZW1pdHRlciAnJHtvdXRwdXQucHJvcH0nIG9uIGNvbXBvbmVudCAnJHt0aGlzLmluZm8uc2VsZWN0b3J9JyFgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJlZ2lzdGVyQ2xlYW51cCgpIHtcbiAgICB0aGlzLmVsZW1lbnQuYmluZCgnJGRlc3Ryb3knLCAoKSA9PiB7XG4gICAgICB0aGlzLmNvbXBvbmVudFNjb3BlLiRkZXN0cm95KCk7XG4gICAgICB0aGlzLmNvbXBvbmVudFJlZi5kZXN0cm95KCk7XG4gICAgfSk7XG4gIH1cbn1cblxuY2xhc3MgTmcxQ2hhbmdlIGltcGxlbWVudHMgU2ltcGxlQ2hhbmdlIHtcbiAgY29uc3RydWN0b3IocHVibGljIHByZXZpb3VzVmFsdWU6IGFueSwgcHVibGljIGN1cnJlbnRWYWx1ZTogYW55KSB7fVxuXG4gIGlzRmlyc3RDaGFuZ2UoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLnByZXZpb3VzVmFsdWUgPT09IHRoaXMuY3VycmVudFZhbHVlOyB9XG59XG4iXX0=