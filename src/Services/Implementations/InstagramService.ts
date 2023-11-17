import axios from 'axios';
import { UserAccount } from '../../Entities/UserAccount';
import { ObjectId } from 'mongodb';
import { InstagramProfile } from '../../Entities/InstagramProfile';
import { inject } from 'tsyringe';
import { InstagramRepository } from '../../Repositories/Implementations/InstagramRepository';

const INSTAGRAM_GRAPH_API_BASE_URL = 'https://graph.instagram.com';

export class InstagramService {

    private instagramRepository: InstagramRepository;

    constructor(@inject('InstagramRepository') instagramRepository: InstagramRepository) {
        this.instagramRepository = instagramRepository;
    }

    async fetchUserAndSave(token: string): Promise<any> {

        const response = await axios.get(`${INSTAGRAM_GRAPH_API_BASE_URL}/me`, {
            params: {
                access_token: token,
                fields:
                    'id,first_name,middle_name,last_name,gender,age_range,birthday,email,link,location,about,languages,political,website,picture,short_name',
            },
        });

        // Extract user data from the Facebook API response
        const userInstaProfile: InstagramProfile = {
            instaId: response.data?.id,
            instaHandle: response.data?.instaHandle,
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

        const userData: UserAccount = {
            userId: (new ObjectId()).toString(),
            password: '',
            emailId: response.data?.email,
            signedUpMethod: 'instagram',
            username: "",
            role: ""
        };

        // Create a new user entity using the extracted user data
        const success: boolean = await this.instagramRepository.connectProfile(userData.userId, userData.role, userInstaProfile);

        return success;
    }
}
