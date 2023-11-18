import path from 'path';
import { UserAccount } from '../../Entities/UserAccount';
import { UserRepository } from '../../Repositories/Implementations/UserRepository';
import { FacebookService } from './FacebookService';
import jwt, { SignOptions } from 'jsonwebtoken';
import { autoInjectable } from 'tsyringe';
import { FacebookProfile } from '../../Entities/FacebookProfile';
const fs = require('fs');

@autoInjectable()
export class UserService {

    private readonly userRepository: UserRepository;
    private readonly facebookService: FacebookService;

    constructor(userRepository: UserRepository, facebookService: FacebookService) {
        this.userRepository = userRepository;
        this.facebookService = facebookService;
    }

    async verifyCredentials(emailId: string, password: string): Promise<any> {

        const user = await this.userRepository.findUserByEmail(emailId);

        if (user == null) {
            //throw new Error('User not found');
            throw new Error('Invalid credentials: user not found by email');
        }

        const passwordMatch = password === user.password;

        if (!passwordMatch) {
            throw new Error('Invalid credentials: password did not matched :' + passwordMatch);
        }

        return { userId: user.userId, role: user.role };
    }

    async getUser(userId: string): Promise<UserAccount> {

        const existingUser = await this.userRepository.getUserByUserId(userId);

        if (existingUser == null) {
            throw Error("No such user exists");
        }

        return existingUser;
    };

    async registerUserAccountWithBasicDetails(userAccount: UserAccount): Promise<any> {

        if (userAccount == null) {
            return {
                id: undefined,
                status: "user details not found"
            };
        }

        const userStatus = await this.userRepository.createUserWithBasicDetails(userAccount);

        return userStatus;
    }

    async registerUserAccountFromFacebook(facebookToken: string, role: string): Promise<any> {

        const facebookProfile: FacebookProfile = await this.facebookService.getProfile(facebookToken);

        if (facebookProfile != null) {

            const userStatus = await this.userRepository.createUserWithFacebook(facebookProfile, role);

            return userStatus;
        }
        else {
            throw Error("Could not fetched the user from Facebook");
        }
    }

    async login(userId: string, role: string): Promise<string> {

        // PAYLOAD
        const payload = {
            userId: userId
        };

        //ToDo: get private key from KeyVault
        const privateKEY = fs.readFileSync(path.join(__dirname, 'private.key'), 'utf8');

        const i = 'InfluenZa';          // Issuer 
        const s = 'rvs@influenza.com';        // Subject 
        const a = 'http://influenza.com'; // Audience

        // SIGNING OPTIONS
        const signOptions: SignOptions = {
            issuer: i,
            subject: s,
            audience: a,
            expiresIn: "12h",
            algorithm: "RS512"
        };

        var token = jwt.sign(payload, privateKEY, signOptions);

        return token;
    }
}