export function _AddNewActionValidator(title: string, desc: string, type: string, startDate: string, endDate: string, assignTo: string) {

    return function (form) {

        const titleValue = form.get(title).value;
        const descValue = form.get(desc).value;
        const typeValue = form.get(type).value;
        const startDateValue = form.get(startDate).value;
        const endDateValue = form.get(endDate).value;
        const assignToValue = form.get(assignTo).value;

        if (titleValue == '' || descValue == '' || typeValue == '' || !startDateValue || !endDateValue || assignToValue.length <= 0 ) {     
            return { 'formHasError': true};
        } else {
            return null;
        }
    }

}

