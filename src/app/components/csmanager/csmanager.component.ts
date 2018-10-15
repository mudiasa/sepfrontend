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
    filteredRequests: ClientRequest[];
    request: ClientRequest;

    selectedRequest: ClientRequest; 

    rerender: boolean;
    displayDeleteDialog: boolean;
    cols: any[];

    messages: Message[] = [];
    breadcrumbItems: MenuItem[];

    constructor(
        private requestService: RequestService,
        private cdRef: ChangeDetectorRef,
    ) { }

    ngOnInit() {

        this.breadcrumbItems = [];

        this.filteredRequests = [];

        this.breadcrumbItems.push({ label: 'Customer Service Manager' });

        this.requestService.getRequests().subscribe(r => {
            this.requests = r.filter(r => r.isSentToCSManager === true);
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

    setAdditionalProperties(r) {
        r.isSentToCSManager = false ;
        r.isSentToFinanceManager = true;
        r.isSentToAdminManager = false;
        r.isSentBackToCSManager = false;

        
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
            this.rerender = true;
            this.cdRef.detectChanges();
            this.rerender = false;
        });
    }

    initBooleans() {
        this.displayDeleteDialog = false;
    }

    showDeleteDialog() {
        this.displayDeleteDialog = true;
    }





}
