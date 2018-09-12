import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'home',
    templateUrl: '../views/home.component.html',
})

export class HomeComponent implements OnInit{
    public titulo: string;
 


    constructor(
    ) { 
        this.titulo = ' Home '; 
      
    }

    ngOnInit() {  
        console.log('Home')
    }
}