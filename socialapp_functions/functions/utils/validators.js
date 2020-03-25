

// Helper Function - checks if its a valid email
const isEmail = (email) => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(email.match(regEx)) return true;
    else return false;
}

// Helper Function - verifies if handle string is empty
const isEmpty = (string) => {
    if (string.trim() === '') return true; // trim to elimite blank spaces
    else return false;
}


exports.validateSignupData = data => {
            // email Verification
            let errors = {};
            if (isEmpty(data.email)){
                errors.email = 'Must not be empty'
            } else if ( !isEmail(data.email)){
                errors.email = 'Must be a valid email address'
            }
                // email Verification
            if (isEmpty(data.password)){
                errors.password = 'Must not be empty'
            } if (data.password !== data.confirmPassword)
                errors.password = 'Passwords must match';
        
            if (isEmpty(data.handle)){ errors.handle = 'Must not be empty'} 
        
            return {
                errors,
                valid: Object.keys(errors).length === 0 ? true : false
            }
}

exports.validateLoginData = data => {
    let errors = {};

    if(isEmpty(data.email) ) errors.email = 'Must not be empty'
    if(isEmpty(data.password) ) errors.password = 'Must not be empty'

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
}