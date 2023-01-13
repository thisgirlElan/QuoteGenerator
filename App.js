import React, { Component } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  Pressable,
  Linking,
  View,
} from 'react-native';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import Clipboard from '@react-native-clipboard/clipboard';
import Snackbar from 'react-native-snackbar';

import { API_URL, OPTIONS } from './apiUtil';
import LinearGradient from 'react-native-linear-gradient';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quote: '',
      author: '',
      loading: false,
      speech: false
    }
  }

  fetchQuote = () => {
    this.setState({
      loading: true,
      speech: false
    });
    fetch(API_URL, OPTIONS).then(res => res.json()).then(result => {
      this.setState({
        quote: result.content,
        author: result.originator.name,
        loading: false
      });
    })
      .catch(err => console.error(err))
  }

  copyQuote = () => {
    Clipboard.setString(this.state.quote);
    Snackbar.show({
      text: 'Quote copied to clipboard',
      duration: Snackbar.LENGTH_SHORT,
    })
  }

  tweetQuote = () => {
    const url = "https://twitter.com/intent/tweet?text=" + this.state.quote + '\n' + '—' + this.state.author;
    Linking.openURL(url);
  }

  whatsappShare = () => {
    const url = `whatsapp://send?text=${'Hey! Here\'s a quote I found interesting:' + '\n'
      + '_' + this.state.quote + '_' + '\n' + '—' + this.state.author}`
    Linking.openURL(url)
      .then((data) => {
        console.log('opening whatsapp ...');
      })
      .catch(() => {
        Alert.alert('Kindly install whatsapp to use this feature.')
      })
  }

  componentDidMount() {
    this.fetchQuote();
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <LinearGradient
          start={{ x: 0.5, y: 0 }}
          colors={['purple', 'pink', '#5372F0', 'cyan', 'magenta']}
          style={styles.container}>
          <StatusBar
            barStyle={'light-content'}
            backgroundColor={'purple'}
          />
          <View
            style={styles.quoteContainer}>
            <Text style={styles.header}>Interesting quotes for you.
            </Text>
            <FontAwesome5
              name='quote-left'
              size={20}
              style={{
                marginBottom: -12
              }}
              color="#000"
            />
            <Text style={styles.quote}>
              {this.state.loading ? 'fetching quote, just a moment..' : this.state.quote}
            </Text>
            <FontAwesome5
              name='quote-right'
              size={20}
              style={{
                marginTop: -12,
                marginBottom: 20,
                textAlign: 'right'
              }}
              color="#000"
            />
            {!this.state.loading &&
              <Text style={styles.author}>
                —{this.state.author}
              </Text>
            }
            <Pressable
              onPress={() => {
                this.fetchQuote()
              }}
              style={[styles.btnContainer, {
                backgroundColor: this.state.loading ? 'rgba(83, 114, 240, 0.7)' : 'rgba(83, 114, 240, 1)',
              }]}>
              <Text style={styles.btnText}>{this.state.loading ? 'Fetching Quote..' : 'New Quote'}</Text>
            </Pressable>

            <View style={styles.iconContainer}>
              <Pressable
                onPress={() => {
                  this.copyQuote()
                }}
                style={styles.icon}>
                <FontAwesome5
                  name='copy'
                  size={22}
                  color='#5372F0'
                />
              </Pressable>
              <Pressable
                onPress={() => {
                  this.tweetQuote()
                }}
                style={styles.icon}>
                <FontAwesome
                  name='twitter'
                  size={22}
                  color='#5372F0'
                />
              </Pressable>
              <Pressable
                onPress={() => {
                  this.whatsappShare()
                }}
                style={styles.icon}>
                <FontAwesome
                  name='whatsapp'
                  size={22}
                  color='#5372F0'
                />
              </Pressable>
            </View>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  };

}

export default App;

const styles = StyleSheet.create({
  icon: {
    borderWidth: 2,
    borderColor: '#5372F0',
    borderRadius: 50,
    padding: 15,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  btnText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center'
  },
  btnContainer: {
    padding: 20,
    borderRadius: 30,
    marginVertical: 20
  },
  author: {
    textAlign: 'right',
    fontWeight: '#300',
    fontStyle: 'italic',
    fontSize: 16,
    color: '#000',
    marginHorizontal: 10
  },
  quote: {
    color: '#000',
    fontSize: 15,
    lineHeight: 25,
    letterSpacing: 1.1,
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 30
  },
  header: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20
  },
  quoteContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#5372F0'
  }
});
