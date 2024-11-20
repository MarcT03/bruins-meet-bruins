//component that pops up an interface when user either clicks login / create an account
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useCookies } from 'react-cookie'

const AuthUi = ({ setAuth, hasAccount }) => {
    const [email, setEmail]  = useState('')
    const [password, setPassword] = useState('')
    const [passcheck, setPasswordCheck] = useState('')
    const [errormessage, setError] = useState(null)
    const [ cookie, setCookie, removeCookie ] = useCookies(['user']) 
    
    const navigate = useNavigate()     //use react's navigate to get from page to page

    console.log(email, password, passcheck) 

    const handleClick = () => {
        setAuth(false)
    }

    useEffect(() => {
        setEmail('');
        setPassword('');
        setPasswordCheck('');
        setError(null);
    }, [hasAccount]);

    const handlelogin = async (e) => {
        e.preventDefault()
        try{        //checks for passwords matching
            if(hasAccount && (password !== passcheck)){
                setError('Passwords do not match! Please try again.')
                return
            }

            const urlLogin = hasAccount ? 'http://localhost:8000/signup' : 'http://localhost:8000/login'
            //pass email and pass to backend
            const respond = await axios.post(urlLogin, { email, password}) 

            //Cookies implementation and syntax adapted from https://www.npmjs.com/package/react-cookie
            setCookie('LoginToken', respond.data.loginToken)
            setCookie('UserId', respond.data.userId)

           
            const success = respond.status === 201   //successful http request

            //messed up naming, but if hasAccount = true, then user DOESN'T have an account, and vice versa
            if(success && hasAccount){                    //if successful, send user to CreateProfile page
                navigate('/CreateProfile')
            }
            if(success && !hasAccount){
                navigate('/SearchPage') //placeholder for now
            }

        }
        catch(error){
            console.log(error)
        }
    }
    return( //Interface for logging and signing in
        <div className="auth_Ui">       
            <button onClick={handleClick} className="closeButton">X</button>
            <h2>{hasAccount ? 'Create Your Account!' : 'Log In!'}</h2>   
        <form onSubmit={handlelogin}> 
            <input      
                type = "email" 
                id = "email"
                name = "email"
                placeholder= "Enter email"
                value = {email}
                required={true}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type = "password"
                id = "password"
                name = "password"
                placeholder= "Enter password"
                value = {password}
                required={true}
                onChange={(e) => setPassword(e.target.value)}
            />
            {hasAccount && <input       // if we are signing in, then we only need username and password
                type = "password"
                id = "passcheck"
                name = "passcheck"
                placeholder="Confirm your pasword"
                value = {passcheck}
                required={true}
                onChange={(e) => setPasswordCheck(e.target.value)}
            />}
            <input className="otherButton" type = "submit"/>
            <p>{errormessage}</p>   
        </form>
        </div>
        
    )
}

export default AuthUi  