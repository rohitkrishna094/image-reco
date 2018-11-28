import React, { Component } from 'react';
import { CLARIFAI_API_KEY } from './config/keys';
import { CLARIFAI_BASEURL, SAMPLE_IMAGE_URL } from './config/urls';
import './App.css';

class App extends Component {
  state = {
    predictionResults: [],
    url: SAMPLE_IMAGE_URL
  };

  componentDidMount() {
    this.predict(SAMPLE_IMAGE_URL);
  }

  predict(imageUrl) {
    const payload = {
      inputs: [
        {
          data: {
            image: {
              url: imageUrl
            }
          }
        }
      ]
    };

    fetch(
      CLARIFAI_BASEURL + 'models/aaa03c23b3724a16a56b629203edc62c/versions/aa7f35c01e0642fda5cf400f543e7c40/outputs',
      {
        method: 'POST',
        headers: { Authorization: 'Key ' + CLARIFAI_API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }
    )
      .then(res => {
        return res.json();
      })
      .then(data => {
        // console.log(data);
        const concepts = data.outputs[0].data.concepts;
        // concepts.forEach(c => {
        //   console.log(c.name + ' : ' + c.value);
        // });
        this.setState({ predictionResults: concepts, url: imageUrl });
      });
  }

  onSubmit = e => {
    e.preventDefault();

    this.predict(this.state.url);
  };

  onChange = e => {
    this.setState({ url: e.target.value });
  };

  render() {
    const style = { textAlign: 'center' };
    return (
      <div className="App">
        <img src={this.state.url} alt="" style={{ margin: 'auto', display: 'block' }} />
        <form onSubmit={this.onSubmit} style={style}>
          <input type="text" size="100" value={this.state.url} onChange={this.onChange} />
          <input type="submit" value="Predict?" />
        </form>
        {this.state.predictionResults.map(r => (
          <p style={style} key={Math.random()}>
            <b>{r.name}</b> {r.value}
          </p>
        ))}
      </div>
    );
  }
}

export default App;
