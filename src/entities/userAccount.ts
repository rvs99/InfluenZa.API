import { ObjectId } from 'mongodb';
import { FacebookProfile } from './facebookProfile';
import { InstagramProfile } from './instagramProfile';
import { TwitterProfile } from './twitterProfile';
import { TiktokProfile } from './tiktokProfile';

export interface UserAccount {
    id: ObjectId;
    name: string;
    password: string;
    emailId: string;
    signedUpMethod: string;
    facebookProfiles: FacebookProfile[];
    instagramProfiles: InstagramProfile[];
    twitterProfiles: TwitterProfile[];
    tiktokProfiles: TiktokProfile[];
}

export default UserAccount;