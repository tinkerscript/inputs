import React from 'react'
import PropTypes from 'prop-types'
import {dateHelper} from 'modul-helpers'
import Drop from './Drop'
import DatePicker from './DatePicker'

const PERIOD = {
    TODAY: 'TODAY',
    YESTERDAY: 'YESTERDAY',
    LAST_30: 'LAST_30',
    LAST_WEEK: 'LAST_WEEK',
    LAST_MONTH: 'LAST_MONTH',
    LAST_QUARTER: 'LAST_QUARTER',
    LAST_YEAR: 'LAST_YEAR',
    BEGIN_YEAR_FOR_TODAY: 'BEGIN_YEAR_FOR_TODAY', // сначала года, до текущей даты
};
const PERIOD_LABEL = {
    TODAY: 'Сегодня',
    YESTERDAY: 'Вчера',
    LAST_30: 'Последние 30 дней',
    LAST_WEEK: 'Текущая неделя',
    LAST_MONTH: 'Текущий месяц',
    LAST_QUARTER: 'Текущий квартал',
    LAST_YEAR: 'Весь год',
    BEGIN_YEAR_FOR_TODAY: 'Весь год',
};

function getDateRangeByPeriod(period) {
    let range;
    switch (period) {
        case PERIOD.YESTERDAY:
            const yesterday = dateHelper.getYesterday();
            range = dateHelper.getDateRange(yesterday);
            break;
        case PERIOD.TODAY:
            range = dateHelper.getDateRange(new Date());
            break;
        case PERIOD.LAST_30:
            range = dateHelper.getLast30DaysDates(new Date());
            break;
        case PERIOD.LAST_WEEK:
            range = dateHelper.getCurrentWeekDates(new Date());
            break;
        case PERIOD.LAST_MONTH:
            range = dateHelper.getCurrentMonthDates(new Date());
            break;
        case PERIOD.LAST_QUARTER:
            range = dateHelper.getCurrentQuarterDates(new Date());
            break;
        case PERIOD.LAST_YEAR:
            range = dateHelper.getCurrentYearDates(new Date());
            break;
        case PERIOD.BEGIN_YEAR_FOR_TODAY:
            range = dateHelper.getBeginYearForTodayDates(new Date());
            break;
    }
    return {dateFrom: range.startDate, dateTo: range.stopDate};
}


class DatePickerRange extends React.Component {
    static defaultProps = {
        onChange: () => {
        },
        ignoreDropCloseAttr: '',
        className: 'light small',
        periods: null
    };
    static PERIODS = PERIOD;
    initDropInstance(drop) {
        const {setDropInstance}=this.props;
        if (setDropInstance)
            setDropInstance(drop);
    }

    handleSelectPeriod(period) {
        const dateRange = getDateRangeByPeriod(period);
        this.props.onChange(dateRange);
    }

    handleChangeDateFrom(date) {
        this.props.onChange({
            dateFrom: date,
            dateTo: this.dropTo.getValue()
        });
    }

    handleChangeDateTo(date) {
        this.props.onChange({
            dateFrom: this.dropFrom.getValue(),
            dateTo: date
        });
    }

    handleSelectDateRange() {
        this.props.onChange({
            dateFrom: this.dropFrom.getValue(),
            dateTo: this.dropTo.getValue()
        });
    }

    render() {
        const {ignoreDropCloseAttr, dateFrom, dateTo, className, periods, position = "bottom left"}=this.props;

        const dateFromStr = dateFrom ? dateHelper.dateFormat(dateFrom, 'd mmmm:R') : '';
        const dateToStr = dateTo ? dateHelper.dateFormat(dateTo, 'd mmmm:R') : '';

        const list = periods || Object.keys(PERIOD);

        let title = 'Выберите период';
        if (dateFrom || dateTo) {
            title = '';
            if (dateFrom)
                title = `с ${dateFromStr} `;
            if (dateTo)
                title += `по ${dateToStr}`;
        }

        return (<Drop drop={{position: position}}
					  setInstance={::this.initDropInstance}>
			<a className={'drop-target icon-date button ' + className}>{title}</a>
			<div className="drop-content-another" data-ignore={ignoreDropCloseAttr}>
				<div className="drop-content-inner dashboard-period-choose">

					<ul className="drop-menu">
                        {list.map((item, i) => <li key={i}><a data-close="true" onClick={() => this.handleSelectPeriod(PERIOD[item])}>{PERIOD_LABEL[item]}</a></li>)}
					</ul>
					<div className="drop-date-choose">
						<div className="filter_date_value">
							<DatePicker ref={d => this.dropFrom = d}
										value={dateFrom}
										onChange={::this.handleChangeDateFrom}
										className="filter_date_input small date_from"/>
							<DatePicker ref={d => this.dropTo = d}
										value={dateTo}
										onChange={::this.handleChangeDateTo}
										className="filter_date_input small date_to"/>

							<button data-close="true"
									className="button small"
									onClick={::this.handleSelectDateRange}>Ок
							</button>
						</div>
					</div>
				</div>
			</div>
		</Drop>);
    }
}

DatePickerRange.propTypes = {
    setDropInstance: PropTypes.func,
    onChange: PropTypes.func,
    ignoreDropCloseAttr: PropTypes.string,
    dateFrom: PropTypes.any,
    dateTo: PropTypes.any,
    position: PropTypes.string,
    periods: PropTypes.array,
};

export default DatePickerRange;