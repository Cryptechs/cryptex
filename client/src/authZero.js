import auth0 from 'auth0-js';

//lots and lots to talk about here, talk to james D for in depth stuff.
class Auth {
    constructor() {
        this.auth0 = new auth0.WebAuth({
            // the following three lines MUST be updated
            domain: 'FILL_ME_IN', //you need to make your own auth0 account, see me.
            audience: 'https://FILL_ME_IN/userinfo',
            clientID: 'SECRET_STUFF',
            redirectUri: 'FILL_ME_IN',
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
            } else if (err) {
                console.log(err, "handleauth err");
            }
        });
    }
    setSession(authResult) {
        // Set the time that the Access Token will expire at
        let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('expires_at', expiresAt);
        localStorage.setItem('name', authResult.idTokenPayload.name); // this gives you access to the clients username
    }

    isAuthenticated() {
        // Check whether the current time is past the 
        // Access Token's expiry time
        let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
        return new Date().getTime() < expiresAt;
    }
    signIn() { // use to redirect and login
        this.auth0.authorize();
        this.handleAuthentication();
    }
    signOut() {
        // Clear Access Token and ID Token from local storage
        localStorage.removeItem('access_token'); //username is no longer detected in local storage
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
        localStorage.removeItem('name')
        this.idToken = null;
        this.profile = null;
        this.expiresAt = null;
        this.auth0.logout() // see james, this also redirects to '/' page
    }
}
const auth0Client = new Auth();
export default auth0Client;