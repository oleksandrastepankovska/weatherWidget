const form = document.querySelector('.form');
const input = document.querySelector('.input');
const errorMessage = document.querySelector('.errorMessage');
const list = document.querySelector('.cities');
const apiKey = 'e8c9e3bf970879716bf489660566ca43';
const dataFromStorage = JSON.parse(localStorage.getItem('data'));

const render = (data) => {
  const {
    main, name, sys, weather,
  } = data;
  const icon = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${
    weather[0].icon
  }.svg`;

  const li = document.createElement('li');
  li.classList.add('city');
  const output = `
    <h2 class="city-name" data-name="${name},${sys.country}">
        <span>${name}</span>
        <sup>${sys.country}</sup>
    </h2>
    <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
    <figure>
        <img class="city-icon" src="${icon}" alt="${weather[0].description}">
        <figcaption>${weather[0].description}</figcaption>
    </figure>
    `;
  li.innerHTML = output;
  list.appendChild(li);
};

let array = [];

if (dataFromStorage) {
  array = dataFromStorage;
  array.forEach((item) => {
    render(item);
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const inputValue = input.value;

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      array.push(data);
      localStorage.setItem('data', JSON.stringify(array));
      render(data);
    })
    .catch(() => {
      errorMessage.textContent = 'Please search for a valid city 😩';
    });

  errorMessage.textContent = '';
  form.reset();
  input.focus();
});
