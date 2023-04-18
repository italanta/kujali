export function _PhoneOrEmailValidator(phone: string, email: string) {

    return function (form) {
        const phoneValue = form.get(phone).value;
        const emailValue = form.get(email).value;

        if (!phoneValue && !emailValue ) {
            form.controls['phone'].setErrors({phoneValue: true});
            form.controls['email'].setErrors({emailValue: true});

            return { 'value': true}
        }
        else if ((phoneValue && form.controls['phone'].value.toString().includes('.'))) {
            form.controls['phone'].setErrors({phoneValue: true});
            return { 'period': true}
        }
        else{
            form.controls['phone'].setErrors(null);
            form.controls['email'].setErrors(null);
        }

        form.controls['phone'].markAsTouched();
        form.controls['email'].markAsTouched();

        return null;
    }

}

