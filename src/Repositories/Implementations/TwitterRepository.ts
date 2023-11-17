import { inject, injectable } from "tsyringe";
import { TwitterProfile } from "../../Entities/TwitterProfile";
import { DataRepository } from "./DataRepository";
import InfluencerProfile from "../../Entities/InfluencerProfile";
import { Collection } from "mongodb";
import BrandProfile from "../../Entities/BrandProfile";

@injectable()
export class TwitterRepository {

    private influencerCollectionName = 'InfluencerProfiles';
    private twitterProfileCollectionName = 'TwitterProfiles';
    private brandProfileCollectionName = 'BrandProfiles';
    private dataService: DataRepository;
    private twitterProfileCollection: Promise<Collection<TwitterProfile>>;
    private influencerProfileCollection: Promise<Collection<InfluencerProfile>>;
    private brandProfileCollection: Promise<Collection<BrandProfile>>;

    constructor(@inject('DataRepository') dataService: DataRepository) {
        this.dataService = dataService;
        this.twitterProfileCollection = this.dataService.getDataCollection<TwitterProfile>(this.twitterProfileCollectionName);
        this.influencerProfileCollection = this.dataService.getDataCollection<InfluencerProfile>(this.influencerCollectionName);
        this.brandProfileCollection = this.dataService.getDataCollection<BrandProfile>(this.brandProfileCollectionName);
    }

    private async getInfluencerCollection(): Promise<Collection<InfluencerProfile>> {
        return await this.influencerProfileCollection;
    }

    private async getBrandCollection(): Promise<Collection<BrandProfile>> {
        return await this.brandProfileCollection;
    }

    private async getTwitterProfileCollection(): Promise<Collection<TwitterProfile>> {
        return await this.twitterProfileCollection;
    }

    async createTwitterProfile(userData: TwitterProfile): Promise<any> {
        const twitterProfileCollection = await this.getTwitterProfileCollection();
        const result = await twitterProfileCollection.insertOne(userData);
        return await result.insertedId;
    }

    async connectProfile(userId: string, role: string, userProfile: TwitterProfile): Promise<boolean> {

        if (role == "Influencer") {
            const influencerCollection = await this.getInfluencerCollection();
            const exist = await influencerCollection.findOne({ twitterId: userProfile.twitterId });

            if (exist != null) {
                throw Error("twitter profile already attached");
            }

            const updateResult = await influencerCollection.updateOne(
                { influencerId: userId },
                { $push: { twitterProfiles: userProfile } });

            return updateResult.modifiedCount === 1 ? true : false;
        }
        else if (role == "Brand") {
            const brandCollection = await this.getBrandCollection();

            const pipeline = [
                {
                    $match: {
                        'twitterProfiles.twitterId': userProfile.twitterId
                    }
                },
                {
                    $project: {
                        _id: 0,
                        twitterProfiles: 1
                    }
                }
            ];

            const exist = await brandCollection.aggregate(pipeline).toArray();

            if (exist != null) {
                throw Error("twitter profile already attached");
            }

            const updateResult = await brandCollection.updateOne(
                { brandId: userId },
                { $push: { twitterProfiles: userProfile } });

            return updateResult.modifiedCount === 1 ? true : false;
        }
    }
}