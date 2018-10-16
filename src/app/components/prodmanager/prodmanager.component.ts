import { EventService } from './../../services/event.service';
import { Message, MenuItem } from 'primeng/primeng';
import { ClientEvent } from './../../models/client-event';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-prodmanager',
  templateUrl: './prodmanager.component.html',
  styleUrls: ['./prodmanager.component.css']
})
export class ProdmanagerComponent implements OnInit {

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
        private eventService: EventService,
        private cdRef: ChangeDetectorRef,
    ) { }

    ngOnInit() {

        this.breadcrumbItems = [];

        this.breadcrumbItems.push({ label: 'Production Manager - Service Dept.' });

        this.eventService.getEvents().subscribe(e => {
            this.myEvents = e.filter(e => e.isSentToProdManagers === true);
        });


        this.colsEvent = [

            { field: 'type', header: 'Type' },
            { field: 'startDate', header: 'Start' },
            { field: 'finishDate', header: 'Finish' },
            { field: 'budget', header: 'Buget' },
            { field: 'numberOfAttendees', header: 'No Attendees' },
            { field: 'ClientName', header: 'Client' },
            { field: 'ClientPhone', header: 'Phone' },
            { field: 'description', header: 'Comments' },

        ];
    }

    sendEventToSubTeams() {
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

    setAdditionalEventProperties(e) {
        e.isCreated = true;
        e.isSentToCSManager = false;
        e.isSentToProdManagers = false;
        e.isSentToSubTeams = true;
    }

    renderTable() {

        this.eventService.getEvents().subscribe(e => {
            this.myEvents = e.filter(r => r.isSentToProdManagers === true);

            this.rerender = true;
            this.cdRef.detectChanges();
            this.rerender = false;

        });
    }

    initBooleans() {
        this.displayDeleteDialog = false;
        this.displayEventDialog = false;
    }




}
