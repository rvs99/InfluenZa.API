import axios, { AxiosResponse } from 'axios';
import { UserAccount } from '../../Entities/UserAccount';
import { TikTokProfile } from '../../Entities/TikTokProfile';
import { ObjectId } from 'mongodb';
import { TikTokRepository } from '../../Repositories/Implementations/TikTokRepository';
import { injectable } from 'tsyringe';

const FACEBOOK_GRAPH_API_BASE_URL = 'https://graph.tikTok.com';

@injectable()
export class TikTokService {

    constructor(private readonly tikTokRepo: TikTokRepository) { }

    async connectProfile(userId: string, role: string, token: string): Promise<boolean> {

        const tikTokProfile = await this.getProfile(token);

        const connected = this.tikTokRepo.connectProfile(userId, role, tikTokProfile);

        return connected;
    }

    async getUserAccount(token: string): Promise<any> {
        try {
            console.log('TikTokService initialized');

            const response: AxiosResponse<any> = await axios.get(`${FACEBOOK_GRAPH_API_BASE_URL}/me`, {
                params: {
                    access_token: token,
                    fields: 'id,first_name,middle_name,last_name,gender,age_range,birthday,email,link,location,about,languages,political,website,picture,short_name',
                },
            });

            if (response.status !== 200 || !response.data) {
                throw new Error('Failed to fetch user data from TikTok API');
            }

            const userData: UserAccount = {
                userId: new ObjectId().toString(),
                username: response.data?.email || '',
                password: '',
                emailId: response.data?.email || '',
                signedUpMethod: 'tikTok',
                role: ''
            };

            return userData;
        } catch (error) {
            console.error('Error in fetchUserAndSave:', error);
            return null;
        }
    }

    async getProfile(token: string): Promise<TikTokProfile> {
        try {

            const response: AxiosResponse<any> = await axios.get(`${FACEBOOK_GRAPH_API_BASE_URL}/me`, {
                params: {
                    access_token: token,
                    fields: 'id,first_name,middle_name,last_name,gender,age_range,birthday,email,link,location,about,languages,political,website,picture,short_name',
                },
            });

            if (response.status !== 200 || !response.data) {
                throw new Error('Failed to fetch user data from TikTok API');
            }

            const userFbData: TikTokProfile = {
                ttId: response.data?.id,
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
            throw Error("Error while fetching tikTok profile");
        }
    }
}
