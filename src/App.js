import React, { useEffect } from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import { useAuth0 } from '@auth0/auth0-react'
import { useAserto } from '@aserto/aserto-react'

import history from './utils/history'
import config from './utils/auth_config.json'

import Loading from './components/Loading'
import NavBar from './components/NavBar'
import Home from './views/Home'
import Profile from './views/Profile'
import Users from './views/Users'
import UserView from './views/UserView'
import Applications from './views/Applications'
import Application from './views/Application'
import Api from './views/Api'

import './App.css'

// get api origin from config
const { apiOrigin = "http://localhost:3001" } = config;

function App() {
  const { isLoading, error, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const { init, loading, accessMap } = useAserto();

  // use an effect to load the Aserto access map 
  useEffect(() => {
    async function load() {
      const token = await getAccessTokenSilently();
      if (token) {
        await init({ serviceUrl: apiOrigin, accessToken: token });
      }
    }

    // load the access map when Auth0 has finished initializing
    if (!error && !isLoading && isAuthenticated) {
      load();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]); 

  if (error) {
    return <div><h1>Error encountered</h1><p>{error.message}</p></div>;
  }

  if (isLoading) {
    return <Loading />
  }

  if (isAuthenticated && !accessMap) {
    if (loading) {
      return <Loading />
    }
    return <div><h1>Error encountered</h1><p>Access map failed to load</p></div>
  }

  return (
    <Router history={history}>
      <div id="app" className="d-flex flex-column h-100">
        <NavBar />
        <Container className="flex-grow-1 mt-4">
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/profile" exact component={Profile} />
            <Route path="/api" exact component={Api} />
            <Route path="/users" exact component={Users} />
            <Route path="/users/:id" component={UserView} />
            <Route path="/applications" exact component={Applications} />
            <Route path="/applications/:id" component={Application} />
          </Switch>
        </Container>
      </div>
    </Router>
  )
}

export default App
