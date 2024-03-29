import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { setContextYear, fetchWBData, setViewMode } from '../actions';
import logo from '../imgs/logo-wb.svg';
import config from '../config';

const { params } = config;

class Header extends React.Component {
    onHistoryListen = (location, action) => {
        if (action === 'POP') {
            const { itemsCount } = this.props;
            const searchString = location.search;
            const yearParamMatch = searchString.match(params.year.regex);

            if (yearParamMatch) {
                const contextYear = searchString.slice(
                    yearParamMatch.index + params.year.prefixLength,
                    yearParamMatch.index + yearParamMatch[0].length
                );

                if (contextYear !== this.props.contextYear) {
                    this.props.setContextYear({ contextYear });
                    this.props.fetchWBData({
                        year: contextYear,
                        itemsCount,
                    });
                }
            } else {
                this.props.setContextYear({ contextYear: '' });
            }
        }
    };

    componentDidMount() {
        const searchString = this.props.history.location.search;
        const { itemsCount } = this.props;

        const yearParamMatch = searchString.match(params.year.regex);

        if (yearParamMatch) {
            const contextYear = searchString.slice(
                yearParamMatch.index + params.year.prefixLength,
                yearParamMatch.index + yearParamMatch[0].length
            );

            this.props.fetchWBData({
                year: contextYear,
                itemsCount,
            });

            this.props.setContextYear({ contextYear });
        }

        this.unregisterHistoryListener = this.props.history.listen(
            this.onHistoryListen
        );
    }

    componentWillUnmount() {
        this.unregisterHistoryListener();
    }

    handleYearChange = (event) => {
        const value = event.target.value;
        const { itemsCount, searchTerm, sorting } = this.props;

        this.props.fetchWBData({
            year: value,
            itemsCount,
        });
        this.props.setContextYear({ contextYear: value });

        const yearParam = value ? `year=${value}` : '';
        const searchParam = searchTerm ? `&search=${searchTerm}` : '';
        const sortGroupParam = sorting.groupName
            ? `&sortgroup=${sorting.groupName}`
            : '';
        const sortDirParam = sorting.direction
            ? `&sortdir=${sorting.direction}`
            : '';
        const search = `${yearParam}${searchParam}${sortGroupParam}${sortDirParam}`;

        this.props.history.push({ search });
    };

    onRadioChange = (e) => {
        this.props.setViewMode(e.target.value);
    };

    render() {
        const { contextYear } = this.props;

        return (
            <header className='bg-white'>
                <form className='p-2 d-flex'>
                    <a
                        className='me-auto'
                        href='https://www.worldbank.org/'
                        target='_blank'
                        rel='noopener noreferrer'>
                        <img src={logo} alt='WB Logo' />
                    </a>
                    <div className='input-group w-25'>
                    <div className="form-check">
                        <input 
                            className="form-check-input" 
                            type="radio" 
                            name="viewModeRadio" 
                            id="listRadio" 
                            value="list"
                            onChange={this.onRadioChange}
                            checked={this.props.viewMode === 'list'} />
                        <label className="form-check-label me-3" htmlFor="listRadio">
                            List
                        </label>
                        </div>
                        <div className="form-check">
                        <input 
                            className="form-check-input" 
                            type="radio" 
                            name="viewModeRadio" 
                            id="chartRadio" 
                            value="chart"
                            onChange={this.onRadioChange}
                            checked={this.props.viewMode === 'chart'} />
                        <label className="form-check-label" htmlFor="chartRadio">
                            Chart
                        </label>
                    </div>
                    </div>
                    <div className='input-group w-25'>
                        <div className='input-group-prepend'>
                            <label
                                htmlFor='yearInput'
                                className='input-group-text'
                                id='basic-addon1'>
                                Year:
                            </label>
                        </div>
                        <input
                            id='yearInput'
                            onChange={this.handleYearChange}
                            value={contextYear}
                            type='number'
                            className='form-control'
                            aria-label='Username'
                            aria-describedby='basic-addon1'
                        />
                    </div>
                </form>
            </header>
        );
    }
}

Header.propTypes = {
    contextYear: PropTypes.string.isRequired,
    itemsCount: PropTypes.number.isRequired,
    searchTerm: PropTypes.string.isRequired,
    sorting: PropTypes.exact({
        groupName: PropTypes.string.isRequired,
        direction: PropTypes.string.isRequired,
    }),
    viewMode: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
    const { contextYear, itemsCount, searchTerm, sorting, viewMode } = state.appReducer;

    return {
        contextYear,
        itemsCount,
        searchTerm,
        sorting,
        viewMode,
    };
};

export default compose(
    withRouter,
    connect(mapStateToProps, { setContextYear, fetchWBData, setViewMode })
)(Header);
