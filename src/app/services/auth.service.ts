import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: any;

  constructor(private auth: AngularFireAuth, private db: AngularFirestore) {
    // this.auth.authState.subscribe((data) => {
    //   if (data) {
    //     // this.user = data;
    //     // localStorage.setItem('uid', JSON.stringify(this.user));
    //   } else {
    //     localStorage.clear();
    //   }
    //   // console.log(this.user);
    // });
  }

  login(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    this.auth.signOut();
    localStorage.removeItem('uid');
    localStorage.removeItem('id');
  }

  async sendVerificationMail() {
    (await this.auth.currentUser)
      .sendEmailVerification()
      .then(() => console.log('Verifiation Maoil Sent'));
  }

  // recoverPassword(email: string) {
  //   this.auth
  //     .sendPasswordResetEmail(email)
  //     .then((data) => console.log(data))
  //     .catch((err) => console.log(err));
  // }

  findData(type: string, username: string) {
    return this.db.collection(type, (ref) =>
      ref.where('username', '==', username)
    );
  }

  isLoggedIn() {
    const user = localStorage.getItem('user');
    return user !== null ? true : false;
  }
}
