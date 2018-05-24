import React from 'react';

export default class DateFilter extends React.Component {

    render() {
        const date = new Date(this.props.date);
        const day = date.getDate();
        const monthIndex = date.getMonth()+1;
        const year = date.getFullYear();
        const formattedDate = day+'-'+monthIndex+'-'+year;
        return(
            formattedDate
        )
    }
}