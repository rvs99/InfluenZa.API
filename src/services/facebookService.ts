import axios, { AxiosResponse } from 'axios';
import { createUser, findUserByEmail } from '../repositories/userRepository';
import { UserAccount } from '../entities/userAccount';
import { FacebookProfile } from '../entities/facebookProfile';
import { ObjectId } from 'mongodb';

const FACEBOOK_GRAPH_API_BASE_URL = 'https://graph.facebook.com';

export class FacebookService {
    async fetchUserAndSave(token: string): Promise<any> {
        try {
            console.log('FacebookService initialized');

            const response: AxiosResponse<any> = await axios.get(`${FACEBOOK_GRAPH_API_BASE_URL}/me`, {
                params: {
                    access_token: token,
                    fields: 'id,first_name,middle_name,last_name,gender,age_range,birthday,email,link,location,about,languages,political,website,picture,short_name',
                },
            });

            if (response.status !== 200 || !response.data) {
                throw new Error('Failed to fetch user data from Facebook API');
            }

            const userFbData: FacebookProfile = {
                fbId: response.data?.id,
                firstName: response.data?.first_name,
                lastName: response.data?.last_name,
                gender: response.data?.gender,
                birthday: new Date(response.data?.birthday),
                email: response.data?.email,
                profileLink: response.data?.link,
                location: response.data?.location?.name,
                languages: (response.data?.languages || []).map((lang: { id: string; name: string }) => lang.name),
                profilePicture: response.data?.picture?.data?.url,
                shortName: response.data?.short_name,
                middleName: response.data?.middle_name,
                about: response.data?.about,
                political: response.data?.political,
                website: response.data?.website,
            };

            const userData: UserAccount = {
                id: new ObjectId(),
                name: response.data?.first_name || '',
                password: '',
                emailId: response.data?.email || '',
                signedUpMethod: 'facebook',
                facebookProfiles: [userFbData],
                instagramProfiles: [],
                twitterProfiles: [],
                tiktokProfiles: [],
            };

            const newUser = await createUser(userData);

            return newUser;

        } catch (error) {
            console.error('Error in fetchUserAndSave:', error);
            return null;
        }
    }
}
