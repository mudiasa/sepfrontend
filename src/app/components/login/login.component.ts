import { Router } from '@angular/router';
import { UserService } from './../../services/user.service';
import { Message, MenuItem } from 'primeng/primeng';
import { User } from './../../models/user';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    loginForm: FormGroup;

    users: User[]; 
    //user: User;
    messages: Message[] = [];
    breadcrumbItems: MenuItem[];


    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private router: Router,
    ) { }

    ngOnInit() {

        this.breadcrumbItems = [];

        this.breadcrumbItems.push({ label: 'Login' });

        this.initLoginForm();

        this.userService.getUsers().subscribe(u => {
            this.users = u;

            console.log("users",this.users);
        });
    }

    hasFormsErrors() {
        return !this.loginForm.valid;
    }

    initLoginForm() {
        this.loginForm = this.fb.group({
            username: ['', [Validators.required, Validators.maxLength(255)]],
            password: ['', [Validators.required, Validators.maxLength(255)]],

        });
    }

    onSubmit(){
        console.log("login");
        let username = this.loginForm.value.username;
        let password = this.loginForm.value.password;
        let user: User;
        
        user = this.findUser(this.users, username, password);

        console.log("user", user);

        if(user) {
            if (user.type == "CS Employee") {
                this.router.navigate(['/csemployee']);

            } else if (user.type == "CS Manager") {
                this.router.navigate(['/csmanager']);

            } else if (user.type == "Finance Manager") {
                this.router.navigate(['/fmanager']);

            } else if (user.type == "Administration Manager") {
                this.router.navigate(['/adminmanager']);

            } else if (user.type == "Production Manager") {
                this.router.navigate(['/prodmanager']);

            } else if (user.type == "Service Manager") {
                this.router.navigate(['/servicemanager']);

            } else {
                this.router.navigate(['/stmember']);        
            }
        } else {
            this.messages.push({ severity: 'error', summary: 'Error', detail: 'Invalid Credentials' });
        }

        

        this.initLoginForm();
            
        
             
    }

    cancelLogIn() {
        console.log("cancel");
    }

    findUser(array, username, password) {
        return array.find(x => x.username === username && x.password === password );
    }

}
