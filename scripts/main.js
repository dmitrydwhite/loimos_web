var React = require('react');
var ReactDOM = require('react-dom');

/**
 * Futzing data things here
 */
var researchItems = [
  {
    name: "ATLANTA",
    group: "blue"
  }, {
    name: "ESSEN",
    group: "blue"
  }, {
    name: "PARIS",
    group: "blue"
  }, {
    name: "ONE QUIET NIGHT",
    group: "grant"
  }, {
    name: "SHANGHAI",
    group: "red"
  }
];

var mockGroupMessages = [{
    sender: 'SCIENCE',
    timeStamp: 1461352678287,
    body: 'I have two blue cards, and I can get to Atlanta to solve blue'
  }, {
    sender: 'QUARANTINE',
    timeStamp: 1461352678260,
    body: 'I think I will head east toward Asia'
  }, {
    sender: 'SCIENCE',
    timeStamp: 1461352678254,
    body: 'who is going to head to asia?'
  }, {
    sender: 'OPERATIONS',
    timeStamp: 1461352678234,
    body: 'I plan to build a research station in shanghai'
  }, {
    sender: 'PLANNING',
    timeStamp: 1461352678224,
    body: 'does anyone have any event cards?'
  }, {
    sender: 'QUARANTINE',
    timeStamp: 1461352678209,
    body: 'I feel like we need to address the situation in South America at some point soon'
  }];

var mockOtherPlayers = [{
    name: 'SCIENCE',
    location: 'SHANGHAI',
    research: [{}, {}, {}, {}, {}],
  }, {
    name: 'QUARANTINE',
    location: 'ESSEN',
    research: [{}, {}, {}]
  }, {
    name: 'OPERATIONS',
    location: 'PARIS',
    research: [{}, {}, {}, {}]
  }, {
    name: 'PLANNING',
    location: 'ATLANTA',
    research: []
  }
];

var mockUpdateInfo = [{
    type: 'teams',
    data: mockOtherPlayers
  }, {
    type: 'map',
    data: []
  }, {
    type: 'disease',
    data: []
  }, {
    type: 'research',
    data: []
  }, {
    type: 'message',
    data: mockGroupMessages
  }
];

var mockCounterStates = [{
    type: 'outbreak',
    value: '0'
  }, {
    type: 'infects',
    value: 3
  }
  , {
    type: 'turns',
    value: 8
  }
];


/**
 * The below globals are used for mapping data from state to desired display values (text, icons, etc)
 * TODO: Make sure they are encapsulated in namespace.
 * @type {Object}
 */
var playerIconMap = {
    MEDICAL: "local_hospital",
    PLANNING: "assignment",
    SCIENCE: "local_pharmacy",
    QUARANTINE: "security",
    RESEARCH: "local_library",
    OPERATIONS: "build",
    DISPATCH: "headset_mic"
};

var updateBarText = {
  message: 'Team Messaging',
  map: 'Map',
  teams: 'Team Status',
  disease: 'Disease Status',
  research: 'My Status'
};

var panelViews = {
  'neutral': true,
  'map': true,
  'message': true,
  'disease': true,
  'teams': true,
  'research': true
};

/**
 * Main App Class
 */
var App = React.createClass({
  getInitialState: function () {
    return {
      otherPlayers: mockOtherPlayers,
      counterStates: mockCounterStates,
      updates: mockUpdateInfo,
      messages: mockGroupMessages,
      panelView: 'neutral'
    };
  },

  goToView: function (view) {
    if (panelViews[view]) {
      this.state.panelView = view;
      this.setState({
        panelView: this.state.panelView,
        updates: this.state.updates
      });
    }
  },

  viewExpand: function () {
    switch (this.state.panelView) {
      case 'map':
        return <MapPanel currentView={this.state.panelView} goToView={this.goToView} />;
      case 'teams':
        return <TeamsPanel currentView={this.state.panelView} goToView={this.goToView} players={this.state.otherPlayers} messages={this.state.messages} />;
      case 'message':
        return <MessagesPanel currentView={this.state.panelView} goToView={this.goToView} />;
      case 'disease':
        return <DiseasePanel currentView={this.state.panelView} goToView={this.goToView} />;
      case 'research':
        return <PlayerControlPanel currentView={this.state.panelView} goToView={this.goToView} />
      case 'neutral': 
        return '';
      default:
        return '';  
    }
  },

  render: function () {
    return (
      <div className="container-fluid">
        <TitleBar />
        <MiniDash players={this.state.otherPlayers} counters={this.state.counterStates} goToView={this.goToView} />
        {this.viewExpand()}
        {
          // <UpdateBar type="message" goToView={this.goToView} />
        }
        <UpdatePanels updates={this.state.updates} goToView={this.goToView} currentView={this.state.panelView} />
      </div>
    );
  }
});

/**
 * TitleBar
 */
