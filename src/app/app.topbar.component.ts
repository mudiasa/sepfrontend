import {Component} from '@angular/core';
import {AppComponent} from './app.component';

@Component({
    selector: 'app-topbar',
    template: `
        <div class="topbar clearfix">
            <div class="topbar-left">
                <div class="logo">
                    <img src="assets/layout/images/logo-black.png" alt="Logo">
                </div>
            </div>

            
        </div>
    `
})
export class AppTopBarComponent {

    constructor(public app: AppComponent) {}

}
