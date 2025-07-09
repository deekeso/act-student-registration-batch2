export const useValidators = () => {
    /**  
     * Custom validator to check for only letters, spaces, hyphens, and apostrophes
     * @param {any} rule - Validation rule object
     * @param {any} value - The value of the names field to validate if they have
     * @param {any} callback - Function to call with validation result (error or success)
     */
    const nameValidator = (rule: string, value: string, callback: (error?: string | Error) => void) => {
        const pattern = /^[A-Za-z]+$/
        // if value doesnt exist
        if (!value) {
            callback(new Error('This field is required.'))
        } else if (!pattern.test(value)) {
            // else if the password has numbers / symbols
            callback(new Error('Only letters are allowed.'))
        } else {
            callback()
        }
    }

    return { nameValidator }
}