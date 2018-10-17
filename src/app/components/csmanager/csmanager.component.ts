import { Client } from 'src/app/models/client';
import { ClientService } from './../../services/client.service';
import { EventService } from './../../services/event.service';
import { ClientEvent } from './../../models/client-event';
import { ClientRequest } from './../../models/client-request';

import { RequestService } from './../../services/request.service';
import { Message, MenuItem } from 'primeng/primeng';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-csmanager',
  templateUrl: './csmanager.component.html',
  styleUrls: ['./csmanager.component.css']
})
export class CsmanagerComponent implements OnInit {

    requests: ClientRequest[];
    request: ClientRequest;

    client: Client;

    selectedRequest: ClientRequest; 

    myEvents: ClientEvent[];
    myEvent: ClientEvent;
    selectedEvent: ClientEvent

    rerender: boolean;
    displayDeleteDialog: boolean;
    displayEventDialog: boolean;
    cols: any[];
    colsEvent: any[];

    messages: Message[] = [];
    breadcrumbItems: MenuItem[];

    constructor(
        private requestService: RequestService,
        private eventService: EventService,
        private clientService: ClientService,
        private cdRef: ChangeDetectorRef,
    ) { }

    ngOnInit() {

        this.breadcrumbItems = [];

        this.breadcrumbItems.push({ label: 'Customer Service Manager' });

        this.requestService.getRequests().subscribe(r => {
            this.requests = r.filter(r => r.isSentToCSManager === true);
        });

        this.eventService.getEvents().subscribe(e => {
            this.myEvents = e.filter(e => e.isSentToCSManager === true);
            
            // console.log("this.myEvents", this.myEvents);

            // for (var i = 0; i < this.myEvents.length; i++) {
            //     var cId = this.myEvents[i].clientId;
            //     console.log("cId", cId );

            //     this.clientService.getclients().subscribe(c => {
            //         console.log("c",c );
            //         this.client = c.find(x => x.id === cId);

            //         console.log("this.client ", this.client );

            //         e[i].clientName = this.client.name;
            //         e[i].clientPhone = this.client.phone;

            //         console.log("e",e);

            //         this.eventService.update(e[i], e[i].id).subscribe(c=>{
            //             console.log("c",c);
            //         });
            //     });
                
            // }
                
        });

        
        this.cols = [

            { field: 'recordNumber', header: 'Rec No' },
            { field: 'clientName', header: 'Client' },
            { field: 'startDate', header: 'Start' },
            { field: 'finishDate', header: 'Finish' },
            { field: 'numberOfAttendees', header: 'No Attendees' },
            { field: 'expectedBudget', header: 'Expected Budget(Kr)' },

        ];

        this.colsEvent = [

            { field: 'type', header: 'Type' },
            { field: 'startDate', header: 'Start' },
            { field: 'finishDate', header: 'Finish' },
            { field: 'budget', header: 'Buget' },
            { field: 'numberOfAttendees', header: 'No Attendees' },
            { field: 'clientName', header: 'Client' },
            { field: 'clientPhone', header: 'Phone' },

        ];
    }

   


    sendToFinancialManager() {
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

    sendEventToProd() {
        this.setAdditionalEventProperties(this.selectedEvent);

        console.log("this.selectedEvent", this.selectedEvent)

        this.eventService.update(this.selectedEvent, this.selectedEvent.id)
            .subscribe(e => {
                this.renderTable();
                console.log("ee", e);
                this.messages.push({ severity: 'success', summary: 'Success', detail: 'Event Sent to Prod Managers' });
            },
                err => {
                    this.messages.push({ severity: 'error', summary: 'Error', detail: 'An unexpected error happened' });
                });

    }

    setAdditionalProperties(r) {
        r.isSentToCSManager = false ;
        r.isSentToFinanceManager = true;
        r.isSentToAdminManager = false;
        r.isSentBackToCSManager = false; 
    }

    setAdditionalEventProperties(e) {
        e.isCreated = true;
        e.isSentToCSManager = false;
        e.isSentToProdManagers = true;
        e.isSentToSubTeams = false;
    }

    deleteRequest() {
        let r = this.selectedRequest
        this.requestService.delete(r.id)
            .subscribe(x => {
                this.renderTable();
                this.messages.push({ severity: 'success', summary: 'Assignment Deleted', detail: 'Request Deleted!' });
            });
        this.renderTable();
        this.initBooleans();
    }

    renderTable() {

        this.requestService.getRequests().subscribe(r => {
            this.requests = r.filter(r => r.isSentToCSManager === true);

            this.eventService.getEvents().subscribe(e => {
                this.myEvents = e.filter(r => r.isSentToCSManager === true);
            });
                
            this.rerender = true;
            this.cdRef.detectChanges();
            this.rerender = false;
        
        });
    }

    initBooleans() {
        this.displayDeleteDialog = false;
        this.displayEventDialog = false;
    }

    showDeleteDialog() {
        this.displayDeleteDialog = true;
    }

    showEventDialog() {
        this.displayEventDialog = true;
    }

    planWithClient() {
        this.messages.push({ severity: '', summary: '', detail: 'Feature Not Implemented :)' });
    }

  





}
