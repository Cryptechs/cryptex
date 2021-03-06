import auth0 from 'auth0-js';


class Auth {
    constructor() {
        this.auth0 = new auth0.WebAuth({
            // the following three lines MUST be updated
            domain: 'james-dempsey.auth0.com',
            audience: 'https://james-dempsey.auth0.com/userinfo',
            clientID: 'NbD9tWynHT5BxpsIksRslk7HiRrmBSYY',
            redirectUri: 'http://127.0.0.1:3000/home',
            //returnTo: 'http://127.0.0.1:3000/',
            responseType: 'token id_token',
            scope: 'openid profile'
        });

        this.getProfile = this.getProfile.bind(this);
        this.handleAuthentication = this.handleAuthentication.bind(this);
        this.isAuthenticated = this.isAuthenticated.bind(this);
        this.signIn = this.signIn.bind(this);
        this.signOut = this.signOut.bind(this);
    }

    getProfile() {
        return this.profile;
    }

    getIdToken() {
        return this.idToken;
    }

    handleAuthentication() {
        this.auth0.parseHash((err, authResult) => {
            if (authResult && authResult.accessToken && authResult.idToken) {
                this.setSession(authResult);
                console.log(authResult)
                //history.replace('/home');
            } else if (err) {
                // history.replace('/home');
                console.log(err);
            }
        });
    }
    setSession(authResult) {
        // Set the time that the Access Token will expire at
        let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('expires_at', expiresAt);
        localStorage.setItem('name', authResult.idTokenPayload.name);
        // navigate to the home route
        //history.replace('/home');
    }

    isAuthenticated() {
        // Check whether the current time is past the 
        // Access Token's expiry time
        let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
        return new Date().getTime() < expiresAt;
    }

    signIn() {
        this.auth0.authorize();
        this.handleAuthentication();
    }

    signOut() {
        // Clear Access Token and ID Token from local storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
        localStorage.removeItem('name')
        this.idToken = null;
        this.profile = null;
        this.expiresAt = null;
        this.auth0.logout()

        // navigate to the home route
        //history.replace('/');
    }
}

const auth0Client = new Auth();

export default auth0Client;