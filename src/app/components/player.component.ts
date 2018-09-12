import { Component, OnInit } from '@angular/core';
import { GLOBAL } from '../service/global';
import { Song } from '../models/song';

@Component({
    selector: 'player',
    template: `
    <div class="album-image">
        <span *ngIf="song.album">
            <img if="play-image-album" src="{{ URL + 'get-image-album/'+song.album.image}}" >
        </span>
        <span *ngIf="!song.album">
            <img id="play-image-album" src="assets/images/default.png" />
        </span>
    </div>
    <div class="audio-file">
        <p>
        Reproduciendo: 
        <span id="play-song-title">
            {{ song.name }}
        </span>      
        </p>
        
        <audio controls id="player">
            <source id="mp3-source" src="{{ URL + 'get-song-file/'+ song.file }}" type="audio/mpeg" />
            Tu navegador no es compatible
        </audio>
    </div>
    `
})
export class PlayerComponent implements OnInit {
    public URL: string;
    public song;

    constructor() {
        this.URL = GLOBAL.url;

    }

    ngOnInit(): void {
        var song = JSON.parse(localStorage.getItem('sound_song'));
        if (song) {
            this.song = song;
        } else {
            this.song = new Song(1, '', '', '', '');
        }        
    }
} 