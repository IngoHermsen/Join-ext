import { Injectable, NgZone } from '@angular/core';
import { User } from 'src/models/user';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ViewService } from '../view/view.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedIn: boolean = false;
  guestLogin: boolean = null;
  userData: User;
  userDataSet: Subject<boolean> = new Subject;
  userSpecValues: any;
  noMatchingData: Subject<boolean> = new Subject;
  resetMailsuccessful: Subject<boolean> = new Subject;

  constructor(
    public afs: AngularFirestore, // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    private viewService: ViewService,
  ) {
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.loggedIn = true;
        localStorage.setItem('user', JSON.stringify(user));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  // Sign in with email/password
  SignIn(email: string, password: string, guestLogin?: boolean) {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => { 
          this.guestLogin = guestLogin || false;    
          this.SetUserData(result.user);
      })
      .catch(() => {
        this.noMatchingData.next(true);
        setTimeout(() => {
          this.noMatchingData.next(false)
        }, 6000)
      });
  }

  SignInAsGuest() {        
    this.SignIn('contact@ingo-hermsen.de', '123456', true);
  }

  // Sign up with email/password
  SignUp(formData: any) {
    return this.afAuth
      .createUserWithEmailAndPassword(formData.email, formData.password)
      .then((result) => {
        // this.SendVerificationMail();
        this.SetNewUserData(
          result.user,
          formData
        );
        this.router.navigate(['auth/login']);
        this.viewService.showSignUpNote = true;
        setTimeout(() => {
          this.viewService.showSignUpNote = false;
        }, 4000)
      })
      .catch((error) => {
        window.alert(error.message);
      })

  }

  // Send email verification when new user sign up
  SendVerificationMail() {
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        // this.router.navigate(['verify-email-address']);
      });
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);

    return user !== null ? true : false;
    // return user !== null && user.emailVerified !== false ? true : false;
  }

  SendPasswordResetEmail(emailAdress: string) {
    return this.afAuth.sendPasswordResetEmail(emailAdress)
    .then(() => {      
      this.router.navigate(['auth/login']);
      this.viewService.showResetPasswordNote = true;
      setTimeout(() => {
        this.viewService.showResetPasswordNote = false;
      }, 4000)
    })
    .catch(() => {      
      this.resetMailsuccessful.next(false)
    })
  }


  SetNewUserData(
    user: any,
    formData: any
  ) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );

    userRef.get().subscribe(ref => {
      const userDocData: any = ref.data();

      const userData: User = {
        uid: user.uid,
        firstName: formData.firstName,
        lastName: formData.lastName,
        initials: formData.initials,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified,
        contacts: [],
        projects: [],
        latestActiveProject: null,
        public: false
      };

      this.userData = userData;

      return userRef.set(userData, {
        merge: true,
      });
    })
  }


  SetUserData(
    user: any,
  ) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${user.uid}`
    );

    userRef.get().subscribe(ref => {
      const userDocData: any = ref.data();

      const userData: User = {
        uid: user.uid,
        firstName: userDocData.firstName,
        lastName: userDocData.lastName,
        initials: userDocData.initials,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified,
        contacts: userDocData.contacts,
        projects: userDocData.projects,
        latestActiveProject: userDocData.latestActiveProject,
        public: userDocData.public,
      };

      this.userData = userData;      
      this.userDataSet.next(true)
      localStorage.setItem('initials', userData.initials);
      localStorage.setItem('activeProject', userData.latestActiveProject);
      localStorage.setItem('greetName', userData.firstName);
      localStorage.setItem('guestSession', this.guestLogin ? 'true' : 'false');
      localStorage.setItem('publicProfile', userData.public ? 'true' : 'false');

      this.afAuth.authState.subscribe((user) => {
        if (user && this.isLoggedIn == true) { 
          this.router.navigate(['summary']);
        }
      });
    
      return userRef.set(userData, {
        merge: true,
      });
    })

  }

  // Sign out
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.clear();
      this.router.navigate(['auth/login']);
    });
  }
}

