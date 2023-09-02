export class User {
    uid: string;
    firstName: string;
    lastName: string;
    initials: string;
    email: string;
    displayName: string;
    emailVerified: boolean;
    contacts: any[];
    projects: any[];
    latestActiveProject: string;
    public: boolean;
}