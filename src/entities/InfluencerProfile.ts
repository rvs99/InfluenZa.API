import { ObjectId } from 'mongodb';
import { FacebookProfile } from './FacebookProfile';
import { InstagramProfile } from './InstagramProfile';
import { TwitterProfile } from './TwitterProfile';
import { TikTokProfile } from './TiktokProfile';
import { LinkedInProfile } from './LinkedInProfile';
import { YouTubeProfile } from './YoutubeProfile';

export interface influencerProfile {
    influencerId: string;
    name: string;
    description: string;
    contact_no: string;
    address: string;
    contact_email_id: string;
    website: string;
    collaborationCount: number;
    facebookProfiles: FacebookProfile[];
    instagramProfiles: InstagramProfile[];
    youtubeProfiles: YouTubeProfile[];
    linkedInProfiles: LinkedInProfile[];
    twitterProfiles: TwitterProfile[];
    tiktokProfiles: TikTokProfile[];
}

export default influencerProfile;