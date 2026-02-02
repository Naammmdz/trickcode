export const getSelectStyles = (isDark) => ({
    control: (styles) => ({
        ...styles,
        backgroundColor: isDark ? '#0a0a0a' : '#f9fafb', // dark:zinc-950, light:neutral-50
        borderColor: isDark ? '#3f3f46' : '#e5e7eb', // dark:zinc-700, light:neutral-200
        boxShadow: 'none',
        '&:hover': {
            borderColor: isDark ? '#52525b' : '#d4d4d8', // dark:zinc-600, light:neutral-300
        },
    }),
    menu: (styles) => ({
        ...styles,
        backgroundColor: isDark ? '#18181b' : '#ffffff', // dark:zinc-900, light:white
        border: `1px solid ${isDark ? '#3f3f46' : '#e5e7eb'}`,
    }),
    option: (styles, { isFocused, isSelected }) => ({
        ...styles,
        backgroundColor: isSelected ? '#fb923c' : isFocused ? (isDark ? '#27272a' : '#f3f4f6') : 'transparent', // primary, dark:zinc-800, light:neutral-100
        color: isSelected ? 'white' : (isDark ? '#f4f4f5' : '#171717'), // dark:zinc-100, light:neutral-900
        ':active': {
            ...styles[':active'],
            backgroundColor: !isSelected ? (isDark ? '#3f3f46' : '#e5e7eb') : undefined,
        },
    }),
    multiValue: (styles) => ({
        ...styles,
        backgroundColor: isDark ? '#27272a' : '#e5e7eb',
    }),
    multiValueLabel: (styles) => ({
        ...styles,
        color: isDark ? '#f4f4f5' : '#171717',
    }),
    multiValueRemove: (styles) => ({
        ...styles,
        color: isDark ? '#a1a1aa' : '#737373',
        ':hover': {
            backgroundColor: '#fb923c',
            color: 'white',
        },
    }),
    input: (styles) => ({ ...styles, color: isDark ? '#f4f4f5' : '#171717' }),
    singleValue: (styles) => ({ ...styles, color: isDark ? '#f4f4f5' : '#171717' }),
});
