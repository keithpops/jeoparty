// LIBRARY
import React from 'react';
import Helmet from 'react-helmet';
import cx from 'classnames';

// COMPONENT
import TodoItem from './TodoItem';
import TodoTextInput from './TodoTextInput';
import TodoSnapshots from './TodoSnapshots';

// FLUX
import AppActions from '../../actions/AppActions';
import AppStore from '../../stores/AppStore';
import SnapshotStore from '../../stores/SnapshotStore';
import connectToStores from 'alt/utils/connectToStores';

const metas = require('../../../assets/config.json').helmet;

const todoSection = class TodoSection extends React.Component {
  constructor() {
    super();
    this.state = {
      completed: false
    };

    // https://facebook.github.io/react/blog/2015/01/27/react-v0.13.0-beta-1.html#autobinding
    this.handleOnClickRemoveAll = this.handleOnClickRemoveAll.bind(this);
    this.handleOnClickToggleAll = this.handleOnClickToggleAll.bind(this);
    this.handleOnSave = this.handleOnSave.bind(this);
  }

  handleOnClickRemoveAll() {
    AppActions.removeAll();
  }

  handleOnClickToggleAll() {
    const completed = !this.state.completed;
    /*this.setState({
      completed
    });*/
    AppActions.updateCompleteAll({completed});
  }

  handleOnSave(text) {
    if (text.trim()){
      AppActions.create(text);
    }
  }

  render() {
    // retrieve data from store
    const storeProps = TodoSection.getPropsFromStores();
    // build with current data
    const allTodos = storeProps.allData, todos = [];
    // generate todo item list
    for (const key in allTodos) {
      todos.push(
        <TodoItem
            key={key}
            todo={allTodos[key]}
        />
      );
    }

    return (
      <div>
        <h1>{'TODO PAGE'}</h1>
        <Helmet title={metas.title}
            titleTemplate='%s | Todo page'
        />
        <div className='todo'>
          <p>{'First add some tasks by pressing enter key'}</p>
          <TodoTextInput
              className='edit'
              id='new-todo'
              onSave={this.handleOnSave}
              placeholder='What needs to be done ?'
              value=''
          />
          <ul id='todo-list'>{todos}</ul>
          <button
              className={cx({'hidden': !todos.length})}
              onClick={this.handleOnClickToggleAll}
          >
              {'TOGGLE ALL STATES'}
          </button>
          <button
              className={cx({'hidden': !todos.length})}
              onClick={this.handleOnClickRemoveAll}
          >
              {'CLEAR'}
          </button>
        </div>
        <TodoSnapshots
            snapshots={storeProps.snapshots}
            todoLength={todos.length}
        />
      </div>
    );
  }

  static getStores() {
    return [AppStore, SnapshotStore];
  }

  static getPropsFromStores() {
    return {
      allData: AppStore.getState().get('data').toJS(),
      areAllComplete: AppStore.areAllComplete(),
      snapshots: SnapshotStore.getState().get('snapshots').toArray()
    };
  }
};

todoSection.prototype.displayName = 'TodoSection';

export default connectToStores(todoSection);
