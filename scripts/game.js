import React, { Component } from 'react'
import Card from './card'
import cards from './cards'
import loadingImage from '../img/drake-loading.gif'

/* Helpers 💁🏻‍♀️ */
const createSelected = (cards = {}) => {
  let selected = {}
  Object.keys(cards).map(key => {
    selected[key] = false
  })
  return selected
}
const shuffleArray = arr => arr.sort(() => 0.5 - Math.random())

/* Constants 𝌸 */
const TOTAL_ATTEMPTS = 10
const SHUFFLED_CARDS = shuffleArray(Object.keys(cards))
const INIT_SELECTED = createSelected(cards)

export default class Game extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cards: SHUFFLED_CARDS,
      selected: INIT_SELECTED,
      matched: [],
      playing: false,
      attemptsRemaining: TOTAL_ATTEMPTS,
      loaded: false
    }
  }

  componentDidMount = () => {
    window.onload = () => {
      setTimeout(() => this.setState({ loaded: true }), 5000)
    }
  }

  resetCards = cards => {
    this.setState({
      selected: INIT_SELECTED
    })
  }

  checkMatch = () => {
    const { selected } = this.state

    let isMatch = false
    const selectedCards = Object.keys(selected).filter(key => selected[key])

    if (selectedCards.length === 2) {
      const firstCard = selectedCards[0]
      const secondCard = selectedCards[1]

      isMatch = cards[firstCard] === cards[secondCard]

      if (!isMatch) {
        this.setState({
          attemptsRemaining: this.state.attemptsRemaining - 1
        })
        return
      }
      this.setState({
        matched: [...this.state.matched, firstCard, secondCard],
        selected: INIT_SELECTED
      })
    }
  }

  triggerMatchAnimation = () => {
    // Run diamond spin shit
  }

  onCardClick = key => {
    const { selected } = this.state
    const selectedCards = Object.keys(selected).filter(key => selected[key])
    // if 2 cards are currently selected, flip them back, as we are now trying a new combination
    if (selectedCards.length === 2) {
      this.setState(
        {
          selected: {
            ...this.state.selected,
            [selectedCards[0]]: false,
            [selectedCards[1]]: false,
            [key]: !this.state.selected[key]
          }
        },
        () => this.checkMatch()
      )
    } else {
      this.setState(
        {
          selected: {
            ...this.state.selected,
            [key]: !this.state.selected[key]
          }
        },
        () => this.checkMatch()
      )
    }
  }

  renderCards = () => (
    <div className="fadeIn full-height">
      <div className="slideshow" />
      <NAV
        attemptsRemaining={this.state.attemptsRemaining}
        matchCount={divideByTwo(this.state.matched.length)}
      />
      <div className="cards">
        {this.state.cards.map(key => (
          <Card
            onClick={this.onCardClick}
            key={key}
            matched={this.state.matched.includes(key)}
            cardKey={key}
            rapper={cards[key]}
            checked={this.state.selected[key]}
          />
        ))}
      </div>
    </div>
  )

  renderIntro = () => (
    <div>
      <div className="backdrop fadeIn" />
      <div className="welcome">
        <h1 className="" onClick={() => this.setState({ playing: true })}>
          💧 P L A Y 💧
        </h1>
      </div>
    </div>
  )

  youWin = () => this.state.matched.length === this.state.cards.length

  render() {
    if (!this.state.loaded) return <Loading />
    if (this.state.attemptsRemaining < 1) {
      /* Y O U  L O O S E  B I T C H */
      window.location = 'https://www.youtube.com/watch?v=8rZwOR9lfIo'
    }

    if (this.youWin()) {
      window.location = 'https://www.youtube.com/watch?v=4LfJnj66HVQ'
    }

    return this.state.playing ? this.renderCards() : this.renderIntro()
  }
}

const divideByTwo = num => num / 2

const Loading = () => (
  <div className="loading">
    <img src={loadingImage} />
  </div>
)

const NAV = ({ matchCount = 0, attemptsRemaining }) => (
  <nav>
    <h1 className="shadow">
      {attemptsRemaining} 💣 {matchCount} 😭
    </h1>
  </nav>
)
