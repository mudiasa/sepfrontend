export interface ClientRequest {
    id: number;
    recordNumber: string;
    clientName: string;
    eventType: string;
    description: string;
    startDate: string;
    finishDate: string;
    numberOfAttendees: number;
    expectedBudget: number;
    userId: number;
    isSentToCSManager: boolean;
    isSentToFinanceManager: boolean;
    isSentToAdminManager: boolean;
    isSentBackToCSManager: boolean;
}
