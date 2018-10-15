import { User } from './../../models/user';
import { UserService } from './../../services/user.service';
import { RequestService } from './../../services/request.service';
import { MenuItem, Message } from 'primeng/primeng';
import { Request } from './../../models/Request';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-csemployee',
  templateUrl: './csemployee.component.html',
  styleUrls: ['./csemployee.component.css']
})
export class CsemployeeComponent implements OnInit {

    requestForm: FormGroup;

    requests: Request [];
    request: Request;

    users: User[];
    user: User;
    userId: number;

    selectedUser: User;

    filteredUsers: User[] = [];


    rerender: boolean;
    cols: any[];

    messages: Message[] = [];
    breadcrumbItems: MenuItem[];

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private requestService: RequestService,
        private cdRef: ChangeDetectorRef,
    ) { }

    ngOnInit() {

        this.breadcrumbItems = [];

        this.breadcrumbItems.push({ label: 'Customer Service Employee' });

        this.initRequestForm();

        this.userService.getUsers().subscribe(u => {
            this.users = u;

            console.log("users", this.users);
        });

        this.requestService.getRequests().subscribe(r => {
            this.requests = r;

            console.log("requests", this.requests);
        });

        this.cols = [

            { field: 'recordNumber', header: 'Rec No' },
            { field: 'clientName', header: 'Client' },
            { field: 'startDate', header: 'Start' },
            { field: 'finishDate', header: 'Finish' },
            { field: 'numberOfAttendees', header: 'No Attendees' },
            { field: 'expectedBudget', header: 'Expected Budget' },

        ];
    }

    initRequestForm() {
        this.requestForm = this.fb.group({
            recordNumber: ['', [Validators.required, Validators.maxLength(255)]],
            clientName: ['', [Validators.required, Validators.maxLength(255)]],
            eventType: ['', [Validators.required, Validators.maxLength(255)]],
            description: ['', [Validators.maxLength(400)]],
            startDate: ['', [Validators.required, Validators.maxLength(255)]],
            finishDate: ['', [Validators.required, Validators.maxLength(255)]],
            numberOfAttendees: ['', [Validators.required, Validators.maxLength(255)]],
            expectedBudget: ['', [Validators.required, Validators.maxLength(255)]],
            signedBy: ['', [Validators.required, Validators.maxLength(255)]],
        });
    }

    hasFormsErrors() {
        return !this.requestForm.valid;
    }

    onSubmit() {
        let r = Object.assign({}, this.request, this.requestForm.value);

        this.setAdditionalProperties(r);

        console.log("u", r);

        this.requestService.create(r)
            .subscribe(x => {
                this.renderTable();
                this.messages.push({ severity: 'success', summary: 'Request Created & Sent to CS manager', detail: 'User created' });
            },
                err => {
                    this.messages.push({ severity: 'error', summary: 'Error', detail: 'An unexpected error happened' });
                });

        this.initRequestForm();

    }

    setAdditionalProperties(r) {
        r.userId = this.userId;
    }

    renderTable() {
        this.requestService.getRequests().subscribe(r => {
            this.requests = r;
            this.rerender = true;
            this.cdRef.detectChanges();
            this.rerender = false;
        });
    }

    cancelRequest() {
        console.log("cancel");
    }

    getFilteredUsers(event) {
        console.log("event", event);
        console.log("this.users", this.users);
        this.filteredUsers = this.filterUsers(event, this.users);
    }


    filterUsers(event, items: any[]): any[] {
        const query = event.query;
        const filteredItems: any[] = [];

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.username.toLowerCase().indexOf(query.toLowerCase()) === 0 ||
                item.department.toLowerCase().indexOf(query.toLowerCase()) === 0) {

                filteredItems.push(item);
            }
        }
        console.log("filteredItems", filteredItems );
        return filteredItems;

    }

    getUserId() {
        this.userId = this.requestForm.value.signedBy.id;
        console.log("this.userid", this.userId);
    }





}
