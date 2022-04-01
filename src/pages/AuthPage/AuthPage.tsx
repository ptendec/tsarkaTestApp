import React, {FC, useEffect, useState} from 'react';
import {LockClosedIcon} from '@heroicons/react/solid'
import classes from './AuthPage.module.css'
import {API_URL} from "../../utils/consts";
import {Navigate, useNavigate} from "react-router-dom";
import {setUser} from "../../store/user/reducer";
import {useAppDispatch} from "../../hooks/redux";
import {validateEmail, validatePassword} from "../../utils/validation";
import WarningToast from "../../components/WarningToast/WarningToast";
import {useSelector} from "react-redux";
import {RootState} from "../../store";

const AuthPage: FC = () => {
    const dispatch = useAppDispatch()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isEmailIncorrect, setIsEmailIncorrect] = useState(false)
    const [isPasswordIncorrect, setIsPasswordIncorrect] = useState(false)
    const [isInvalidCredentials, setIsInvalidCredentials] = useState(false)
    const navigate = useNavigate()
    const isAuth = useSelector((state: RootState) => state.user.isAuth)
    useEffect(() => {
        setIsPasswordIncorrect(false)
        setIsEmailIncorrect(false)
        setIsInvalidCredentials(false)
    }, [])
    if (isAuth) return <Navigate to={'/'}/>
    const authorizeUser = ({event}: { event: any }) => {
        event.preventDefault()
        if (!validateEmail(email)) {
            setIsEmailIncorrect(true)
            return;
        }
        setIsEmailIncorrect(false)
        if (!validatePassword(password)) {
            setIsPasswordIncorrect(true)
            return;
        }
        setIsPasswordIncorrect(false)
        fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                query: `
                mutation($email: String!, $password: String!){
                    users{
                        login(input: {email: $email, password: $password}) {
                            token{
                                accessToken,
                                refreshToken
                            }
                        }
                    }
                }
                `,
                variables: {
                    email,
                    password
                }
            }),
        }).then((response) => {
            return response.json()
        }).then(data => {
            if (data.data.users?.login !== null) {
                console.log(data)
                localStorage.setItem('accessToken', data.data.users.login.token.accessToken)
                localStorage.setItem('refreshToken', data.data.users.login.token.refreshToken)
                // CHECKME Было бы круто, если бы в токене содержались данные, по типу его id и email, можно было бы его декодировать и сохранить в хранилище redux
                dispatch(setUser({email}))
                navigate('/')
            } else {
                console.log("incorrect")
                setIsInvalidCredentials(true)
            }
        }).catch(error => {
            console.log(error)
        })
    }

    return (
        <div className={classes.authPage + ' py-20'}>
            <div className={classes.toasts}>
                {
                    isEmailIncorrect ? <WarningToast message={'Введите корректный email'}/> : ''
                }
                {
                    isPasswordIncorrect ? <WarningToast
                        message={'Пароль должен включать в себя, как минимум 1 цифру, 1 символ и длина должна быть не меньше 8'}/> : ''
                }
                {
                    isInvalidCredentials ? <WarningToast message={'Вы ввели неправильный email или пароль'}/> : ''
                }
            </div>
            <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-lg w-full space-y-8">
                    <div>
                        <h2 className="mt-6 text-center text-4xl font-extrabold text-gray-900">Sign in to your
                            account</h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                        </p>
                    </div>
                    <form className="mt-8 space-y-6" action="#" method="POST">
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="email-address" className="sr-only">
                                    Email address
                                </label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 lg:text-lg"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(event => setEmail(event.target.value))}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">
                                    Password
                                </label>
                                <input
                                    value={password}
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 lg:text-lg"
                                    placeholder="Password"
                                    onChange={(event => setPassword(event.target.value))}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent  xl:text-xl font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                onClick={event => authorizeUser({event: event})}
                            >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true"/>
                </span>
                                Sign in
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
