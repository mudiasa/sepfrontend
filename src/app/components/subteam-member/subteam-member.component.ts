import { EventService } from 'src/app/services/event.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Message, MenuItem } from 'primeng/primeng';
import { ClientEvent } from './../../models/client-event';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-subteam-member',
  templateUrl: './subteam-member.component.html',
  styleUrls: ['./subteam-member.component.css']
})
export class SubteamMemberComponent implements OnInit {

    feedbackForm: FormGroup;

    myEvents: ClientEvent[];
    myEvent: ClientEvent;
    selectedEvent: ClientEvent

    rerender: boolean;
    displayFeedbackDialog: boolean;

    cols: any[];
    colsEvent: any[];

    messages: Message[] = [];
    breadcrumbItems: MenuItem[];

    constructor(
        private fb: FormBuilder,
        private eventService: EventService,
        private cdRef: ChangeDetectorRef,
    ) { }

    ngOnInit() {

        this.breadcrumbItems = [];

        this.initFeedbackForm();

        this.breadcrumbItems.push({ label: 'Production Subteam Member' });

        this.eventService.getEvents().subscribe(e => {
            this.myEvents = e.filter(e => e.isSentToSubTeams === true);
        });


        this.cols = [

            { field: 'type', header: 'Type' },
            { field: 'startDate', header: 'Start' },
            { field: 'finishDate', header: 'Finish' },
            { field: 'budget', header: 'Buget' },
            { field: 'numberOfAttendees', header: 'No Attendees' },
            { field: 'clientName', header: 'Client' },
            { field: 'clientPhone', header: 'Phone' },
            { field: 'description', header: 'Comments' },

        ];
    }

    initFeedbackForm() {
        this.feedbackForm = this.fb.group({
            description: ['', [Validators.maxLength(400)]],
        });
    }

    hasFormsErrors() {
        return !this.feedbackForm.valid;
    }


    sendBackToProdManager() {
        this.setAdditionalEventProperties(this.selectedEvent);

        console.log("this.selectedEvent", this.selectedEvent)

        this.eventService.update(this.selectedEvent, this.selectedEvent.id)
            .subscribe(e => {
                this.renderTable();
                console.log("ee", e);
                this.messages.push({ severity: 'success', summary: 'Success', detail: 'Event Sent to Prod Manager' });
            },
                err => {
                    this.messages.push({ severity: 'error', summary: 'Error', detail: 'An unexpected error happened' });
                });

    }

    setAdditionalEventProperties(e) {
        e.isCreated = true;
        e.isSentToCSManager = false;
        e.isSentToProdManagers = true;
        e.isSentToSubTeams = false;
    }

    renderTable() {

        this.eventService.getEvents().subscribe(e => {
            this.myEvents = e.filter(r => r.isSentToSubTeams === true);

            this.rerender = true;
            this.cdRef.detectChanges();
            this.rerender = false;

        });
    }

    initBooleans() {
        this.displayFeedbackDialog = false;
    }


    showFeedbackDialog() {
        this.displayFeedbackDialog = true;
    }

    ArchiveEvent() {

        this.selectedEvent.isCreated = false;
        this.selectedEvent.isSentToCSManager = false;
        this.selectedEvent.isSentToProdManagers = false;
        this.selectedEvent.isSentToSubTeams = false;

        this.eventService.update(this.selectedEvent, this.selectedEvent.id)
            .subscribe(e => {
                this.renderTable();
                this.messages.push({ severity: 'success', summary: 'Success', detail: 'Event Archived!' });
            },
                err => {
                    this.messages.push({ severity: 'error', summary: 'Error', detail: 'An unexpected error happened' });
                });
        this.initBooleans();
        this.initFeedbackForm();
    }

    saveFeedback() {

        this.selectedEvent.description = this.feedbackForm.value.description;
        this.eventService.update(this.selectedEvent, this.selectedEvent.id)
            .subscribe(e => {
                this.renderTable();
                this.messages.push({ severity: 'success', summary: 'Success', detail: 'Feedback added' });
            },
                err => {
                    this.messages.push({ severity: 'error', summary: 'Error', detail: 'An unexpected error happened' });
                });
        this.initBooleans();
        this.initFeedbackForm();

    }

}
