import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import {Data} from '../../app/data/data';
import {Size} from '../../app/data/size';

@Injectable()
export class DataService {
    private baseUrl: string = 'http://localhost:8080/rxdecision';
    private data: Data[];
    private size: Size;

    constructor(private http: Http) {}

    getSelected( first:number): Observable<Data[]>{
        let data$ = this.http
            .get(`${this.baseUrl}/selected?first=${first}`, {headers: this.getHeaders()})
            .map(mapData)
            .catch(handleError);
        console.log(' object array:' , data$)
        return data$;
    }

    getAll(): Observable<Data[]>{
        let data$ = this.http
            .get(`${this.baseUrl}/alldata`, {headers: this.getHeaders()})
            .map(mapData)
            .catch(handleError);
        console.log(' object array:' , data$)
        return data$;
    }

    getSize(): Observable<Size>{
        let size$ = this.http
            .get(`${this.baseUrl}/size`, {headers: this.getHeaders()})
            .map(mapSize)
            .catch(handleError);
            return size$;
    }

    private getHeaders(){
        let headers = new Headers();
        headers.append('Accept', 'application/json');
        return headers;
    }
}

function mapSize(response:Response): Size {

    return toSize(response.json());
}

function toSize(r:any): Size{
    let size = <Size> ({size:  r.size});
    console.log('Parsed size:', size);
    return size;
}

function mapData(response:Response): Data[]{
    // uncomment to simulate error:
    // throw new Error('ups! Force choke!');

    // The response of the API has a results
    // property with the actual results
    this.data = response.json().map(toData);
    console.log("value of test");
    console.log(this.data)
    console.log("value of test");
    return this.data;
}

function toData(r:any): Data{
    let data = <Data>({
        s: r.id,
        md5: r.md5,
        md1: r.md1
    });
    console.log('Parsed person:', data);
    return data;
}


function handleError (error: any) {
    // log error
    // could be something more sofisticated
    let errorMsg = error.message || `Yikes! There was was a problem with our hyperdrive device and we couldn't retrieve your data!`
    console.error(errorMsg);

    // throw an application level error
    return Observable.throw(errorMsg);
}
