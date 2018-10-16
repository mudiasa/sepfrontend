import { ClientRequest } from './../../models/client-request';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RequestService } from './../../services/request.service';
import { Message, MenuItem } from 'primeng/primeng';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-finance-manager',
  templateUrl: './finance-manager.component.html',
  styleUrls: ['./finance-manager.component.css']
})
export class FinanceManagerComponent implements OnInit {

    requests: ClientRequest[];
    request: ClientRequest;

    feedbackForm: FormGroup;

    selectedRequest: ClientRequest;

    rerender: boolean;
    displayFeedbackDialog: boolean;
    cols: any[];

    messages: Message[] = [];
    breadcrumbItems: MenuItem[];

    constructor(
        private fb: FormBuilder,
        private requestService: RequestService,
        private cdRef: ChangeDetectorRef,
    ) { }

    ngOnInit() {

        this.breadcrumbItems = [];

        this.requests = [];

        this.initFeedbackForm();

        this.breadcrumbItems.push({ label: 'Finance Manager' });

        this.requestService.getRequests().subscribe(r => {
            this.requests = r.filter(r => r.isSentToFinanceManager === true);
        });


        this.cols = [

            { field: 'recordNumber', header: 'Rec No' },
            { field: 'clientName', header: 'Client' },
            { field: 'startDate', header: 'Start' },
            { field: 'finishDate', header: 'Finish' },
            { field: 'numberOfAttendees', header: 'No Attendees' },
            { field: 'expectedBudget', header: 'Expected Budget(Kr)' },

        ];
    }


    hasFormsErrors() {
        return !this.feedbackForm.valid;
    }

    initFeedbackForm() {
        this.feedbackForm = this.fb.group({
            description: ['', [Validators.maxLength(400)]],
        });
    }

    sendToAdminManager() {
        this.setAdditionalProperties(this.selectedRequest);
        console.log("this.selectedRequest", this.selectedRequest)

        this.requestService.update(this.selectedRequest, this.selectedRequest.id)
            .subscribe(r => {
                this.renderTable();
                console.log("req", r);
                this.messages.push({ severity: 'success', summary: 'Success', detail: 'Request Sent to Administration Manager' });
            },
                err => {
                    this.messages.push({ severity: 'error', summary: 'Error', detail: 'An unexpected error happened' });
                });

    }

    saveFeedback() {

        this.selectedRequest.description = this.feedbackForm.value.description;
        this.requestService.update(this.selectedRequest, this.selectedRequest.id)
            .subscribe(r => {
                this.renderTable();
                console.log("req", r);
                this.messages.push({ severity: 'success', summary: 'Success', detail: 'Feedback added' });
            },
                err => {
                    this.messages.push({ severity: 'error', summary: 'Error', detail: 'An unexpected error happened' });
                });
        this.initBooleans();
        this.initFeedbackForm();        

    }

    setAdditionalProperties(r) {
        r.isSentToCSManager = false;
        r.isSentToFinanceManager = false;
        r.isSentToAdminManager = true;
        r.isSentBackToCSManager = false;


    }

    deleteRequest() {
        let r = this.selectedRequest
        this.requestService.delete(r.id)
            .subscribe(x => {
                this.renderTable();
                this.messages.push({ severity: 'success', summary: 'Assignment Deleted', detail: 'Request Deleted!' });
            });
        this.initBooleans();
    }

    renderTable() {
        this.requests = [];
        this.requestService.getRequests().subscribe(r => {
            this.requests = r.filter(r => r.isSentToFinanceManager === true);
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


}
