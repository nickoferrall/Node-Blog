import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import PostContainer from './components/PostContainer';
import LoadingSpinner from './components/LoadingSpinner';
import { Route } from 'react-router-dom';
import SinglePost from './components/SinglePost';

class App extends Component {
  constructor() {
    super();
    this.state = {
      posts: [],
      isLoaded: false
    };
  }

  componentDidMount() {
    console.log('Component mounting!');
    axios.get('http://localhost:9000/api/users').then(response => {
      console.log('response from cdm', response);
      this.setState({
        posts: response,
        isLoaded: true
      });
    });
  }

  render() {
    return (
      <div className="App">
        <Route
          exact
          path="/"
          render={props =>
            this.state.isLoaded === true ? (
              <PostContainer {...props} posts={this.state.posts} />
            ) : (
              <LoadingSpinner />
            )
          }
        />
        <div>
          <Route
            path="/post/:id"
            render={props => <SinglePost {...props} posts={this.state.posts} />}
          />
        </div>
      </div>
    );
  }
}

export default App;
