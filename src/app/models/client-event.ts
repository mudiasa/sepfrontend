export interface ClientEvent {
    id: number;
    type: string;
    description: string;
    startDate: string;
    finishDate: string;
    numberOfAttendees: number;
    budget: number;
    clientId: number;
    userId: number;
    isCreated: boolean;
    isSentToCSManager: boolean;
    isSentToProdManagers: boolean;
    isSentToSubTeams: boolean;

    //Additional
    clientName: string;
    clientPhone: string;
 
}
