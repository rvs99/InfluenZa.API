import axios from 'axios';
import { createUser } from '../repositories/userRepository';
import {User} from '../entities/userAccount';
import { ObjectId } from 'mongodb';
import { InstagramProfile } from '../entities/instagramProfile';

const INSTAGRAM_GRAPH_API_BASE_URL = 'https://graph.instagram.com';

export class InstagramService {
    async fetchUserAndSave(token: string): Promise<any> {
        const response = await axios.get(`${INSTAGRAM_GRAPH_API_BASE_URL}/me`, {
            params: {
                access_token: token,
                fields:
                    'id,first_name,middle_name,last_name,gender,age_range,birthday,email,link,location,about,languages,political,website,picture,short_name',
            },
        });

        // Extract user data from the Facebook API response
        const userFbData: InstagramProfile = {
            fbId: response.data?.id,
            firstName: response.data?.first_name,
            lastName: response.data?.last_name,
            gender: response.data?.gender,
            birthday: new Date(response.data?.birthday),
            email: response.data?.email,
            profileLink: response.data?.link,
            location: response.data?.location?.name,
            languages: response.data?.languages?.map((lang: { id: string; name: string; }) => lang.name) || [],
            profilePicture: response.data?.picture?.data?.url,
            shortName: response.data?.short_name,
            middleName: response.data?.middle_name,
            about: response.data?.about,
            political: response.data?.political,
            website: response.data?.website
        };

        const userData: User = {
            id: new ObjectId(),
            name: response.data?.first_name,
            password: '',
            email: response.data?.email,
            signedUpMethod: 'instagram',
            facebookProfiles: [userFbData],
            instagramProfiles: [],
            twitterProfiles: [],
            tiktokProfiles: []
        };

        // Create a new user entity using the extracted user data
        const userId: ObjectId = await createUser(userData);
            
        return userId;
    }
}
