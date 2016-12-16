import {Component, OnInit} from '@angular/core';


@Component({
	template: `
				<h1> {{title}} </h1>
				<router-outlet></router-outlet>
			  `,
	selector: 'my-app'
})
export class AppComponent {
	title:string = 'PREMIER | Decision Support Analytics';

}
