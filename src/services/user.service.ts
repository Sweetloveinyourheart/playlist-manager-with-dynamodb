import { CreateNewUserDTO, UpdateUserDTO, UserLoginDTO } from "../dtos/user.dto";
import * as bcrypt from 'bcrypt'
import UserModel, { User } from "../models/user.model";
import { v4 as uuidv4 } from 'uuid';
import AccountModel, { Account } from "../models/account.model";
import { BadRequestException } from "../exceptions/bad-request.exception";
import { UnauthorizedException } from "../exceptions/unauthorized.exception";
import * as jwt from 'jsonwebtoken'
import { JWT_SECRET } from "../configs/variables.config";
import { NotFoundException } from "../exceptions/not-found.exception";

export default class UserService {

    async createUser(newUserData: CreateNewUserDTO) {
        const { email, password, ...userData } = newUserData

        const existedAccounts = await AccountModel.query({ email }).exec()
        if (existedAccounts.length > 0) throw new BadRequestException('User already exist !')

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newUserData.password, salt)

        const newUser = await UserModel.create({
            ...userData,
            user_id: uuidv4()
        })

        const newAccount = await AccountModel.create({
            email,
            password: hashedPassword,
            user: newUser
        })

        return true
    }

    async userLogin(userLogin: UserLoginDTO) {
        const account = await AccountModel.get(userLogin.email)
        if (!account) throw new UnauthorizedException('Email or password is not valid !')

        // const account = accounts[0]
        const isValidPassword = await bcrypt.compare(userLogin.password, account.password)
        if (!isValidPassword) throw new UnauthorizedException('Email or password is not valid !')

        const accountWithUser = await account.populate() as Account
        const jwtPayload = {
            email: account.email,
            user_id: (accountWithUser.user instanceof User) ? accountWithUser.user.user_id : accountWithUser.user
        }

        const accessToken = jwt.sign(jwtPayload, JWT_SECRET, { expiresIn: '15m' })
        const refreshToken = jwt.sign(jwtPayload, JWT_SECRET, { expiresIn: '7d' })

        return { accessToken, refreshToken }
    }

    async refreshNewToken(refreshToken: string) {
        const decodedPayload = jwt.decode(refreshToken) as any
        if (!decodedPayload) throw new UnauthorizedException()

        const jwtPayload = { email: decodedPayload.email, user_id: decodedPayload.user_id }

        const accessToken = jwt.sign(jwtPayload, JWT_SECRET, { expiresIn: '15m' })

        return { accessToken }
    }

    async getUserProfile(user_id: string) {
        const user = await UserModel.get(user_id)
        if (!user) throw new NotFoundException('No profile found !')

        return user
    }

    async getUserAccountByEmail(email: string) {
        const account = await AccountModel.get(email)
        if (!account) throw new NotFoundException("No account found")

        return account
    }

    async updateUserProfile(user_id: string, updateData: UpdateUserDTO) {
        const user = await UserModel.get(user_id)
        if (!user) throw new NotFoundException('No profile found !')

        const updatedUser = await UserModel.update(user_id, updateData)
        return updatedUser
    }
}