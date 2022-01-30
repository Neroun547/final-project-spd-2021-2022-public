import { Body, Controller, Delete, Get, Post, Req, Res, UploadedFile } from "@nestjs/common";
import { Request, Response } from "express";
import { UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { MyMusicsService } from "./service/myMusics.service";
import { UploadMusicDto } from "./dto/upload-music.dto";  

@Controller()
export class MyMusicsController {

    constructor(private readonly myMusicsService: MyMusicsService){}

    @Get()
    async musicPage(@Req() req: Request, @Res() res: Response) {
        const musics = await this.myMusicsService.getMusicsId(0, 5, req["user"].username); 
        const countMusics = await this.myMusicsService.getCount(req["user"].username);

        res.render("my-musics", {
            auth: true,
            idAvatar: req["user"].idAvatar,
            musics: musics,
            loadMore: countMusics > 5 ? true : false,
            countMusic: countMusics,
            script:"/js/my-musics.js",
            style: "/css/my-musics.css"
        });
    }

    @Get("upload-new-musics-form")
    uploadNewMusicForm(@Req() req:Request, @Res() res:Response) {
        res.render("upload-musics-form", {
            auth: true,
            idAvatar: req["user"].idAvatar,
            style: "/css/signInForm.css"
        });
    }

    @Post("upload-new-music")
    @UseInterceptors(FileInterceptor('file', {
        fileFilter:(req, file, cb) => {
            if(file.mimetype !== "audio/mpeg") {
                cb(null, false);
            }
            if(+file.size > 1000000){
                cb(null, false);
            } else {
                cb(null, true);
            }
        },
        storage:diskStorage({
            destination: './musics',
            filename:(req, file, cb) => {
                const name = Date.now();
                return cb(null, `${name+Math.floor(Math.random() * 1000) + "." + file.originalname}`);
            }
        })
    }))
    async uploadMusic(@UploadedFile() file: Express.Multer.File, @Body() body: UploadMusicDto, @Req() req:Request, @Res() res:Response) {
        await this.myMusicsService.uploadNewMusics({ 
            name: body.name,
            author: body.author,
            music: file.filename,
            publicateUser: req["user"].username 
        });

        res.redirect("/my-musics");        
    }

    @Post("load-more-musics")
    async loadMoreMusics(@Req() req: Request, @Res() res: Response) {
        const musics = await this.myMusicsService.getMusicsId(req.body.skip, 4, req["user"].username); 

        res.send(musics);
    }

    @Delete("delete/:id")
    async deleteMusic(@Req() req: Request, @Res() res: Response) {   
        await this.myMusicsService.deleteMusic(req.params["id"], req["user"].username);
        res.sendStatus(200);
    }

    @Get(":id")
    async getMusic(@Req() req:Request, @Res() res:Response) {
        await this.myMusicsService.getMusics(req.params["id"], req, res); 
    }
}

