import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';
import { albumService } from '../service/album.service';
import { songService } from '../service/song.service';
import { Router, ActivatedRoute, Params, Route } from '@angular/router';
import { GLOBAL } from '../service/global';
import { Artist } from '../models/artist';
import { Album } from '../models/album';
import { Song } from '../models/song';
@Component({
    selector: 'album-detail',
    templateUrl: '../views/album-detail.component.html',
    providers: [UserService, albumService, songService]
})

export class AlbumDetailComponent implements OnInit {

    public identity;
    public token;
    public URL;
    public alertMesagge;
    public songs: Song[];
    public album: Album;

    constructor(
        private _service: UserService,
        private _albumService: albumService,
        private _songService: songService,
        private _router: Router,
        private _route: ActivatedRoute,
        private route: Router
    ) {

        this.identity = this._service.getIdentity();
        this.token = this._service.getToken();
        this.URL = GLOBAL.url;

    }

    ngOnInit() {
        // console.log('Artistas add')
        this.getAlbum();
    }

    getAlbum() {
        this._route.paramMap.subscribe(params => {
            let id = params.get('id');
            this._albumService.getAlbum(this.token, id).subscribe(
                response => {


                    if (!response.album) {
                        this.route.navigate(['/']);
                    } else {
                        this.album = response.album;

                        this._songService.getSongs(this.token, response.album._id).subscribe(
                            response => {

                                if (!response.songs) {
                                    this.alertMesagge = 'Este artista no tiene canciones';
                                } else {
                                    this.songs = response.songs;
                                }
                            },
                            error => {
                                var errorMessage = <any>error;

                                if (errorMessage != null) {
                                    let body = JSON.parse(error._body);
                                    this.alertMesagge = body.message;
                                }
                            }
                        );
                    }

                },
                error => {
                    var errorMessage = <any>error;

                    if (errorMessage != null) {
                        let body = JSON.parse(error._body);
                        this.alertMesagge = body.message;
                    }
                }
            );
        });
    }

    public confirmado;

    onDeleteConfirm(id) {
        this.confirmado = id;
    }

    onDeleteSong(id) {
        this._songService.deleteSong(this.token, id).subscribe(
            response =>{
                if(!response.song){
                    alert('Error en el servidor');
                }

                this.getAlbum();
            },
            error => {
                var errorMessage = <any>error;

                if (errorMessage != null) {
                    let body = JSON.parse(error._body);
                    this.alertMesagge = body.message;
                }
            }
        );
    }

    onCancelSong() {
        this.confirmado = null;
    }

    startPlayer(song:Song){
        let song_player = JSON.stringify(song);
        let file_path = this.URL + 'get-song-file/' + song.file;

        // let image_path = this.URL + ' ' + + song.album.image;

        localStorage.setItem('sound_song', song_player);
        document.getElementById('mp3-source').setAttribute('src', file_path);
        (document.getElementById('player') as any).load();
        (document.getElementById('player') as any).play();

        document.getElementById('play-song-title').innerHTML = song.name;
        // document.getElementById('play-song-title').innerHTML = song.album;

    }

}