var TitleBar = React.createClass({
  render: function () {
    return (
      <nav className="navbar navbar-inverse">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
          </div>
          <a className="navbar-brand" href="#">LOIMOS</a>
        </div>
      </nav>
    )
  }
});

/**
 * MiniDash
 */
var MiniDash = React.createClass({
  goToTeams: function (evt) {
    evt.stopPropagation();
    this.props.goToView('teams');
  },

  renderPlayerIcons: function (player, idx, players) {
    var columnWidth = 12 / players.length;
    var fullClassName = 'text-center col-xs-' + columnWidth.toString();

    return (
      <div className={fullClassName} key={idx} onClick={this.goToTeams} >
        <div className="dash-icon-container"><i className="material-icons">{playerIconMap[player.name]}</i></div>
        <div className="dash-team-location">{player.location.toUpperCase()}</div>
      </div>
    )
  },

  renderCounterStates: function (counterObj, idx) {
    var colWidth = 12 / this.props.counters.length;

    return (
      <GameStatusIcon key={idx} type={counterObj.type} width={colWidth} value={counterObj.value} />
    )
  },

  render: function () {
    return (
      <div className="mini-dash container">
        <div className="row dash-game-status">
          {this.props.counters.map(this.renderCounterStates)}
        </div>
        <div className="row dash-team-status">
          {this.props.players.map(this.renderPlayerIcons)}
        </div>
        <div className="dash-disease-status"></div>
      </div>
    )
  }
});

var GameStatusIcon = React.createClass({
  render: function () {
    var textMap = {
      'outbreak': 'Disease Outbreaks',
      'infects': 'Infection Rate',
      'turns': 'Turns Remaining'
    };

    var iconMap = {
      'outbreak': 'zoom_out_map',
      'infects': 'multiline_chart',
      'turns': 'event'
    };

    var width = this.props.width;
    var fullClassName = 'game-counter col-xs-' + width.toString() + ' ' + this.props.type;

    return (
      <div className={fullClassName}>
        <div className="icon-container">
          <i className="material-icons">{iconMap[this.props.type]}</i>
        </div>
        <div className="status-info">
          <div className="status-name">{textMap[this.props.type]}</div>
          <div className="status-count">{this.props.value}</div>
        </div>
      </div>
    )
  }
});

var UpdatePanels = React.createClass({
  orderUpdates: function (updateArray) {
    var sorted = updateArray.sort();

    return sorted;
  },

  sortUpdateBars: function (update, idx) {
    if (this.props.currentView === update.type) {
      return ''
    } else {
      return (
        <UpdateBar key={idx} type={update.type} goToView={this.props.goToView}/>
      )
    }
  },

  render: function () {
    return (
      <div>
        {this.orderUpdates(this.props.updates).map(this.sortUpdateBars)}
      </div>
      )
  }
});

var UpdateBar = React.createClass({
  updatePanelClick: function (evt) {
    evt.stopPropagation();
    if (this.props.currentView === this.props.type) {
      this.props.goToView('neutral');
    } else {
      this.props.goToView(this.props.type);
    }
  },

  render: function () {
    var fullClassName = 'row update-bar-' + this.props.type;
    
    return (
      <div className={fullClassName}>
        <button type="button" className="btn btn-default btn-block" onClick={this.updatePanelClick} >
          {updateBarText[this.props.type]}
        </button>
      </div>
    )
  }
});

/**
 * MapPanel React Component
 */
var MapPanel = React.createClass({
  componentDidMount: function () {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZG1pdHJ5ZHdoaXRlIiwiYSI6InhpaHVObTAifQ.36E6lf4fSTduEtzPaDrd4w';
    var map = new mapboxgl.Map({
      container: 'lm-map-view',
      style: 'mapbox://styles/mapbox/dark-v8',
      minZoom: 2,
      maxZoom: 6
    });
  },

  render: function () {
    return (
      <div>
        <UpdateBar currentView={this.props.currentView} goToView={this.props.goToView} type="map" />
        <div id="lm-map-view" style={{width: '100%', height: '300px'}}></div>
      </div>
    )
  }
});
   
/**
 * TeamsPanel React Component
 */
var TeamsPanel = React.createClass({
  renderTeams: function () {
    var allTeams = this.props.players;
    var markup = [];

    for (var i=0; i<allTeams.length; i++) {
      var thisTeam = allTeams[i];
      var styleClasses = i === 0 ? '' : 'border-top';

      markup.push(<TeamStatusPane key={i} teamInfo={thisTeam} styleClasses={styleClasses} messages={this.props.messages} />);
    }

    return markup;
  },

  render: function () {
    return (
      <div>
        <UpdateBar currentView={this.props.currentView} goToView={this.props.goToView} type="teams" />
        {this.renderTeams()}
      </div>
    )
  }
});

/**
 * TeamStatusPane
 */
