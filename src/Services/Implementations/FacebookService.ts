import axios, { AxiosResponse } from 'axios';
import { UserAccount } from '../../Entities/UserAccount';
import { FacebookProfile } from '../../Entities/FacebookProfile';
import { ObjectId } from 'mongodb';
import { FacebookRepository } from '../../Repositories/Implementations/FacebookRepository';
import { injectable } from 'tsyringe';

const FACEBOOK_GRAPH_API_BASE_URL = 'https://graph.facebook.com';

@injectable()
export class FacebookService {

    constructor(private readonly facebookRepo: FacebookRepository) { }

    async connectProfile(userId: string, role: string, token: string): Promise<boolean> {

        const fbProfile = await this.getProfile(token);

        const connected = this.facebookRepo.connectProfile(userId, role, fbProfile);

        return connected;
    }

    async getUserAccount(token: string): Promise<any> {
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

            const userData: UserAccount = {
                userId: new ObjectId().toString(),
                username: response.data?.email || '',
                password: '',
                emailId: response.data?.email || '',
                signedUpMethod: 'facebook',
                role: ''
            };

            return userData;
        } catch (error) {
            console.error('Error in fetchUserAndSave:', error);
            return null;
        }
    }

    async getProfile(token: string): Promise<FacebookProfile> {
        try {

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

            return userFbData;
        } catch (error) {
            console.error('Error in fetchUserAndSave:', error);
            throw Error("Error while fetching facebook profile");
        }
    }
}
