/**
 * Created by smishra2 on 12/14/2016.
 */
import {NgModule,Component,ElementRef,OnInit,AfterViewInit,AfterViewChecked,DoCheck,OnDestroy,Input,Output,Renderer,EventEmitter,ContentChild,TemplateRef,IterableDiffers,forwardRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SelectItem} from '../components/common/api';
import {SharedModule} from '../components/common/shared';
import {DomHandler} from '../components/dom/domhandler';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';

export const DROPDOWN_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DropdownComponent),
    multi: true
};

@Component({
    selector: 'p-dropdowncustom',
    templateUrl: './app/dropdowncomponent/dropdown.component.html',
    styleUrls: ['./app/dropdowncomponent/dropdown.component.css'],
    providers: [DomHandler,DROPDOWN_VALUE_ACCESSOR]
})
export class DropdownComponent implements OnInit,AfterViewInit,AfterViewChecked,DoCheck,OnDestroy,ControlValueAccessor {
    @Input() options: SelectItem[] =[{value:'c', label:'C'},{value:'a', label:'A'}, {value:'a', label:'A'},{value:'a', label:'A'},{value:'a', label:'A'},{value:'a', label:'A'},{value:'b', label:'B'}];

    @Input() scrollHeight: string = '50px';

    @Input() filter: boolean;

    @Input() style: any;

    @Input() styleClass: string;

    @Input() disabled: boolean;

    @Input() autoWidth: boolean = true;

    @Input() required: boolean;

    @Input() editable: boolean;

    @Input() appendTo: any;

    @Output() onChange: EventEmitter<any> = new EventEmitter();

    @Output() onFocus: EventEmitter<any> = new EventEmitter();

    @Output() onBlur: EventEmitter<any> = new EventEmitter();

    @ContentChild(TemplateRef) itemTemplate: TemplateRef<any>;

    constructor(public el: ElementRef, public domHandler: DomHandler, public renderer: Renderer, differs: IterableDiffers) {
        this.differ = differs.find([]).create(null);
    }

    selectedOption: SelectItem = {value:'a', label:'A'};
    selectedOptions  : SelectItem;

    value: any;

    onModelChange: Function = () => {};

    onModelTouched: Function = () => {};

    optionsToDisplay: SelectItem[];

    hover: boolean;

    focus: boolean;

    differ: any;

    public panelVisible: boolean = false;

    public documentClickListener: any;

    public optionsChanged: boolean;

    public panel: any;

    public container: any;

    public itemsWrapper: any;

    public initialized: boolean;

    public selfClick: boolean;

    public itemClick: boolean;

    public hoveredItem: any;

    public selectedOptionUpdated: boolean;

    logmesaage(){
//
        console.log(this.selectedOptions);
        console.log("iside mlogmsg ");
        console.log(this.selectedOption);
    }
    logmesaages(r:any){
        console.log("iside mlogmsg ", r);

    }

    ngOnInit() {
        this.optionsToDisplay = this.options;

        this.documentClickListener = this.renderer.listenGlobal('body', 'click', () => {
            if(!this.selfClick&&!this.itemClick) {
                this.panelVisible = false;
            }

            this.selfClick = false;
            this.itemClick = false;
        });
    }

    ngDoCheck() {
        let changes = this.differ.diff(this.options);

        if(changes && this.initialized) {
            this.optionsToDisplay = this.options;
            this.updateSelectedOption(this.value);
            this.optionsChanged = true;
        }
    }

    ngAfterViewInit() {
        this.container = this.el.nativeElement.children[0];
        this.panel = this.domHandler.findSingle(this.el.nativeElement, 'div.ui-dropdown-panel');
        this.itemsWrapper = this.domHandler.findSingle(this.el.nativeElement, 'div.ui-dropdown-items-wrapper');

        this.updateDimensions();
        this.initialized = true;

        if(this.appendTo) {
            if(this.appendTo === 'body')
                document.body.appendChild(this.container);
            else
                this.appendTo.appendChild(this.container);
        }
    }

    get label(): string {
        return this.selectedOption ? this.selectedOption.label : null;
    }

    onItemClick(event, option) {
        this.itemClick = true;
        this.selectItem(event, option);
            console.log("iside item click", option);
        this.hide();
    }

    selectItem(event, option) {
        this.selectedOption = option;
        this.value = option.value;

        this.onModelChange(this.value);
        this.onChange.emit({
            originalEvent: event,
            value: this.value
        });

        if(option.label == null) {
            document.getElementById("dropd").click(); // the event.stoppropagation() causes the custom dropdown to be disactivated for a click
        }
    }

    ngAfterViewChecked() {
        if(this.optionsChanged) {
            this.domHandler.relativePosition(this.panel, this.container);
            this.optionsChanged = false;
        }

        if(this.selectedOptionUpdated && this.itemsWrapper) {
            let selectedItem = this.domHandler.findSingle(this.panel, 'li.ui-state-highlight');
            if(selectedItem) {
                this.domHandler.scrollInView(this.itemsWrapper, this.domHandler.findSingle(this.panel, 'li.ui-state-highlight'));
            }
            this.selectedOptionUpdated = false;
        }
    }

    writeValue(value: any): void {
        this.value = value;
        this.updateSelectedOption(value);
    }

