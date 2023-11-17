import { ObjectId } from 'mongodb';
import { FacebookProfile } from './FacebookProfile';
import { InstagramProfile } from './InstagramProfile';
import { TwitterProfile } from './TwitterProfile';
import { TiktokProfile } from './TiktokProfile';

export interface brandProfile {
    brandId: string;
    innfluenzaHandle: string,
    name: string;
    description: string;
    contact_no: string;
    address: string;
    contact_email_id: string;
    website: string;
    collaboration_count: number;
    facebookProfiles: FacebookProfile[];
    instagramProfiles: InstagramProfile[];
    twitterProfiles: TwitterProfile[];
    tiktokProfiles: TiktokProfile[];
}

export default brandProfile;