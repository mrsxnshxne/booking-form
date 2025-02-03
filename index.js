
// Variables

const addBookingButton = document.querySelector('#add-booking');
const formContainer = document.querySelector('#form-container');
const submitButton = document.querySelector("#submit-button");

const dates = [
    "2025-01-07",
    "2025-01-14",
    "2025-01-21",
    "2025-01-28",
];

const defaultFormCase = (
    "<div class=\"flex justify-between items-center\">\n" +
    "   <h2 class=\"font-bold\">Réservation</h2>\n" +
    "   <button\n" +
    "       type=\"button\"\n" +
    "       class=\"bg-red-500 text-white text-sm font-semibold py-2 px-4 rounded-lg disabled:opacity-50 remove-booking\"\n" +
    "   >\n" +
    "       Supprimer\n" +
    "   </button>\n" +
    "   </div>\n" +
    "\n" +
    "   <hr class=\"mt-4 border-purple-500\">\n" +
    "\n" +
    "   <p class=\"text-purple-800 text-sm font-semibold mt-4\">Date de réservation</p>\n" +
    "   <select class=\"w-full border border-purple-800 p-2 rounded-lg date-selector\">\n" +
    "       <option value=\"\" disabled selected>Choisir une date</option>\n" +
    "   </select>\n" +
    "\n" +
    "   <p class=\"text-purple-800 text-sm font-semibold mt-2\">Nombre de places</p>\n" +
    "   <input\n" +
    "       type=\"number\"\n" +
    "       class=\"w-full border border-purple-800 p-2 rounded-lg seat-input\"\n" +
    "       placeholder=\"Nombre de places\"\n" +
    "       min=\"1\"\n" +
    "       max=\"10\"\n" +
    "       value=\"2\"\n" +
    "       required" +
    "   >\n" +
    "</div>"
);


// Functions

const generateDateSelector = (dateList) => {
    return dateList.map((date) => {
        const option = document.createElement('option');
        option.value = date;
        option.text = date;
        return option;
    });
}

const generateFormCase = (isRemovable = false) => {
    const formCase = document.createElement('div');

    formCase.classList.add('w-full', 'bg-purple-100', 'border', 'border-purple-200', 'p-4', 'rounded-lg', 'form-case');
    formCase.innerHTML = defaultFormCase.trim();
    formCase.querySelector(".remove-booking").disabled = !isRemovable;

    return formCase;
}

const calculateUsedDates = () => {
    const dateSelectors = document.querySelectorAll('.date-selector');
    const values = Array.from(dateSelectors).map((dateSelector) => dateSelector.value);

    return dates.filter((date) => !values.includes(date));
}

const addFormCase = (isRemovable = false) => {
    const formCase = generateFormCase(isRemovable);

    const dateSelector = formCase.querySelector('.date-selector');
    generateDateSelector(calculateUsedDates()).forEach((option) => {
        dateSelector.appendChild(option);
    });

    formContainer.appendChild(formCase);
}

const processDateSelectorRefresh = () => {
    const dateSelectors = document.querySelectorAll('.date-selector');

    dateSelectors.forEach((dateSelector) => {

        const usedDates = calculateUsedDates();
        const currentSelection = dateSelector.value;
        dateSelector.innerHTML = "";

        const option = document.createElement('option');
        option.value = currentSelection;
        option.text = currentSelection === "" ? "Choisir une date" : currentSelection;
        option.selected = true;
        option.disabled = currentSelection === "";

        dateSelector.appendChild(option);

        generateDateSelector(usedDates).forEach((option) => {
            dateSelector.appendChild(option);
        });
    })
}

const isFormSubmittable = () => {
    const dateSelectors = document.querySelectorAll(".date-selector");

    let isSubmittable = true;

    dateSelectors.forEach((dateSelector) => {
        if (dateSelector.value === "") {
            isSubmittable = false;
        }
    });

    return isSubmittable;
}

const processFormSubmittableCheck = () => {
    submitButton.disabled = !isFormSubmittable();
}


// Events

document.addEventListener("DOMContentLoaded", () => {
    addFormCase(false);
    processFormSubmittableCheck();
})

addBookingButton.addEventListener('click', () => {
    if (formContainer.children.length >= dates.length) {
        return;
    }
    addFormCase(true);
    processFormSubmittableCheck();

    // after adding formCase, re-evaluating ability to add new formCase
    if (formContainer.children.length >= dates.length) {
        addBookingButton.disabled = true;
    }
});

document.addEventListener('change', (e) => {
    if (e.target.classList.contains('date-selector')) {
        processDateSelectorRefresh();
        processFormSubmittableCheck();
    }
});

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-booking')) {
        e.target.parentElement.parentElement.remove();
        processDateSelectorRefresh();
        processFormSubmittableCheck();
    }

    if (formContainer.children.length < dates.length) {
        addBookingButton.disabled = false;
    }
});