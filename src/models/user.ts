export interface User {
    uid: string;
    firstName: string;
    lastName: string;
    initials: string;
    email: string;
    displayName: string;
    emailVerified: boolean;
    projects: any[];
    latestActiveProject: string;
    
}