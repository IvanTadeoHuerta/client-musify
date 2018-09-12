import { Component, OnInit } from '@angular/core';
import { User } from './models/users';
import { UserService } from './service/user.service';
import { GLOBAL } from './service/global';
import { Router, ActivatedRoute, Params } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})
export class AppComponent implements OnInit {
  title = 'MUSIFY';
  public user: User;
  public user_register: User;
  public alertRegister;  
  public identity;
  public token: string;
  public errorSign;
  public URL;


  constructor(
    private _service: UserService,
    private _router: Router,
    private _route: ActivatedRoute

  ) {
    this.user = new User('', '', '', '', '', 'ROLE_USER', '');
    this.user_register = new User('', '', '', '', '', 'ROLE_USER', '');
    this.URL = GLOBAL.url;
  }

  ngOnInit() {
    this.identity = this._service.getIdentity();
    this.token = this._service.getToken();
  }

  ngSubmit(event): void {
    // Conseguir los datos del usuario identificado
    this._service.signup(this.user).subscribe(
      response => {
        let identity = response.user;
        this.identity = identity;
        if (!this.identity._id) {
          alert('El usuario no se logueo correctamente')
        } else {
          localStorage.setItem('identity', JSON.stringify(identity));
          this._service.signup(this.user, 'true').subscribe(
            response => {

              let token = response.token;
              this.token = token;
              if (!this.token.length) {
                alert('El token no se genero correctamente')
              } else {
                localStorage.setItem('token', token);
                // almacena token
                // Crear elemento en el localstorage para tener al usuario en la sesion
              }
            },
            error => {
              var errorMessage = <any>error;

              if (errorMessage != null) {
                let body = JSON.parse(error._body);
                this.errorSign = body.message;
              }
            }
          );
        }
      },
      error => {
        var errorMessage = <any>error;

        if (errorMessage != null) {
          let body = JSON.parse(error._body);
          this.errorSign = body.message;
        }
      }
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('identity');
    localStorage.clear();
    this.token = null;
    this.identity = null;
    this.user = new User('', '', '', '', '', 'ROLE_USER', '');    
    this._router.navigate(['/']);
  }

  registro() {
    this._service.registro(this.user_register).subscribe(
      response => {
        let user = response.user;
        this.user_register = user;

        if (!user._id) {
          this.alertRegister = 'Error al registrarse';
        } else {
          this.alertRegister = 'Registro exitoso! Identificate con: '+ this.user_register.email;
          this.user_register = new User('', '', '', '', '', 'ROLE_USER', '');        
        }
      },
      error => {
        var errorMessage = <any>error;

        if (errorMessage != null) {
          let body = JSON.parse(error._body);
          this.alertRegister = body.message;
        }
      }
    );
  }
}
