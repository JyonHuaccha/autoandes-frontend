import { Component } from '@angular/core';import { RouterOutlet } from '@angular/router';import { Header } from '../header/header';import { Sidebar } from '../sidebar/sidebar';
@Component({imports:[RouterOutlet,Header,Sidebar],template:`<app-header/><div class="layout"><app-sidebar/><main id="contenido"><router-outlet/></main></div>`})export class MainLayout {}
