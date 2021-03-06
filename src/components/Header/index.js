import React from 'react'
import PropTypes from 'prop-types'

import './style.scss'

const Header = ({ closeWebchat, preferences }) => (
  <div
    className="RecastAppHeader"
    style={{
      color: preferences.complementaryColor,
      backgroundColor: preferences.accentColor,
    }}
  >
    <img className="RecastAppHeader--logo" src={preferences.headerLogo} />

    <div className="RecastAppHeader--title">{preferences.headerTitle}</div>

    <div className="RecastAppHeader--btn" onClick={closeWebchat}>
      <img src="https://cdn.recast.ai/webchat/close.svg" />
    </div>
  </div>
)

Header.propTypes = {
  closeWebchat: PropTypes.func,
  preferences: PropTypes.object,
}

export default Header
