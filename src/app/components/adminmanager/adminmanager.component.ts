import { EventService } from './../../services/event.service';
import { ClientEvent } from './../../models/client-event';
import { ClientService } from './../../services/client.service';
import { UserService } from './../../services/user.service';
import { User } from './../../models/user';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Message, MenuItem } from 'primeng/primeng';
import { ClientRequest } from './../../models/client-request';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RequestService } from 'src/app/services/request.service';
import { Client } from 'src/app/models/client';


@Component({
  selector: 'app-adminmanager',
  templateUrl: './adminmanager.component.html',
  styleUrls: ['./adminmanager.component.css']
})
export class AdminmanagerComponent implements OnInit {

    eventForm: FormGroup;

    requests: ClientRequest[];
    filteredRequests: ClientRequest[];
    request: ClientRequest;

    selectedRequest: ClientRequest;

    rerender: boolean;
    displayCreateEventDialog: boolean;
    cols: any[];

    users: User[];
    user: User;
    userId: number;
    selectedUser: User;
    filteredUsers: User[] = [];

    myEvent: ClientEvent;

    clients: Client[];
    client: Client;
    clientId: number;
    selectedClient: Client;
    filteredClients: Client[] = [];

    messages: Message[] = [];
    breadcrumbItems: MenuItem[];

    constructor(
        private fb: FormBuilder,
        private requestService: RequestService,
        private clientService: ClientService,
        private eventService: EventService,
        private userService: UserService,
        private cdRef: ChangeDetectorRef,
    ) { }


    ngOnInit() {
        this.breadcrumbItems = [];

        this.filteredRequests = [];

        this.initeventForm();

        this.breadcrumbItems.push({ label: 'Administration Manager' });

        this.requestService.getRequests().subscribe(r => {
            this.requests = r.filter(r => r.isSentToAdminManager === true);
        });

        this.userService.getUsers().subscribe(u => {
            this.users = u;

            console.log("users", this.users);
        });

        this.clientService.getclients().subscribe(e => {
            this.clients = e;

        });

        this.cols = [

            { field: 'recordNumber', header: 'Rec No' },
            { field: 'clientName', header: 'Client' },
            { field: 'startDate', header: 'Start' },
            { field: 'finishDate', header: 'Finish' },
            { field: 'numberOfAttendees', header: 'No Attendees' },
            { field: 'expectedBudget', header: 'Expected Budget(Kr)' },
            { field: 'description', header: 'FM Feedback' },

        ];

        
    }

    hasFormsErrors() {
        return !this.eventForm.valid;
    }

    initeventForm() {
        this.eventForm = this.fb.group({
            signedBy: ['', [Validators.required, Validators.maxLength(255)]],
            client: ['', [Validators.required, Validators.maxLength(255)]],

        });
    }


    setRequestReadyToArchive() {
        this.setAdditionalProperties(this.selectedRequest);
        console.log("this.selectedRequest", this.selectedRequest)

        this.requestService.update(this.selectedRequest, this.selectedRequest.id)
            .subscribe(r => {
                this.renderTable();
                console.log("req", r);
                this.messages.push({ severity: 'success', summary: 'Success', detail: 'Request Sent to Finance Manager' });
            },
                err => {
                    this.messages.push({ severity: 'error', summary: 'Error', detail: 'An unexpected error happened' });
                });

    }

    createEventFromRequest() {

        let e: ClientEvent ;
        e = Object.assign({}, this.myEvent, this.eventForm.value);

        e.type = this.selectedRequest.eventType,
        e.startDate = this.selectedRequest.startDate,
        e.finishDate = this.selectedRequest.finishDate,
        e.numberOfAttendees = this.selectedRequest.numberOfAttendees,
        e.budget = this.selectedRequest.expectedBudget,
        e.clientId = this.clientId,
        e.userId = this.userId,

        this.setAdditionalEventProperties(e); 


        console.log("e", e);

        this.eventService.create(e)
            .subscribe(x => {
                this.setRequestReadyToArchive();               
                this.renderTable();
                this.messages.push({ severity: 'success', summary: 'Success', detail: 'Event created' });
            },
                err => {
                    this.messages.push({ severity: 'error', summary: 'Error', detail: 'An unexpected error happened' });
                });

        this.initeventForm();
        this.initBooleans();

    }

    setAdditionalProperties(r) {
        r.isSentToCSManager = false;
        r.isSentToFinanceManager = false;
        r.isSentToAdminManager = false;
        r.isSentBackToCSManager = false;
    }

    setAdditionalEventProperties(e) {
        e.isCreated = true;
        e.isSentToCSManager = true;
        e.isSentToProdManagers = false;
        e.isSentToSubTeams = false;
    }

    rejectRequest() {
        this.selectedRequest.isSentToCSManager = false;
        this.selectedRequest.isSentToFinanceManager = true;
        this.selectedRequest.isSentToAdminManager = false;
        this.selectedRequest.isSentBackToCSManager = false;

        this.requestService.update(this.selectedRequest, this.selectedRequest.id)
            .subscribe(r => {
                this.renderTable();
                console.log("req", r);
                this.messages.push({ severity: 'success', summary: 'Success', detail: 'Request Sent to Finance Manager' });
            },
                err => {
                    this.messages.push({ severity: 'error', summary: 'Error', detail: 'An unexpected error happened' });
                });
        this.initBooleans();
    }

    renderTable() {
        this.requestService.getRequests().subscribe(r => {
            this.requests = r.filter(r => r.isSentToAdminManager === true);
            this.rerender = true;
            this.cdRef.detectChanges();
            this.rerender = false;
        });
    }

    initBooleans() {
        this.displayCreateEventDialog = false;

        //this.selectedRequest = undefined;
    }

    showCreateEventDialog() {
        this.displayCreateEventDialog = true;
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
        console.log("filteredItems", filteredItems);
        return filteredItems;

    }

    getUserId() {
        this.userId = this.eventForm.value.signedBy.id;
        console.log("this.userid", this.userId);
    }

    getFiltereClients(event) {
        this.filteredClients = this.filterClients(event, this.clients);
    }


    filterClients(event, items: any[]): any[] {
        const query = event.query;
        const filteredItems: any[] = [];

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.name.toLowerCase().indexOf(query.toLowerCase()) === 0 ||
                item.email.toLowerCase().indexOf(query.toLowerCase()) === 0) {

                filteredItems.push(item);
            }
        }
        console.log("filteredItems", filteredItems);
        return filteredItems;

    }

    getClientId() {
        this.clientId = this.eventForm.value.client.id;
        console.log("this.myEventId", this.clientId);
    }





}
