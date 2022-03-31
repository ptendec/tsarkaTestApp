import React, {useEffect, useState} from 'react';
import classes from "./MainPage.module.css";
import fetchIntercept from "../../utils/fetchIntercept";
import AvailablePage from "../../components/AvailablePage/AvailablePage";

const MainPage = () => {
    const [availableWebSites, setAvailableWebSites] = useState<Array<any>>([])
    useEffect(() => {

        fetchIntercept({
            query: `query {
                             viewer {
                                 id,
                                 email,
                                 sites {
                                     id,
                                     host
                                 }
                             }
                        }`
        }).then(({response, data}) => {
            setAvailableWebSites(data.data.viewer.sites)

        })
    }, [])
    return (
        <div className={classes.mainPage}>
            <h1>Ссылки по которым, вы можете перейти</h1>
            <div
                className="w-128 text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                {
                    availableWebSites.map(webSite => (
                        <AvailablePage link={webSite.host} key={webSite.id}/>
                    ))
                }
            </div>
        </div>
    );
};

export default MainPage;
