import { Controller, Req, Res, Get, Post } from "@nestjs/common";
import { Request, Response } from "express";
import { AddFriendService } from "./service/add-friend.service";

@Controller()
export class AddFriendController {
    constructor(private readonly service: AddFriendService){}
    
    @Get()
    async addFriend(@Req() req: Request, @Res() res: Response){
        const inviteFriends = await this.service.getFriendInvites(req["user"]._id, 5, 0);
        const countInvites = await this.service.countInvites(req["user"]._id);

        res.render("add-friend", {
            username: req["user"].username,
            auth: true,
            idAvatar: req["user"].idAvatar,
            invites: inviteFriends,
            loadMoreInvites: countInvites > 5 ? true : false,
            script: "/js/modules/my-account/my-friends/invites-friends.js",
            style: "/css/add-friends.css"
        });
    }

    @Get("accept-invite/:username") 
    async acceptInvite(@Req() req: Request, @Res() res: Response) {
        await this.service.acceptInvite(req["user"].username, req.params["username"]);

        res.redirect("/add-friend");
    }

    @Post("load-more")
    async loadMore(@Req() req: Request, @Res() res: Response) {
        const inviteFriends = await this.service.getFriendInvites(req["user"]._id, 5, req.body.skip);

        res.send(inviteFriends);
    }

    @Get("add-friend/:username")
    async addFriendInvite(@Req() req: Request, @Res() res: Response) {
        await this.service.addFriendInvite(req.params["username"], req["user"]._id);

        res.redirect(`/user/photo/${req.params['username']}`);
    }
}
