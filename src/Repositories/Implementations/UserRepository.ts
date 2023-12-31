import { Collection, ObjectId } from 'mongodb';
import { UserAccount } from '../../Entities/UserAccount';
import { autoInjectable } from 'tsyringe';
import influencerProfile from '../../Entities/InfluencerProfile';
import BrandProfile from '../../Entities/BrandProfile';
import { FacebookProfile } from '../../Entities/FacebookProfile';
import { DataRepository } from './DataRepository';

@autoInjectable()
export class UserRepository {

    private userAccountCollectionPromise: Promise<Collection<UserAccount>>;
    private influencerCollectionPromise: Promise<Collection<influencerProfile>>;
    private brandCollectionPromise: Promise<Collection<BrandProfile>>;
    private dataService: DataRepository;

    constructor(dataRepository: DataRepository) {
        this.dataService = dataRepository;
        this.userAccountCollectionPromise = this.dataService.getDataCollection<UserAccount>('userAccounts');
        this.influencerCollectionPromise = this.dataService.getDataCollection<influencerProfile>('influencerProfiles');
        this.brandCollectionPromise = this.dataService.getDataCollection<BrandProfile>('brandProfiles');
    }

    private async getUserCollection(): Promise<Collection<UserAccount>> {
        return await this.userAccountCollectionPromise;
    }

    private async getInfluencerCollection(): Promise<Collection<influencerProfile>> {
        return await this.influencerCollectionPromise;
    }

    private async getBrandCollection(): Promise<Collection<BrandProfile>> {
        return await this.brandCollectionPromise;
    }

    public async createUserWithBasicDetails(userAccount: UserAccount): Promise<{ id?: string; status: string }> {

        const userAccountCollection = await this.getUserCollection();
        const existingUser = await userAccountCollection.findOne<UserAccount>({ emailId: userAccount.emailId });

        if (existingUser) {
            return {
                id: existingUser.userId,
                status: "existing user"
            };
        }

        const result = await userAccountCollection.insertOne(userAccount);

        if (result.acknowledged) {
            if (userAccount.role == 'Influencer') {

                const influencerCollection = await this.getInfluencerCollection();

                const influencerProfile: influencerProfile = {
                    name: '',
                    contact_email_id: userAccount.emailId,
                    collaborationCount: 0,
                    facebookProfiles: [],
                    influencerId: userAccount.userId,
                    description: '',
                    contact_no: '',
                    address: '',
                    website: '',
                    instagramProfiles: [],
                    youtubeProfiles: [],
                    linkedInProfiles: [],
                    twitterProfiles: [],
                    tiktokProfiles: []
                }

                influencerCollection.insertOne(influencerProfile)
            }
            else if (userAccount.role = 'Brand') {
                const brandCollection = await this.getBrandCollection();

                const brandProfile: BrandProfile = {
                    brandId: userAccount.userId,
                    name: '',
                    description: '',
                    contact_no: '',
                    address: '',
                    contact_email_id: userAccount.emailId,
                    website: '',
                    collaboration_count: 0,
                    facebookProfiles: [],
                    instagramProfiles: [],
                    twitterProfiles: [],
                    tiktokProfiles: []
                }

                brandCollection.insertOne(brandProfile);
            }

            return {
                id: userAccount.userId,
                status: "new user"
            }
        }
        else {
            return {
                id: undefined,
                status: "user error"
            };
        }

    }

    public async createUserWithFacebook(facebookProfile: FacebookProfile, role: string): Promise<{ id?: string; status: string }> {

        const userAccountCollection = await this.getUserCollection();
        const existingUser = await userAccountCollection.findOne<UserAccount>({ emailId: facebookProfile.email });

        if (existingUser) {
            return {
                id: existingUser.userId,
                status: "existing user"
            };
        }

        const userId = new ObjectId().toString();
        const userAccount: UserAccount = {
            userId: userId,
            username: facebookProfile.email,
            password: "",
            emailId: facebookProfile.email,
            signedUpMethod: "Facebook",
            role: role
        }

        const result = await userAccountCollection.insertOne(userAccount);

        if (result.acknowledged) {
            if (role == 'Influencer') {

                const influencerCollection = await this.getInfluencerCollection();

                const influencerProfile: influencerProfile = {
                    name: facebookProfile.firstName + " " + facebookProfile.lastName,
                    contact_email_id: facebookProfile.email,
                    collaborationCount: 0,
                    facebookProfiles: [facebookProfile],
                    influencerId: userId,
                    description: '',
                    contact_no: '',
                    address: '',
                    website: '',
                    instagramProfiles: [],
                    youtubeProfiles: [],
                    linkedInProfiles: [],
                    twitterProfiles: [],
                    tiktokProfiles: []
                }

                influencerCollection.insertOne(influencerProfile)
            }
            else if (role = 'Brand') {
                const brandCollection = await this.getBrandCollection();

                const brandProfile: BrandProfile = {
                    brandId: userId,
                    name: facebookProfile.firstName + " " + facebookProfile.lastName,
                    description: '',
                    contact_no: '',
                    address: '',
                    contact_email_id: facebookProfile.email,
                    website: JSON.stringify(facebookProfile.website),
                    collaboration_count: 0,
                    facebookProfiles: [facebookProfile],
                    instagramProfiles: [],
                    twitterProfiles: [],
                    tiktokProfiles: []
                }

                brandCollection.insertOne(brandProfile);
            }

            return {
                id: userId,
                status: "new user"
            }
        }
        else {
            return {
                id: undefined,
                status: "user error"
            };
        }
    }

    async findUserByEmail(emailId: string): Promise<UserAccount | null> {
        const collection = await this.getUserCollection();

        return await collection.findOne<UserAccount>(
            { emailId: emailId },
            { projection: { _id: 0, userId: 1, username: 1, password: 1, emailId: 1, role: 1 } }
        );
    }

    async getUserByUserId(userId: string): Promise<UserAccount | null> {
        console.error("Begin Repo.getUser");
        const collection = await this.getUserCollection();

        var user = await collection.findOne<UserAccount>({ userId: userId },
            { projection: { _id: 0, userId: 1, username: 1, emailId: 1, role: 1 } });

        console.error("End Repo.getUser: User email id " + user.emailId);

        return;
    }
}
