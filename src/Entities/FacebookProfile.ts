export interface FacebookProfile {
    fbId: string
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    gender: string;
    birthday: Date;
    profileLink: URL;
    location: string[];
    languages: string[];
    profilePicture: URL;
    shortName: string;
    about: string;
    political: string;
    website: URL;
}