import {React, useState} from 'react'
import Cookies from 'universal-cookie'
import "../../App.css"
import "../../assets/css/signin.css" 
import {Navigate} from 'react-router-dom'

export default function Login() {
    
    let username = "";
    let password = "";
    const [user, setUser] = useState([]);  
    const handlesubmit = e => {
        e.preventDefault();
        if(!e.target.username.value){
            alert("Kullanıcı adı geçerli olmalıdır!");
        }else if(!e.target.password.value) {
            alert("Şifre geçerli olmalıdır!");
        }else{
            username = e.target.username.value;
            password = e.target.password.value;

            tryLogin();

            user.map((item) => {
                if (item.status === "OK") {
                    const cookie_login = new Cookies();
                    cookie_login.set("login", true, { path: '/' });
                    cookie_login.set("userid", item.userid, { path: '/' })
                    return <Navigate to="/" />;
                }
            });
        }      
    };

    async function tryLogin(){
        const response = await fetch("https://localhost:44392/api/users/login/" + username + "/" + password);
        const get = await response.json();

        setUser(get);
    }

    const cookie = new Cookies();
    var login = cookie.get('login');
    if (typeof login === "undefined") {
      login = "false";
    }else{
        return <Navigate to="/" />;
    }

    return (
        <main className="form-signin text-center">
            <form onSubmit={handlesubmit}>
                <i className="logo bi bi-menu-button-wide-fill"></i>
                <h1 className="h3 fw-normal">To<span className="logo-span">Do</span> App</h1>
                <h6 className="mb-3">Projelerinize ulaşabilmek için giriş yapın.</h6>

                <div className="form-floating">
                    <input type="text" className="form-control" id="username" placeholder="Kullanıcı Adı" />
                    <label htmlFor="username">Kullanıcı Adı</label>
                </div>
                <div className="form-floating">
                    <input type="password" className="form-control" id="password" placeholder="Şifre" />
                    <label htmlFor="password">Şifre</label>
                </div>

                <button className="w-100 btn btn-lg btn-primary" type="submit">Giriş</button>
                <a href="/register" className="register-href">Kayıt Ol</a>
                <p className="mt-5 mb-3 text-muted">&copy; 2021</p>
            </form>
        </main>
    )
}
