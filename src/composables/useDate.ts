export const useDate = () => {

     // Disable if the selected date is before 1950-01-01 or after today
    const disabledDate = (date: Date) => {
        const minDate = new Date("1950-01-01"); // set the minimun date
        const today = new Date(); // today's date
        return date < minDate || date > today;
    };

    return { disabledDate }
}