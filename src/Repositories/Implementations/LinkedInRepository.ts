import { autoInjectable } from "tsyringe";
import { LinkedInProfile } from "../../Entities/LinkedInProfile";
import { DataRepository } from "./DataRepository";
import InfluencerProfile from "../../Entities/InfluencerProfile";
import { Collection } from "mongodb";
import BrandProfile from "../../Entities/BrandProfile";

@autoInjectable()
export class LinkedInRepository {

    private influencerCollectionName = 'InfluencerProfiles';
    private linkedInProfileCollectionName = 'LinkedInProfiles';
    private brandProfileCollectionName = 'BrandProfiles';
    private dataService: DataRepository;
    private linkedInProfileCollection: Promise<Collection<LinkedInProfile>>;
    private influencerProfileCollection: Promise<Collection<InfluencerProfile>>;
    private brandProfileCollection: Promise<Collection<BrandProfile>>;

    constructor(dataService: DataRepository) {
        this.dataService = dataService;
        this.linkedInProfileCollection = this.dataService.getDataCollection<LinkedInProfile>(this.linkedInProfileCollectionName);
        this.influencerProfileCollection = this.dataService.getDataCollection<InfluencerProfile>(this.influencerCollectionName);
        this.brandProfileCollection = this.dataService.getDataCollection<BrandProfile>(this.brandProfileCollectionName);
    }

    private async getInfluencerCollection(): Promise<Collection<InfluencerProfile>> {
        return await this.influencerProfileCollection;
    }

    private async getBrandCollection(): Promise<Collection<BrandProfile>> {
        return await this.brandProfileCollection;
    }

    private async getLinkedInProfileCollection(): Promise<Collection<LinkedInProfile>> {
        return await this.linkedInProfileCollection;
    }

    async createLinkedInProfile(userData: LinkedInProfile): Promise<any> {
        const linkedInProfileCollection = await this.getLinkedInProfileCollection();
        const result = await linkedInProfileCollection.insertOne(userData);
        return await result.insertedId;
    }

    async connectProfile(userId: string, role: string, userProfile: LinkedInProfile): Promise<boolean> {

        if (role == "Influencer") {
            const influencerCollection = await this.getInfluencerCollection();
            const exist = await influencerCollection.findOne({ fbId: userProfile.linkedInId });

            if (exist != null) {
                throw Error("LinkedIn profile already attached");
            }

            const updateResult = await influencerCollection.updateOne(
                { influencerId: userId },
                { $push: { linkedInProfiles: userProfile } });

            return updateResult.modifiedCount === 1 ? true : false;
        }
        else if (role == "Brand") {
            const brandCollection = await this.getBrandCollection();

            const pipeline = [
                {
                    $match: {
                        'linkedInProfiles.linkedInId': userProfile.linkedInId
                    }
                },
                {
                    $project: {
                        _id: 0,
                        linkedInProfiles: 1
                    }
                }
            ];

            const exist = await brandCollection.aggregate(pipeline).toArray();

            if (exist != null) {
                throw Error("LinkedIn profile already attached");
            }

            const updateResult = await brandCollection.updateOne(
                { brandId: userId },
                { $push: { linkedInProfiles: userProfile } });

            return updateResult.modifiedCount === 1 ? true : false;
        }
    }
}