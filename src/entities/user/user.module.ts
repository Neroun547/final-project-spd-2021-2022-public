import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserRepository } from "../user/user.repository"; 

@Module({
    imports:[TypeOrmModule.forFeature([UserRepository])],
    providers:[UserService],
    exports:[UserService]
})
export class UserEntityModule { };
