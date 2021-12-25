import React from 'react';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { sortByGroup, setSearchTerm } from '../actions';

const groups = {
    p: 'population',
    gdp: 'gdp',
    gdpc: 'gdpCapita',
};

class TableHead extends React.Component {
    sortByGroup = (event) => {
        event.preventDefault();
        const { groupName } = event.target.dataset;

        this.props.sortByGroup({ groupName });
    };

    handleSearchChange = (event) => {
        event.preventDefault();
        const value = event.target.value;
        const { contextYear } = this.props;

        this.props.setSearchTerm(value);

        if (value) {
            this.props.history.push({ search: `y=${contextYear}&s=${value}` });
        } else {
            this.props.history.push({ search: `y=${contextYear}` });
        }
    };

    componentDidMount() {
        const searchPrefixLength = 2;
        const searchString = this.props.history.location.search;

        const regex = /s=\w+/i;
        const index = searchString.search(regex);

        if (index !== -1) {
            const match = searchString.match(regex);
            const searchTerm = searchString.slice(
                index + searchPrefixLength,
                index + match[0].length
            );
            this.props.setSearchTerm(searchTerm);
        }

        this.unregisterHistoryListener = this.props.history.listen(
            (location, action) => {
                if (action === 'POP') {
                    const searchString = location.search;
                    const index = searchString.search(/s=\w+/i);

                    if (index !== -1) {
                        const match = searchString.match(regex);
                        const searchTerm = searchString.slice(
                            index + searchPrefixLength,
                            index + match[0].length
                        );
                        this.props.setSearchTerm(searchTerm);
                    } else {
                        this.props.setSearchTerm('');
                    }
                }
            }
        );
    }

    componentWillUnmount() {
        this.unregisterHistoryListener();
    }

    render() {
        const { direction, groupName } = this.props.sorting;
        const { searchTerm } = this.props;

        return (
            <thead className='table-head'>
                <tr className='table-row'>
                    <th colSpan={2}>
                        <div className='input-group w-50'>
                            <div className='input-group-prepend'>
                                <label
                                    htmlFor='searchInput'
                                    className='input-group-text'
                                    id='basic-addon2'>
                                    Search:
                                </label>
                            </div>
                            <input
                                id='searchInput'
                                onChange={this.handleSearchChange}
                                value={searchTerm}
                                type='text'
                                className='form-control'
                                aria-label='Search'
                                aria-describedby='basic-addon2'
                            />
                        </div>
                    </th>
                    <th>
                        <button
                            className='btn btn-light d-flex align-items-center'
                            type='button'
                            data-group-name={groups.p}
                            onClick={this.sortByGroup}>
                            Population
                            <i
                                className={` ms-1
                                ${
                                    groupName === groups.p
                                        ? direction === 'asc'
                                            ? 'icon-circle-up'
                                            : 'icon-circle-down'
                                        : 'icon-circle-right'
                                }`}></i>
                        </button>
                    </th>
                    <th>
                        <button
                            className='btn btn-light d-flex align-items-center'
                            type='button'
                            data-group-name={groups.gdp}
                            onClick={this.sortByGroup}>
                            Economy
                            <i
                                className={` ms-1
                                ${
                                    groupName === groups.gdp
                                        ? direction === 'asc'
                                            ? 'icon-circle-up'
                                            : 'icon-circle-down'
                                        : 'icon-circle-right'
                                }`}></i>
                        </button>
                    </th>
                    <th>
                        <button
                            className='btn btn-light d-flex align-items-center'
                            type='button'
                            data-group-name={groups.gdpc}
                            onClick={this.sortByGroup}>
                            GDP per capita
                            <i
                                className={` ms-1
                                    ${
                                        groupName === groups.gdpc
                                            ? direction === 'asc'
                                                ? 'icon-circle-up'
                                                : 'icon-circle-down'
                                            : 'icon-circle-right'
                                    }`}></i>
                        </button>
                    </th>
                </tr>
            </thead>
        );
    }
}

const mapStateToProps = (state) => {
    const { sorting, searchTerm, contextYear } = state.appReducer;

    return { sorting, searchTerm, contextYear };
};

export default compose(
    withRouter,
    connect(mapStateToProps, { sortByGroup, setSearchTerm })
)(TableHead);