var TeamStatusPane = React.createClass({
  iteratePlayerResearch: function (player) {
    var cards = player.research;
    if (cards.length > 0) {
      var markup = [];
      for (var i=0; i<cards.length; i++) {
        markup.push(<i key={i} className="material-icons">save</i>);
      }
      return markup;
    } else {
      return (
        <div>{player.name} has no saved research.</div>
      )
    }
  },

  seePlayerOnMap: function (evt) {
    evt.stopPropagation();
    // TODO: Once MapView is figured out, switch to map view and center location on this player
    console.log(this.props.teamInfo.name);
  },

  showRecentMessages: function () {
    var playerMessages = [];
    var groupMessages = this.props.messages;
    var recentMsg = groupMessages.length - 1;

    while (playerMessages.length < 3 && recentMsg >= 0) {
      if (groupMessages[recentMsg].sender === this.props.teamInfo.name) {
        playerMessages.push(<GroupMessage key={playerMessages.length} model={groupMessages[recentMsg]} />);
      }
      recentMsg -= 1;
    }

    return playerMessages
  },

  render: function () {
    var player = this.props.teamInfo;

    return (
      <div className="team-pane row panel panel-default" >
        <div className="text-center col-xs-3 center-block">
          <div className="pane-icon-container"><i className="material-icons">{playerIconMap[player.name]}</i></div>
          <div className="pane-name-container">{player.name}</div>
        </div>

        <div className="col-xs-9">
          {this.iteratePlayerResearch(player)}
          <div>LOCATION <a href="#" onClick={this.seePlayerOnMap} >{player.location}</a></div>
        </div>

        <div className="col-xs-12">
          {this.showRecentMessages()}
        </div>
      </div>
    )
  }
});
   
/**
 * MessagesPanel React Component
 */
var MessagesPanel = React.createClass({
  render: function () {
    return (
      <div>
        <UpdateBar currentView={this.props.currentView} goToView={this.props.goToView} type="message" />
        MessagesPanel
      </div>
    )
  }
});

/**
 * GroupMessage
 */
var GroupMessage = React.createClass({
  render: function () {
    var msg = this.props.model;

    return (
      <div className="row">
        <div className="col-xs-2 text-center">
          <div ><i className="material-icons">{playerIconMap[msg.sender]}</i></div>
          <div >{new Date(msg.timeStamp).toDateString()}</div>

        </div>
        <div className="col-xs-10">{msg.body}</div>
      </div>
    )
  }
});
   
/**
 * DiseasePanel React Component
 */
var DiseasePanel = React.createClass({
  render: function () {
    return (
      <div>
        <UpdateBar currentView={this.props.currentView} goToView={this.props.goToView} type="disease" />
        DiseasePanel
      </div>
    )
  }
});

/**
 * PlayerControlPanel React Component
 */
var PlayerControlPanel = React.createClass({
  render: function () {
    return (
      <div>
        <UpdateBar currentView={this.props.currentView} goToView={this.props.goToView} type="research" />
        Player Controls and Status
      </div>
    )    
  }
});

/**
 * MapView
 */
var MapView = React.createClass({
  render: function () {
    return (
      <div className="jumbotron lm-mapview">
        <h1>This is the Map View</h1>
        <div className="row">
          <div className="col-md-5"></div>
          <div className="col-md-2">
            <input className="btn btn-default" type="button" value="Hide Map View" />
          </div>
          <div className="col-md-5"></div>
        </div>
      </div>
    )
  }
});

/**
 * StatusView
 */
var StatusView = React.createClass({
  render: function () {
    return (
      <div className="row">
        <Research />
        <div className="col-md-4">
          <div className="panel panel-default">
            <div className="panel-heading">
              <h3 className="panel-title">Situation</h3>
            </div>
            <div className="panel-body">
              <img className="img-responsive center-block img-circle" src="./static/situation_room.png" />
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="panel panel-default">
            <div className="panel-heading">
              <h3 className="panel-title">Team Status</h3>
            </div>
            <div className="panel-body">
              <img className="img-responsive center-block img-circle" src="./static/team_status.png" />
            </div>
          </div>
        </div>                
      </div>
    )
  }
})

/**
 * Card List
 */
var CardList = React.createClass({
  render: function () {
    var createItem = function (item) {
      return (
        <div className="panel panel-default">
          <div className="panel-body">
            <div className="row">
              <div className="col-md-3">[icon]</div>
              <div className="col-md-9">{item.name}</div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <ul>{this.props.items.map(createItem)}</ul>
    )
  }
});

/**
 * Research View
 */
var Research = React.createClass({

  render: function () {

    return (
      <div className="col-md-4">
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">Research</h3>
          </div>
          <div className="panel-body" >
            <CardList items={researchItems} />
          </div>
        </div>
      </div>
    )
  }
});


ReactDOM.render(<App/>, document.getElementById('main'));