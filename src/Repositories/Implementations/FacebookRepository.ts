import { injectable } from "tsyringe";
import { FacebookProfile } from "../../Entities/FacebookProfile";
import { DataRepository } from "./DataRepository";
import influencerProfile from "../../Entities/InfluencerProfile";
import { Collection } from "mongodb";
import brandProfile from "../../Entities/BrandProfile";

@injectable()
export class facebookRepository {

    private influencerCollectionName = 'InfluencerProfiles';
    private facebookProfileCollectionName = 'FacebookProfiles';
    private brandProfileCollectionName = 'BrandProfiles';
    private dataService: DataRepository;
    private facebookProfileCollection: Promise<Collection<FacebookProfile>>;
    private influencerProfileCollection: Promise<Collection<influencerProfile>>;
    private brandProfileCollection: Promise<Collection<brandProfile>>;

    constructor() {
        this.dataService = new DataRepository();
        this.facebookProfileCollection = this.dataService.getDataCollection<FacebookProfile>(this.facebookProfileCollectionName);
        this.influencerProfileCollection = this.dataService.getDataCollection<influencerProfile>(this.influencerCollectionName);
        this.brandProfileCollection = this.dataService.getDataCollection<brandProfile>(this.brandProfileCollectionName);
    }

    private async getInfluencerCollection(): Promise<Collection<influencerProfile>> {
        return await this.influencerProfileCollection;
    }

    private async getBrandCollection(): Promise<Collection<brandProfile>> {
        return await this.brandProfileCollection;
    }

    private async getFacebookProfileCollection(): Promise<Collection<FacebookProfile>> {
        return await this.facebookProfileCollection;
    }

    async createFacebookProfile(userData: FacebookProfile): Promise<any> {
        const facebookProfileCollection = await this.getFacebookProfileCollection();
        const result = await facebookProfileCollection.insertOne(userData);
        return await result.insertedId;
    }

    async connectProfile(userId: string, role: string, userProfile: FacebookProfile): Promise<boolean> {

        if (role == "Influencer") {
            const influencerCollection = await this.getInfluencerCollection();
            const exist = await influencerCollection.findOne({ fbId: userProfile.fbId });

            if (exist != null) {
                throw Error("facebook profile already attached");
            }

            const updateResult = await influencerCollection.updateOne(
                { influencerId: userId },
                { $push: { facebookProfiles: userProfile } });

            return updateResult.modifiedCount === 1 ? true : false;
        }
        else if (role == "Brand") {
            const brandCollection = await this.getBrandCollection();

            const pipeline = [
                {
                    $match: {
                        'facebookProfiles.fbId': userProfile.fbId
                    }
                },
                {
                    $project: {
                        _id: 0,
                        facebookProfiles: 1
                    }
                }
            ];

            const exist = await brandCollection.aggregate(pipeline).toArray();

            if (exist != null) {
                throw Error("facebook profile already attached");
            }

            const updateResult = await brandCollection.updateOne(
                { brandId: userId },
                { $push: { facebookProfiles: userProfile } });

            return updateResult.modifiedCount === 1 ? true : false;
        }
    }
}