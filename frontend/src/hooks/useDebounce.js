import { useState, useEffect } from 'react';

//   Delays updating the returned value until after `delay` ms
//   have passed without the input value changing.


export function useDebounce(value, delay = 500) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        //cancel the timer if value changes before delay expires
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}
