import { autoInjectable } from "tsyringe";
import { TikTokProfile } from "../../Entities/TikTokProfile";
import { DataRepository } from "./DataRepository";
import InfluencerProfile from "../../Entities/InfluencerProfile";
import { Collection } from "mongodb";
import BrandProfile from "../../Entities/BrandProfile";

@autoInjectable()
export class TikTokRepository {

    private influencerCollectionName = 'InfluencerProfiles';
    private tikTokProfileCollectionName = 'TikTokProfiles';
    private brandProfileCollectionName = 'BrandProfiles';
    private dataService: DataRepository;
    private tikTokProfileCollection: Promise<Collection<TikTokProfile>>;
    private influencerProfileCollection: Promise<Collection<InfluencerProfile>>;
    private brandProfileCollection: Promise<Collection<BrandProfile>>;

    constructor(dataService: DataRepository) {
        this.dataService = dataService;
        this.tikTokProfileCollection = this.dataService.getDataCollection<TikTokProfile>(this.tikTokProfileCollectionName);
        this.influencerProfileCollection = this.dataService.getDataCollection<InfluencerProfile>(this.influencerCollectionName);
        this.brandProfileCollection = this.dataService.getDataCollection<BrandProfile>(this.brandProfileCollectionName);
    }

    private async getInfluencerCollection(): Promise<Collection<InfluencerProfile>> {
        return await this.influencerProfileCollection;
    }

    private async getBrandCollection(): Promise<Collection<BrandProfile>> {
        return await this.brandProfileCollection;
    }

    private async getTikTokProfileCollection(): Promise<Collection<TikTokProfile>> {
        return await this.tikTokProfileCollection;
    }

    async createTikTokProfile(userData: TikTokProfile): Promise<any> {
        const tikTokProfileCollection = await this.getTikTokProfileCollection();
        const result = await tikTokProfileCollection.insertOne(userData);
        return await result.insertedId;
    }

    async connectProfile(userId: string, role: string, userProfile: TikTokProfile): Promise<boolean> {

        if (role == "Influencer") {
            const influencerCollection = await this.getInfluencerCollection();
            const exist = await influencerCollection.findOne({ ttId: userProfile.ttId });

            if (exist != null) {
                throw Error("tikTok profile already attached");
            }

            const updateResult = await influencerCollection.updateOne(
                { influencerId: userId },
                { $push: { tikTokProfiles: userProfile } });

            return updateResult.modifiedCount === 1 ? true : false;
        }
        else if (role == "Brand") {
            const brandCollection = await this.getBrandCollection();

            const pipeline = [
                {
                    $match: {
                        'tikTokProfiles.ttId': userProfile.ttId
                    }
                },
                {
                    $project: {
                        _id: 0,
                        tikTokProfiles: 1
                    }
                }
            ];

            const exist = await brandCollection.aggregate(pipeline).toArray();

            if (exist != null) {
                throw Error("tikTok profile already attached");
            }

            const updateResult = await brandCollection.updateOne(
                { brandId: userId },
                { $push: { tikTokProfiles: userProfile } });

            return updateResult.modifiedCount === 1 ? true : false;
        }
    }
}