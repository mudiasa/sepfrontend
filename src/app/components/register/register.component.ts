import { User } from './../../models/user';
import { Message, MenuItem, SelectItem } from 'primeng/primeng';
import { UserService } from './../../services/user.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

    registerForm: FormGroup;

    users: User[]; 
    user:User;

    rerender: boolean;

    cols: any[];

    userTypes: SelectItem[];
    departments: SelectItem[];
    
    messages: Message[] = [];
    breadcrumbItems: MenuItem[];

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private cdRef: ChangeDetectorRef,
    ) { }

    ngOnInit() {

        this.breadcrumbItems = [];

        this.breadcrumbItems.push({ label: 'User Registration' });

        this.initregisterForm();

        this.userService.getUsers().subscribe(u => {
            this.users = u;

            console.log("users", this.users);
        });

        this.cols = [

            { field: 'username', header: 'Username' },
            { field: 'email', header: 'Email' },
            { field: 'department', header: 'department' },
            { field: 'type', header: 'Type' },
            
        ];

        this.userTypes = [];
        this.userTypes.push({ label: 'Select User Type', value: 'null' });
        this.userTypes.push({ label: 'CS Employee', value: 'CS Employee' });
        this.userTypes.push({ label: 'CS Manager', value: 'CS Manager' });
        this.userTypes.push({ label: 'Finance Manager', value: 'Finance Manager' });
        this.userTypes.push({ label: 'Administration Manager', value: 'Administration Manager' });
        this.userTypes.push({ label: 'Production Manager', value: 'Production Manager' });
        this.userTypes.push({ label: 'Service Manager', value: 'Service Manager' });
        this.userTypes.push({ label: 'Subteam Member', value: 'Subteam Member' });
            
        this.departments = [];
        this.departments.push({ label: 'Select Department', value: 'null' });
        this.departments.push({ label: 'Administration', value: 'Administration' });
        this.departments.push({ label: 'Customer Service', value: 'Customer Service' });
        this.departments.push({ label: 'Finance', value: 'Finance' });
        this.departments.push({ label: 'Production', value: 'Production' });
        this.departments.push({ label: 'Service', value: 'Service' });
    }

    initregisterForm() {
        this.registerForm = this.fb.group({
            firstName: ['', [Validators.required, Validators.maxLength(255)]],
            lastName: ['', [Validators.required, Validators.maxLength(255)]],
            username: ['', [Validators.required, Validators.maxLength(255)]],
            password: ['', [Validators.required, Validators.maxLength(255)]],
            email: ['', [Validators.required, Validators.maxLength(255)]],
            department: ['', [Validators.required, Validators.maxLength(255)]],
            type: ['', [Validators.required, Validators.maxLength(255)]],

        });
    }

    hasFormsErrors() {
        return !this.registerForm.valid;
    }

    onSubmit() {
        let u = Object.assign({}, this.user, this.registerForm.value);
        
        console.log("u", u);

        this.userService.create(u)
            .subscribe(x => {
                this.renderTable();
                this.messages.push({ severity: 'success', summary: 'User Created', detail: 'User created' });
            },
                err => {
                    this.messages.push({ severity: 'error', summary: 'Error', detail: 'An unexpected error happened' });
                });

        this.initregisterForm();

    }

    renderTable() {
        this.userService.getUsers().subscribe(u => {
            this.users = u;
            this.rerender = true;
            this.cdRef.detectChanges();
            this.rerender = false;
        });
    }


    cancelLogIn() {
        console.log("cancel");
    }




}