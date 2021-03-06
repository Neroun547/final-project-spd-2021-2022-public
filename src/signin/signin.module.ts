import { Module } from '@nestjs/common';
import { SignInController } from "./signin.controller";
import { SignInService } from "./service/signin.service"; 
import { UserEntityModule } from "../../entities/user/user.module";
import { Test } from '@nestjs/testing';

@Module({
    imports:[UserEntityModule],
    controllers:[SignInController],
    providers:[SignInService]
})
export class SigninModule {}
