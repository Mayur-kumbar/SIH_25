export function Button({label, onClick}) {
    return (
        <button
            onClick={onClick}
            className="text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-700"
        >
            {label}
        </button>
    );
}