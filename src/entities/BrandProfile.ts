import { FacebookProfile } from './FacebookProfile';
import { InstagramProfile } from './InstagramProfile';
import { TwitterProfile } from './TwitterProfile';
import { TikTokProfile } from './TiktokProfile';

export interface BrandProfile {
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
    tiktokProfiles: TikTokProfile[];
}

export default BrandProfile;