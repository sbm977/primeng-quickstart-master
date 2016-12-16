/**
 * Created by smishra2 on 11/18/2016.
 */
import {Component, OnInit} from '@angular/core';
import {Car} from '../cars/car';
import {Data} from '../data/data';
import {Size} from '../data/size';
import {CarService} from '../cars/carservice';
import {DataService} from '../data/dataservice';
import {LazyLoadEvent} from '../../components/common/api';
import {SelectItem} from '../components/common/api';


class PrimeCar implements Car {
    constructor(public vin?, public year?, public brand?, public color?) {}
}

@Component({
    selector: 'home-component',
    templateUrl: './app/homecomponent/home.component.html',
    styles: []
})
export class HomeComponent implements OnInit {
    datas: Data[] = [];

    size: Size;

    errorMessage: string = '';

    isLoading: boolean = true;

    totalRecords: number;

    displayDialog: boolean;

    car: Car = new PrimeCar();

    selectedCar: Car;

    newCar: boolean;

    cars: Car[];

    brands: string[] = ['Audi','BMW','Fiat','Ford','Honda','Jaguar','Mercedes','Renault','Volvo','VW'];

    filteredBrands: any[];

    brand: string;

    options: SelectItem[] =[{value:'a', label:'A'}, {value:'a', label:'A'},{value:'a', label:'A'},{value:'a', label:'A'},{value:'a', label:'A'},{value:'b', label:'B'}];

    selectedOptions  : SelectItem = {value:'b',label:'B'};

    constructor(private carService: CarService , private dataService : DataService) { }

    ngOnInit() {
        this.carService.getCarsMedium().then(cars => this.cars = cars);

        this.dataService
            .getAll()
            .subscribe(
                /* happy path */ p => this.datas = p,
                /* error path */ e => this.errorMessage = e,
                /* onComplete */ () => this.isLoading = false);

        this.dataService
            .getSize()
            .subscribe(
                /* happy path */ p => this.totalRecords = p.size,
                /* error path */ e => this.errorMessage = e,
                /* onComplete */ () => this.isLoading = false);

        console.log('inside app component',this.totalRecords); // doesnot display it as as this instant of point its yet to be initialize but later when
    }

    loadDataLazy(event: LazyLoadEvent) {
        console.log('called lazy load event',event);

        this.dataService
            .getSelected(event.first)
            .subscribe(
                /* happy path */ p => this.datas = p,
                /* error path */ e => this.errorMessage = e,
                /* onComplete */ () => this.isLoading = false);

    }



    showDialogToAdd() {
        this.newCar = true;
        this.car = new PrimeCar();
        this.displayDialog = true;
    }

    save() {
        if(this.newCar)
            this.cars.push(this.car);
        else
            this.cars[this.findSelectedCarIndex()] = this.car;

        this.car = null;
        this.displayDialog = false;
    }

    delete() {
        this.cars.splice(this.findSelectedCarIndex(), 1);
        this.car = null;
        this.displayDialog = false;
    }

    onRowSelect(event) {
        this.newCar = false;
        this.car = this.cloneCar(event.data);
        this.displayDialog = true;
    }

    cloneCar(c: Car): Car {
        let car = new PrimeCar();
        for(let prop in c) {
            car[prop] = c[prop];
        }
        return car;
    }

    findSelectedCarIndex(): number {
        return this.cars.indexOf(this.selectedCar);
    }

    filterBrands(event) {
        this.filteredBrands = [];
        for(let i = 0; i < this.brands.length; i++) {
            let brand = this.brands[i];
            if(brand.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                this.filteredBrands.push(brand);
            }
        }
    }

    handleDropdownClick() {
        this.filteredBrands = [];

        //mimic remote call
        setTimeout(() => {
            this.filteredBrands = this.brands;
        }, 100)
    }


    logmesaage(msg: any){

        console.log(this.selectedOptions);
        console.log("iside mlogmsg ");
    }

}
