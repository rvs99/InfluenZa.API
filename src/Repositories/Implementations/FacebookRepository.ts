import { autoInjectable, inject } from "tsyringe";
import { FacebookProfile } from "../../Entities/FacebookProfile";
import { DataRepository } from "./DataRepository";
import InfluencerProfile from "../../Entities/InfluencerProfile";
import { Collection } from "mongodb";
import BrandProfile from "../../Entities/BrandProfile";

@autoInjectable()
export class FacebookRepository {

    private influencerCollectionName = 'InfluencerProfiles';
    private facebookProfileCollectionName = 'FacebookProfiles';
    private brandProfileCollectionName = 'BrandProfiles';
    private dataService: DataRepository;
    private facebookProfileCollection: Promise<Collection<FacebookProfile>>;
    private influencerProfileCollection: Promise<Collection<InfluencerProfile>>;
    private brandProfileCollection: Promise<Collection<BrandProfile>>;

    constructor(dataService: DataRepository) {
        this.dataService = dataService;
        this.facebookProfileCollection = this.dataService.getDataCollection<FacebookProfile>(this.facebookProfileCollectionName);
        this.influencerProfileCollection = this.dataService.getDataCollection<InfluencerProfile>(this.influencerCollectionName);
        this.brandProfileCollection = this.dataService.getDataCollection<BrandProfile>(this.brandProfileCollectionName);
    }

    private async getInfluencerCollection(): Promise<Collection<InfluencerProfile>> {
        return await this.influencerProfileCollection;
    }

    private async getBrandCollection(): Promise<Collection<BrandProfile>> {
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