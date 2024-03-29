class Auth {
    users = [];
    loggedInUser = null
    constructor (){
        this.users = JSON.parse(localStorage.getItem('users')||'[]')
    }
    register(user, password){
        const newUser = {
            id: `${this.users.length}`, 
            user, 
            password
        };
        this.users.push(newUser)
        localStorage.setItem('users', JSON.stringify(this.users))
        return newUser;
    }
    isAuth(){
        return !!this.loggedInUser;
    }
    login(user,password){
        const selected = this.users.find(u => u.user.toLowerCase() === user.toLowerCase())
        if(selected.password === password){
            this.loggedInUser = selected;
            return selected
        } else {
            return null
        }
    }
    logout(){
        this.loggedInUser = null;
    }
    getUsers(){
        return this.users;
    }
}

export default new Auth()