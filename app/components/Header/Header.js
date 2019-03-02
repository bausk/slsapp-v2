import React from 'react';
import styled from 'styled-components';

const Header = styled.div`
  display: flex;
  flex-direction: row;
  text-align: center;
  font-size: 1.5em;
  line-height: 1.6;
  font-weight: 400;
  font-family: "Open Sans", "HelveticaNeue", "Helvetica Neue", Helvetica, Arial, sans-serif;
  color: rgb(50, 50, 50);
`;

const Tab = styled.div`
align-items: center;
background-color: rgb(255, 255, 255);
border-bottom-color: rgb(211, 211, 211);
border-bottom-style: solid;
border-bottom-width: 1px;
border-image-outset: 0px;
border-image-repeat: stretch;
border-image-slice: 100%;
border-image-source: none;
border-image-width: 1;
border-left-color: rgb(211, 211, 211);
border-left-style: solid;
border-left-width: 1px;
border-right-color: rgb(211, 211, 211);
border-right-style: solid;
border-right-width: 1px;
border-top-color: rgb(211, 211, 211);
border-top-left-radius: 10px;
border-top-right-radius: 10px;
border-top-style: solid;
border-top-width: 3px;
box-shadow: rgb(255, 255, 255) 1px 1px 0px 0px;
box-sizing: border-box;
color: rgb(0, 0, 0);
flex: 1;
cursor: pointer;
`;

const SelectedTab= styled(Tab)`
  border-top-color: rgb(227, 98, 9);
  border-bottom-width: 0;
`;

class HeaderContainer extends React.Component {
  renderTabs = () => {
    return this.props.tabs && this.props.tabs.map(({id, title}) => {
      return this.props.selected === id ? 
        (<SelectedTab onClick={e => this.props.onSelect(id)} key={id}>
          <span>{title}</span>
        </SelectedTab>)
        : (<Tab onClick={e => this.props.onSelect(id)} key={id}>
          <span>{title}</span>
        </Tab>);
    });
  };

  render() {
    return (
      <Header>
        {this.renderTabs()}
      </Header>
    );
  }
}

export default HeaderContainer;
