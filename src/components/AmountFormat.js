import React from 'react'
import PropTypes from 'prop-types'
import {validateHelper} from 'modul-helpers'
import accounting from 'accounting';

const CurrencySymbol = ({value}) => {
	if (value == 'RUR')
		return (<span class="cur ruble"><span>р.</span></span>);
	if (value == 'USD')
		return (<span class="cur dollar"><span>$</span></span>);
	if (value == 'EUR')
		return (<span class="cur euro"><span>€</span></span>);
	if (value == 'CNY')
		return (<span class="cur cny"><span>¥</span></span>);
	return null;
};

const AmountFormat = ({value, currency = 'RUR', def = '', className = '', precision = 2}) => {
	if (validateHelper.isEmpty(value))
		return def ? (<span>{def}</span>) : null;
	const val = parseFloat(cleanValue(value));
	const formatted = !isNaN(val) ? accounting.formatNumber(val, precision, " ") : def;
	return (<span className={className}>{formatted}&nbsp;<CurrencySymbol value={currency}/></span>);
};

function cleanValue(val) {
	return val.replace ? val.replace(/[^0-9\.,]+/g, '').replace(',', '.') : val;
}

AmountFormat.propTypes = {
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	currency: PropTypes.oneOf([null,'','RUR', 'USD', 'EUR', 'CNY']),
	def: PropTypes.string,
	className: PropTypes.string
};

export  default AmountFormat;