    updateSelectedOption(val: any): void {
        this.selectedOption = this.findOption(val, this.optionsToDisplay);
        if(!this.selectedOption && this.optionsToDisplay && this.optionsToDisplay.length && !this.editable) {
            this.selectedOption = this.optionsToDisplay[0];
        }
        this.selectedOptionUpdated = true;
    }

    registerOnChange(fn: Function): void {
        this.onModelChange = fn;
    }

    registerOnTouched(fn: Function): void {
        this.onModelTouched = fn;
    }

    setDisabledState(val: boolean): void {
        this.disabled = val;
    }

    updateDimensions() {
        if(this.autoWidth) {
            let select = this.domHandler.findSingle(this.el.nativeElement, 'select');
            if(!this.style||(!this.style['width']&&!this.style['min-width'])) {
                this.el.nativeElement.children[0].style.width = select.offsetWidth + 30 + 'px';
            }
        }
    }

    onMouseenter(event) {
        this.hover = true;
    }

    onMouseleave(event) {
        this.hover = false
    }

    onMouseclick(event,input) {
        if(this.disabled) {
            return;
        }

        this.selfClick = true;

        if(!this.itemClick) {
            input.focus();

            if(this.panelVisible)
                this.hide();
            else {
                this.show(this.panel,this.container);
            }
        }
    }

    onEditableInputClick(event) {
        this.itemClick = true;
    }

    onEditableInputFocus(event) {
        this.focus = true;
        this.hide();
    }

    onEditableInputChange(event) {
        this.value = event.target.value;
        this.updateSelectedOption(this.value);
        this.onModelChange(this.value);
        this.onChange.emit({
            originalEvent: event,
            value: this.value
        });
    }

    show(panel,container) {
        if(this.options && this.options.length) {
            this.panelVisible = true;
            panel.style.zIndex = ++DomHandler.zindex;
            this.domHandler.relativePosition(panel, container);
            this.domHandler.fadeIn(panel,250);
        }
    }

    hide() {
        this.panelVisible = false;
    }

    onInputFocus(event) {
        this.focus = true;
        this.onFocus.emit(event);
    }

    onInputBlur(event) {
        this.focus = false;
        this.onModelTouched();
        this.onBlur.emit(event);
    }

    onKeydown(event) {
        let selectedItemIndex = this.selectedOption ? this.findOptionIndex(this.selectedOption.value, this.optionsToDisplay) : -1;

        switch(event.which) {
            //down
            case 40:
                if(!this.panelVisible && event.altKey) {
                    this.show(this.panel, this.container);
                }
                else {
                    if(selectedItemIndex != -1) {
                        let nextItemIndex = selectedItemIndex + 1;
                        if(nextItemIndex != (this.optionsToDisplay.length)) {
                            this.selectedOption = this.optionsToDisplay[nextItemIndex];
                            this.selectedOptionUpdated = true;
                            this.selectItem(event, this.selectedOption);
                        }
                    }
                    else if(this.optionsToDisplay) {
                        this.selectedOption = this.optionsToDisplay[0];
                    }
                }

                event.preventDefault();

                break;

            //up
            case 38:
                if(selectedItemIndex > 0) {
                    let prevItemIndex = selectedItemIndex - 1;
                    this.selectedOption = this.optionsToDisplay[prevItemIndex];
                    this.selectedOptionUpdated = true;
                    this.selectItem(event, this.selectedOption);
                }

                event.preventDefault();
                break;

            //enter
            case 13:
                this.hide();

                event.preventDefault();
                break;

            //escape and tab
            case 27:
            case 9:
                this.panelVisible = false;
                break;
        }
    }

    findListItem(element) {
        if(element.nodeName == 'LI') {
            return element;
        }
        else {
            let parent = element.parentElement;
            while(parent.nodeName != 'LI') {
                parent = parent.parentElement;
            }
            return parent;
        }
    }

    findOptionIndex(val: any, opts: SelectItem[]): number {
        let index: number = -1;
        if(opts) {
            for(let i = 0; i < opts.length; i++) {
                if((val == null && opts[i].value == null) || this.domHandler.equals(val, opts[i].value)) {
                    index = i;
                    break;
                }
            }
        }

        return index;
    }

    findOption(val: any, opts: SelectItem[]): SelectItem {
        let index: number = this.findOptionIndex(val, opts);
        return (index != -1) ? opts[index] : null;
    }

    onFilter(event): void {
        if(this.options && this.options.length) {
            let val = event.target.value.toLowerCase();
            this.optionsToDisplay = [];
            for(let i = 0; i < this.options.length; i++) {
                let option = this.options[i];
                if(option.label.toLowerCase().indexOf(val) > -1) {
                    this.optionsToDisplay.push(option);
                }
            }
            this.optionsChanged = true;
        }

    }

    applyFocus(): void {
        if(this.editable)
            this.domHandler.findSingle(this.el.nativeElement, '.ui-dropdown-label.ui-inputtext').focus();
        else
            this.domHandler.findSingle(this.el.nativeElement, 'input[readonly]').focus();
    }

    ngOnDestroy() {
        this.initialized = false;

        if(this.documentClickListener) {
            this.documentClickListener();
        }

        if(this.appendTo) {
            this.el.nativeElement.appendChild(this.container);
        }
    }
}

@NgModule({
    imports: [CommonModule,SharedModule],
    exports: [DropdownComponent,SharedModule],
    declarations: [DropdownComponent]
})
export class DropdownModule { }
