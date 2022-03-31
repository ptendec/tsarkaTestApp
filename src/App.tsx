import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import RequireAuth from "./hoc/RequireAuth/RequireAuth";
import MainPage from "./pages/MainPage/MainPage";
import AuthPage from "./pages/AuthPage/AuthPage";
import {useAppDispatch} from "./hooks/redux";
import {removeUser, setUser} from "./store/user/reducer";
import fetchIntercept from "./utils/fetchIntercept";

function App() {
    const dispatch = useAppDispatch()
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
        fetchIntercept({query: `query {
                                        viewer {
                                            id,
                                            email,
                                        }
                                     }`
        }).then(response => response.json())
            .then(data => {
                dispatch(setUser({email: data.data.viewer.email, id: data.data.viewer.id}))
            })
    } else {
        dispatch(removeUser({email: ''}))
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path={'/authorization'} element={<AuthPage/>}/>
                <Route path={'/'} element={
                    <RequireAuth>
                        <MainPage/>
                    </RequireAuth>}>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
