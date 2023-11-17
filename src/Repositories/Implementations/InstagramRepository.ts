import { DataRepository } from "./DataRepository";
import { InstagramProfile } from '../../Entities/InstagramProfile';
import { Collection } from "mongodb";
import { inject, injectable } from "tsyringe";
import InfluencerProfile from "../../Entities/InfluencerProfile";
import BrandProfile from "../../Entities/BrandProfile";

@injectable()
export class InstagramRepository {

    private influencerCollectionName = 'InfluencerProfiles';
    private instagramProfileCollectionName = 'InstagramProfile';
    private brandProfileCollectionName = 'BrandProfiles';
    private dataService: DataRepository;
    private instagramProfileCollection: Promise<Collection<InstagramProfile>>;
    private influencerProfileCollection: Promise<Collection<InfluencerProfile>>;
    private brandProfileCollection: Promise<Collection<BrandProfile>>;

    constructor(@inject('DataRepository') dataService: DataRepository) {
        this.dataService = dataService;
        this.instagramProfileCollection = this.dataService.getDataCollection<InstagramProfile>(this.instagramProfileCollectionName);
        this.influencerProfileCollection = this.dataService.getDataCollection<InfluencerProfile>(this.influencerCollectionName);
        this.brandProfileCollection = this.dataService.getDataCollection<BrandProfile>(this.brandProfileCollectionName);
    }

    async createFacebookProfile(userData: InstagramProfile): Promise<any> {
        var instagramProfileCollection = await this.getInstagramProfileCollection();
        const result = await instagramProfileCollection.insertOne(userData);
        return await result.insertedId;
    }

    async connectProfile(userId: string, role: string, userProfile: InstagramProfile): Promise<boolean> {

        if (role == "Influencer") {
            const influencerCollection = await this.getInfluencerCollection();
            const exist = await influencerCollection.findOne({ fbId: userProfile.fbId });

            if (exist != null) {
                throw Error("Instagram profile already attached");
            }

            const updateResult = await influencerCollection.updateOne(
                { influencerId: userId },
                { $push: { instagramProfiles: userProfile } });

            return updateResult.modifiedCount === 1 ? true : false;
        }
        else if (role == "Brand") {
            const brandCollection = await this.getBrandCollection();

            const pipeline = [
                {
                    $match: {
                        'instagramProfiles.fbId': userProfile.fbId
                    }
                },
                {
                    $project: {
                        _id: 0,
                        instagramProfiles: 1
                    }
                }
            ];

            const exist = await brandCollection.aggregate(pipeline).toArray();

            if (exist != null) {
                throw Error("Instagram profile already attached");
            }

            const updateResult = await brandCollection.updateOne(
                { brandId: userId },
                { $push: { facebookProfiles: userProfile } });

            return updateResult.modifiedCount === 1 ? true : false;
        }
    }

    private async getInfluencerCollection(): Promise<Collection<InfluencerProfile>> {
        return await this.influencerProfileCollection;
    }

    private async getBrandCollection(): Promise<Collection<BrandProfile>> {
        return await this.brandProfileCollection;
    }

    private async getInstagramProfileCollection(): Promise<Collection<InstagramProfile>> {
        return await this.instagramProfileCollection;
    }
}